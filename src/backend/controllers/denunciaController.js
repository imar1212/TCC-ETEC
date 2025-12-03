const Denuncia = require("../models/Denuncia");

const denunciaController = {
  getAll: async (req, res) => {
    try {
      const denuncias = await Denuncia.findAll();
      res.json(denuncias);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao buscar denúncias" });
    }
  },

  getById: async (req, res) => {
    try {
      const denuncia = await Denuncia.findById(req.params.id);
      if (!denuncia)
        return res.status(404).json({ message: "Denúncia não encontrada" });
      res.json(denuncia);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao buscar denúncia" });
    }
  },

  getByUser: async (req, res) => {
    try {
      const denuncias = await Denuncia.findByUser(req.params.id);
      if (!denuncias.length)
        return res.status(404).json({ message: "Nenhuma denúncia encontrada" });
      res.json(denuncias);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao buscar denúncia" });
    }
  },

  create: async (req, res) => {
    try {
      const { motivo, alvo, denunciadoPor, desabafoId, userId, respostaId, descricao } =
        req.body;

      if (!motivo || !alvo) {
        return res
          .status(400)
          .json({ message: "Motivo e alvo são obrigatórios" });
      }

      const denunciaId = await Denuncia.create({
        motivo,
        alvo,
        userId,
        denunciadoPor,
        desabafoId,
        respostaId,
        descricao,
        status: "pendente",
      });

      res.status(201).json({
        Id_denuncia: denunciaId,
        Motivo: motivo,
        Alvo: alvo,
        Denunciado_por: denunciadoPor,
        Descricao: descricao,
        Status: "pendente",
        Data: new Date().toISOString(),
        userId,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao criar denúncia" });
    }
  },

  // ✅ corrigido aqui:
  countActiveReports: async (req, res) => {
    try {
      const result = await Denuncia.countActiveReports();
      res.status(200).json({
        success: true,
        total: result.total,
      });
    } catch (error) {
      console.error("Erro ao contar denúncias resolvidas:", error);
      res.status(500).json({
        success: false,
        message: "Erro ao contar denúncias resolvidas",
        error: error.message,
      });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { motivo, descricao, status, denunciadoPor } = req.body;

      if (!motivo || !status) {
        return res
          .status(400)
          .json({ message: "Motivo e status são obrigatórios" });
      }

      await Denuncia.update(id, { motivo, descricao, status, denunciadoPor });
      res.json({ message: "Denúncia atualizada com sucesso" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao atualizar denúncia" });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      await Denuncia.delete(id);
      res.json({ message: "Denúncia deletada com sucesso" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao deletar denúncia" });
    }
  },

  switchState: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const allowedStatus = ["pendente", "resolvida", "arquivada"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Status inválido" });
      }

      await Denuncia.switchState(id, status);
      res.json({
        message: `Status da denúncia ${id} atualizado para '${status}'`,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao alterar status da denúncia" });
    }
  },
};

module.exports = denunciaController;
