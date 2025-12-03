const path = require("path");
const Conteudo = require("../models/Conteudo");

const BASE_URL = "http://localhost:5000"; 

const conteudoController = {

  async listarTodos(req, res) {
    try {
      const conteudos = await Conteudo.findAll();
      const formatted = conteudos.map(c => ({
        ...c,
        Imagem: c.Imagem ? `${BASE_URL}${c.Imagem}` : null
      }));
      res.status(200).json({ total: formatted.length, data: formatted });
    } catch (err) {
      console.error("Erro ao listar conteúdos:", err);
      res.status(500).json({ message: "Erro ao listar conteúdos." });
    }
  },


  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const conteudo = await Conteudo.findById(id);
      if (!conteudo) return res.status(404).json({ message: "Conteúdo não encontrado." });

      if (conteudo.Imagem) conteudo.Imagem = `${BASE_URL}${conteudo.Imagem}`;
      res.status(200).json(conteudo);
    } catch (err) {
      console.error("Erro ao buscar conteúdo:", err);
      res.status(500).json({ message: "Erro ao buscar conteúdo." });
    }
  },


  async criar(req, res) {
    try {
      const { Titulo, Resumo, Conteudo: texto, Tipo, Status, Fk_usuario } = req.body;
      if (!Fk_usuario) return res.status(400).json({ message: "Fk_usuario é obrigatório" });

      const Imagem = req.file ? `/uploads/conteudos/${req.file.filename}` : null;

      const id = await Conteudo.create({ Titulo, Resumo, Conteudo: texto, Tipo, Status, Fk_usuario, Imagem });
      res.status(201).json({ message: "Conteúdo criado com sucesso!", id, Imagem: Imagem ? `${BASE_URL}${Imagem}` : null });
    } catch (err) {
      console.error("Erro ao criar conteúdo:", err);
      res.status(500).json({ message: "Erro ao criar conteúdo." });
    }
  },

async atualizar(req, res) {
  try {
    const { id } = req.params;
    const { Titulo, Resumo, Conteudo: texto, Tipo, Status, RemoverImagem } = req.body;

    // Buscar conteúdo atual
    const conteudoAtual = await Conteudo.findById(id);
    if (!conteudoAtual) return res.status(404).json({ message: "Conteúdo não encontrado." });

    let novaImagem = conteudoAtual.Imagem; 


    if (req.file) {
      novaImagem = `/uploads/conteudos/${req.file.filename}`;
    } else if (RemoverImagem === "true" || RemoverImagem === true) {
      novaImagem = null;
    }

    await Conteudo.update(id, { Titulo, Resumo, Conteudo: texto, Tipo, Status, Imagem: novaImagem });

    res.status(200).json({ message: "Conteúdo atualizado com sucesso.", Imagem: novaImagem ? `${BASE_URL}${novaImagem}` : null });
  } catch (err) {
    console.error("Erro ao atualizar conteúdo:", err);
    res.status(500).json({ message: "Erro ao atualizar conteúdo." });
  }
},



  async deletar(req, res) {
    try {
      const { id } = req.params;
      await Conteudo.delete(id);
      res.status(200).json({ message: "Conteúdo deletado com sucesso." });
    } catch (err) {
      console.error("Erro ao deletar conteúdo:", err);
      res.status(500).json({ message: "Erro ao deletar conteúdo." });
    }
  }
};

module.exports = conteudoController;
