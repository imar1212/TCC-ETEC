import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  Edit,
  Trash2,
  Clock,
  User,
  Send,
  Plus,
  EyeOff
} from "lucide-react";
import {
  getDesabafos,
  getLikesCount,
  getComentariosAtivos,
  createInteracao,
  checkUserLike,
  toggleLike,
  createDesabafo,
  deleteInteracao,
  deleteDesabafo,
} from "../../../../../services/api";
import BotaoDenuncia from "../Denuncia/BotaoDenuncia";
import EditarComentario from "../Editar/EditarComentario";
import EditarPost from "../Editar/EditarPost";
import "./PostsComunidade.css";

const PostsComunidade = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [mostrarDesabafos, setMostrarDesabafos] = useState(false);
  const [novoTexto, setNovoTexto] = useState("");
  const [anonimo, setAnonimo] = useState(false);
  const limite = 3000;

  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const userData = JSON.parse(sessionStorage.getItem("user")) || {};


  useEffect(() => {
    if (!token || !userData) {
      navigate("/");
      return;
    }
    if (userData.tipo !== "usuario") {
      navigate("/inicio_admin");
    }
  }, [navigate, token, userData]);


  const carregarPosts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getDesabafos();
      const aprovados = res.data.filter((p) => p.Status === "aprovado");

      const postsFormatados = await Promise.all(
        aprovados.map(async (p) => {
          let curtidas = 0;
          let curtido = false;
          let comentarios = [];

          // CORREÇÃO: Usar o campo Anonimo do banco (0 ou 1)
          const isAnonimo = p.Anonimo === 1;

          try {
            const [likesRes, likedRes, comentariosRes] = await Promise.all([
              getLikesCount(p.Id_desabafo),
              checkUserLike(p.Id_desabafo),
              getComentariosAtivos(p.Id_desabafo)
            ]);

            curtidas = likesRes.data.totalLikes || likesRes.data.count || 0;
            curtido = likedRes.data.liked || likedRes.data.isLiked || false;

            comentarios = comentariosRes.data
              .filter(c => c.Status === "ativo")
              .map((c) => ({
                ...c,
                texto: c.Text || c.texto || c.Texto || "",
                editando: false,
              }));
          } catch (err) {
            console.error(`Erro ao carregar dados do post ${p.Id_desabafo}:`, err);
          }

          return {
            Id_desabafo: p.Id_desabafo,
            Texto: p.Texto || "",
            Data: formatarData(p.Data),
            Status: p.Status,
            Anonimo: isAnonimo,
            Usuario: isAnonimo
              ? {
                id: p.Id_usuario,
                Apelido: "Anônimo",
                nametag: "Anônimo",
                Foto: null
              }
              : {
                id: p.Id_usuario,
                Apelido: p.Apelido || "Usuário",
                nametag: p.nametag || "user",
                Foto: p.Foto,
              },
            curtidas,
            curtido,
            comentarios,
            novoComentario: "",
            editando: false,
            expandido: false,
          };
        })
      );

      postsFormatados.sort((a, b) => new Date(b.Data) - new Date(a.Data));
      setPosts(postsFormatados);
    } catch (err) {
      console.error("Erro ao carregar posts:", err);
      setErro("Erro ao carregar posts. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarPosts();
  }, [carregarPosts]);


  const formatarData = (dataString) => {
    if (!dataString) return "";

    try {
      const data = new Date(dataString);
      const agora = new Date();
      const diffMs = agora - data;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return "Agora mesmo";
      if (diffMins < 60) return `Há ${diffMins} min`;
      if (diffHours < 24) return `Há ${diffHours} h`;
      if (diffDays < 7) return `Há ${diffDays} dia${diffDays > 1 ? 's' : ''}`;

      return data.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch (error) {
      return dataString;
    }
  };


  const toggleCurtida = async (postId) => {
    const postOriginal = posts.find(p => p.Id_desabafo === postId);

    setPosts(prev => prev.map(p =>
      p.Id_desabafo === postId
        ? {
          ...p,
          curtido: !p.curtido,
          curtidas: p.curtido ? p.curtidas - 1 : p.curtidas + 1
        }
        : p
    ));

    try {
      await toggleLike(postId);
      const [likesRes, likedRes] = await Promise.all([
        getLikesCount(postId),
        checkUserLike(postId),
      ]);

      setPosts(prev => prev.map(p =>
        p.Id_desabafo === postId
          ? {
            ...p,
            curtidas: likesRes.data.totalLikes || likesRes.data.count || 0,
            curtido: likedRes.data.liked || likedRes.data.isLiked || false,
          }
          : p
      ));
    } catch (err) {
      console.error("Erro ao alternar curtida:", err);
      setPosts(prev => prev.map(p =>
        p.Id_desabafo === postId ? postOriginal : p
      ));
      setErro("Erro ao curtir/descurtir post");
    }
  };


  const deletarComentario = async (postId, interacaoId) => {
    if (!window.confirm("Tem certeza que deseja deletar este comentário?")) return;

    try {
      await deleteInteracao(interacaoId);
      setPosts(prev => prev.map(p =>
        p.Id_desabafo === postId
          ? {
            ...p,
            comentarios: p.comentarios.filter(c => c.Id_interacao !== interacaoId),
          }
          : p
      ));
      setMensagem("Comentário deletado com sucesso!");
    } catch (err) {
      console.error("Erro ao deletar comentário:", err);
      setErro("Erro ao deletar comentário. Você pode não ter permissão.");
    }
  };


  const deletarPost = async (postId) => {
    if (!window.confirm("Tem certeza que deseja deletar este post?")) return;

    try {
      await deleteDesabafo(postId);
      setPosts(prev => prev.filter(p => p.Id_desabafo !== postId));
      setMensagem("Post deletado com sucesso!");
    } catch (err) {
      console.error("Erro ao deletar post:", err);
      setErro("Erro ao deletar post. Você pode não ter permissão.");
    }
  };


  const enviarComentario = async (postId, texto) => {
    if (!texto.trim()) return;

    const postOriginal = posts.find(p => p.Id_desabafo === postId);
    const comentarioTemp = {
      Id_interacao: `temp-${Date.now()}`,
      Text: texto,
      Apelido: userData.apelido,
      Foto: userData.foto,
      Id_usuario: userData.id,
      Status: 'pendente',
      editando: false
    };

    setPosts(prev => prev.map(p =>
      p.Id_desabafo === postId
        ? {
          ...p,
          comentarios: [...p.comentarios, comentarioTemp],
          novoComentario: "",
        }
        : p
    ));

    try {
      await createInteracao(postId, { tipo: "comentario", texto });
      const comentariosRes = await getComentariosAtivos(postId);

      setPosts(prev => prev.map(p =>
        p.Id_desabafo === postId
          ? {
            ...p,
            comentarios: comentariosRes.data
              .filter(c => c.Status === "ativo")
              .map(c => ({
                ...c,
                texto: c.Text || c.texto || c.Texto || "",
                editando: false,
              })),
          }
          : p
      ));
      setMensagem("Comentário enviado! (Aguardando moderação)");
    } catch (err) {
      console.error("Erro ao enviar comentário:", err);
      setPosts(prev => prev.map(p =>
        p.Id_desabafo === postId ? postOriginal : p
      ));
      setErro("Erro ao enviar comentário");
    }
  };

  const postarDesabafo = async () => {
    if (!novoTexto.trim()) return;

    try {
      console.log("Enviando desabafo:", {
        texto: novoTexto,
        anonimo: anonimo
      });

     
      const dadosDesabafo = {
        texto: novoTexto,
        anonimo: anonimo ? 1 : 0
      };

      const res = await createDesabafo(dadosDesabafo);

      console.log("Resposta da API:", res.data);


      const novoPostId = res.data.Id_desabafo || res.data.id;

      if (!novoPostId) {
        throw new Error("ID do post não retornado pela API");
      }


      const postCompleto = await getDesabafos();
      const postCriado = postCompleto.data.find(p => p.Id_desabafo === novoPostId);

      const novoPost = {
        Id_desabafo: novoPostId,
        Texto: novoTexto,
        Data: "Agora mesmo",
        Status: "pendente",
        Anonimo: anonimo,
        Usuario: anonimo
          ? {
            id: userData.id,
            Apelido: "Anônimo",
            nametag: "Anônimo",
            Foto: null
          }
          : {
            id: userData.id,
            Apelido: userData.apelido,
            nametag: userData.nametag,
            Foto: userData.foto,
          },
        curtidas: 0,
        curtido: false,
        comentarios: [],
        novoComentario: "",
        editando: false,
        expandido: true,
      };

      setPosts(prev => [novoPost, ...prev]);
      setMensagem(anonimo ? "Desabafo anônimo enviado para moderação!" : "Desabafo enviado para moderação!");
      setNovoTexto("");
      setAnonimo(false);
      setMostrarDesabafos(false);

      setTimeout(() => {
        carregarPosts();
      }, 1000);

    } catch (err) {
      console.error("Erro detalhado ao postar desabafo:", err);

      if (err.response) {
        console.error("Resposta de erro da API:", err.response.data);
        setErro(`Erro ao postar desabafo: ${err.response.data.message || "Erro desconhecido"}`);
      } else {
        setErro("Erro ao postar desabafo. Verifique sua conexão.");
      }
    }
  };


  const toggleExpandirComentarios = (postId) => {
    setPosts(prev => prev.map(p =>
      p.Id_desabafo === postId ? { ...p, expandido: !p.expandido } : p
    ));
  };


  const navegarParaPerfil = (usuario) => {
    if (usuario.id && usuario.Apelido !== "Anônimo") {
      navigate(`/perfil/${usuario.nametag}`);
    }
  };


  useEffect(() => {
    if (mensagem || erro) {
      const timer = setTimeout(() => {
        setMensagem("");
        setErro("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [mensagem, erro]);


  if (loading) {
    return (
      <div className="comunidade-container">
        <div className="loading-posts">
          <div className="loading-spinner"></div>
          <p>Carregando posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="comunidade-container">
        <header className="comunidade-header">
          <h1 className="titulo-gradiente">
            <MessageCircle size={28} className="emoji-gradiente" />
            Comunidade
          </h1>
          <p>Compartilhe suas experiências e apoie outros usuários</p>
        </header>

        <div className="comunidade-actions">
          <button
            className="btn-primary btn-novo-post"
            onClick={() => setMostrarDesabafos(true)}
          >
            <Plus size={20} />
            Novo Desabafo
          </button>
        </div>

        {/* Mensagens de feedback */}
        {mensagem && (
          <div className="alert alert-success">
            <span>{mensagem}</span>
          </div>
        )}
        {erro && (
          <div className="alert alert-error">
            <span>{erro}</span>
          </div>
        )}

        {/* Modal novo desabafo */}
        {mostrarDesabafos && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Novo Desabafo</h2>
                <button
                  className="btn-close"
                  onClick={() => setMostrarDesabafos(false)}
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <textarea
                  className="post-textarea"
                  maxLength={limite}
                  placeholder="Compartilhe o que está sentindo..."
                  value={novoTexto}
                  onChange={(e) => setNovoTexto(e.target.value)}
                  autoFocus
                />
                <div className="checkbox-anonimo">
                  <input
                    type="checkbox"
                    id="anonimo"
                    className="input-anom"
                    checked={anonimo}
                    onChange={(e) => setAnonimo(e.target.checked)}
                  />
                  <label htmlFor="anonimo">Postar como anônimo</label>
                </div>
                <div className="post-actions">
                  <span className="char-count">{novoTexto.length}/{limite}</span>
                  <button
                    className="btn-primary"
                    onClick={postarDesabafo}
                    disabled={!novoTexto.trim()}
                  >
                    <Send size={16} />
                    Publicar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

   

        <div className="posts-grid">
          {posts.length === 0 ? (
            <div className="empty-state">
              <MessageCircle size={48} />
              <h3>Nenhum post ainda</h3>
              <p>Seja o primeiro a compartilhar uma experiência!</p>
              <button
                className="btn-primary"
                onClick={() => setMostrarDesabafos(true)}
              >
                Criar Primeiro Post
              </button>
            </div>
          ) : (
            posts.map((post) => (
              <article key={post.Id_desabafo} className='post-card'>
                {/* Header do post */}
                <header className="post-header">
                  <div
                    className={`user-info ${post.Anonimo ? 'user-info-anonimo' : 'user-info-normal'}`}
                    onClick={() => !post.Anonimo && navegarParaPerfil(post.Usuario)}
                    style={{
                      cursor: post.Anonimo ? 'default' : 'pointer'
                    }}
                  >
                    <div className="avatar-container">
                      {post.Anonimo ? (
                        <div className="avatar-placeholder anonimo">
                          <EyeOff size={16} />
                        </div>
                      ) : post.Usuario.Foto ? (
                        <img
                          src={post.Usuario.Foto}
                          alt={`Avatar de ${post.Usuario.Apelido}`}
                          className="user-avatar"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : (
                        <div className="avatar-placeholder">
                          <User size={16} />
                        </div>
                      )}
                    </div>
                    <div className="user-details">
                      <strong className="username">
                        {post.Anonimo ? "Anônimo" : (post.Usuario.Apelido || "Usuário")}
                        {post.Anonimo && <span className="anonimo-badge">Anônimo</span>}
                      </strong>
                      <span className="post-time">
                        <Clock size={12} />
                        {post.Data}
                      </span>
                    </div>
                  </div>

                  <div className="post-actions-header">
                    {!post.Anonimo && userData.id === post.Usuario.id ? (
                      <div className="owner-actions">
                        <button
                          className="btn-icon"
                          onClick={() =>
                            setPosts(prev =>
                              prev.map(p =>
                                p.Id_desabafo === post.Id_desabafo
                                  ? { ...p, editando: true }
                                  : p
                              )
                            )
                          }
                          title="Editar post"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="btn-icon"
                          onClick={() => deletarPost(post.Id_desabafo)}
                          title="Deletar post"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ) : (
                      <BotaoDenuncia
                        alvoId={post.Id_desabafo}
                        tipo="desabafo"
                        userId={post.Usuario.id}
                        denunciadoPor={userData.id}
                        onSuccess={() => setMensagem("Denúncia enviada com sucesso!")}
                      />
                    )}
                  </div>
                </header>


                <div className="post-content">
                  {post.editando ? (
                    <EditarPost
                      post={post}
                      onCancel={() => setPosts(prev =>
                        prev.map(p => p.Id_desabafo === post.Id_desabafo
                          ? { ...p, editando: false }
                          : p
                        )
                      )}
                      onSuccess={(id, novoTexto) => setPosts(prev =>
                        prev.map(p => p.Id_desabafo === id
                          ? { ...p, Texto: novoTexto, editando: false }
                          : p
                        )
                      )}
                    />
                  ) : (
                    <div className="post-text">
                      {post.Texto}
                    </div>
                  )}
                </div>
                <footer className="post-footer">
                  <div className="post-stats">
                    <button
                      className={`btn-like ${post.curtido ? 'liked' : ''}`}
                      onClick={() => toggleCurtida(post.Id_desabafo)}
                    >
                      <Heart size={18} fill={post.curtido ? 'currentColor' : 'none'} />
                      <span>{post.curtidas}</span>
                    </button>
                    <button
                      className="btn-comment-toggle"
                      onClick={() => toggleExpandirComentarios(post.Id_desabafo)}
                    >
                      <MessageCircle size={18} />
                      <span>{post.comentarios.length}</span>
                    </button>
                  </div>
                </footer>

                {/* Seção de comentários */}
                {/* Seção de comentários - SEMPRE EXISTE NO DOM */}
                <div className={`comments-section ${post.expandido ? 'expandido' : 'contraido'}`}>
                  <div className="comments-list">
                    {post.comentarios.length === 0 ? (
                      <div className="no-comments">
                        <p>Nenhum comentário ainda. Seja o primeiro a comentar!</p>
                      </div>
                    ) : (
                      post.comentarios.map((comentario) => (
                        <div key={comentario.Id_interacao} className="comment">
                          <div className="comment-header">
                            <div
                              className="comment-user"
                              onClick={() => comentario.Id_usuario && navegarParaPerfil({
                                id: comentario.Id_usuario,
                                Apelido: comentario.Apelido
                              })}
                              style={{ cursor: comentario.Id_usuario ? 'pointer' : 'default' }}
                            >
                              {comentario.Foto ? (
                                <img
                                  src={comentario.Foto}
                                  alt={`Avatar de ${comentario.Apelido}`}
                                  className="comment-avatar"
                                />
                              ) : (
                                <div className="comment-avatar-placeholder">
                                  <User size={12} />
                                </div>
                              )}
                              <span className="comment-username">
                                {comentario.Apelido || "Usuário"}
                              </span>
                            </div>
                            {userData.id === comentario.Id_usuario ? (
                              <div className="comment-actions">
                                <button
                                  className="btn-icon"
                                  onClick={() => setPosts(prev =>
                                    prev.map(p => p.Id_desabafo === post.Id_desabafo
                                      ? {
                                        ...p,
                                        comentarios: p.comentarios.map(c =>
                                          c.Id_interacao === comentario.Id_interacao
                                            ? { ...c, editando: true }
                                            : c
                                        )
                                      }
                                      : p
                                    )
                                  )}
                                  title="Editar comentário"
                                >
                                  <Edit size={14} />
                                </button>
                                <button
                                  className="btn-icon"
                                  onClick={() => deletarComentario(post.Id_desabafo, comentario.Id_interacao)}
                                  title="Deletar comentário"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            ) : (
                              <BotaoDenuncia
                                alvoId={comentario.Id_interacao}
                                tipo="resposta"
                                userId={comentario.Id_usuario}
                                denunciadoPor={userData.id}
                                onSuccess={() => setMensagem("Denúncia enviada com sucesso!")}
                              />
                            )}
                          </div>

                          <div className="comment-content">
                            {comentario.editando ? (
                              <EditarComentario
                                comentario={comentario}
                                postId={post.Id_desabafo}
                                onCancel={() => setPosts(prev =>
                                  prev.map(p => p.Id_desabafo === post.Id_desabafo
                                    ? {
                                      ...p,
                                      comentarios: p.comentarios.map(c =>
                                        c.Id_interacao === comentario.Id_interacao
                                          ? { ...c, editando: false }
                                          : c
                                      )
                                    }
                                    : p
                                  )
                                )}
                                onSuccess={(comentariosAtualizados) => setPosts(prev =>
                                  prev.map(p => p.Id_desabafo === post.Id_desabafo
                                    ? { ...p, comentarios: comentariosAtualizados }
                                    : p
                                  )
                                )}
                              />
                            ) : (
                              <p>{comentario.texto}</p>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="new-comment">
                    <input
                      type="text"
                      placeholder="Escreva um comentário..."
                      value={post.novoComentario}
                      onChange={(e) => setPosts(prev =>
                        prev.map(p => p.Id_desabafo === post.Id_desabafo
                          ? { ...p, novoComentario: e.target.value }
                          : p
                        )
                      )}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          enviarComentario(post.Id_desabafo, post.novoComentario);
                        }
                      }}
                    />
                    <button
                      className="btn-send-comment"
                      onClick={() => enviarComentario(post.Id_desabafo, post.novoComentario)}
                      disabled={!post.novoComentario.trim()}
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PostsComunidade;