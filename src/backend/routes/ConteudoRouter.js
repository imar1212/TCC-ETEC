const express = require("express");
const router = express.Router();
const path = require('path'); // <-- ADICIONADO AQUI
// const upload = require("../middlewares/upload"); // LINHA ANTIGA
// const conteudoController = require("../controllers/conteudoController"); // LINHA ANTIGA

// Novas linhas usando __dirname e path.join para garantir o caminho
const upload = require('../middleware/upload') 
const conteudoController = require(path.join(__dirname, '..', 'controllers', 'conteudoController')); 

router.get("/", conteudoController.listarTodos);
router.get("/:id", conteudoController.buscarPorId);
router.post("/", upload.single("Imagem"), conteudoController.criar);
router.put("/:id", upload.single("Imagem"), conteudoController.atualizar);
router.delete("/:id", conteudoController.deletar);

module.exports = router;