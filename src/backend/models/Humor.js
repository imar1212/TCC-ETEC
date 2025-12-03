const db = require("../config/db");

class Humor {
  // Cria um novo humor/desabafo
  static async create({ nome, escala, descricao, icone }) {
    const [result] = await db.query(
      `INSERT INTO humor (nome, escala, descricao, icone, status)
       VALUES (?, ?, ?, ?, 'inativo')`,
      [nome, escala, descricao, icone]
    );
    return result;
  }

  // Retorna todos os humores
  static async findAll() {
    const [rows] = await db.query(`SELECT * FROM humor`);
    return rows;
  }

  // Pesquisa por nome
  static async browse(nome) {
    const [rows] = await db.query(
      `SELECT *
       FROM humor
       WHERE nome LIKE ?`,
      [`%${nome}%`]
    );
    return rows;
  }

  // Atualiza um humor/desabafo
  static async update(id, { nome, escala, descricao, icone }) {
    await db.query(
      `UPDATE humor
       SET nome = ?, escala = ?, descricao = ?, icone = ?
       WHERE id_humor = ?`,
      [nome, escala, descricao, icone, id]
    );
  }

  static async switchState(id, { status }) {
    await db.query(
      `UPDATE humor SET status = ? WHERE id_humor = ?`,
      [status, id]
    );
  }

  // Deleta um humor/desabafo
  static async delete(id) {
    await db.query(`DELETE FROM humor WHERE id_humor = ?`, [id]);
  }
}

module.exports = Humor;
