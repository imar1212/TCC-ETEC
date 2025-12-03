import React, { useState, useEffect } from "react";
import { aplicarPunicao, switchDenunciaStatus, switchStatusConteudo } from "../../../../../services/api";
import "./ModalDenuncias.css";
import { FolderDown, ShieldAlert, Search, ArrowLeft, Check, Loader2, X, ArrowRight, Eye, AlertCircle } from "lucide-react";
import ModalDetalhes from "../ModalDetalhes/ModalDetalhes";

const ModalDenunciaAdmin = ({ denuncia, fecharModal, atualizarLista }) => {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [tipoPunicao, setTipoPunicao] = useState("suspensao");
  const [dataFim, setDataFim] = useState("");
  const [modalDetalhesAberto, setModalDetalhesAberto] = useState(false);
  const [acaoSelecionada, setAcaoSelecionada] = useState(null);

  useEffect(() => {
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 1);
    setDataFim(defaultDate.toISOString().slice(0, 16));
  }, []);

  // Atualiza dataFim quando o tipo de punição muda
  useEffect(() => {
    if (tipoPunicao === "banimento") {
      // Para banimento, não definir data de fim (permanente)
      setDataFim("");
    } else {
      // Para suspensão, definir data padrão
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 1);
      setDataFim(defaultDate.toISOString().slice(0, 16));
    }
  }, [tipoPunicao]);

  if (!denuncia) return null;

  const steps = [
    { title: "Detalhes da Denúncia", subtitle: "Revise as informações" },
    { title: "Escolher Ação", subtitle: "Selecione como proceder" },
    { title: "Confirmar Ação", subtitle: "Revise e confirme" }
  ];

  const getIdDetalhes = () => {
    switch (denuncia.Alvo?.toLowerCase()) {
      case "desabafo":
        return denuncia.Fk_desabafo;
      case "resposta":
        return denuncia.Fk_resposta;
      case "perfil":
        return denuncia.UserId;
      default:
        return null;
    }
  };

  const handleSelecionarAcao = (acao) => {
    setAcaoSelecionada(acao);
  };

  const avancarParaProximoPasso = () => {
    if (currentStep < steps.length - 1) {
      // Só valida se pode avançar para o passo 3
      if (currentStep === 1 && !acaoSelecionada) {
        return; // Não avança se estiver no passo 2 e não selecionou ação
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const voltarParaPassoAnterior = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleArquivarDenuncia = async () => {
    try {
      setLoading(true);
      await switchDenunciaStatus(denuncia.Id_denuncia, "arquivada");
      alert("Denúncia arquivada com sucesso!");
      atualizarLista();
      fecharModal();
    } catch (err) {
      console.error(err);
      alert("Erro ao arquivar a denúncia.");
    } finally {
      setLoading(false);
    }
  };

  const handleAplicarPunicao = async () => {
    // Para suspensão, verificar se há data de fim
    if (tipoPunicao === "suspensao" && !dataFim) {
      alert("Por favor, selecione a data de término da suspensão.");
      return;
    }

    try {
      setLoading(true);
      const admin = JSON.parse(sessionStorage.getItem("user"));
      if (!admin?.id) {
        alert("Administrador não identificado.");
        return;
      }

      if (!denuncia.UserId) {
        alert("Usuário denunciado não identificado.");
        return;
      }

      // Para banimento, Data_fim será null (permanente)
      const dadosPunicao = {
        Fk_usuario: denuncia.UserId,
        Fk_denuncia: denuncia.Id_denuncia,
        Tipo: tipoPunicao,
        Motivo: denuncia.Motivo || "Punição aplicada pelo administrador.",
        Data_Inicio: new Date().toISOString(),
        Data_fim: tipoPunicao === "banimento" ? null : new Date(dataFim).toISOString(),
        Aplicado_por: admin.id,
        Status: "ativa",
      };

      await aplicarPunicao(dadosPunicao);

      if (denuncia.Alvo) {
        const alvo = denuncia.Alvo.toLowerCase();
        const id = getIdDetalhes();
        if (alvo && id) {
          const statusMap = {
            "desabafo": "reprovado",
            "resposta": "inativo",
            "perfil": "inativo"
          };
          if (statusMap[alvo]) {
            await switchStatusConteudo(alvo, id, statusMap[alvo]);
          }
        }
      }

      await switchDenunciaStatus(denuncia.Id_denuncia, "resolvida");

      alert("Punição aplicada e conteúdo desativado com sucesso!");
      atualizarLista();
      fecharModal();
    } catch (err) {
      console.error("Erro ao aplicar punição:", err);
      alert("Erro ao aplicar punição. Veja o console para detalhes.");
    } finally {
      setLoading(false);
    }
  };

  const executarAcao = async () => {
    if (acaoSelecionada === "punir") {
      await handleAplicarPunicao();
    } else if (acaoSelecionada === "arquivar") {
      await handleArquivarDenuncia();
    }
  };

  // Verifica se pode avançar para o próximo passo
  const podeAvancar = () => {
    // Só bloqueia avanço para o passo 3 se não tiver ação selecionada
    if (currentStep === 1 && !acaoSelecionada) {
      return false;
    }
    return true;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="wizard-step">
            <div className="denuncia-info-grid">
              <div className="info-item">
                <label>ID da Denúncia</label>
                <span className="info-value">#{denuncia.Id_denuncia}</span>
              </div>
              <div className="info-item">
                <label>Quem denunciou</label>
                <span className="info-value">{denuncia.Apelido_Denunciante || denuncia.Fk_usuario || "Desconhecido"}</span>
              </div>
              <div className="info-item">
                <label>Usuário denunciado</label>
                <span className="info-value">{denuncia.Apelido_Denunciado || denuncia.UserId || "Desconhecido"}</span>
              </div>
              <div className="info-item">
                <label>Motivo</label>
                <span className="info-value motivo-text">{denuncia.Motivo}</span>
              </div>
              <div className="info-item">
                <label>Alvo</label>
                <span className="info-value tag">{denuncia.Alvo}</span>
              </div>
              <div className="info-item">
                <label>Status</label>
                <span className={`info-value status-tag status-${denuncia.Status?.toLowerCase()}`}>
                  {denuncia.Status}
                </span>
              </div>
            </div>

            <div className="detalhes-alvo-section">
              <button 
                className="btn-detalhes"
                onClick={() => setModalDetalhesAberto(true)}
              >
                <Eye size={12} /> Ver Detalhes do Conteúdo Denunciado
              </button>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="wizard-step">
            <div className="acoes-grid">
              <div 
                className={`acao-card ${acaoSelecionada === "punir" ? "selecionada" : ""}`}
                onClick={() => handleSelecionarAcao("punir")}
              >
                <div className="acao-icon"><ShieldAlert /></div>
                <h4>Aplicar Punição</h4>
                <p>Aplicar suspensão ou banimento ao usuário e desativar conteúdo</p>
                <div className="acao-details">
                  <span className="badge warning">Ação Moderadora</span>
                </div>
                {acaoSelecionada === "punir" && (
                  <div className="selecionado-indicator">
                    <Check size={16} />
                  </div>
                )}
              </div>

              <div 
                className={`acao-card ${acaoSelecionada === "arquivar" ? "selecionada" : ""}`}
                onClick={() => handleSelecionarAcao("arquivar")}
              >
                <div className="acao-icon"><FolderDown /></div>
                <h4>Arquivar Denúncia</h4>
                <p>Arquivar a denúncia sem tomar ação punitiva</p>
                <div className="acao-details">
                  <span className="badge info">Ação Administrativa</span>
                </div>
                {acaoSelecionada === "arquivar" && (
                  <div className="selecionado-indicator">
                    <Check size={16} />
                  </div>
                )}
              </div>

              {getIdDetalhes() && (
                <div className="acao-card" onClick={() => setModalDetalhesAberto(true)}>
                  <div className="acao-icon"><Search /></div>
                  <h4>Investigar Mais</h4>
                  <p>Analisar detalhes do conteúdo denunciado antes de decidir</p>
                  <div className="acao-details">
                    <span className="badge secondary">Investigação</span>
                  </div>
                </div>
              )}
            </div>

            {acaoSelecionada === "punir" && (
              <div className="config-punicao">
                <h4>Configuração de Punição</h4>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Tipo da Punição</label>
                    <select value={tipoPunicao} onChange={(e) => setTipoPunicao(e.target.value)}>
                      <option value="suspensao">Suspensão</option>
                      <option value="banimento">Banimento</option>
                    </select>
                  </div>
                  {tipoPunicao === "suspensao" && (
                    <div className="form-group">
                      <label>Data de Término</label>
                      <input
                        type="datetime-local"
                        value={dataFim}
                        onChange={(e) => setDataFim(e.target.value)}
                      />
                    </div>
                  )}
                </div>
                {tipoPunicao === "banimento" && (
                  <div className="banimento-alert">
                    <AlertCircle size={16} />
                    <span>Banimento permanente - não é possível definir data de término</span>
                  </div>
                )}
              </div>
            )}

            {!acaoSelecionada && (
              <div className="acao-obrigatoria">
                <AlertCircle size={16} />
                <p>Selecione uma ação para continuar</p>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="wizard-step">
            <div className="confirmacao-content">
              <div className="confirmacao-icon">
                {acaoSelecionada === "punir" ? <ShieldAlert size={48} /> : <FolderDown size={48} />}
              </div>
              
              <h3>Confirmar {acaoSelecionada === "punir" ? "Aplicação de Punição" : "Arquivamento"}</h3>
              
              <div className="confirmacao-details">
                {acaoSelecionada === "punir" ? (
                  <>
                    <div className="confirmacao-item">
                      <strong>Tipo:</strong> 
                      <span>{tipoPunicao === "suspensao" ? "Suspensão Temporária" : "Banimento Permanente"}</span>
                    </div>
                    {tipoPunicao === "suspensao" && (
                      <div className="confirmacao-item">
                        <strong>Data de Término:</strong> 
                        <span>{new Date(dataFim).toLocaleString('pt-BR')}</span>
                      </div>
                    )}
                    {tipoPunicao === "banimento" && (
                      <div className="confirmacao-item">
                        <strong>Duração:</strong> 
                        <span>Permanente</span>
                      </div>
                    )}
                    <div className="confirmacao-item">
                      <strong>Ações:</strong> 
                      <span>
                        <ul>
                          <li>Punição aplicada ao usuário {denuncia.Apelido_Denunciado || denuncia.UserId}</li>
                          <li>Conteúdo será desativado</li>
                          <li>Status da denúncia alterado para "Resolvida"</li>
                        </ul>
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="confirmacao-item">
                      <strong>Ação:</strong> 
                      <span>Arquivamento da Denúncia</span>
                    </div>
                    <div className="confirmacao-item">
                      <strong>Efeito:</strong> 
                      <span>
                        <ul>
                          <li>Denúncia será arquivada sem ações punitivas</li>
                          <li>Status da denúncia alterado para "Arquivada"</li>
                          <li>Conteúdo permanece ativo</li>
                        </ul>
                      </span>
                    </div>
                  </>
                )}
              </div>

              <div className="confirmacao-aviso">
                <AlertCircle size={16} />
                <p>Esta ação não pode ser desfeita automaticamente</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getTextoBotaoProximo = () => {
    switch (currentStep) {
      case 0:
        return "Escolher Ação";
      case 1:
        return "Revisar e Confirmar";
      case 2:
        return "Executar Ação";
      default:
        return "Continuar";
    }
  };

  return (
    <div className="modal-overlay" onClick={fecharModal}>
      <div className="modal-denuncia-wizard" onClick={(e) => e.stopPropagation()}>
        <div className="wizard-header">
          <div className="wizard-steps">
            {steps.map((step, index) => (
              <div 
                key={index}
                className={`step ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
                onClick={() => {
                  // Permite clicar em qualquer step, mas só avança se atender às condições
                  if (index === 1 && currentStep === 0) {
                    setCurrentStep(1); // Pode ir do passo 1 para o 2 livremente
                  } else if (index === 2 && currentStep === 1 && acaoSelecionada) {
                    setCurrentStep(2); // Só vai para o passo 3 se tiver ação selecionada
                  } else if (index < currentStep) {
                    setCurrentStep(index); // Pode voltar para steps anteriores
                  }
                }}
              >
                <div className="step-number">
                  {index < currentStep ? <Check size={16} /> : index + 1}
                </div>
                <div className="step-info">
                  <div className="step-title">{step.title}</div>
                  <div className="step-subtitle">{step.subtitle}</div>
                </div>
              </div>
            ))}
          </div>
          
          <button className="btn-fechar" onClick={fecharModal}>
            <X size={20} />
          </button>
        </div>

        <div className="wizard-content">
          {renderStepContent()}
        </div>

        <div className="wizard-navigation">
          {currentStep > 0 && (
            <button 
              className="btn-anterior"
              onClick={voltarParaPassoAnterior}
              disabled={loading}
            >
              <ArrowLeft size={12} /> Anterior
            </button>
          )}
          
          <div className="navigation-spacer"></div>
          
          <button 
            className="btn-proximo"
            onClick={currentStep === 2 ? executarAcao : avancarParaProximoPasso}
            disabled={!podeAvancar() || loading}
          >
            {currentStep === 2 ? (
              loading ? (
                <>
                  <Loader2 className="animate-spin" size={12} /> Processando...
                </>
              ) : (
                <>
                  <Check size={12} /> {getTextoBotaoProximo()}
                </>
              )
            ) : (
              <>
                {getTextoBotaoProximo()} <ArrowRight size={12} />
              </>
            )}
          </button>
        </div>

        {modalDetalhesAberto && getIdDetalhes() && (
          <ModalDetalhes
            tipo={denuncia.Alvo?.toLowerCase()}
            id={getIdDetalhes()}
            fecharModal={() => setModalDetalhesAberto(false)}
          />
        )}
      </div>
    </div>
  );
};

export default ModalDenunciaAdmin;