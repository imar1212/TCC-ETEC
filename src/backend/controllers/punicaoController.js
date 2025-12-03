const Punicao = require("../models/Punicao");
const User = require("../models/User");

const punicaoController = {
  async listarTodas(req, res) {
    try {
      const { page = 1, limit = 20 } = req.query;
      const result = await Punicao.findAll(parseInt(page), parseInt(limit));
      res.status(200).json({ message: "Punições listadas com sucesso!", ...result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao listar punições." });
    }
  },

  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const punicao = await Punicao.findById(id);
      if (!punicao) return res.status(404).json({ message: "Punição não encontrada." });
      res.status(200).json(punicao);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar punição." });
    }
  },

  async buscarPorUsuario(req, res) {
    try {
      const { userId } = req.params;
      const punicoes = await Punicao.findByUserId(userId);
      res.status(200).json({ total: punicoes.length, data: punicoes });
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar punições do usuário." });
    }
  },

  async buscarAtivasPorUsuario(req, res) {
    try {
      const { userId } = req.params;
      const ativas = await Punicao.findActiveByUserId(userId);
      res.status(200).json({ total: ativas.length, data: ativas });
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar punições ativas." });
    }
  },

async criar(req, res) {
  try {
    const idPunicao = await Punicao.create(req.body);

    const { Fk_usuario, Tipo } = req.body;
    if (Tipo === "suspensão") {
      await User.suspenderUsuario(Fk_usuario);
    } else if (Tipo === "banimento") {
      await User.banirUsuario(Fk_usuario);
    }

    res.status(201).json({ message: "Punição criada e usuário atualizado!", id: idPunicao });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao criar punição." });
  }
},

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const ok = await Punicao.update(id, req.body);
      if (!ok) return res.status(404).json({ message: "Punição não encontrada." });
      res.status(200).json({ message: "Punição atualizada com sucesso." });
    } catch (error) {
      res.status(500).json({ message: "Erro ao atualizar punição." });
    }
  },

  async atualizarStatus(req, res) {
    try {
      const { id } = req.params;
      const { Status } = req.body;
      const ok = await Punicao.updateStatus(id, Status);
      if (!ok) return res.status(404).json({ message: "Punição não encontrada." });
      res.status(200).json({ message: "Status atualizado com sucesso." });
    } catch (error) {
      res.status(500).json({ message: "Erro ao atualizar status." });
    }
  },

async revogar(req, res) {
  try {
    const { id } = req.params;
    const punicao = await Punicao.findById(id);
    if (!punicao) return res.status(404).json({ message: "Punição não encontrada." });

    const ok = await Punicao.revoke(id);
    if (!ok) return res.status(400).json({ message: "Punição já revogada ou expirada." });

    await User.updateUserStatus(punicao.Fk_usuario, "ativo");

    res.status(200).json({ message: "Punição revogada e usuário reativado." });
  } catch (error) {
    res.status(500).json({ message: "Erro ao revogar punição." });
  }
},


  async deletar(req, res) {
    try {
      const { id } = req.params;
      const ok = await Punicao.delete(id);
      if (!ok) return res.status(404).json({ message: "Punição não encontrada." });
      res.status(200).json({ message: "Punição excluída com sucesso." });
    } catch (error) {
      res.status(500).json({ message: "Erro ao excluir punição." });
    }
  },

  async atualizarExpiradas(req, res) {
    try {
      const qtd = await Punicao.updateExpired();
      res.status(200).json({ message: `Atualizadas ${qtd} punições expiradas.` });
    } catch (error) {
      res.status(500).json({ message: "Erro ao atualizar punições expiradas." });
    }
  },

  async verificarAtiva(req, res) {
    try {
      const { userId } = req.params;
      const punicao = await Punicao.hasActivePunishment(userId);
      res.status(200).json({
        hasActive: !!punicao,
        data: punicao || null,
      });
    } catch (error) {
      res.status(500).json({ message: "Erro ao verificar punição ativa." });
    }
  },
};

module.exports = punicaoController;
