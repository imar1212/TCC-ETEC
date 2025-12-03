import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Queer from '../../../assets/Queercoded_Logo.png';
import { 
  House, Users, CircleUserRound, LogOut, LogIn, Info, 
  Drama, Book, MessageCircleWarning, MessageSquareMore, MessagesSquare, LaughIcon 
} from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const carregarUsuario = () => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    carregarUsuario();

    const handleAuthChange = () => {
      carregarUsuario();
    };

    window.addEventListener('authChanged', handleAuthChange);
    return () => {
      window.removeEventListener('authChanged', handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    setUser(null);
    window.dispatchEvent(new Event('authChanged'));
    navigate('/');
  };

  const isActiveLink = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <img src={Queer} alt="Logo QueerCoded" height={60} />
      </div>
      <ul className="nav-links">
        <li>
          {user && user.tipo === 'administrador' ? (
            <Link to="/inicio_admin" className={isActiveLink('/inicio_admin')}>
              <House size={16} strokeWidth={1.25} />
              Início
            </Link>
          ) : user && user.tipo === 'usuario' ? (
            <Link to="/inicio/usuario" className={isActiveLink('/inicio/usuario')}>
              <House size={16} strokeWidth={1.25} />
              Início
            </Link>
          ) : (
            <Link to="/" className={isActiveLink('/')}>
              <House size={16} strokeWidth={1.25} />
              Início
            </Link>
          )}
        </li>

        {user && user.tipo === 'usuario' && (
          <>
            <li>
              <Link to="/comunidade" className={isActiveLink('/comunidade')}>
                <Users size={16} strokeWidth={1.25} />
                Comunidade
              </Link>
            </li>
            <li>
              <Link to="/registro/humor" className={isActiveLink('/registro/humor')}>
                <LaughIcon size={16} strokeWidth={1.25} />
                Registro de humor
              </Link>
            </li>
            <li>
              <Link to="/conteudo" className={isActiveLink('/conteudo')}>
                <Book size={16} strokeWidth={1.25} />
                Recursos
              </Link>
            </li>
          </>
        )}

        {user && user.tipo === 'administrador' && (
          <>
            <li>
              <Link to="/admin/user" className={isActiveLink('/admin/user')}>
                <Users size={16} strokeWidth={1.25} />
                Usuários
              </Link>
            </li>
            <li>
              <Link to="/admin/post" className={isActiveLink('/admin/post')}>
                <MessageSquareMore size={16} strokeWidth={1.25} />
                Postagens
              </Link>
            </li>
            <li>
              <Link to="/admin/respostas" className={isActiveLink('/admin/respostas')}>
                <MessagesSquare size={16} strokeWidth={1.25} />
                Respostas
              </Link>
            </li>
            <li>
              <Link to="/admin/denuncias" className={isActiveLink('/admin/denuncias')}>
                <MessageCircleWarning size={16} strokeWidth={1.25} />
                Denúncias
              </Link>
            </li>
          </>
        )}

        <li>
          {!user && (
            <Link to="/sobre" className={isActiveLink('/sobre')}>
              <Info size={16} strokeWidth={1.25} />
              Sobre nós
            </Link>
          )}
        </li>
      </ul>

      <div className="user-actions">
        {!user ? (
          <>
            <Link to="/login" className={`btn btn-login ${isActiveLink('/login')}`}>
              <LogIn size={16} strokeWidth={1.25} />
              Entrar
            </Link>
            <Link to="/cadastro" className={`btn btn-register ${isActiveLink('/cadastro')}`}>
              Cadastrar-se
            </Link>
          </>
        ) : (
          <>
            <Link to="/perfil/pessoal" className={`btn btn-profile ${isActiveLink('/perfil/pessoal')}`}>
              <CircleUserRound size={16} strokeWidth={1.5} />
              Meu perfil
            </Link>
            <button onClick={handleLogout} className="btn btn-logout">
              <LogOut size={16} strokeWidth={1.5} />
              Sair
            </button>
          </>
        )}
      </div>
      <div className="rainbow-border"></div>
    </nav>
  );
};

export default Navbar;
