import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ADICIONADO
import { getAllComentarios, switchStatusResposta } from "../../../../../services/api";
import { StepBack } from "lucide-react";
import "./AdminRepostas.css";

const AdminRepostas = () => {
  const [respostas, setRespostas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [respostaSelecionada, setRespostaSelecionada] = useState(null);
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

  const fetchRespostas = async () => {
    try {
      setLoading(true);
      const res = await getAllComentarios();
      setRespostas(res.data);
      console.log(res.data)
    } catch (err) {
      console.error("Erro ao buscar respostas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRespostas();
  }, []);

  const handleToggleStatus = async (resposta) => {
    const confirm = window.confirm(
      `Tem certeza que deseja ${resposta.Status === "ativo" ? "inativar" : "ativar"} esta resposta?`
    );
    if (!confirm) return;

    try {
      const newStatus = resposta.Status === "ativo" ? "inativo" : "ativo";
      await switchStatusResposta(resposta.Id_interacao, newStatus);
      fetchRespostas();
      fecharModal();
    } catch (err) {
      console.error("Erro ao atualizar status da resposta:", err);
    }
  };

  const abrirModal = (resposta) => {
    setRespostaSelecionada(resposta);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setRespostaSelecionada(null);
    setModalAberto(false);
  };

  if (loading) return <div>Carregando respostas...</div>;

  return (
    <div className="container">
      <div className="admin-respostas-container">

        <button className="voltar-btn" onClick={() => window.history.back()}>
          <StepBack size={10} /> Voltar
        </button>
        <h1 className="Titulo">Respostas</h1>

        <table className="tabela-respostas">
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuário</th>
              <th>Desabafo</th>
              <th>Resposta</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {respostas.map((resposta) => (
              <tr key={resposta.Id_interacao}>
                <td>{resposta.Id_interacao}</td>
                <td>{resposta.Apelido || "Anônimo"}</td>
                <td>{resposta.Fk_desabafo}</td>
                <td>{resposta.Text ? resposta.Text.slice(0, 50) + "..." : ""}</td>
                <td className={resposta.Status === "ativo" ? "status-ativo" : "status-inativo"}>
                  {resposta.Status === "ativo" ? "aprovado" : "negado"}
                </td>
                <td>
                  <button className="btn-visualizar" onClick={() => abrirModal(resposta)}>
                    Visualizar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {modalAberto && respostaSelecionada && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Detalhes da Resposta</h3>
              <p><strong>ID:</strong> {respostaSelecionada.Id_interacao}</p>
              <p><strong>Usuário:</strong> {respostaSelecionada.Apelido || "Anônimo"}</p>
              <p><strong>Desabafo:</strong> {respostaSelecionada.Fk_desabafo}</p>
              <p><strong>Status:</strong> {respostaSelecionada.Status === "ativo" ? "aprovado" : "negado"}</p>
              <p><strong>Conteúdo:</strong></p>
              <div className="conteudo-resposta">{respostaSelecionada.Text}</div>

              <div className="modal-buttons">
                <button onClick={() => handleToggleStatus(respostaSelecionada)}>
                  {respostaSelecionada.Status === "ativo" ? "Negar" : "Aprovar"}
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

export default AdminRepostas;
