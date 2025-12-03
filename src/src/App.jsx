import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './Components/Paginas/Geral/Home/Home'
import CadastroUsuario from './Components/Paginas/Geral/CadastroUsuario/CadastroUsuario'
import AdminUsuarios from './Components/Paginas/Usuarios/Administrador/AdminUsuarios/AdminUsuarios'
import FormLogin from './Components/Paginas/Geral/Login/FormLogin';
import Inicio_Admin from './Components/Paginas/Usuarios/Administrador/Inicio_Admin/Inicio_Admin';
import Footer from './Components/Reutilizaveis/Footer/Footer';
import Inicio_Usuario from './Components/Paginas/Usuarios/Comum/Inicio_Usuario/Inicio_Usuario'
import RegistroHumor from './Components/Paginas/Usuarios/Comum/RegistroHumor/RegistroHumor';
import EditarPerfil from './Components/Paginas/Usuarios/Comum/EditarPerfil/EditarPerfil';
import PostsComunidade from './Components/Paginas/Usuarios/Comum/Posts/PostsComunidade';
import AdminPosts from './Components/Paginas/Usuarios/Administrador/AdminPosts/AdminPosts';
import PostsPendentes from './Components/Paginas/Usuarios/Administrador/AdminPostPendentes/PostsPendentes';
import AdminRepostas from './Components/Paginas/Usuarios/Administrador/AdminRepostas/AdminRepostas';
import Navbar from './Components/Reutilizaveis/Navbar/Navbar';
import Perfil from './Components/Paginas/Usuarios/Comum/Perfil/Perfil';
import SobreNos from './Components/Paginas/Geral/SobreNos/SobreNos';
import AdminDenuncias from './Components/Paginas/Usuarios/Administrador/AdminDenuncias/AdminDenuncias';
import MeuPerfil from './Components/Paginas/Usuarios/Comum/PerfilPessoal/PerfilPessoal';
import AdminPunicoes from './Components/Paginas/Usuarios/Administrador/AdminPunicoes/AdminPunicoes';
import AdminConteudo from './Components/Paginas/Usuarios/Administrador/AdminConteudo/AdminConteudo';
import CriarConteudo from './Components/Paginas/Usuarios/Administrador/CriarConteudo/CriarConteudo';
import EditarConteudo from './Components/Paginas/Usuarios/Administrador/EditarConteudo/EditarConteudo';
import Conteudos from './Components/Paginas/Usuarios/Comum/Conteudos/Conteudos';
import ConteudoDetalhes from './Components/Paginas/Usuarios/Comum/CounteudoDetalhes/ConteudoDetalhe';

import './App.css';


function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<SobreNos />} />
          <Route path="/cadastro" element={<CadastroUsuario />} />
          <Route path="/login" element={<FormLogin />} />
          <Route path="/inicio_admin" element={<Inicio_Admin />} />
          <Route path="/admin/user" element={<AdminUsuarios />} />
          <Route path="/inicio/usuario" element={<Inicio_Usuario />} />
          <Route path="/registro/humor" element={<RegistroHumor />} />
          <Route path="/editar/perfil" element={<EditarPerfil />} />
          <Route path="/perfil/:userNametag" element={<Perfil />} />
          <Route path="/comunidade" element={<PostsComunidade />} />
  
          <Route path="/admin/post" element={<AdminPosts />} />
          <Route path="/admin/post/pendente" element={<PostsPendentes />} />
          <Route path="/admin/respostas" element={<AdminRepostas />} />
          <Route path="/admin/denuncias" element={<AdminDenuncias />} />
          <Route path="/perfil/pessoal" element={<MeuPerfil />} />
          <Route path="/admin/punicoes" element={<AdminPunicoes />} />
          <Route path="/admin/conteudo" element={<AdminConteudo />} />
          <Route path="/criar/conteudo" element={<CriarConteudo />} />
          <Route path="/editar/conteudo/:id" element={<EditarConteudo />} />
          <Route path="/conteudo" element={<Conteudos />} />
          <Route path="/conteudo/:id" element={<ConteudoDetalhes />} />
        </Routes>
      </Router>
      <Footer />

    </>

  );
}

export default App;
