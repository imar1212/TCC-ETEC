const Interacao = require("../models/Interacao");

const interacaoController = {

  getInteracoes: async (req, res) => {
    try {
      const { desabafoId } = req.params;
      const interacoes = await Interacao.findByDesabafo(desabafoId);
      res.json(interacoes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao buscar interações" });
    }
  },

  getUserResponses: async (req, res) => {
    try {

      const { userId } = req.params;

      if (!userId) {
        return res
          .status(400)
          .json({ message: "ID do usuário é obrigatório." });
      }

      const responses = await Interacao.selectUserResponses(userId);

      res.status(200).json({
        message: "Respostas do usuário carregadas com sucesso.",
        data: responses,
        total: responses.length,
      });
    } catch (error) {
      console.error("Erro ao buscar respostas do usuário:", error);
      res
        .status(500)
        .json({ message: "Erro interno do servidor ao buscar respostas." });
    }
  },

 getInteracaoById: async (req, res) => {
    try {
      const { id } = req.params;
      const interacao = await Interacao.getInteracaoById(id);
      if (!interacao) return res.status(404).json({ message: "Interação não encontrada" });
      res.json(interacao);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erro ao buscar interação" });
    }
  },

  getUserLikes: async (req, res) => {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res
          .status(400)
          .json({ message: "ID do usuário é obrigatório." });
      }

      const likes = await Interacao.selectUserLikes(userId);

      res.status(200).json({
        message: "Curtidas do usuário carregadas com sucesso.",
        data: likes,
        total: likes.length,
      });
    } catch (error) {
      console.error("Erro ao buscar curtidas do usuário:", error);
      res
        .status(500)
        .json({ message: "Erro interno do servidor ao buscar curtidas." });
    }
  },

  createInteracao: async (req, res) => {
    try {
      const { desabafoId } = req.params;
      const { tipo, texto } = req.body; // texto é o campo correto do BD
      const userId = req.user.id;

      if (!["curtida", "comentario"].includes(tipo)) {
        return res.status(400).json({ message: "Tipo de interação inválido" });
      }

      if (tipo === "comentario" && (!texto || texto.trim() === "")) {
        return res
          .status(400)
          .json({ message: "Comentário não pode ser vazio" });
      }

      const interacaoId = await Interacao.create({
        tipo,
        conteudo: texto,
        userId,
        desabafoId,
      });

      res.status(201).json({
        Id_interacao: interacaoId,
        tipo,
        status: tipo === "comentario" ? "pendente" : "ativo",
        data: new Date(),
        texto: texto || null,
        fk_usuario: userId,
        fk_desabafo: desabafoId,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao criar interação" });
    }
  },


  getLikesCount: async (req, res) => {
    try {
      const { desabafoId } = req.params;
      const total = await Interacao.countLikes(desabafoId);
      res.json({ totalLikes: total });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao contar curtidas" });
    }
  },

  getComentarios: async (req, res) => {
    try {
      const { desabafoId } = req.params;
      const comentarios = await Interacao.selectComments(desabafoId);
      res.json(comentarios);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao buscar comentários" });
    }
  },
  getAllComentarios: async (req, res) => {
    try {
      const comentarios = await Interacao.selectAllComments();
      res.json(comentarios);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao buscar comentários" });
    }
  },

  getUserComentarios: async (req, res) => {
    try {
      const { desabafoId } = req.params;
      const userId = req.user.id;
      const comentarios = await Interacao.selectUserComments(
        desabafoId,
        userId
      );
      res.json(comentarios);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao buscar comentários" });
    }
  },

  checkUserLike: async (req, res) => {
    try {
      const { desabafoId } = req.params;
      const userId = req.user.id;
      const like = await Interacao.hasUserLiked(desabafoId, userId);
      res.json({ liked: !!like });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao verificar curtida" });
    }
  },

  toggleLike: async (req, res) => {
    try {
      const { desabafoId } = req.params;
      const userId = req.user.id;
      const result = await Interacao.toggleLike(desabafoId, userId);

      const totalLikes = await Interacao.countLikes(desabafoId);

      res.json({
        ...result,
        totalLikes,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao alternar curtida" });
    }
  },

  deleteInteracao: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      await Interacao.delete(id, userId);
      res.json({ message: "Interação deletada com sucesso" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao remover interação" });
    }
  },
  switchStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;


      if (!status || !["ativo", "inativo", "pendente"].includes(status)) {
        return res.status(400).json({ message: "Status inválido" });
      }


      await Interacao.switchStatus(id, status); // with userId

      res.json({ message: "Status atualizado com sucesso!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  },
  updateComentario: async (req, res) => {
    try {
      const { id } = req.params; 
      const { texto } = req.body;
      const userId = req.user.id;

      if (!texto || texto.trim() === "") {
        return res
          .status(400)
          .json({ message: "Comentário não pode ser vazio" });
      }

      const atualizado = await Interacao.updateComentario(id, userId, texto);

      if (!atualizado) {
        return res.status(404).json({
          message: "Comentário não encontrado ou você não tem permissão",
        });
      }

      res.json({ message: "Comentário atualizado com sucesso!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao atualizar comentário" });
    }
  },
};

module.exports = interacaoController;
