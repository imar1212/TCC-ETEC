import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { getDesabafos, switchStatusDesabafo } from "../../../../../services/api";
import "./AdminPosts.css";
import { StepBack } from "lucide-react";

const AdminPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [postSelecionado, setPostSelecionado] = useState(null);
  const navigate = useNavigate();


  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await getDesabafos();
      setPosts(Array.isArray(res.data) ? res.data : []);
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

  // CORREÇÃO: Usa a função dedicada e o status correto ("reprovado")
  const handleToggleStatus = async (post) => {
    // Usa "reprovado" que é o status correto no backend (em vez de "negado")
    const novoStatus = post.Status === "aprovado" ? "reprovado" : "aprovado";

    const confirm = window.confirm(
      `Tem certeza que deseja ${novoStatus} este post?`
    );
    if (!confirm) return;

    try {
      // CHAMADA CORRETA: Usa a função PATCH dedicada, enviando apenas ID e Status
      await switchStatusDesabafo(post.Id_desabafo, novoStatus);
      console.log(novoStatus)

      fetchPosts();
      fecharModal();
      alert(`Status alterado para ${novoStatus} com sucesso!`);
    } catch (err) {
      console.error("Erro ao atualizar status do post:", err);
      alert("Erro ao atualizar o post. Verifique o console para detalhes.");
    }
  };

  if (loading) return <div>Carregando posts...</div>;

  return (
    <div className="container">
      <div className="admin-posts-container">
        <button className="voltar-btn" onClick={() => navigate(-1)}>
          <StepBack size={10} /> Voltar
        </button>
        <h1 className="Titulo">Administração de Posts</h1>

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
            {posts.map((post) => (
              <tr key={post.Id_desabafo}>
                <td>{post.Id_desabafo}</td>
                <td>{post.Apelido || "Anônimo"}</td>
                <td>{post.Texto.slice(0, 50)}...</td>
                <td className={post.Status === "aprovado" ? "status-ativo" : "status-inativo"}>
                  {post.Status}
                </td>
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
            <div className="modal">
              <h3>Visualizar Post</h3>
              <p><strong>ID:</strong> {postSelecionado.Id_desabafo}</p>
              <p><strong>Usuário:</strong> {postSelecionado.Apelido || "Anônimo"}</p>
              <p><strong>Anônimo:</strong> {postSelecionado.Anonimo ? "Não" : "Sim"}</p>
              <p><strong>Status:</strong> {postSelecionado.Status}</p>
              <p><strong>Conteúdo:</strong></p>
              <div className="conteudo-post">{postSelecionado.Texto}</div>

              <div className="modal-buttons">
                <button onClick={() => handleToggleStatus(postSelecionado)}>
                  {postSelecionado.Status === "aprovado" ? "Reprovar" : "Aprovar"}
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

export default AdminPosts;