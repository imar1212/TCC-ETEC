const db = require("../config/db");

class Conteudo {
  // Criar novo conteúdo
  static async create({ Titulo, Resumo, Conteudo, Imagem, Tipo, Fk_usuario, Status = "ativo" }) {
    const [result] = await db.query(
      `INSERT INTO Conteudo 
        (Titulo, Resumo, Conteudo, Imagem, Tipo, Fk_usuario, Status, Data) 
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [Titulo, Resumo, Conteudo, Imagem || null, Tipo, Fk_usuario, Status]
    );
    return result.insertId;
  }

  // Buscar todos os conteúdos
  static async findAll() {
    const [rows] = await db.query(
      `SELECT c.*, u.Apelido, u.nametag, u.Foto 
       FROM Conteudo c 
       LEFT JOIN Usuario u ON c.Fk_usuario = u.Id_usuario 
       ORDER BY c.Data DESC`
    );
    return rows;
  }

  // Buscar conteúdo por ID
  static async findById(id) {
    const [rows] = await db.query(
      `SELECT c.*, u.Apelido, u.nametag, u.Foto 
       FROM Conteudo c 
       LEFT JOIN Usuario u ON c.Fk_usuario = u.Id_usuario 
       WHERE c.Id_conteudo = ?`,
      [id]
    );
    return rows[0] || null;
  }

  // Buscar conteúdos por usuário
  static async findByUser(userId) {
    const [rows] = await db.query(
      `SELECT * FROM Conteudo WHERE Fk_usuario = ? ORDER BY Data DESC`,
      [userId]
    );
    return rows;
  }

  // Atualizar conteúdo
  static async update(id, { Titulo, Resumo, Conteudo, Imagem, Tipo, Status }) {
    await db.query(
      `UPDATE Conteudo 
       SET Titulo = ?, Resumo = ?, Conteudo = ?, Imagem = ?, Tipo = ?, Status = ? 
       WHERE Id_conteudo = ?`,
      [Titulo, Resumo, Conteudo, Imagem || null, Tipo, Status, id]
    );
  }

  // Deletar conteúdo
  static async delete(id) {
    await db.query(`DELETE FROM Conteudo WHERE Id_conteudo = ?`, [id]);
  }
}

module.exports = Conteudo;
