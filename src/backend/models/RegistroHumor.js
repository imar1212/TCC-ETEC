const db = require("../config/db");

class RegistroHumor {
  // Criar novo registro de humor
  static async create({ Fk_Humor, Observacao, Data, Fk_usuario }) {
    
    const [result] = await db.query(
      `INSERT INTO registro_humor (Fk_Humor, Observacao, Data, Fk_usuario)
     VALUES (?, ?, ?, ?)`,
      [Fk_Humor, Observacao, Data, Fk_usuario]
    );

    return result;
  }

  // Buscar registros por usuário
  static async findByUser(userId) {
    const [rows] = await db.query(
      `SELECT rh.*, h.nome AS humor_nome, h.icone
       FROM registro_humor rh
       JOIN humor h ON rh.Fk_Humor = h.id_humor
       WHERE rh.Fk_usuario = ?`,
      [userId]
    );
    return rows;
  }

  // Atualizar registro de humor
  static async update(id, { Fk_Humor, Observacao, Data }) {
    await db.query(
      `UPDATE registro_humor
       SET Fk_Humor = ?, Observacao = ?, Data = ?
       WHERE Id_Registro_Humor = ?`,
      [Fk_Humor, Observacao, Data, id]
    );
  }

  // Deletar registro
  static async delete(id) {
    await db.query(`DELETE FROM registro_humor WHERE Id_Registro_Humor = ?`, [
      id,
    ]);
  }
}

module.exports = RegistroHumor;
