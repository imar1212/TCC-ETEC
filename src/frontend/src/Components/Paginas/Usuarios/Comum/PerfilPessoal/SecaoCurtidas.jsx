import React from "react";
import { X, MessageCircle, EyeOff, User } from "lucide-react";
import { toggleLike } from "../../../../../services/api";

const SecaoCurtidas = ({ curtidas, onDescurtido }) => {
  const handleDesfazerCurtida = async (desabafoId) => {
    if (!window.confirm("Deseja desfazer esta curtida?")) return;
    try {
      await toggleLike(desabafoId);
      onDescurtido(desabafoId);
    } catch (err) {
      console.error("Erro ao desfazer curtida:", err);
      alert("Erro ao desfazer curtida.");
    }
  };

  return (
    <div className="secao-perfil">
      <h2 className="subtitulo-secao">Desabafos Curtidos</h2>
      {curtidas.length > 0 ? (
        <div className="lista-conteudo">
          {curtidas.map((c) => {
            // CORREÇÃO: Verificar anonimato igual na última componente
            const isAnonimo = c.Anonimo === 1 || c.Anonimo === true;
            const autorDisplay = isAnonimo 
              ? "Anônimo" 
              : `@${c.AutorDesabafoNametag || "usuário"}`;

            return (
              <div key={c.Id_interacao} className="card-conteudo curtida-card">
                <div className="comentario-cabecalho-acoes">
                  <div className="comentario-texto-wrapper">
                    <div className="autor-info">
                      {isAnonimo ? (
                        <div className="user-info-anonimo">
                          <EyeOff size={14} />
                          <span className="anonimo-label">Anônimo</span>
                        </div>
                      ) : (
                        <div className="user-info-normal">
                          <User size={14} />
                          <span className="autor-nametag">@{c.AutorDesabafoNametag}</span>
                        </div>
                      )}
                    </div>
                    <p className="titulo-conteudo">
                      <MessageCircle size={16} style={{ display: 'inline', marginRight: '8px' }} />
                      {c.DesabafoSnippet}
                    </p>
                    <p className="snippet-conteudo" style={{ marginTop: '8px', fontSize: '0.9rem', color: '#64748b' }}>
                      Por: {autorDisplay}
                    </p>
                  </div>
                </div>
                
                <div className="acoes">
                  <button className="Desfazer" onClick={() => handleDesfazerCurtida(c.Id_desabafo)}>
                    <X size={16} /> Desfazer curtida
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="texto-sem-conteudo">
          Você ainda não curtiu nenhum desabafo.
        </p>
      )}
    </div>
  );
};

export default SecaoCurtidas;