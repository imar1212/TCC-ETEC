import React, { useState } from "react";
import { Edit, X, MessageCircle, User, EyeOff } from "lucide-react";
import { deleteInteracao } from "../../../../../services/api";
import EditarComentario from "../Editar/EditarComentario";

const SecaoRespostas = ({ respostas, onComentarioAtualizado, onComentarioDeletado }) => {
  const [editandoId, setEditandoId] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm("Deseja realmente excluir este comentário?")) return;
    try {
      await deleteInteracao(id);
      onComentarioDeletado(id);
    } catch (err) {
      console.error("Erro ao excluir comentário:", err);
      alert("Erro ao excluir comentário.");
    }
  };

  return (
    <div className="secao-perfil">
      <h2 className="subtitulo-secao">Minhas Respostas</h2>
      {respostas.length > 0 ? (
        <div className="lista-conteudo">
          {respostas.map((r) => {
            // CORREÇÃO: Verificar anonimato igual na última componente
            const isDesabafoAnonimo = r.AnonimoDesabafo === 1 || r.AnonimoDesabafo === true;
            const autorDesabafoDisplay = isDesabafoAnonimo 
              ? "Anônimo" 
              : `@${r.AutorDesabafoNametag || "usuário"}`;

            return (
              <div key={r.Id_interacao} className="card-conteudo resposta-card">
                {/* Seção do Desabafo Original - COM VERIFICAÇÃO DE ANONIMATO */}
                <div className="desabafo-original-section">
                  <div className="desabafo-header">
                    <MessageCircle size={16} className="icon-desabafo" />
                    <span className="desabafo-label">Desabafo Original</span>
                    {isDesabafoAnonimo ? (
                      <div className="user-info-anonimo">
                        <EyeOff size={14} />
                        <span className="anonimo-label">Anônimo</span>
                      </div>
                    ) : (
                      <span className="desabafo-autor">
                        por @{r.AutorDesabafoNametag}
                      </span>
                    )}
                  </div>
                  <div className="desabafo-conteudo">
                    <p className="snippet-conteudo desabafo-texto">
                      {r.DesabafoConteudo || "Desabafo não disponível"}
                    </p>
                    {r.DataDesabafo && (
                      <p className="data-conteudo desabafo-data">
                        {new Date(r.DataDesabafo).toLocaleDateString('pt-BR')}
                      </p>
                    )}
                  </div>
                </div>

                {/* Seção da Resposta do Usuário - COM EDIÇÃO */}
                <div className="minha-resposta-section">
                  <div className="resposta-header">
                    <User size={16} className="icon-resposta" />
                    <span className="resposta-label">Minha Resposta</span>
                  </div>

                  {editandoId === r.Id_interacao ? (
                    // MODO EDIÇÃO - Mostra apenas o editor
                    <EditarComentario
                      comentario={r}
                      postId={r.Id_desabafo}
                      onCancel={() => setEditandoId(null)}
                      onSuccess={() => {
                        onComentarioAtualizado(r.Id_interacao);
                        setEditandoId(null);
                      }}
                    />
                  ) : (
                    // MODO VISUALIZAÇÃO - Mostra a resposta e os botões
                    <>
                      <div className="comentario-cabecalho-acoes">
                        <div className="comentario-texto-wrapper">
                          <p className="snippet-conteudo resposta-texto">
                            {r.TextoComentario}
                          </p>
                        </div>
                      </div>
                      <p className="data-conteudo resposta-data">
                        Respondido em {new Date(r.DataComentario).toLocaleDateString('pt-BR')} às {new Date(r.DataComentario).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </p>

                      <div className="acoes">
                        <button className='Editar'onClick={() => setEditandoId(r.Id_interacao)}>
                          <Edit size={16} /> Editar
                        </button>
                        <button className='Desfazer'onClick={() => handleDelete(r.Id_interacao)}>
                          <X size={16} /> Excluir
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="texto-sem-conteudo">
          Você ainda não respondeu a nenhum desabafo.
        </p>
      )}
    </div>
  );
};

export default SecaoRespostas;