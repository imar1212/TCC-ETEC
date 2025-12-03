import React from 'react';
import './ModalDetalhesDenuncia.css';

const ModalDetalhesDenuncia = ({ denuncia, onFechar }) => {
  if (!denuncia) return null;

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

  // Função para determinar o tipo de conteúdo
  const getTipoConteudo = () => {
    if (denuncia.Fk_desabafo) return 'Desabafo';
    if (denuncia.Fk_post) return 'Post';
    if (denuncia.Fk_resposta) return 'Comentário';
    return 'Conteúdo';
  };

  // Função para obter classe do status
  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'pendente':
      case 'em análise':
        return 'status-pendente';
      case 'resolvida':
      case 'concluída':
        return 'status-resolvida';
      case 'arquivada':
      case 'fechada':
        return 'status-arquivada';
      default:
        return 'status-default';
    }
  };

  return (
    <div className="modal-overlay-detalhes" onClick={onFechar}>
      <div className="modal-detalhes-denuncia" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Detalhes da Denúncia</h3>
          <button className="btn-fechar" onClick={onFechar}>×</button>
        </div>

        <div className="modal-content">
          {/* Informações principais */}
          <div className="info-section">
            <h4>Informações da Denúncia</h4>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">ID:</span>
                <span className="info-value">#{denuncia.Id_denuncia}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Status:</span>
                <span className={`info-status ${getStatusClass(denuncia.Status)}`}>
                  {denuncia.Status || 'Pendente'}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Data:</span>
                <span className="info-value">
                  {formatarData(denuncia.Data || denuncia.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Motivo e descrição */}
          <div className="info-section">
            <h4>Motivo da Denúncia</h4>
            <div className="motivo-content">
              <strong>{denuncia.Motivo || 'Motivo não especificado'}</strong>
              {denuncia.Descricao && (
                <div className="descricao-content">
                  <p>{denuncia.Descricao}</p>
                </div>
              )}
            </div>
          </div>

          {/* Conteúdo denunciado */}
          <div className="info-section">
            <h4>Conteúdo Denunciado</h4>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Tipo:</span>
                <span className="info-value">{getTipoConteudo()}</span>
              </div>
              <div className="info-item">
                <span className="info-label">ID do Conteúdo:</span>
                <span className="info-value">
                  {denuncia.Fk_desabafo || denuncia.Fk_resposta || 'N/A'}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Alvo:</span>
                <span className="info-value">{denuncia.Alvo || 'Não especificado'}</span>
              </div>
            </div>
          </div>

          {/* Informações do usuário */}
          <div className="info-section">
            <h4>Informações do Usuário</h4>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Seu ID:</span>
                <span className="info-value">{denuncia.Fk_usuario || 'N/A'}</span>
              </div>
              {denuncia.Apelido && (
                <div className="info-item">
                  <span className="info-label">Seu Apelido:</span>
                  <span className="info-value">{denuncia.Apelido}</span>
                </div>
              )}
              {denuncia.nametag && (
                <div className="info-item">
                  <span className="info-label">Seu Nametag:</span>
                  <span className="info-value">@{denuncia.nametag}</span>
                </div>
              )}
            </div>
          </div>

          {/* Ações */}
          <div className="info-section">
            <h4>Ações Realizadas</h4>
            <div className="acoes-info">
              {denuncia.Status?.toLowerCase() === 'resolvida' ? (
                <div className="acao-realizada">
                  <span className="icone-acao">✓</span>
                  <span>Esta denúncia foi revisada e devidamente resolvida pela equipe de moderação. O conteúdo ofensivo foi removido. Agradecemos por ajudar a manter o ambiente saudável para todos!</span>
                </div>
              ) : denuncia.Status?.toLowerCase() === 'arquivada' ? (
                <div className="acao-realizada">
                  <span className="icone-acao"></span>
                  <span>Esta denúncia foi analisada pela moderação e arquivada por não violar nossas diretrizes.</span>
                </div>
              ) : (
                <div className="acao-pendente">
                  <span className="icone-acao"></span>
                  <span>Esta denúncia está em análise pela nossa equipe de moderação.</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-fechar-modal" onClick={onFechar}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDetalhesDenuncia;