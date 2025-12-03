
const User = require("../models/User");
const bcrypt = require("bcrypt");

const userController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await User.findAll();
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  },

  getUserById: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user)
        return res.status(404).json({ message: "Usuário não encontrado" });
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  },

    getUserByNametag: async (req, res) => {
    try {
      const user = await User.findByNametag(req.params.nametag);
      if (!user)
        return res.status(404).json({ message: "Usuário não encontrado" });
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  },

  countUsers: async (req, res) => {
    try {
      const total = await User.countUsers();
      res.status(200).json({ success: true, total });
    } catch (error) {
      console.error("Erro ao contar usuários", error);
      res.status(500).json({
        success: false,
        message: "Erro ao contar usuários",
        error: error.message,
      });
    }
  },

  createUser: async (req, res) => {
    try {
      let {
        apelido,
        email,
        senha,
        tipo = "usuario",
        status = "ativo",
        foto = "/nenhuma.png",
        nametag,
        bio,
        pronomes,
      } = req.body;

      if (await User.emailExists(email))
        return res.status(400).json({ message: "Email já cadastrado" });
      if (nametag && (await User.nametagExists(nametag)))
        return res.status(400).json({ message: "Nametag já cadastrada" });

      // Normaliza pronomes
      if (!Array.isArray(pronomes)) pronomes = [];
      const pronomesNormalizados = pronomes.map((p) => p.toLowerCase().trim());

      const userId = await User.create({
        apelido,
        email,
        senha,
        tipo,
        status,
        foto,
        nametag,
        bio,
        pronomes: pronomesNormalizados,
      });

      res
        .status(201)
        .json({
          Id_usuario: userId,
          apelido,
          email,
          tipo,
          status,
          foto,
          nametag,
          bio,
          pronomes: pronomesNormalizados,
        });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  },

  updateUser: async (req, res) => {
    try {
      const { id } = req.params;
      let { apelido, foto, nametag, bio, pronomes } = req.body;

      // Normaliza pronomes recebidos
      if (!Array.isArray(pronomes)) pronomes = [];
      const pronomesNovos = pronomes.map((p) => p.toLowerCase().trim());

      // Busca usuário atual
      const usuarioAtual = await User.findById(id);
      if (!usuarioAtual)
        return res.status(404).json({ message: "Usuário não encontrado" });

      const pronomesAtuais = (usuarioAtual.pronomes || []).map((p) =>
        p.toLowerCase().trim()
      );

      // Compara arrays
      const pronomesIguais =
        pronomesNovos.length === pronomesAtuais.length &&
        pronomesNovos.every((p) => pronomesAtuais.includes(p));

      if (pronomesIguais) pronomes = undefined;
      else pronomes = pronomesNovos;

      await User.update(id, { apelido, foto, nametag, bio, pronomes });

      res.json({ message: "Modificações feitas com sucesso!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  },

  updatePassword: async (req, res) => {
    try {
      const { id } = req.params;
      const { senhaAtual, senhaNova } = req.body;


      if (!senhaNova || senhaNova.length < 6) {
        return res
          .status(400)
          .json({ message: "A nova senha deve ter pelo menos 6 caracteres" });
      }


      const user = await User.findByIdWithPassword(id);
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }


      const senhaCorreta = await bcrypt.compare(senhaAtual, user.Senha);
      if (!senhaCorreta) {
        return res.status(400).json({ message: "Senha atual incorreta" });
      }


      await User.updatePassword(id, senhaNova);

      res.json({ message: "Senha atualizada com sucesso!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  },


  checkEmail: async (req, res) => {
    try {
      const { email } = req.params;
      const exists = await User.emailExists(email);
      res.json({ available: !exists });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  },

  checkNametag: async (req, res) => {
    try {
      const { nametag } = req.params;
      const exists = await User.nametagExists(nametag);
      res.json({ available: !exists });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  },

  updateUserType: async (req, res) => {
    try {
      const { id } = req.params;
      const { tipo } = req.body;
      if (!tipo || !["usuario", "administrador"].includes(tipo))
        return res.status(400).json({ message: "Tipo inválido" });

      await User.updateUserType(id, tipo);
      res.json({ message: "Tipo de usuário atualizado com sucesso!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  },

   updateUserStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (!status || !["ativo", "inativo"].includes(status))
        return res.status(400).json({ message: "Status inválido" });

      await User.updateUserStatus(id, status);
      res.json({ message: "Status de usuário atualizado com sucesso!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;
      await User.delete(id);
      res.json({ message: "Usuário deletado com sucesso!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  },
};

module.exports = userController;
