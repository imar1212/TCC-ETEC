const express = require("express");
const router = express.Router();
const RegistroHumorController = require("../controllers/registroHumorController");
const authMiddleware = require("../middleware/auth");

// Criar novo registro de humor (autenticado)
router.post("/", authMiddleware, RegistroHumorController.create);

// Buscar registros por usuário
router.get("/user/:userId", authMiddleware, RegistroHumorController.findByUser);

// Atualizar registro de humor
router.put("/:id", authMiddleware, RegistroHumorController.update);

// Deletar registro
router.delete("/:id", authMiddleware, RegistroHumorController.delete);

module.exports = router;
