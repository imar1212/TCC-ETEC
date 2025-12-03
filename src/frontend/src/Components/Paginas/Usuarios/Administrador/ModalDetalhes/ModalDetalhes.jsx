import React, { useEffect, useState } from "react";
import { getDesabafoById, getInteracaoById } from "../../../../../services/api";
import "./ModalDetalhes.css";
import { User, UserX } from "lucide-react"; // Importando ícones para avatar

const ModalDetalhes = ({ tipo, id, fecharModal }) => {
  const [detalhes, setDetalhes] = useState(null);
  const [desabafo, setDesabafo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetalhes = async () => {
      setLoading(true);
      try {
        if (tipo === "resposta") {
          const resResposta = await getInteracaoById(id);
          const resposta = resResposta.data;

          const resDesabafo = await getDesabafoById(resposta.Id_desabafo);
          const desabafoData = resDesabafo.data;

          const desabafoCompleto = {
            ...desabafoData,
            AutorDesabafoApelido: resposta.AutorDesabafoApelido,
            AutorDesabafoNametag: resposta.AutorDesabafoNametag,
            FotoAutorDesabafo: resposta.FotoAutorDesabafo,
            DesabafoAnonimo: resposta.DesabafoAnonimo // Adicionando esta informação
          };

          setDesabafo(desabafoCompleto);
          setDetalhes(resposta);

        } else if (tipo === "desabafo") {
          const resDesabafo = await getDesabafoById(id);
          setDetalhes(resDesabafo.data);
        }

      } catch (err) {
        console.error("Erro ao carregar detalhes:", err);
        setDetalhes(null);
        setDesabafo(null);
      } finally {
        setLoading(false);
      }
    };

    if (id && tipo) fetchDetalhes();
  }, [tipo, id]);

  // Função para renderizar avatar com fallback
  const renderAvatar = (fotoUrl, isAnonimo = false, tamanho = 40) => {
    if (isAnonimo || !fotoUrl) {
      return (
        <div className="md-avatar-placeholder">
          <UserX size={tamanho * 0.5} />
        </div>
      );
    }
    
    return (
      <img
        src={fotoUrl}
        alt="avatar"
        className="md-comentario-avatar"
        onError={(e) => {
          // Fallback se a imagem não carregar
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'flex';
        }}
      />
    );
  };

  const renderForum = () => {
    if (!detalhes) return <p className="md-mensagem-vazia">Nenhum detalhe encontrado.</p>;

    if (tipo === "resposta") {
      return (
        <>
          {/* Desabafo original */}
          {desabafo && (
            <div className="md-comentario">
              <div className="md-avatar-container">
                {renderAvatar(
                  desabafo.FotoAutorDesabafo, 
                  desabafo.DesabafoAnonimo === 1 || desabafo.DesabafoAnonimo === true
                )}
                <div className="md-avatar-placeholder" style={{display: 'none'}}>
                  <UserX size={20} />
                </div>
              </div>
              <div className="md-comentario-conteudo">
                <p className="md-comentario-autor">
                  <strong>{desabafo.AutorDesabafoApelido || "Anônimo"}</strong>
                </p>
                <p className="md-comentario-texto">{desabafo.Texto}</p>
                {desabafo.DesabafoAnonimo && (
                  <span className="md-badge-anonimo">Anônimo</span>
                )}
              </div>
            </div>
          )}

          {/* Resposta do usuário */}
          <div className="md-comentario md-comentario-resposta">
            <div className="md-avatar-container">
              {renderAvatar(detalhes.FotoUsuario)}
              <div className="md-avatar-placeholder" style={{display: 'none'}}>
                <User size={20} />
              </div>
            </div>
            <div className="md-comentario-conteudo">
              <p className="md-comentario-autor">
                <strong>{detalhes.Apelido || "Usuário"}</strong>
              </p>
              <p className="md-comentario-texto">{detalhes.Text || detalhes.texto}</p>
            </div>
          </div>
        </>
      );
    }

    // Caso seja apenas um desabafo
    return (
      <div className="md-comentario">
        <div className="md-avatar-container">
          {renderAvatar(
            detalhes.Foto, 
            detalhes.Anonimo === 1 || detalhes.Anonimo === true
          )}
          <div className="md-avatar-placeholder" style={{display: 'none'}}>
            {detalhes.Anonimo ? <UserX size={20} /> : <User size={20} />}
          </div>
        </div>
        <div className="md-comentario-conteudo">
          <p className="md-comentario-autor">
            <strong>{detalhes.Apelido || (detalhes.Anonimo ? "Anônimo" : "Usuário")}</strong>
          </p>
          <p className="md-comentario-texto">{detalhes.Texto}</p>
          {detalhes.Anonimo && (
            <span className="md-badge-anonimo">Anônimo</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="md-modal-overlay" onClick={fecharModal}>
      <div className="md-modal" onClick={(e) => e.stopPropagation()}>
        <div className="md-modal-header">
          <h2 className="md-modal-titulo">Detalhes do {tipo}</h2>
        </div>
        
        <div className="md-modal-conteudo">
          {loading ? (
            <div className="md-carregando">
              <div className="md-carregando-spinner"></div>
              <p>Carregando conteúdo...</p>
            </div>
          ) : (
            <div className="md-detalhes-container">
              {renderForum()}
            </div>
          )}
        </div>

        <div className="md-modal-rodape">
          <button className="md-botao-fechar" onClick={fecharModal}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDetalhes;