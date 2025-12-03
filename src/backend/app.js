require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const userRoutes = require('./routes/UserRouter');
const authRoutes = require('./routes/AuthRouter');
const desabafoRoutes = require ('./routes/DesabafoRouter');
const interacaoRoutes = require ('./routes/InteracaoRouter');
const HumorRouter = require ('./routes/HumorRouter');
const RegistroHumor = require('./routes/RegistroHumorRouter');
const DenunciaRouter = require ('./routes/DenunciaRouter');
const PunicaoRoutes = require('./routes/PunicaoRoutes');
const ConteudoRoutes = require('./routes/ConteudoRouter');

const app = express();
app.use(cors());
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(bodyParser.json());


// rotas
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/desabafo', desabafoRoutes);
app.use('/api/interacao', interacaoRoutes);
app.use('/api/humor',HumorRouter);
app.use('/api/registro/humor',RegistroHumor);
app.use('/api/denuncia',DenunciaRouter);
app.use('/api/punicao',PunicaoRoutes);
app.use('/api/conteudo',ConteudoRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
