// routes/UserRouter.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

// Rotas públicas
router.get('/check-email/:email', userController.checkEmail);
router.get('/check-nametag/:nametag', userController.checkNametag);
router.get('/count', userController.countUsers);

// Criação de usuário pública (registro)
router.post('/', userController.createUser);

// Rotas protegidas (ex.: listagem, edição, deleção) — exige token
router.get('/', authMiddleware, userController.getAllUsers);
router.get('/:id', authMiddleware, userController.getUserById);
router.get('/perfil/:nametag', authMiddleware, userController.getUserByNametag);
router.put('/:id', authMiddleware, userController.updateUser);
router.delete('/:id', authMiddleware, userController.deleteUser);

// Rotas para atualizar tipo e status (exemplo)
router.put('/:id/type', authMiddleware, userController.updateUserType);
router.put('/:id/status', authMiddleware, userController.updateUserStatus);
router.put('/:id/password', authMiddleware, userController.updatePassword);

module.exports = router;
