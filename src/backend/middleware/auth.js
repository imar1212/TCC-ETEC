const jwt = require('jsonwebtoken');
const Punicao = require('../models/Punicao');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Token não fornecido' });

  const parts = authHeader.split(' ');
  if (parts.length !== 2) return res.status(401).json({ message: 'Token inválido' });

  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme)) return res.status(401).json({ message: 'Token malformado' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // contém id, email, tipo, status, etc.


    if (decoded.status === 'inativo') {
      return res.status(403).json({
        message: 'Usuário inativo. Entre em contato com o suporte.',
      });
    }

    await Punicao.updateExpired();


    const punicaoAtiva = await Punicao.hasActivePunishment(decoded.id);

    if (punicaoAtiva) {
      const tipo = (punicaoAtiva.Tipo || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); 


      if (tipo.includes('ban') || tipo.includes('susp')) {
        const ate = punicaoAtiva.Data_fim ? ` até ${punicaoAtiva.Data_fim}` : '';
        return res.status(403).json({
          message: `Acesso bloqueado: você possui uma punição ativa (${punicaoAtiva.Tipo})${ate}.`,
          punicao: punicaoAtiva,
        });
      }
    }

    return next();

  } catch (err) {
    console.error('Erro no authMiddleware:', err);
    return res.status(401).json({ message: 'Token inválido ou expirado' });
  }
};

module.exports = authMiddleware;
