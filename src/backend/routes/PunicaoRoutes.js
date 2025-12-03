const express = require("express");
const router = express.Router();
const punicaoController = require("../controllers/punicaoController");
const authMiddleware = require("../middleware/auth");


router.get("/", authMiddleware, punicaoController.listarTodas);
router.get("/:id", authMiddleware, punicaoController.buscarPorId);
router.get("/usuario/:userId", authMiddleware, punicaoController.buscarPorUsuario);
router.get("/usuario/:userId/ativas", authMiddleware, punicaoController.buscarAtivasPorUsuario);
router.get("/usuario/:userId/verificar", authMiddleware, punicaoController.verificarAtiva);
router.post("/", authMiddleware, punicaoController.criar);
router.put("/:id", authMiddleware, punicaoController.atualizar);
router.patch("/:id/status",  authMiddleware, punicaoController.atualizarStatus);
router.patch("/:id/revogar",  authMiddleware, punicaoController.revogar);
router.delete("/:id",  authMiddleware, punicaoController.deletar);
router.patch("/expiradas/atualizar",  authMiddleware, punicaoController.atualizarExpiradas);

module.exports = router;
