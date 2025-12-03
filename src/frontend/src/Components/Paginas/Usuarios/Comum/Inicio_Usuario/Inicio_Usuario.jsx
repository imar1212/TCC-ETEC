import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { countUsers, countDesabafo } from '../../../../../services/api'; // Importando as funções da API
import './Inicio_Usuario.css';

const Inicio_Usuario = () => {
  const [user, setUser] = useState(null);
  const [mood, setMood] = useState('');
  const [stats, setStats] = useState({
    totalMembros: 0,
    totalDesabafos: 0
  });
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const token = sessionStorage.getItem('token');

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem('user'));

    if (!token || !userData) {
      navigate('/');
    } else if (userData.tipo !== 'usuario') {
      navigate('/inicio_admin');
    }

    if (userData) {
      setUser(userData);
    }
  }, [navigate, token]);

  // Função para carregar as estatísticas
  const loadStats = async () => {
    try {
      setLoading(true);
      
      // Buscar estatísticas em paralelo
      const [membrosResponse, desabafosResponse] = await Promise.all([
        countUsers(),
        countDesabafo()
      ]);

      setStats({
        totalMembros: membrosResponse.data.total || 0,
        totalDesabafos: desabafosResponse.data.total || 0
      });

    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
      // Em caso de erro, manter os valores padrão (0)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadStats();
    }
  }, [token]);

  const handleMoodSubmit = (e) => {
    e.preventDefault();
    if (mood.trim()) {
      alert(`Seu humor (${mood}) foi registrado com sucesso!`);
      setMood('');
    }
  };

  return (
    <div className="container">
      <div className="user-home-container">
        {/* Welcome Section */}
        <section className="welcome-section">
          <div className="welcome-content">
            <div className="user-info">
              <div className="user-avatar">
                <img 
                  src={user?.foto || '/default-avatar.png'} 
                  alt="Avatar" 
                  onError={(e) => {
                    e.target.src = '/default-avatar.png';
                  }}
                />
              </div>
              <div className="user-details">
                <h1>Olá, {user?.apelido || 'Usuário'}!</h1>
                <p>Como você está se sentindo hoje?</p>
              </div>
            </div>

            <form onSubmit={handleMoodSubmit} className="mood-form">
              <div className="mood-input">
                <button type="submit" className="buttn">
                  <Link className="buttn" to='/registro/humor'>
                    Registrar Estado de humor
                  </Link>
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="quick-actions-section">
          <h2>Acesso Rápido</h2>
          <div className="actions-grid">
            <Link to="/comunidade" className="action-card">
              <div className="action-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-people" viewBox="0 0 16 16">
                  <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4" />
                </svg>
              </div>
              <h3>Comunidade</h3>
              <p>Conecte-se com outras pessoas</p>
            </Link>

            <Link to="/conteudo" className="action-card">
              <div className="action-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-book" viewBox="0 0 16 16">
                  <path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783" />
                </svg>
              </div>
              <h3>Recursos</h3>
              <p>Encontre materiais de apoio e informações</p>
            </Link>

            <Link to="/perfil/pessoal" className="action-card">
              <div className="action-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
                  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                  <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                </svg>
              </div>
              <h3>Meu Perfil</h3>
              <p>Gerencie sua conta e configurações</p>
            </Link>
          </div>
        </section>

        {/* Community Stats */}
        <section className="cb-section">
          <h2 className="cb-title">Nossa Comunidade</h2>

          <div className="cb-layout">
            <div className="cb-image">
              <img src="/InicioUsuario.png" alt="Comunidade" />
            </div>

            <div className="cb-stats-column">
              <div className="cb-stat-card">
                <div className="cb-stat-value">
                  {loading ? (
                    <div className="loading-spinner">...</div>
                  ) : (
                    stats.totalMembros.toLocaleString()
                  )}
                </div>
                <div className="cb-stat-label">Membros</div>
              </div>

              <div className="cb-stat-card">
                <div className="cb-stat-value">
                  {loading ? (
                    <div className="loading-spinner">...</div>
                  ) : (
                    stats.totalDesabafos.toLocaleString()
                  )}
                </div>
                <div className="cb-stat-label">Desabafos</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Inicio_Usuario;