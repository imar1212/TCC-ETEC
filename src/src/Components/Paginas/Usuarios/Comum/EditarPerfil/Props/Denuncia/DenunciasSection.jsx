import React, { useState, useEffect } from 'react';
import { getDenunciaByUser } from '../../../../../../../services/api';
import ModalDetalhesDenuncia from './ModalDetalhesDenuncia'; // Importe o modal
import './DenunciasSection.css';

const DenunciasSection = ({ userId, onCarregarDenuncias }) => {
  const [filtroAtivo, setFiltroAtivo] = useState('Todas');
  const [denuncias, setDenuncias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [denunciaSelecionada, setDenunciaSelecionada] = useState(null); // Estado para o modal

  // Função para carregar denúncias do usuário
const carregarMinhasDenuncias = async () => {
  if (!userId) {
    setError('Usuário não identificado');
    setLoading(false);
    return;
  }

  try {
    setLoading(true);
    setError(null);

    const response = await getDenunciaByUser(userId);
    // Garante que sempre teremos um array
    const denunciasUsuario = response.data || [];

    setDenuncias(denunciasUsuario);

    // Se houver callback externo
    if (onCarregarDenuncias) {
      onCarregarDenuncias(denunciasUsuario);
    }
  } catch (err) {
    console.error('Erro ao carregar denúncias:', err);
    // Se a API retornar vazio, não trata como erro
    setError(null);
    setDenuncias([]);
  } finally {
    setLoading(false);
  }
};


  // Carrega denúncias quando o componente monta ou userId muda
  useEffect(() => {
    carregarMinhasDenuncias();
  }, [userId]);

  // Função para filtrar denúncias baseado no filtro ativo
  const denunciasFiltradas = denuncias.filter(denuncia => {
    if (filtroAtivo === 'Todas') return true;
    
    const statusNormalizado = denuncia.Status?.toLowerCase();
    switch (filtroAtivo) {
      case 'Em análise':
        return statusNormalizado === 'em análise' || statusNormalizado === 'pendente';
      case 'Resolvidas':
        return statusNormalizado === 'resolvida' || statusNormalizado === 'concluída';
      case 'Arquivadas':
        return statusNormalizado === 'arquivada' || statusNormalizado === 'fechada';
      default:
        return true;
    }
  });

  // Função para formatar data
  const formatarData = (dataString) => {
    if (!dataString) return 'Data não informada';
    
    try {
      const data = new Date(dataString);
      return data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dataString;
    }
  };

  // Função para determinar o tipo de conteúdo denunciado
  const getTipoConteudo = (denuncia) => {
    if (denuncia.Fk_desabafo) return 'Desabafo';
    if (denuncia.Fk_post) return 'Post';
    if (denuncia.Fk_resposta) return 'Comentário';
    return 'Conteúdo';
  };

  // Função para obter detalhes da denúncia (resumo)
  const getDetalhesDenuncia = (denuncia) => {
    const tipoConteudo = getTipoConteudo(denuncia);
    const idConteudo = denuncia.Fk_desabafo || denuncia.Fk_post || denuncia.Fk_resposta;
    
    return `Denúncia sobre ${tipoConteudo} #${idConteudo}`;
  };

  // Função para abrir modal com detalhes
  const handleVerDetalhes = (denuncia) => {
    setDenunciaSelecionada(denuncia);
  };

  // Função para fechar modal
  const handleFecharModal = () => {
    setDenunciaSelecionada(null);
  };

  // Função para tentar recarregar
  const handleTentarNovamente = () => {
    carregarMinhasDenuncias();
  };

  if (loading) {
    return (
      <div className="denuncias-section">
        <h2 className="subtitulo-secao">Minhas Denúncias</h2>
        <div className="loading-denuncias">
          <div className="loading-spinner"></div>
          <p>Carregando suas denúncias...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="denuncias-section">
        <h2 className="subtitulo-secao">Minhas Denúncias</h2>
        <div className="erro-denuncias">
          <p>{error}</p>
          <button onClick={handleTentarNovamente} className="btn-tentar-novamente">
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="denuncias-section">
      <h2 className="subtitulo-secao">Minhas Denúncias</h2>
      
      <div className="filtros-denuncias">
        <button 
          className={filtroAtivo === 'Todas' ? 'filtro-ativo' : ''}
          onClick={() => setFiltroAtivo('Todas')}
        >
          Todas ({denuncias.length})
        </button>
        <button 
          className={filtroAtivo === 'Em análise' ? 'filtro-ativo' : ''}
          onClick={() => setFiltroAtivo('Em análise')}
        >
          Em análise ({denuncias.filter(d => d.Status?.toLowerCase().includes('análise') || d.Status?.toLowerCase().includes('pendente')).length})
        </button>
        <button 
          className={filtroAtivo === 'Resolvidas' ? 'filtro-ativo' : ''}
          onClick={() => setFiltroAtivo('Resolvidas')}
        >
          Resolvidas ({denuncias.filter(d => d.Status?.toLowerCase().includes('resolvida') || d.Status?.toLowerCase().includes('concluída')).length})
        </button>
        <button 
          className={filtroAtivo === 'Arquivadas' ? 'filtro-ativo' : ''}
          onClick={() => setFiltroAtivo('Arquivadas')}
        >
          Arquivadas ({denuncias.filter(d => d.Status?.toLowerCase().includes('arquivada') || d.Status?.toLowerCase().includes('fechada')).length})
        </button>
      </div>

      <div className="lista-denuncias">
        {denunciasFiltradas.length > 0 ? (
          denunciasFiltradas.map(denuncia => (
            <div key={denuncia.Id_denuncia} className="denuncia-card">
              <div className="denuncia-header">
                <div className="denuncia-info">
                  <span className="denuncia-motivo">{denuncia.Motivo || 'Motivo não especificado'}</span>
                  <span className="denuncia-data">
                    {formatarData(denuncia.Data || denuncia.createdAt)}
                  </span>
                </div>
                <span className={`denuncia-status ${denuncia.Status?.toLowerCase().replace(' ', '-')}`}>
                  {denuncia.Status || 'Pendente'}
                </span>
              </div>
              <div className="denuncia-detalhes">
                {getDetalhesDenuncia(denuncia)}
                {denuncia.Descricao && (
                  <div className="denuncia-descricao">
                    {denuncia.Descricao}
                  </div>
                )}
              </div>
              <div className="denuncia-acoes">
                <button 
                  className="btn-detalhes"
                  onClick={() => handleVerDetalhes(denuncia)}
                >
                  Ver detalhes
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="sem-denuncias">
            <div className="icone-sem-denuncias"></div>
            <p>
              {filtroAtivo === 'Todas' 
                ? 'Você não realizou nenhuma denúncia ainda.'
                : `Nenhuma denúncia encontrada no filtro "${filtroAtivo}".`
              }
            </p>
          </div>
        )}
      </div>

      {/* Modal de detalhes */}
      {denunciaSelecionada && (
        <ModalDetalhesDenuncia
          denuncia={denunciaSelecionada}
          onFechar={handleFecharModal}
        />
      )}
    </div>
  );
};

export default DenunciasSection;