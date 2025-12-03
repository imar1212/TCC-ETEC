import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import '../Posts/PostsComunidade.css';
import "./BotaoDenuncia.css";
import { createDenuncia } from "../../../../../services/api";
import { Flag } from "lucide-react";

const motivosPredefinidos = {
  perfil: ["Nametag imprópria", "Apelido ofensivo", "Foto imprópria", "Outro"],
  comentario: ["Comportamento tóxico", "Ofensa a outro usuário", "Spam ou propaganda", "Outro"],
  desabafo: ["Conteúdo ofensivo", "Spam ou propaganda", "Conteúdo sensível", "Outro"],
};

const BotaoDenuncia = ({ alvoId, tipo, userId, denunciadoPor, onSuccess, className = "" }) => {
  const [aberto, setAberto] = useState(false);
  const [motivo, setMotivo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [enviando, setEnviando] = useState(false);
  
  useEffect(() => {
    if (tipo && motivosPredefinidos[tipo]) {
      setMotivo(motivosPredefinidos[tipo][0]);
    }
  }, [tipo]);

  const abrirModal = () => setAberto(true);
  const fecharModal = () => {
    setAberto(false);
    setMotivo(motivosPredefinidos[tipo] ? motivosPredefinidos[tipo][0] : "");
    setDescricao("");
    setErro("");
    setSucesso("");
    setEnviando(false);
  };

  const enviarDenuncia = async () => {
    if (!motivo.trim()) return setErro("O motivo da denúncia é obrigatório.");
    if (!denunciadoPor) return setErro("Não foi possível identificar o usuário denunciado.");

    setEnviando(true);
    setErro("");

    console.log(denunciadoPor, userId);
    try {
      await createDenuncia({
        motivo,
        descricao,
        alvo: tipo,
        userId: userId,      
        denunciadoPor: denunciadoPor,       
        desabafoId: tipo === "desabafo" ? alvoId : null,
        respostaId: tipo === "comentario" ? alvoId : null,
        status: "pendente",
      })
      console.log(motivo, descricao, tipo, alvoId, userId, denunciadoPor);

      setSucesso("Denúncia enviada com sucesso!");
      
      if (onSuccess) onSuccess();
      setTimeout(fecharModal, 2000);
    } catch (err) {
      console.error(err);
      setErro("Erro ao enviar denúncia. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  };


  return (
    <>
      <button
        onClick={abrirModal}
        className={`botao-denuncia ${className}`}
        title={`Denunciar ${tipo}`}
      >
        <Flag size={14} />
        Denunciar
      </button>

      {aberto && createPortal(
        <div className="bd-modal-overlay" onClick={fecharModal}>
          <div className="bd-modal-conteudo" onClick={(e) => e.stopPropagation()}>
            <div className="bd-modal-header">
              <h3>Denunciar {tipo}</h3>
              <button
                className="bd-fechar-modal"
                onClick={fecharModal}
                disabled={enviando}
              >
                ×
              </button>
            </div>

            <div className="bd-form-content">
              <label htmlFor="motivo-denuncia">Motivo da denúncia</label>
              <select
                id="motivo-denuncia"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                disabled={enviando}
              >
                {tipo && motivosPredefinidos[tipo]?.map((m, idx) => (
                  <option key={idx} value={m}>{m}</option>
                ))}
              </select>

              <label htmlFor="descricao-denuncia">Descrição adicional (opcional)</label>
              <textarea
                id="descricao-denuncia"
                placeholder="Forneça mais detalhes sobre a denúncia..."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                disabled={enviando}
              />

              {erro && <div className="bd-mensagem bd-erro">{erro}</div>}
              {sucesso && <div className="bd-mensagem bd-sucesso">{sucesso}</div>}

              <button
                className={`bd-enviar ${enviando ? 'loading' : ''}`}
                onClick={enviarDenuncia}
                disabled={!motivo.trim() || enviando}
              >
                {enviando ? 'Enviando...' : 'Enviar Denúncia'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default BotaoDenuncia;
