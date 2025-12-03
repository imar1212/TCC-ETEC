const Humor = require("../models/Humor");

class HumorController {

  static async create(req, res) {
    try {
      const { nome, escala, descricao, icone } = req.body;
      const result = await Humor.create({ nome, escala, descricao, icone });
      res
        .status(201)
        .json({ message: "Humor criado com sucesso", id: result.insertId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao criar humor" });
    }
  }


  static async findAll(req, res) {
    try {
      const humores = await Humor.findAll();
      res.json(humores);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar humores" });
    }
  }

  static async browse(req, res) {
    try {
      const { nome, escala, descricao } = req.body;
      const icone = req.file ? `/uploads/humores/${req.file.filename}` : null;

      const result = await Humor.create({ nome, escala, descricao, icone });
      res
        .status(201)
        .json({ message: "Humor criado com sucesso", id: result.insertId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao criar humor" });
    }
  }

  static async update(id, { nome, escala, descricao, icone, status }) {
    try {
      const { id } = req.params;
      const { nome, escala, descricao, status } = req.body;
      const icone = req.file ? `/uploads/humores/${req.file.filename}` : null;

      await Humor.update(id, { nome, escala, descricao, status, icone });
      res.json({ message: "Humor atualizado com sucesso" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao atualizar humor" });
    }
  }


  static async delete(req, res) {
    try {
      const { id } = req.params;
      await Humor.delete(id);
      res.json({ message: "Humor deletado com sucesso" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao deletar humor" });
    }
  }

  static async switchState(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;


      if (!status || !["ativo", "inativo"].includes(status)) {
        return res.status(400).json({ message: "Status inválido" });
      }


      await Humor.switchState(id, { status });

      res.json({ message: "Status de humor atualizado com sucesso!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  }
}

module.exports = HumorController;
