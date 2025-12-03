// models/user.js
const db = require("../config/db");
const bcrypt = require("bcrypt");

class User {
  static async pronomeExists(pronome) {
    const [rows] = await db.query("SELECT 1 FROM pronome WHERE Pronome = ?", [
      pronome,
    ]);
    return rows.length > 0;
  }

static async countUsers() {
  const [rows] = await db.query('SELECT COUNT(*) AS total FROM usuario');
  return rows[0].total; // retorna apenas o número
}


  static async findAll() {
    const [rows] = await db.query(
      "SELECT Id_usuario, Apelido, Email, Tipo, Status, Foto, nametag, Bio, Data_cadastro FROM usuario"
    );
    return rows;
  }

    static async findByNametag(nametag) {
    const [rows] = await db.query(
      "SELECT Id_usuario, Apelido, Email, Tipo, Status, Foto, nametag, bio, Data_cadastro FROM usuario WHERE nametag = ?",
      [nametag]
    );
      return rows;
  }

  static async findById(id) {
    const [userRows] = await db.query(
      "SELECT Id_usuario, Apelido, Email, Tipo, Status, Foto, nametag, bio, Data_cadastro FROM usuario WHERE Id_usuario = ?",
      [id]
    );
    if (!userRows.length) return null;

    const user = userRows[0];

    const [pronomeRows] = await db.query(
      "SELECT Pronome FROM pronome WHERE Fk_Usuario = ?",
      [id]
    );

    user.pronomes = pronomeRows.map((row) => row.Pronome);
    return user;
  }

  static async create({
    apelido,
    email,
    senha,
    tipo,
    status,
    foto,
    nametag,
    bio,
    pronomes,
  }) {
    const conn = await db.getConnection();
    await conn.beginTransaction();

    try {
      const hashedSenha = await bcrypt.hash(senha, 10);

      const [result] = await conn.query(
        `INSERT INTO usuario 
         (Apelido, Email, Senha, Tipo, Status, Foto, nametag, Bio, Data_cadastro) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [apelido, email, hashedSenha, tipo, status, foto, nametag, bio]
      );

      const userId = result.insertId;

      if (pronomes && pronomes.length > 0) {
        const validPronomes = [];
        for (const pronome of pronomes) {
          const exists = await User.pronomeExists(pronome);
          if (!exists) validPronomes.push(pronome);
        }

        if (validPronomes.length > 0) {
          await conn.query(
            `INSERT INTO pronome (Pronome, Fk_Usuario) VALUES ?`,
            [validPronomes.map((pronome) => [pronome, userId])]
          );
        }
      }

      await conn.commit();
      return userId;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }

  static async update(id, { apelido, foto, nametag, bio, pronomes }) {
    const conn = await db.getConnection();
    await conn.beginTransaction();

    try {
      const [userRows] = await conn.query(
        "SELECT * FROM usuario WHERE Id_usuario = ?",
        [id]
      );
      if (!userRows.length) throw new Error("Usuário não encontrado");
      const usuarioAtual = userRows[0];

      const dadosAtualizados = {
        apelido: apelido ?? usuarioAtual.Apelido,
        foto: foto ?? usuarioAtual.Foto,
        nametag: nametag ?? usuarioAtual.nametag,
        bio: bio ?? usuarioAtual.Bio,
      };

      await conn.query(
        `UPDATE usuario 
         SET Apelido = ?, Foto = ?, nametag = ?, Bio = ?
         WHERE Id_usuario = ?`,
        [
          dadosAtualizados.apelido,
          dadosAtualizados.foto,
          dadosAtualizados.nametag,
          dadosAtualizados.bio,
          id,
        ]
      );

      // Se pronomes for um array, compara com os atuais para ver se mudou
      if (Array.isArray(pronomes)) {
        // Buscar pronomes atuais do usuário
        const [pronomeRows] = await conn.query(
          "SELECT Pronome FROM pronome WHERE Fk_Usuario = ?",
          [id]
        );
        const pronomesAtuais = pronomeRows
          .map((row) => row.Pronome.toLowerCase())
          .sort();
        const pronomesNovos = pronomes.map((p) => p.toLowerCase()).sort();

        // Compara os arrays (mesmo tamanho e mesmos valores)
        const pronomesIguais =
          pronomesAtuais.length === pronomesNovos.length &&
          pronomesAtuais.every((p, i) => p === pronomesNovos[i]);

        if (!pronomesIguais) {
          // Atualiza apenas se forem diferentes
          await User.updatePronouns(id, pronomes, conn);
        }
      }

      await conn.commit();
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }

  static async updatePronouns(id, pronomes, connection = null) {
    const conn = connection ?? (await db.getConnection());
    if (!connection) await conn.beginTransaction();

    try {
      await conn.query("DELETE FROM pronome WHERE Fk_Usuario = ?", [id]);

      if (pronomes && pronomes.length > 0) {
        const valores = pronomes.map((pronome) => [pronome, id]);
        await conn.query("INSERT INTO pronome (Pronome, Fk_Usuario) VALUES ?", [
          valores,
        ]);
      }

      if (!connection) await conn.commit();
    } catch (error) {
      if (!connection) await conn.rollback();
      throw error;
    } finally {
      if (!connection) conn.release();
    }
  }

  static async findByIdWithPassword(id) {
    const [rows] = await db.query(
      "SELECT Id_usuario, Apelido, Email, Senha, Tipo, Status, Foto, nametag, bio, Data_cadastro FROM usuario WHERE Id_usuario = ?",
      [id]
    );
    if (!rows.length) return null;

    const user = rows[0];

    const [pronomeRows] = await db.query(
      "SELECT Pronome FROM pronome WHERE Fk_Usuario = ?",
      [id]
    );
    user.pronomes = pronomeRows.map((row) => row.Pronome);

    return user;
  }

  static async delete(id) {
    const conn = await db.getConnection();
    await conn.beginTransaction();

    try {
      await conn.query("DELETE FROM interacao WHERE Fk_Usuario = ?", [id]);
      await conn.query("DELETE FROM desabafo WHERE Fk_Usuario = ?", [id]);
      await conn.query("DELETE FROM pronome WHERE Fk_Usuario = ?", [id]);
      await conn.query("DELETE FROM usuario WHERE Id_usuario = ?", [id]);
      await conn.commit();
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }

  static async updatePassword(id, novaSenha) {
    const conn = await db.getConnection();
    await conn.beginTransaction();

    try {
      const hashedSenha = await bcrypt.hash(novaSenha, 10);
      await conn.query("UPDATE usuario SET Senha = ? WHERE Id_usuario = ?", [
        hashedSenha,
        id,
      ]);
      await conn.commit();
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }

  static async emailExists(email) {
    const [rows] = await db.query("SELECT 1 FROM usuario WHERE Email = ?", [
      email,
    ]);
    return rows.length > 0;
  }

  static async suspenderUsuario(id) {
    const [result] = await db.query(
      "UPDATE usuario SET Status = 'suspenso' WHERE Id_usuario = ?",
      [id]
    );
    return result.affectedRows > 0;
  }

  static async banirUsuario(id) {
    const [result] = await db.query(
      "UPDATE usuario SET Status = 'banido' WHERE Id_usuario = ?",
      [id]
    );
    return result.affectedRows > 0;
  }

  static async nametagExists(nametag) {
    if (!nametag) return false;
    const [rows] = await db.query("SELECT 1 FROM usuario WHERE nametag = ?", [
      nametag,
    ]);
    return rows.length > 0;
  }

  static async updateUserStatus(id, status) {
    const [result] = await db.query(
      "UPDATE usuario SET Status = ? WHERE Id_usuario = ?",
      [status, id]
    );
    return result.affectedRows > 0;
  }

  static async updateUserType(id, tipo) {
    const [result] = await db.query(
      "UPDATE usuario SET Tipo = ? WHERE Id_usuario = ?",
      [tipo, id]
    );
    return result.affectedRows > 0;
  }
}

module.exports = User;
