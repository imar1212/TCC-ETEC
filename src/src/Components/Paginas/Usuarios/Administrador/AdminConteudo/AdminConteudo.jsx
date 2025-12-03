import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // ADICIONADO useNavigate
import { getConteudos, deleteConteudo } from "../../../../../services/api";
import { Pencil, Trash, StepBack } from "lucide-react";
import './AdminConteudo.css';

const AdminConteudo = () => {
  const [conteudos, setConteudos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate(); // ADICIONADO

  // 🔁 VERIFICAÇÃO DE LOGIN E PERMISSÕES - ADICIONADO
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
  }, [navigate]);

  // Função para buscar conteúdos
  const fetchConteudos = async () => {
    try {
      setLoading(true);
      const response = await getConteudos();
      setConteudos(response.data.data || []);
    } catch (error) {
      console.error("Erro ao buscar conteúdos:", error);
      setConteudos([]);
    } finally {
      setLoading(false);
    }
  };

  // Função para deletar conteúdo
  const handleDelete = async (id, titulo) => {
    if (window.confirm(`Tem certeza que deseja deletar o conteúdo "${titulo}"?`)) {
      try {
        await deleteConteudo(id);
        setConteudos(prev => prev.filter(c => c.Id_conteudo !== id));
      } catch (error) {
        console.error("Erro ao deletar conteúdo:", error);
        alert("Erro ao deletar conteúdo. Tente novamente.");
      }
    }
  };

  // Função para obter classe do status
  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'ativo': return 'status-ativo';
      case 'inativo': return 'status-inativo';
      case 'pendente': return 'status-pendente';
      default: return 'status-pendente';
    }
  };

  // Função para formatar datetime do banco
  const formatDate = (datetime) => {
    if (!datetime) return "Data indisponível";
    // Substitui espaço por T
    let isoString = datetime.includes('T') ? datetime : datetime.replace(' ', 'T');
    const d = new Date(isoString);
    if (isNaN(d.getTime())) {
      const fixed = isoString.length === 16 ? isoString + ":00" : isoString;
      const d2 = new Date(fixed);
      return isNaN(d2.getTime()) ? "Data inválida" : d2.toLocaleDateString('pt-BR');
    }
    return d.toLocaleDateString('pt-BR');
  };

  // Filtrar conteúdos baseado na busca
  const filteredConteudos = conteudos.filter(conteudo =>
    conteudo.Titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conteudo.Resumo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchConteudos();
  }, []);

  return (
    <div className="container">
      <div className="admin-conteudo-container">
        <div className="admin-conteudo-content">
          {/* Header */}
          <button className="voltar-btn" onClick={() => navigate(-1)}>
            <StepBack size={10} /> Voltar
          </button>

          <div className="admin-header">
            <h1>Administração de Conteúdos</h1>
            <p className="admin-subtitle">Gerencie todos os conteúdos do sistema</p>
          </div>

          {/* Botão para criar novo conteúdo */}
          <div className="create-btn-container">
            <Link to="/criar/conteudo" className="btn create-btn">
              + Criar Novo Conteúdo
            </Link>
          </div>

          {/* Filtro de Busca */}
          <div className="filters-container">
            <input
              type="text"
              placeholder="Buscar por título ou resumo..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Loading State */}
          {loading && (
            <div className="loading-container">
              <div>
                <div className="loading-spinner"></div>
                <p className="loading-text">Carregando conteúdos...</p>
              </div>
            </div>
          )}

          {/* Lista de conteúdos */}
          {!loading && (
            <>
              {filteredConteudos.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon"></div>
                  <h3>Nenhum conteúdo encontrado</h3>
                  <p>{searchTerm
                    ? "Não foram encontrados conteúdos para sua busca."
                    : "Comece criando seu primeiro conteúdo!"
                  }</p>
                  {!searchTerm && (
                    <Link to="/criar/conteudo" className="btn create-btn">
                      Criar Primeiro Conteúdo
                    </Link>
                  )}
                </div>
              ) : (
                <>
                  <div className="stats-container">
                    <div className="stat-card">
                      <div className="stat-number">{filteredConteudos.length}</div>
                      <div className="stat-label">Total de Conteúdos</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-number">
                        {filteredConteudos.filter(c => c.Status?.toLowerCase() === 'ativo').length}
                      </div>
                      <div className="stat-label">Conteúdos Ativos</div>
                    </div>
                  </div>

                  <div className="conteudos-grid">
                    {filteredConteudos.map((conteudo) => (
                      <div key={conteudo.Id_conteudo} className="conteudo-card">
                        <div className="card-header">
                          <h3>{conteudo.Titulo}</h3>
                          <div>
                            <span className={`status-badge ${getStatusClass(conteudo.Status)}`}>
                              {conteudo.Status || 'Pendente'}
                            </span>
                            <span className="tipo-badge">{conteudo.Tipo}</span>
                          </div>
                        </div>

                        <div className="card-content">
                          <p><strong>Resumo:</strong></p>
                          <p className="resumo-text">{conteudo.Resumo}</p>

                          <p><strong>Criado em:</strong> {formatDate(conteudo.DataCriacao)}</p>

                          {conteudo.Autor && (
                            <p><strong>Autor:</strong> {conteudo.Autor}</p>
                          )}
                        </div>

                        <div className="card-footer">
                          <div className="btn-group">
                            <Link
                              to={`/editar/conteudo/${conteudo.Id_conteudo}`}
                              className="btn btn-primary"
                            >
                              <Pencil size={15} /> Editar
                            </Link>
                            <button
                              className="btn btn-danger"
                              onClick={() => handleDelete(conteudo.Id_conteudo, conteudo.Titulo)}
                            >
                              <Trash size={15} /> Deletar
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminConteudo;
