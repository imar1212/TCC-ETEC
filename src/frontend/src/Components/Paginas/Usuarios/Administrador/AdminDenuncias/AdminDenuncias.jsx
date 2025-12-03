import React, { useState, useEffect } from "react";
import { getDenuncias } from "../../../../../services/api";
import { Link, useNavigate } from "react-router-dom"; 
import ModalDenunciaAdmin from "../ModalDenuncias/ModalDenuncias";
import "./AdminDenuncias.css";
import { StepBack } from "lucide-react";

const AdminDenuncias = () => {
  const [denuncias, setDenuncias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [denunciaSelecionada, setDenunciaSelecionada] = useState(null);
  const navigate = useNavigate();

  const fetchDenuncias = async () => {
    try {
      setLoading(true);
      const res = await getDenuncias();

      // 🔹 Filtra apenas as denúncias com status "pendente"
      const pendentes = res.data.filter(
        (d) => d.Status?.toLowerCase() === "pendente"
      );

      setDenuncias(pendentes);
    } catch (err) {
      console.error("Erro ao buscar denúncias:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDenuncias();
  }, []);

  const abrirModal = (denuncia) => {
    setDenunciaSelecionada(denuncia);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setDenunciaSelecionada(null);
    setModalAberto(false);
  };

  // Formata o tipo de conteúdo denunciado
  const formatarTipoConteudo = (denuncia) => {
    if (denuncia.Fk_desabafo) return `Desabafo #${denuncia.Fk_desabafo}`;
    if (denuncia.Fk_user) return `Post #${denuncia.Fk_user}`;
    if (denuncia.Fk_resposta) return `Comentário #${denuncia.Fk_resposta}`;
    return "Conteúdo não especificado";
  };

  // Retorna classe CSS conforme o status
  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "pendente":
        return "status-pendente";
      case "resolvida":
        return "status-resolvida";
      case "em análise":
        return "status-analise";
      default:
        return "status-default";
    }
  };

  if (loading) return <div className="loading-denuncias">Carregando denúncias...</div>;

  return (
    <div className="container">
      <div className="admin-denuncias-container">
        <div className="header-buttons">
          <button className="voltar-btn" onClick={() => navigate(-1)}>
            <StepBack size={10} /> Voltar 
          </button>
          <button
            className="btn-punicao"
            onClick={() => window.location.href = "/admin/punicoes"}
          >
            Ir para Punições
          </button>
        </div>


        <h1 className="Titulo">Denúncias Pendentes</h1>

        {denuncias.length === 0 ? (
          <div className="sem-denuncias">
            <p>Nenhuma denúncia pendente encontrada.</p>
          </div>
        ) : (
          <table className="tabela-denuncias">
            <thead>
              <tr>
                <th>ID</th>
                <th>Conteúdo</th>
                <th>Motivo</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {denuncias.map((denuncia) => (
                <tr key={denuncia.Id_denuncia}>
                  <td className="id-denuncia">#{denuncia.Id_denuncia}</td>
                  <td className="conteudo-denuncia">
                    {formatarTipoConteudo(denuncia)}
                  </td>
                  <td className="motivo-denuncia">
                    {denuncia.Motivo || "Motivo não especificado"}
                  </td>
                  <td>
                    <span
                      className={`status-denuncia ${getStatusClass(
                        denuncia.Status
                      )}`}
                    >
                      {denuncia.Status || "Pendente"}
                    </span>
                  </td>
                  <td>
                    <div className="acoes-denuncia">
                      <button
                        className="btn-visualizar-denuncia"
                        onClick={() => abrirModal(denuncia)}
                      >
                        Visualizar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {modalAberto && denunciaSelecionada && (
          <ModalDenunciaAdmin
            denuncia={denunciaSelecionada}
            fecharModal={fecharModal}
            atualizarLista={fetchDenuncias}
          />
        )}
      </div>
    </div>
  );
};

export default AdminDenuncias;
