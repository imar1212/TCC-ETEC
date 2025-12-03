const express = require("express");
const router = express.Router();
const denunciaController = require("../controllers/denunciaController");
const authMiddleware = require("../middleware/auth"); // proteger rotas

// Listar todas as denúncias
router.get("/", denunciaController.getAll);

router.get("/count", denunciaController.countActiveReports);

// Buscar denúncia por ID
router.get("/:id", denunciaController.getById);

// Buscar denúncia por User
router.get("/user/:id", denunciaController.getByUser);

// Criar nova denúncia (autenticado)
router.post("/", authMiddleware, denunciaController.create);

// Atualizar denúncia (autenticado)
router.put("/:id", authMiddleware, denunciaController.update);

// Deletar denúncia (autenticado)
router.delete("/:id", authMiddleware, denunciaController.delete);

// Alterar apenas o status da denúncia
router.put("/:id/status", authMiddleware, denunciaController.switchState);

module.exports = router;
