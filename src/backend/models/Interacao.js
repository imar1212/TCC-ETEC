const db = require("../config/db");

class Interacao {
  // Criar uma interação
  static async create({ tipo, status, conteudo, userId, desabafoId }) {
    if (tipo === "comentario") status = "pendente";
    else status = "ativo";

    const [result] = await db.query(
      `INSERT INTO interacao (Tipo, Status, Data, Fk_desabafo, Fk_usuario, Text)
       VALUES (?, ?, NOW(), ?, ?, ?)`,
      [tipo, status, desabafoId, userId, conteudo || null]
    );

    return result.insertId;
  }
  static async getInteracaoById(id) {
    const [rows] = await db.query(
      `SELECT 
      i.Id_interacao,
      i.Tipo,
      i.Status,
      i.Data,
      i.Text,
      u.Id_usuario,
      u.Apelido,
      u.Nametag,
      u.Foto AS FotoUsuario,           
      d.Id_desabafo,
      d.Texto AS DesabafoTexto,
      d.Anonimo AS DesabafoAnonimo,
      CASE 
        WHEN d.Anonimo = 1 THEN 'Anônimo'
        ELSE u_desabafo.Apelido 
      END AS AutorDesabafoApelido,
      CASE 
        WHEN d.Anonimo = 1 THEN 'Anônimo'
        ELSE u_desabafo.Nametag 
      END AS AutorDesabafoNametag,
      CASE 
        WHEN d.Anonimo = 1 THEN NULL
        ELSE u_desabafo.Foto 
      END AS FotoAutorDesabafo
     FROM interacao i
     JOIN usuario u ON i.Fk_usuario = u.Id_usuario
     LEFT JOIN desabafo d ON i.Fk_desabafo = d.Id_desabafo
     LEFT JOIN usuario u_desabafo ON d.Fk_usuario = u_desabafo.Id_usuario
     WHERE i.Id_interacao = ?`,
      [id]
    );
    return rows[0];
  }

  static async updateComentario(id, userId, texto) {
    const query = `
    UPDATE interacao 
    SET text = ?
    WHERE id_interacao = ? AND fk_usuario = ? AND tipo = 'comentario'
  `;
    const [result] = await db.query(query, [texto, id, userId]);
    return result.affectedRows > 0;
  }

  // Buscar todas as interações de um desabafo
  // Buscar todas as interações de um desabafo
  static async findByDesabafo(desabafoId) {
    const [rows] = await db.query(
      `SELECT i.Id_interacao, i.Tipo, i.Status, i.Data, i.Text,
            u.Id_usuario, u.Apelido, u.Foto, u.nametag,
            d.Anonimo AS DesabafoAnonimo
     FROM interacao i
     JOIN usuario u ON i.Fk_usuario = u.Id_usuario
     JOIN desabafo d ON i.Fk_desabafo = d.Id_desabafo
     WHERE i.Fk_desabafo = ?
     ORDER BY i.Data ASC`,
      [desabafoId]
    );
    return rows;
  }

  // Contar curtidas de um desabafo
  static async countLikes(desabafoId) {
    const [rows] = await db.query(
      `SELECT COUNT(*) AS total
       FROM interacao
       WHERE Fk_desabafo = ? AND Tipo = 'curtida' AND Status = 'ativo'`,
      [desabafoId]
    );
    return rows[0].total;
  }

  // Seleciona comentários ativos
  static async selectComments(desabafoId) {
    const [rows] = await db.query(
      `SELECT i.Id_interacao, i.Text, i.Status, i.Data,
        u.Id_usuario, u.Apelido, u.Foto, u.Nametag,
        d.Id_desabafo, d.Anonimo AS DesabafoAnonimo
     FROM interacao i
     JOIN usuario u ON i.Fk_usuario = u.Id_usuario
     JOIN desabafo d ON i.Fk_desabafo = d.Id_desabafo
     WHERE i.Fk_desabafo = ? AND i.Tipo = 'comentario' AND i.Status = 'ativo'
     ORDER BY i.Data ASC`,
      [desabafoId]
    );
    return rows;
  }
  static async selectAllComments() {
    const [rows] = await db.query(
      `SELECT 
         i.Id_interacao, 
         i.Text AS Text, 
         i.Status AS Status, 
         i.Data,
         u.Id_usuario, 
         u.Apelido, 
         u.Foto, 
         u.Nametag,
         i.Fk_desabafo
       FROM interacao i
       JOIN usuario u ON i.Fk_usuario = u.Id_usuario
       WHERE i.Tipo = 'comentario'
       ORDER BY i.Data DESC`
    );
    return rows;
  }

  // NOVO MÉTODO: Seleciona todas as curtidas ativas de um usuário
  // NOVO MÉTODO: Seleciona todas as curtidas ativas de um usuário
  static async selectUserLikes(userId) {
    const [rows] = await db.query(
      `SELECT 
      i.Id_interacao, 
      i.Data AS DataCurtida, 
      d.Id_desabafo,
      LEFT(d.Texto, 150) AS DesabafoSnippet, 
      d.Anonimo AS Anonimo,
      CASE 
        WHEN d.Anonimo = 1 THEN 'Anônimo'
        ELSE u_autor.Apelido 
      END AS AutorDesabafoApelido,
      CASE 
        WHEN d.Anonimo = 1 THEN 'Anônimo'
        ELSE u_autor.Nametag 
      END AS AutorDesabafoNametag,
      CASE 
        WHEN d.Anonimo = 1 THEN NULL
        ELSE u_autor.Foto 
      END AS Foto
    FROM interacao i
    JOIN desabafo d ON i.Fk_desabafo = d.Id_desabafo
    JOIN usuario u_autor ON d.Fk_usuario = u_autor.Id_usuario
    WHERE i.Fk_usuario = ? AND i.Tipo = 'curtida' AND i.Status = 'ativo'
    ORDER BY i.Data DESC`,
      [userId]
    );
    return rows;
  }

  // Seleciona comentários de um usuário
  static async selectUserComments(userId) {
    const [rows] = await db.query(
      `SELECT *
       FROM interacao
       WHERE Fk_usuario = ? AND Tipo = 'comentario'`,
      [userId] // corrigi a ordem dos parâmetros
    );
    return rows;
  } // Seleciona comentários de um usuário em um desabafo (método existente)

  // ... [Métodos existentes] ...

  static async selectUserComments(desabafoId, userId) {
    const [rows] = await db.query(
      `SELECT *
      FROM interacao WHERE Fk_usuario = ? AND Fk_desabafo = ? AND Tipo = 'comentario'`,
      [userId, desabafoId] // corrigi a ordem dos parâmetros
    );
    return rows;
  }

  // NOVO MÉTODO: Seleciona todas as respostas/comentários de um usuário
  // Em /models/Interacao.js

  // ... [Outras funções] ...

  // Seleciona todas as respostas/comentários de um usuário
  // Seleciona todas as respostas/comentários de um usuário
  static async selectUserResponses(userId) {
    const [rows] = await db.query(
      `SELECT 
      i.Id_interacao, 
      i.Text AS TextoComentario, 
      i.Status AS StatusComentario, 
      i.Data AS DataComentario,
      d.Id_desabafo, 
      d.Texto AS DesabafoConteudo, 
      d.Data AS DataDesabafo,
      d.Anonimo AS AnonimoDesabafo,
      CASE 
        WHEN d.Anonimo = 1 THEN 'Anônimo'
        ELSE u_desabafo.Apelido 
      END AS AutorDesabafoApelido,
      CASE 
        WHEN d.Anonimo = 1 THEN 'Anônimo'
        ELSE u_desabafo.Nametag 
      END AS AutorDesabafoNametag
    FROM interacao i
    JOIN desabafo d ON i.Fk_desabafo = d.Id_desabafo
    JOIN usuario u_desabafo ON d.Fk_usuario = u_desabafo.Id_usuario
    WHERE i.Fk_usuario = ? AND i.Tipo = 'comentario' 
    ORDER BY i.Data DESC`,
      [userId]
    );
    return rows;
  }
  // ... [Outras funções] ...

  // Verificar se usuário já curtiu um post
  // ... [Restante do código] ...

  // Verificar se usuário já curtiu um post
  static async hasUserLiked(desabafoId, userId) {
    const [rows] = await db.query(
      `SELECT Id_interacao, Status
       FROM interacao
       WHERE Fk_desabafo = ? AND Fk_usuario = ? AND Tipo = 'curtida'`,
      [desabafoId, userId]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  // Alternar curtida (curtir se não curtiu, descurtir se já curtiu)
  static async toggleLike(desabafoId, userId) {
    const existingLike = await this.hasUserLiked(desabafoId, userId);

    if (existingLike) {
      // Se já curtiu, remove a curtida
      await db.query(`DELETE FROM interacao WHERE Id_interacao = ?`, [
        existingLike.Id_interacao,
      ]);
      return { action: "removed", liked: false };
    } else {
      // Se não curtiu, adiciona a curtida
      const interacaoId = await this.create({
        tipo: "curtida",
        status: "ativo",
        conteudo: null,
        userId,
        desabafoId,
      });
      return { action: "added", liked: true, interacaoId };
    }
  }

  // Inativar interação
  static async delete(id, userId) {
    await db.query(
      `DELETE FROM interacao WHERE Id_interacao = ? AND Fk_usuario = ?`,
      [id, userId]
    );
  }

  static async switchStatus(id, status) {
    const [rows] = await db.query(
      `UPDATE interacao 
       SET Status = ? 
       WHERE Id_interacao = ?`, // added userId validation
      [status, id]
    );
  }
}

module.exports = Interacao;
