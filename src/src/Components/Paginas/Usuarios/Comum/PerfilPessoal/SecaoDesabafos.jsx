import React, { useState } from "react";
import { Edit, X, EyeOff, User } from "lucide-react";
import { deleteDesabafo } from "../../../../../services/api";
import EditarPost from "../Editar/EditarPost";

const SecaoDesabafos = ({ desabafos, onPostAtualizado, onPostDeletado }) => {
  const [editandoId, setEditandoId] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm("Deseja realmente excluir este desabafo?")) return;
    try {
      await deleteDesabafo(id);
      onPostDeletado(id);
    } catch (err) {
      console.error("Erro ao excluir desabafo:", err);
      alert("Erro ao excluir desabafo.");
    }
  };

  return (
    <div className="secao-perfil">
      <h2 className="subtitulo-secao">Meus Desabafos</h2>
      {desabafos.length > 0 ? (
        <div className="lista-conteudo">
          {desabafos.map((d) => {
            // CORREÇÃO: Verificar anonimato igual na última componente
            const isAnonimo = d.Anonimo === 1 || d.Anonimo === true;
            const usuarioDisplay = isAnonimo 
              ? { Apelido: "Anônimo", nametag: "Anônimo" }
              : { Apelido: d.Apelido || "Usuário", nametag: d.nametag || "user" };

            return (
              <div key={d.Id_desabafo} className="card-conteudo desabafo-card">
                {/* Header com informações do usuário */}
                <div className={`user-info ${isAnonimo ? 'user-info-anonimo' : 'user-info-normal'}`}>
                  <div className="avatar-container">
                    {isAnonimo ? (
                      <div className="avatar-placeholder anonimo">
                        <EyeOff size={16} />
                      </div>
                    ) : (
                      <div className="avatar-placeholder">
                        <User size={16} />
                      </div>
                    )}
                  </div>
                  <div className="user-details">
                    <strong className="username">
                      {usuarioDisplay.Apelido}
                      {isAnonimo && <span className="anonimo-badge">Anônimo</span>}
                    </strong>
                  </div>
                </div>

                {editandoId === d.Id_desabafo ? (
                  <EditarPost
                    post={d}
                    onCancel={() => setEditandoId(null)}
                    onSuccess={(id, novoTexto) => {
                      onPostAtualizado(id, novoTexto);
                      setEditandoId(null);
                    }}
                  />
                ) : (
                  <>
                    <div className="post-body-content">
                      <div className="comentario-texto-wrapper">
                        <p className="snippet-conteudo">{d.Texto}</p>
                      </div>
                    </div>
                    <p className="data-conteudo">
                      {new Date(d.Data).toLocaleDateString('pt-BR')} às {new Date(d.Data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </p>

                    <div className="acoes">
                      <button className="Editar" onClick={() => setEditandoId(d.Id_desabafo)}>
                        <Edit size={16} /> Editar
                      </button>
                      <button className="Desfazer" onClick={() => handleDelete(d.Id_desabafo)}>
                        <X size={16} /> Excluir
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="texto-sem-conteudo">
          Você ainda não publicou nenhum desabafo.
        </p>
      )}
    </div>
  );
};

export default SecaoDesabafos;