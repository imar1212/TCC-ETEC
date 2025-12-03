import React, { useState, useEffect } from "react";
import {
  getPunicoes,
  revogarPunicao,
  atualizarPunicao,
} from "../../../../../services/api";
import { StepBack } from "lucide-react";
import ModalDetalhes from "../ModalDetalhes/ModalDetalhes";
import "./AdminPunicoes.css";

// Modal de Punição
const ModalPunicaoAdmin = ({ punicao, fecharModal, atualizarLista }) => {
  const [tipo, setTipo] = useState(punicao?.Tipo || "");
  const [motivo, setMotivo] = useState(punicao?.Motivo || "");
  const [dataFim, setDataFim] = useState("");
  const [status, setStatus] = useState(punicao?.Status || "ativa");
  const [loading, setLoading] = useState(false);

  // Inicializar dataFim baseado no tipo e dados existentes
  useEffect(() => {
    if (punicao) {
      setTipo(punicao.Tipo || "");
      setMotivo(punicao.Motivo || "");
      setStatus(punicao.Status || "ativa");
      
      // Se for banimento, não mostrar data de fim
      if (punicao.Tipo === "banimento") {
        setDataFim("");
      } else if (punicao.Data_fim) {
        // Se já tem data de fim, usar ela
        setDataFim(new Date(punicao.Data_fim).toISOString().slice(0, 16));
      } else {
        // Se não tem data, definir uma padrão (1 dia a partir de agora)
        const defaultDate = new Date();
        defaultDate.setDate(defaultDate.getDate() + 1);
        setDataFim(defaultDate.toISOString().slice(0, 16));
      }
    }
  }, [punicao]);

  // Quando o tipo muda, ajustar a dataFim
  useEffect(() => {
    if (tipo === "banimento") {
      setDataFim("");
    } else if (tipo === "suspensao" && !dataFim) {
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 1);
      setDataFim(defaultDate.toISOString().slice(0, 16));
    }
  }, [tipo]);

  const handleAtualizar = async () => {
    // Validações
    if (tipo === "suspensao" && !dataFim) {
      alert("Por favor, selecione a data de término da suspensão.");
      return;
    }

    if (!motivo.trim()) {
      alert("Por favor, informe o motivo da punição.");
      return;
    }

    try {
      setLoading(true);
      
      // Preparar dados para envio
      const dadosAtualizacao = {
        Tipo: tipo,
        Motivo: motivo,
        Status: status,
        // Para banimento, Data_fim será null (permanente)
        Data_fim: tipo === "banimento" ? null : new Date(dataFim).toISOString()
      };

      console.log("Enviando dados:", dadosAtualizacao);
      
      await atualizarPunicao(punicao.Id_punicao, dadosAtualizacao);
      alert("Punição atualizada com sucesso!");
      atualizarLista();
      fecharModal();
    } catch (err) {
      console.error("Erro ao atualizar punição:", err);
      alert("Erro ao atualizar punição. Verifique o console para detalhes.");
    } finally {
      setLoading(false);
    }
  };

  const handleRevogar = async () => {
    if (!window.confirm("Deseja realmente revogar esta punição?")) return;
    try {
      setLoading(true);
      await revogarPunicao(punicao.Id_punicao);
      alert("Punição revogada com sucesso!");
      atualizarLista();
      fecharModal();
    } catch (err) {
      console.error("Erro ao revogar punição:", err);
      alert("Erro ao revogar punição.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay-punicoes" onClick={fecharModal}>
      <div className="modal-punicoes" onClick={(e) => e.stopPropagation()}>
        <h2>Editar / Revogar Punição</h2>
        <div className="modal-form-punicoes">
          <label>
            Tipo:
            <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
              <option value="aviso">Aviso</option>
              <option value="suspensao">Suspensão</option>
              <option value="banimento">Banimento</option>
            </select>
          </label>

          <label>
            Motivo:
            <textarea
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              rows={3}
              placeholder="Descreva o motivo da punição..."
            />
          </label>

          {tipo === "suspensao" && (
            <label>
              Data de Término:
              <input
                type="datetime-local"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
              />
            </label>
          )}

          {tipo === "banimento" && (
            <div className="banimento-info">
              <span>⚠️ Banimento permanente - não é possível definir data de término</span>
            </div>
          )}

          <label>
            Status:
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="ativa">Ativa</option>
              <option value="revogada">Revogada</option>
            </select>
          </label>
        </div>

        <div className="modal-buttons-punicoes">
          <button onClick={handleAtualizar} disabled={loading}>
            {loading ? "Atualizando..." : "Atualizar"}
          </button>
          <button onClick={handleRevogar} disabled={loading}>
            {loading ? "Processando..." : "Revogar"}
          </button>
          <button onClick={fecharModal} disabled={loading}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente Principal
const AdminPunicoes = () => {
  const [punicoes, setPunicoes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalPunicaoAberto, setModalPunicaoAberto] = useState(false);
  const [punicaoSelecionada, setPunicaoSelecionada] = useState(null);

  const [modalDetalhesAberto, setModalDetalhesAberto] = useState(false);
  const [detalheTipo, setDetalheTipo] = useState(null);
  const [detalheId, setDetalheId] = useState(null);

  const fetchPunicoes = async () => {
    try {
      setLoading(true);
      const res = await getPunicoes();
      const ativas = res.data?.punicoes?.filter((p) => p.Status === "ativa") || [];
      setPunicoes(ativas);
    } catch (err) {
      console.error("Erro ao buscar punições:", err);
      setPunicoes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPunicoes();
  }, []);

  const abrirModalPunicao = (punicao) => {
    setPunicaoSelecionada(punicao);
    setModalPunicaoAberto(true);
  };

  const fecharModalPunicao = () => {
    setPunicaoSelecionada(null);
    setModalPunicaoAberto(false);
  };

  const abrirModalDetalhes = (tipo, id) => {
    setDetalheTipo(tipo);
    setDetalheId(id);
    setModalDetalhesAberto(true);
  };

  const fecharModalDetalhes = () => {
    setDetalheTipo(null);
    setDetalheId(null);
    setModalDetalhesAberto(false);
  };

  // Função para formatar a data de forma mais legível
  const formatarData = (dataString) => {
    if (!dataString) return "Permanente";
    try {
      return new Date(dataString).toLocaleString('pt-BR');
    } catch {
      return "Data inválida";
    }
  };

  return (
    <div className="container">
      <div className="admin-punicoes-wrapper">
          <button className="voltar-btn" onClick={() => window.history.back()}>
              <StepBack size={10}/> Voltar
        </button>

        <h1 className="Titulo">Administração de Punições Ativas</h1>

        {loading ? (
          <p className="loading-punicoes">Carregando punições...</p>
        ) : punicoes.length === 0 ? (
          <p className="sem-punicoes">Nenhuma punição ativa encontrada.</p>
        ) : (
          <table className="tabela-punicoes-admin">
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuário</th>
                <th>Tipo</th>
                <th>Motivo</th>
                <th>Início</th>
                <th>Fim</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {punicoes.map((p) => (
                <tr key={p.Id_punicao}>
                  <td>{p.Id_punicao}</td>
                  <td>{p.Fk_usuario}</td>
                  <td>{p.Tipo}</td>
                  <td className="motivo-cell">{p.Motivo}</td>
                  <td>{formatarData(p.Data_Inicio)}</td>
                  <td>
                    {p.Tipo === "banimento" ? "Permanente" : formatarData(p.Data_fim)}
                  </td>
                  <td>
                    <span className={`status-punicao status-punicao-${p.Status || 'default'}`}>
                      {p.Status}
                    </span>
                  </td>
                  <td>
                    <button className="btn-punicao" onClick={() => abrirModalPunicao(p)}>
                      Editar / Revogar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {modalPunicaoAberto && punicaoSelecionada && (
          <ModalPunicaoAdmin
            punicao={punicaoSelecionada}
            fecharModal={fecharModalPunicao}
            atualizarLista={fetchPunicoes}
          />
        )}

        {modalDetalhesAberto && detalheId && (
          <ModalDetalhes
            tipo={detalheTipo}
            id={detalheId}
            fecharModal={fecharModalDetalhes}
          />
        )}
      </div>
    </div>
  );
};

export default AdminPunicoes;