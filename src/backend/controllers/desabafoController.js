const Desabafo = require("../models/Desabafo");

const desabafoController = {

  getAll: async (req, res) => {
    try {
      const desabafos = await Desabafo.findAll();
      res.json(desabafos);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao buscar desabafos" });
    }
  },


  getById: async (req, res) => {
    try {
      const desabafo = await Desabafo.findById(req.params.id);
      if (!desabafo)
        return res.status(404).json({ message: "Desabafo não encontrado" });
      res.json(desabafo);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao buscar desabafo" });
    }
  },

  countPosts: async (req, res) => {
    try {
      const total = await Desabafo.countPosts();
      res.status(200).json({
        success: true,
        total: total,
      });
    } catch (error) {
      console.error("Erro ao contar desabafos", error);
      res.status(500).json({
        success: false,
        message: "Erro ao contar desabafos",
        error: error.message,
      });
    }
  },

  countPostsPendentes: async (req, res) => {
    try {
      const total = await Desabafo.countPostsPendentes();
      res.status(200).json({
        success: true,
        total: total,
      });
    } catch (error) {
      console.error("Erro ao contar desabafos pendentes", error);
      res.status(500).json({
        success: false,
        message: "Erro ao contar desabafos pendentes",
        error: error.message,
      });
    }
  },


  create: async (req, res) => {
    try {
      const { texto, anonimo = 0 } = req.body;
      const userId = req.user.id;

      console.log("Dados recebidos para criar desabafo:", { texto, anonimo, userId });

      if (!texto)
        return res.status(400).json({ message: "Texto é obrigatório" });


      const anonimoValue = anonimo ? 1 : 0;

      const desabafoId = await Desabafo.create({ 
        texto, 
        userId, 
        anonimo: anonimoValue 
      });

      console.log("Desabafo criado com ID:", desabafoId);

      const novoDesabafo = await Desabafo.findById(desabafoId);
      res.status(201).json(novoDesabafo);
    } catch (error) {
      console.error("Erro detalhado ao criar desabafo:", error);
      res.status(500).json({ message: "Erro ao criar desabafo" });
    }
  },


  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { texto, status, anonimo } = req.body;
      
      if (!texto || !status)
        return res.status(400).json({ message: "Texto e status obrigatórios" });
      
      const anonimoValue = anonimo ? 1 : 0;
      
      await Desabafo.update(id, { texto, status, anonimo: anonimoValue });
      res.json({ message: "Desabafo atualizado com sucesso" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao atualizar desabafo" });
    }
  },


  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      await Desabafo.delete(id, userId);
      res.json({ message: "Desabafo deletado com sucesso" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao deletar desabafo" });
    }
  },

  getUserDesabafos: async (req, res) => {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res
          .status(400)
          .json({ message: "ID do usuário é obrigatório." });
      }

      const desabafos = await Desabafo.selectUserDesabafos(userId);

      res.status(200).json({
        message: "Desabafos do usuário carregados com sucesso.",
        data: desabafos,
        total: desabafos.length,
      });
    } catch (error) {
      console.error("Erro ao buscar desabafos do usuário:", error);
      res
        .status(500)
        .json({ message: "Erro interno do servidor ao buscar desabafos." });
    }
  },


  switchState: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const allowedStatus = ["pendente", "aprovado", "reprovado"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Status inválido para um desabafo" });
      }

      const atualizado = await Desabafo.updateStatus(id, status);

      if (!atualizado) {
        return res.status(404).json({ message: "Desabafo não encontrado."});
      }

      res.json({
        message: `Status do desabafo ${id} atualizado para '${status}'`,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao alterar status do desabafo" });
    }
  },
};

module.exports = desabafoController;