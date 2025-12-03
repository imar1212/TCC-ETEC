const express = require("express");
const router = express.Router();
const desabafoController = require("../controllers/desabafoController");
const authMiddleware = require("../middleware/auth");

// Rotas públicas
router.get("/", desabafoController.getAll);
router.get("/:id", desabafoController.getById);
router.get('/user/:userId', authMiddleware, desabafoController.getUserDesabafos);
router.get('/count/total', desabafoController.countPosts);
router.get('/count/pendentes', desabafoController.countPostsPendentes);

// Rotas protegidas
router.post("/", authMiddleware, desabafoController.create);
router.put("/:id", authMiddleware, desabafoController.update);
router.delete("/:id", authMiddleware, desabafoController.delete);

// Rota ADICIONADA para alterar o status
router.patch("/:id/status", authMiddleware, desabafoController.switchState);

module.exports = router;