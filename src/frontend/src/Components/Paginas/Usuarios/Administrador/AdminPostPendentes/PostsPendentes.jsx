import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDesabafos, switchStatusDesabafo } from "../../../../../services/api";
import "./PostsPendentes.css";
import { StepBack } from "lucide-react";

const PostsPendentes = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [postSelecionado, setPostSelecionado] = useState(null);
  const navigate = useNavigate();

  // Verificação de login e permissões
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

  // Busca apenas posts pendentes
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await getDesabafos();
      const pendentes = res.data.filter((post) => post.Status === "pendente");
      setPosts(pendentes);
    } catch (err) {
      console.error("Erro ao buscar posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const abrirModal = (post) => {
    setPostSelecionado(post);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setPostSelecionado(null);
    setModalAberto(false);
  };

  // CORREÇÃO: Usando a função switchStatusDesabafo como no segundo componente
  const handleToggleStatus = async (post, novoStatus) => {
    const confirm = window.confirm(
      `Tem certeza que deseja ${novoStatus === "aprovado" ? "aprovar" : "reprovar"} este post?`
    );
    if (!confirm) return;

    try {
      // CHAMADA CORRETA: Usa a função PATCH dedicada, enviando apenas ID e Status
      await switchStatusDesabafo(post.Id_desabafo, novoStatus);

      fetchPosts();
      fecharModal();
      alert(`Status alterado para ${novoStatus} com sucesso!`);
    } catch (err) {
      console.error("Erro ao atualizar status do post:", err);
      alert("Erro ao atualizar o post. Verifique o console para detalhes.");
    }
  };

  if (loading) return <div className="loading-posts">Carregando publicações pendentes...</div>;

  return (
    <div className="container">
      <div className="admin-posts-container">
        <button className="voltar-btn" onClick={() => navigate(-1)}>
          <StepBack size={10} /> Voltar 
        </button>

        <h1>Gerenciamento de Publicações Pendentes</h1>

        <table className="tabela-posts">
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuário</th>
              <th>Conteúdo</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                  Nenhuma publicação pendente
                </td>
              </tr>
            )}
            {posts.map((post) => (
              <tr key={post.Id_desabafo}>
                <td>{post.Id_desabafo}</td>
                <td>{post.Apelido || "Anônimo"}</td>
                <td>{post.Texto.slice(0, 50)}...</td>
                <td className="status-pend">{post.Status}</td>
                <td>
                  <button className="btn-visualizar" onClick={() => abrirModal(post)}>
                    Visualizar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal */}
        {modalAberto && postSelecionado && (
          <div className="modal-overlay">
            <div className="pp-modal">
              <h3>Publicação Pendente</h3>
              <p><strong>ID:</strong> {postSelecionado.Id_desabafo}</p>
              <p><strong>Usuário:</strong> {postSelecionado.Apelido || "Anônimo"}</p>
              <p><strong>Status:</strong> {postSelecionado.Status}</p>
              <p><strong>Conteúdo:</strong></p>
              <div className="conteudo-post">{postSelecionado.Texto}</div>

              <div className="modal-buttons">
                <button
                  className="btn-aprovar"
                  onClick={() => handleToggleStatus(postSelecionado, "aprovado")}
                >
                  Aprovar
                </button>
                <button
                  className="btn-reprovar"
                  onClick={() => handleToggleStatus(postSelecionado, "reprovado")}
                >
                  Reprovar
                </button>
                <button onClick={fecharModal}>Fechar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostsPendentes;