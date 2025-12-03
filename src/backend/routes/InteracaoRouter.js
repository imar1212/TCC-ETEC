const express = require("express");
const router = express.Router();
const InteracaoController = require("../controllers/interacaoController");
const authMiddleware = require("../middleware/auth");

// Listar todas interações de um desabafo
router.get("/:desabafoId", InteracaoController.getInteracoes);

// Criar curtida ou comentário
router.post("/:desabafoId", authMiddleware, InteracaoController.createInteracao);

// routes/interacao.js
router.get("/detalhes/:id", authMiddleware, InteracaoController.getInteracaoById);



// Contar curtidas de um desabafo
router.get("/:desabafoId/likes", InteracaoController.getLikesCount);

// Verificar se usuário já curtiu um post
router.get("/:desabafoId/liked", authMiddleware, InteracaoController.checkUserLike);

// Alternar curtida (curtir/descurtir)
router.post("/:desabafoId/toggle-like", authMiddleware, InteracaoController.toggleLike);

// Selecionar comentários ativos
router.get("/:desabafoId/comentarios", InteracaoController.getComentarios);

// Selecionar todos os comentários globalmente
router.get("/comentarios/all", InteracaoController.getAllComentarios);

// Selecionar todos os comentários do usuário logado
router.get("/:desabafoId/user/comentarios", authMiddleware, InteracaoController.getUserComentarios);

//Inativar/Ativar post
router.put("/:id", authMiddleware, InteracaoController.switchStatus);

// Deletar interação
router.delete("/:id", authMiddleware, InteracaoController.deleteInteracao);

router.put("/comentarios/:id", authMiddleware, InteracaoController.updateComentario);

router.get('/respostas/user/:userId', authMiddleware, InteracaoController.getUserResponses);

// Rota protegida para buscar todas as curtidas de um usuário
router.get('/curtidas/user/:userId', authMiddleware, InteracaoController.getUserLikes);


module.exports = router;
