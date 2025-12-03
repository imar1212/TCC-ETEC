const db = require("../config/db");

class Desabafo {
  static async create({ texto, status = "pendente", userId, anonimo }) {
    const [result] = await db.query(
      `INSERT INTO desabafo (Texto, Data, Status, Fk_usuario, Anonimo)
       VALUES (?, NOW(), ?, ?, ?)`, // CORREÇÃO: Adicionado o 5º placeholder para anonimo
      [texto, status, userId, anonimo] // CORREÇÃO: Ordem correta dos parâmetros
    );
    return result.insertId;
  }

  static async findAll() {
    const [rows] = await db.query(
      `SELECT d.Id_desabafo, d.Texto, d.Data, d.Status, d.Anonimo,
              u.Id_usuario, u.Apelido, u.nametag, u.Foto
       FROM desabafo d
       JOIN usuario u ON d.Fk_usuario = u.Id_usuario
       ORDER BY d.Data DESC`
    );
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query(
      `SELECT d.Id_desabafo, d.Texto, d.Data, d.Status, d.Anonimo, 
              u.Id_usuario, u.Apelido, u.nametag, u.Foto
       FROM desabafo d
       JOIN usuario u ON d.Fk_usuario = u.Id_usuario
       WHERE d.Id_desabafo = ?`,
      [id]
    );
    return rows[0] || null;
  }

  static async countPosts() {
    const [rows] = await db.query(
      `SELECT count(*) AS total
       FROM desabafo`
    );
    return rows[0].total;
  }

  static async countPostsPendentes() {
    const [rows] = await db.query(
      `SELECT count(*) AS total
       FROM desabafo 
       WHERE status = 'pendente'`
    );
    return rows[0].total;
  }

  static async selectUserDesabafos(userId) {
    const [rows] = await db.query(
        `SELECT *
         FROM desabafo
         WHERE Fk_usuario = ? AND Status = 'aprovado'
         ORDER BY Data DESC`,
        [userId]
    );
    return rows;
  }

  static async update(id, { texto, status, anonimo }) { // CORREÇÃO: Adicionado anonimo
    await db.query(
      `UPDATE desabafo SET Texto = ?, Status = ?, Anonimo = ? WHERE Id_desabafo = ?`, // CORREÇÃO: Adicionado Anonimo
      [texto, status, anonimo, id]
    );
  }

  static async updateStatus(id, status) {
    const [result] = await db.query(
      `UPDATE desabafo SET Status = ? WHERE Id_desabafo = ?`,
      [status, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id, userId) {
    await db.query(
      `DELETE FROM desabafo WHERE Id_desabafo = ? AND Fk_usuario = ?`,
      [id, userId]
    );
  }
}

module.exports = Desabafo;