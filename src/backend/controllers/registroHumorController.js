const RegistroHumor = require("../models/RegistroHumor");

class RegistroHumorController {
static async create(req, res) {
  try {
    const { Fk_Humor, Observacao, Data } = req.body;
    const Fk_usuario = req.user.id; // pega do authMiddleware

    const result = await RegistroHumor.create({ Fk_Humor, Observacao, Data, Fk_usuario });
    res.status(201).json({ message: "Registro criado com sucesso!", id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


  static async findByUser(req, res) {
    try {
      const { userId } = req.params;
      const registros = await RegistroHumor.findByUser(userId);
      res.json(registros);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const { Fk_Humor, Observacao, Data } = req.body;
      await RegistroHumor.update(id, { Fk_Humor, Observacao, Data });
      res.json({ message: "Registro atualizado com sucesso!" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      await RegistroHumor.delete(id);
      res.json({ message: "Registro excluído com sucesso!" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = RegistroHumorController;
