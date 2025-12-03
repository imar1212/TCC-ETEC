import React, { useState, useEffect } from 'react';
import './Inicio_Admin.css';
import { Link, useNavigate } from 'react-router-dom';
import { countDenuncia, countDesabafo, countDesabafoPendente, countUsers } from '../../../../../services/api';

const Inicio_Admin = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPosts: 0,
    pendingApprovals: 0,
    reports: 0
  });

useEffect(() => {
  const token = sessionStorage.getItem('token');
  const user = JSON.parse(sessionStorage.getItem('user'));

  if (!token || !user) {
    navigate('/');
    return;
  }

  if (user.tipo !== 'administrador') {
    alert('Você não tem permissão para acessar esta página.');
    navigate('/inicio-usuario');
    return;
  }

  const fetchStats = async () => {
    try {
      const usersData = await countUsers();
      const postsData = await countDesabafo();
      console.log('Posts',postsData.data.total)
      const pendingPostsData = await countDesabafoPendente();
        console.log('Post pendentes',pendingPostsData.total)
      const denunciasData = await countDenuncia();
        console.log('denuncias',denunciasData.data.total)

      setStats({
        totalUsers: usersData.data.total || 0,
        totalPosts: postsData.data.total || 0,
        pendingApprovals: pendingPostsData.data.total || 0,
        reports: denunciasData.data.total || 0,
      });
    } catch (err) {
      console.error('Erro ao buscar estatísticas:', err);
    }
  };

  fetchStats();
}, [navigate]);


  return (
    <div className="container">
      <div className="admin-container">
        {/* Header Section */}
        <section className="admin-header">
          <div className="admin-welcome">
            <h1>Painel de <span className="highlight">Administração</span></h1>
            <p>Gerencie a plataforma, modere conteúdo e acompanhe as estatísticas.</p>
          </div>
          <div className="admin-actions">
            <Link to="/admin/approvals" className="btn btn-warning">
              <i className="fas fa-check-circle"></i>
              Conteúdo para Moderar 
            </Link>
            <Link to="/admin/denuncias" className="btn btn-danger">
              <i className="fas fa-flag"></i>
              Denúncias 
            </Link>
          </div>
        </section>

        {/* Stats Section */}
        <section className="admin-stats">
          <h2>Estatísticas da Plataforma</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon"> <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-people" viewBox="0 0 16 16">
                <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4" />
              </svg></div>
              <div className="stat-info">
                <h3>{stats.totalUsers}</h3>
                <p>Usuários Cadastrados</p>
              </div>
              <Link to="/admin/user" className="stat-link">
                Ver todos <i className="fas fa-arrow-right"></i>
              </Link>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-chat-right-text" viewBox="0 0 16 16">
                  <path d="M2 1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h9.586a2 2 0 0 1 1.414.586l2 2V2a1 1 0 0 0-1-1zm12-1a2 2 0 0 1 2 2v12.793a.5.5 0 0 1-.854.353l-2.853-2.853a1 1 0 0 0-.707-.293H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2z" />
                  <path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6m0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5" />
                </svg>
              </div>
              <div className="stat-info">
                <h3>{stats.totalPosts}</h3>
                <p>Total de Publicações</p>
              </div>
              <Link to="/admin/post" className="stat-link">
                Gerenciar <i className="fas fa-arrow-right"></i>
              </Link>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-envelope-exclamation" viewBox="0 0 16 16">
                <path d="M2 2a2 2 0 0 0-2 2v8.01A2 2 0 0 0 2 14h5.5a.5.5 0 0 0 0-1H2a1 1 0 0 1-.966-.741l5.64-3.471L8 9.583l7-4.2V8.5a.5.5 0 0 0 1 0V4a2 2 0 0 0-2-2zm3.708 6.208L1 11.105V5.383zM1 4.217V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v.217l-7 4.2z" />
                <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.5-5v1.5a.5.5 0 0 1-1 0V11a.5.5 0 0 1 1 0m0 3a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0" />
              </svg></div>
              <div className="stat-info">
                <h3>{stats.pendingApprovals}</h3>
                <p>Publicações Pendentes</p>
              </div>
              <Link to="/admin/post/pendente" className="stat-link">
                Revisar <i className="fas fa-arrow-right"></i>
              </Link>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-exclamation-octagon" viewBox="0 0 16 16">
                <path d="M4.54.146A.5.5 0 0 1 4.893 0h6.214a.5.5 0 0 1 .353.146l4.394 4.394a.5.5 0 0 1 .146.353v6.214a.5.5 0 0 1-.146.353l-4.394 4.394a.5.5 0 0 1-.353.146H4.893a.5.5 0 0 1-.353-.146L.146 11.46A.5.5 0 0 1 0 11.107V4.893a.5.5 0 0 1 .146-.353zM5.1 1 1 5.1v5.8L5.1 15h5.8l4.1-4.1V5.1L10.9 1z" />
                <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z" />
              </svg></div>
            <div className="stat-info">
              <h3>{stats.reports}</h3>
              <p>Denúncias pendentes {stats.reports}</p>
            </div>
            <Link to="/admin/denuncias" className="stat-link">
              Analisar <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
      </div>
    </section>

        {/* Quick Actions Section */ }
  <section className="quick-actions">
    <h2>Ações Rápidas</h2>
    <div className="actions-grid">
      <Link to="/admin/user" className="action-card">
        <div className="action-icon"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-people" viewBox="0 0 16 16">
          <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4" />
        </svg></div>
        <h3>Gerenciar Usuários</h3>
        <p>Visualize, edite ou remova usuários da plataforma</p>
      </Link>
      <Link to="/admin/post" className="action-card">
        <div className="action-icon"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-envelope" viewBox="0 0 16 16">
          <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z" />
        </svg></div>
        <h3>Gerenciar Publicações</h3>
        <p>Modere todo o conteúdo publicado na plataforma</p>
      </Link>
      <Link to="/admin/conteudo" className="action-card">
        <div className="action-icon"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-mortarboard" viewBox="0 0 16 16">
          <path d="M8.211 2.047a.5.5 0 0 0-.422 0l-7.5 3.5a.5.5 0 0 0 .025.917l7.5 3a.5.5 0 0 0 .372 0L14 7.14V13a1 1 0 0 0-1 1v2h3v-2a1 1 0 0 0-1-1V6.739l.686-.275a.5.5 0 0 0 .025-.917zM8 8.46 1.758 5.965 8 3.052l6.242 2.913z" />
          <path d="M4.176 9.032a.5.5 0 0 0-.656.327l-.5 1.7a.5.5 0 0 0 .294.605l4.5 1.8a.5.5 0 0 0 .372 0l4.5-1.8a.5.5 0 0 0 .294-.605l-.5-1.7a.5.5 0 0 0-.656-.327L8 10.466zm-.068 1.873.22-.748 3.496 1.311a.5.5 0 0 0 .352 0l3.496-1.311.22.748L8 12.46z" />
        </svg></div>
        <h3>Reursos Informativos</h3>
        <p>Adicione ou edite materiais de apoio e informações</p>
      </Link>
      {/* <Link to="/configuracoes" className="action-card">
        <div className="action-icon"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-gear" viewBox="0 0 16 16">
          <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0" />
          <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115z" />
        </svg></div>
        <h3>Configurações</h3>
        <p>Ajuste as configurações gerais da plataforma</p>
      </Link> */}
    </div>
  </section>
      </div >
    </div >
  );
};

export default Inicio_Admin;
