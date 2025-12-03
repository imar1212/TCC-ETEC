const db = require("../config/db");

class Denuncia {
  static async create({
    motivo,
    alvo,
    userId, // Quem foi denunciado
    denunciadoPor, // quem denunciou
    desabafoId,
    respostaId,
    descricao,
    status = "pendente",
  }) {
    const [result] = await db.query(
      `INSERT INTO denuncia 
   (Motivo, Alvo, Fk_usuario, Denunciado_por, Fk_desabafo, Fk_resposta, Descricao, Data, Status)
   VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?)`,
      [
        motivo,
        alvo,
        userId || null,
        denunciadoPor || null,
        desabafoId || null,
        respostaId || null,
        descricao || null,
        status,
      ]
    );
    console.log(denunciadoPor, userId);
    return result.insertId;
  }

static async countActiveReports() {
  const [rows] = await db.query(
    `SELECT count(*) AS total
     FROM denuncia 
     WHERE Status = 'pendente'`
  );
  return rows[0];
}


  static async findAll() {
    const [rows] = await db.query(
      `SELECT d.Id_denuncia, d.Motivo, d.Alvo, d.Descricao, d.Data, d.Status, d.Fk_desabafo, d.Fk_resposta,
              d.Denunciado_por, u.Id_usuario AS UserId, u.Apelido, u.nametag, u.Foto
       FROM denuncia d
       LEFT JOIN usuario u ON d.Fk_usuario = u.Id_usuario
       ORDER BY d.Data DESC`
    );
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query(
      `SELECT d.Id_denuncia, d.Motivo, d.Alvo, d.Descricao, d.Data, d.Status, d.Fk_desabafo, d.Fk_resposta,
              d.Denunciado_por, u.Id_usuario AS UserId, u.Apelido, u.nametag, u.Foto
       FROM denuncia d
       LEFT JOIN usuario u ON d.Fk_usuario = u.Id_usuario
       WHERE d.Id_denuncia = ?`,
      [id]
    );
    return rows[0] || null;
  }

  static async findByUser(id) {
    const [rows] = await db.query(
      `SELECT d.Id_denuncia, d.Motivo, d.Alvo, d.Descricao, d.Data, d.Status, d.Fk_desabafo, d.Fk_resposta,
              d.Denunciado_por, u.Id_usuario AS UserId, u.Apelido, u.nametag, u.Foto
       FROM denuncia d
       LEFT JOIN usuario u ON d.Fk_usuario = u.Id_usuario
       WHERE d.Fk_usuario = ?`,
      [id]
    );
    return rows;
  }

  static async update(id, { motivo, descricao, status, denunciadoPor }) {
    await db.query(
      `UPDATE denuncia
   SET Motivo = ?, Descricao = ?, Status = ?, Denunciado_por = ?
   WHERE Id_denuncia = ?`,
      [motivo, descricao, status, denunciadoPor || null, id]
    );
  }

  static async delete(id) {
    await db.query(`DELETE FROM denuncia WHERE Id_denuncia = ?`, [id]);
  }

  static async switchState(id, status) {
    const allowed = ["pendente", "resolvida", "arquivada"];
    if (!allowed.includes(status)) {
      throw new Error("Status inválido");
    }

    await db.query(`UPDATE denuncia SET Status = ? WHERE Id_denuncia = ?`, [
      status,
      id,
    ]);
  }
}

module.exports = Denuncia;