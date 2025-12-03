const express = require("express");
const router = express.Router();
const HumorController = require("../controllers/humorController");
const authMiddleware = require("../middleware/auth"); // se quiser proteger rotas
const upload = require("../middleware/upload");


// Listar todos os humores
router.get("/", HumorController.findAll);

// Buscar humores por nome (ou termo)
router.get("/search", HumorController.browse);

// Criar novo humor/desabafo (autenticado)
router.post("/", authMiddleware, upload.single("icone"), HumorController.create);
router.put("/:id", authMiddleware, upload.single("icone"), HumorController.update);

// Deletar um humor (autenticado)
router.delete("/:id", authMiddleware, HumorController.delete);

// Alterar status do humor (autenticado)
router.put("/:id/:idUser", authMiddleware, HumorController.switchState);

module.exports = router;
