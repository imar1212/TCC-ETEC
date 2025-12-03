import React, { useState, useEffect } from "react";
import { getRegistroHumorByUser, getHumores, createRegistroHumor, updateRegistroHumor, deleteRegistroHumor } from "../../../../../services/api";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";
import "./RegistroHumor.css";

import { Funnel, Calendar, Laugh, ChartSpline, ChartNoAxesCombined, CalendarDays, MoveUp, Edit, Trash } from "lucide-react";

const escalaTextos = {
    1: "Muito Negativo",
    2: "Negativo",
    3: "Neutro",
    4: "Positivo",
    5: "Muito Positivo"
};

const RegistroHumor = () => {
    const [registros, setRegistros] = useState([]);
    const [humores, setHumores] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [mostrarModalEdicao, setMostrarModalEdicao] = useState(false);
    const [novoRegistro, setNovoRegistro] = useState({
        Fk_Humor: "",
        Observacao: "",
        Data: "",
    });
    const [registroEditando, setRegistroEditando] = useState({
        Id_Registro_Humor: "",
        Fk_Humor: "",
        Observacao: "",
        Data: "",
    });
    const [periodo, setPeriodo] = useState("todo");
    const [dropdownAberto, setDropdownAberto] = useState(false);
    const [dropdownEdicaoAberto, setDropdownEdicaoAberto] = useState(false);
    const [erroData, setErroData] = useState("");

    const user = JSON.parse(sessionStorage.getItem("user") || "{}");
    const userId = user.id;

    const carregarHumores = async () => {
        try {
            const { data } = await getHumores();
            setHumores(data);
        } catch (err) {
            console.error("Erro ao carregar humores:", err);
        }
    };
    const handleDelete = async (id) => {
        const confirmar = window.confirm("Tem certeza que deseja excluir este registro?");
        if (!confirmar) return;

        try {
            await deleteRegistroHumor(id); // Chama a API para deletar
            // Atualiza os registros removendo o excluído
            setRegistros(prev => prev.filter(r => r.id !== id));
            alert("Registro excluído com sucesso!");
        } catch (err) {
            console.error("Erro ao excluir registro:", err);
            alert("Não foi possível excluir o registro. Tente novamente.");
        }
    };


    const carregarRegistros = async () => {
        if (!humores.length) return;
        try {
            setCarregando(true);
            const { data } = await getRegistroHumorByUser(userId);

            const humoresMap = {};
            humores.forEach(h => {
                humoresMap[h.id_humor] = h;
            });

            setRegistros(
                data.map(item => {
                    const humor = humoresMap[item.Fk_Humor] || {};

                    let dataRegistro = new Date(); // Valor padrão (hoje)

                    if (item.Data && typeof item.Data === 'string') {
                        const parts = item.Data.split('-');
                        if (parts.length === 3) {
                            const year = parseInt(parts[0], 10);
                            const month = parseInt(parts[1], 10);
                            const day = parseInt(parts[2], 10);
                            if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
                                dataRegistro = new Date(year, month - 1, day);
                            }
                        }
                    }

                    return {
                        id: item.Id_Registro_Humor,
                        data: dataRegistro,
                        humor: humor.nome || "Sem humor",
                        nivel: humor.escala || 3,
                        descricao: item.Observacao || "",
                        emoji: humor.icone || "🙂",
                        idHumor: item.Fk_Humor
                    };
                })
            );
        } catch (err) {
            console.error("Erro ao carregar registros:", err);
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        carregarHumores();
    }, []);
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        const user = JSON.parse(sessionStorage.getItem("user") || "{}");

        if (!token || !user.id) {
            navigate("/");
            return;
        }
        if (user.tipo !== "usuario") {
            navigate("/inicio_admin");
        }
    }, [navigate]);


    useEffect(() => {
        if (humores.length) carregarRegistros();
    }, [humores]);

    // Funções de verificação de datas revisadas
    const verificarRegistroNaData = (data) => {
        const [year, month, day] = data.split('-').map(Number);
        if (isNaN(year) || isNaN(month) || isNaN(day)) return false;

        return registros.some(registro => {
            const regData = registro.data instanceof Date ? registro.data : new Date(registro.data);
            return regData.getFullYear() === year &&
                regData.getMonth() + 1 === month &&
                regData.getDate() === day;
        });
    };

    const verificarOutroRegistroNaData = (data, idExcluir) => {
        const [year, month, day] = data.split('-').map(Number);
        if (isNaN(year) || isNaN(month) || isNaN(day)) return false;

        return registros.some(registro => {
            if (registro.id === idExcluir) return false;
            const regData = registro.data instanceof Date ? registro.data : new Date(registro.data);
            return regData.getFullYear() === year &&
                regData.getMonth() + 1 === month &&
                regData.getDate() === day;
        });
    };

    const handleSalvar = async (e) => {
        e.preventDefault();
        setErroData("");

        if (!novoRegistro.Fk_Humor || !novoRegistro.Data) {
            alert("Humor e data são obrigatórios!");
            return;
        }

        const dataRegistro = new Date(novoRegistro.Data);
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        if (dataRegistro > hoje) {
            alert("Não é possível registrar humores para datas futuras.");
            return;
        }

        if (verificarRegistroNaData(novoRegistro.Data)) {
            setErroData("Já existe um registro de humor para esta data. Use a opção de editar para modificar.");
            return;
        }

        try {
            await createRegistroHumor(novoRegistro);
            setMostrarModal(false);
            setNovoRegistro({ Fk_Humor: "", Observacao: "", Data: "" });
            setErroData("");
            carregarRegistros();
        } catch (err) {
            console.error("Erro ao salvar registro:", err);
            alert("Erro ao salvar registro. Verifique os campos e tente novamente.");
        }
    };

    const handleEditar = async (e) => {
        e.preventDefault();
        setErroData("");

        if (!registroEditando.Fk_Humor || !registroEditando.Data) {
            alert("Humor e data são obrigatórios!");
            return;
        }

        const dataRegistro = new Date(registroEditando.Data);
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        if (dataRegistro > hoje) {
            alert("Não é possível registrar humores para datas futuras.");
            return;
        }

        if (verificarOutroRegistroNaData(registroEditando.Data, registroEditando.Id_Registro_Humor)) {
            setErroData("Já existe outro registro de humor para esta data.");
            return;
        }

        try {
            await updateRegistroHumor(registroEditando.Id_Registro_Humor, {
                Fk_Humor: registroEditando.Fk_Humor,
                Observacao: registroEditando.Observacao,
                Data: registroEditando.Data
            });
            setMostrarModalEdicao(false);
            setRegistroEditando({ Id_Registro_Humor: "", Fk_Humor: "", Observacao: "", Data: "" });
            setErroData("");
            carregarRegistros();
        } catch (err) {
            console.error("Erro ao editar registro:", err);
            alert("Erro ao editar registro. Verifique os campos e tente novamente.");
        }
    };

    const abrirModalEdicao = (registro) => {
        const dataObj = registro.data instanceof Date ? registro.data : new Date(registro.data);
        setRegistroEditando({
            Id_Registro_Humor: registro.id,
            Fk_Humor: registro.idHumor,
            Observacao: registro.descricao,
            Data: dataObj.toISOString().split("T")[0]
        });
        setErroData("");
        setMostrarModalEdicao(true);
    };

    const handleDataChange = (data) => {
        setNovoRegistro({ ...novoRegistro, Data: data });
        setErroData("");
    };

    const handleDataEdicaoChange = (data) => {
        setRegistroEditando({ ...registroEditando, Data: data });
        setErroData("");
    };

    const filtrarPorPeriodo = () => {
        const agora = new Date();
        return registros.filter(r => {
            switch (periodo) {
                case "semana":
                    const semanaPassada = new Date();
                    semanaPassada.setDate(agora.getDate() - 7);
                    return r.data >= semanaPassada;
                case "mes":
                    const mesPassado = new Date();
                    mesPassado.setMonth(agora.getMonth() - 1);
                    return r.data >= mesPassado;
                case "ano":
                    const anoPassado = new Date();
                    anoPassado.setFullYear(agora.getFullYear() - 1);
                    return r.data >= anoPassado;
                default:
                    return true;
            }
        });
    };

    const registrosFiltrados = filtrarPorPeriodo();

    const dadosGrafico = registrosFiltrados
        .slice()
        .sort((a, b) => a.data - b.data)
        .map(r => ({
            data: r.data.toLocaleDateString(),
            nivel: r.nivel,
            humor: r.humor,
        }));
    const calcularHumorPredominante = () => {
        if (registrosFiltrados.length === 0) return "Ainda não há humor predominante";

        // Contagem de ocorrências por humor
        const contagemHumores = {};
        registrosFiltrados.forEach(r => {
            contagemHumores[r.humor] = (contagemHumores[r.humor] || 0) + 1;
        });

        // Quantidade máxima de ocorrências
        const maxCount = Math.max(...Object.values(contagemHumores));

        // Se nenhum humor se repete mais de uma vez
        if (maxCount === 1) return "Ainda não há humor predominante";

        // Todos os humores que têm a quantidade máxima
        const candidatos = Object.keys(contagemHumores)
            .filter(humor => contagemHumores[humor] === maxCount);

        // Se só houver um candidato
        if (candidatos.length === 1) return candidatos[0];

        // Desempate: escolher o humor com a data mais recente
        let humorMaisRecente = candidatos[0];
        let dataMaisRecente = new Date(0); // mínimo possível

        candidatos.forEach(humor => {
            // Pega a data mais recente desse humor
            const datasHumor = registrosFiltrados
                .filter(r => r.humor === humor)
                .map(r => r.data);

            const ultimaData = new Date(Math.max(...datasHumor.map(d => d.getTime())));

            if (ultimaData > dataMaisRecente) {
                dataMaisRecente = ultimaData;
                humorMaisRecente = humor;
            }
        });

        return humorMaisRecente;
    };




    const calcularEstatisticas = () => {
        if (registrosFiltrados.length === 0)
            return { media: 0, total: 0, melhorDia: null, humorPredominante: null };

        // Média dos níveis
        const mediaNum = registrosFiltrados.reduce((acc, r) => acc + r.nivel, 0) / registrosFiltrados.length;

        // Descrição da média
        let descMedia;
        if (mediaNum <= 1) {
            descMedia = 'Muito negativo';
        } else if (mediaNum < 3) {
            descMedia = 'Negativo';
        } else if (mediaNum === 3) {
            descMedia = 'Neutro';
        } else if (mediaNum <= 4) {
            descMedia = 'Positivo';
        } else {
            descMedia = 'Muito positivo';
        }

        // Contagem de ocorrências por humor (nome)
        const contagemHumores = {};
        registrosFiltrados.forEach(r => {
            contagemHumores[r.humor] = (contagemHumores[r.humor] || 0) + 1;
        });

        // Humor que mais se repete
        const humorMaisRepetido = Object.keys(contagemHumores)
            .reduce((a, b) => contagemHumores[a] >= contagemHumores[b] ? a : b);

        // Primeiro dia com esse humor
        const melhorRegistro = registrosFiltrados.find(r => r.humor === humorMaisRepetido);

        return {
            media: descMedia,
            total: registrosFiltrados.length,
            melhorDia: melhorRegistro ? melhorRegistro.data.toLocaleDateString() : null,
            humorPredominante: humorMaisRepetido
        };
    };




    const estatisticas = calcularEstatisticas();

    return (
        <div className="container">
            <div className="humor-registros-container">
                {/* Header */}
                <div className="humor-header">
                    <div className="humor-header-content">
                        <div className="humor-header-icon"> <Laugh /></div>
                        <h1>Meus Registros de Humor</h1>
                    </div>
                    <p>Acompanhe seu bem-estar emocional ao longo do tempo</p>
                    <button className="btn-adicionar" onClick={() => setMostrarModal(true)}>
                        + Novo Registro
                    </button>
                </div>

                {mostrarModal && (
                    <div className="modal-overlay" onClick={() => setMostrarModal(false)}>
                        <div className="modal" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Novo Registro</h2>
                                <button className="modal-close" onClick={() => setMostrarModal(false)}>×</button>
                            </div>

                            <form onSubmit={handleSalvar} className="form-registro">
                                <div className="form-group">
                                    <label>Como você está se sentindo?</label>
                                    <div className="dropdown-humor">
                                        <button
                                            type="button"
                                            className="dropdown-toggle"
                                            onClick={() => setDropdownAberto(!dropdownAberto)}
                                        >
                                            {novoRegistro.Fk_Humor ? (
                                                <div className="dropdown-div">
                                                    <span className="dropdown-emoji">
                                                        <img src={`/humores${humores.find(h => h.id_humor === novoRegistro.Fk_Humor)?.icone}`} alt="" />
                                                    </span>
                                                    <span>
                                                        {humores.find(h => h.id_humor === novoRegistro.Fk_Humor)?.nome}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span>Selecione seu humor...</span>
                                            )}

                                            <div className={`icon ${dropdownAberto ? 'rotated' : ''}`}>
                                                <MoveUp size={20} />
                                            </div>
                                        </button>

                                        {dropdownAberto && (
                                            <div className="dropdown-content">
                                                {humores.map(humor => (
                                                    <button
                                                        key={humor.id_humor}
                                                        type="button"
                                                        className="dropdown-item"
                                                        onClick={() => {
                                                            setNovoRegistro({ ...novoRegistro, Fk_Humor: humor.id_humor });
                                                            setDropdownAberto(false);
                                                        }}
                                                    >
                                                        <span className="dropdown-emoji">
                                                            <img src={`/humores${humor.icone}`} alt="" />
                                                        </span>
                                                        <span className="dropdown-nome">{humor.nome}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Data do registro</label>
                                    <input
                                        type="date"
                                        value={novoRegistro.Data}
                                        onChange={(e) => handleDataChange(e.target.value)}
                                        required
                                        className={`form-input ${erroData ? 'input-error' : ''}`}
                                    />
                                    {erroData && <div className="error-message">{erroData}</div>}
                                </div>

                                <div className="form-group">
                                    <label>Observações (opcional)</label>
                                    <textarea
                                        value={novoRegistro.Observacao}
                                        onChange={(e) => setNovoRegistro({ ...novoRegistro, Observacao: e.target.value })}
                                        placeholder="Como foi seu dia? O que influenciou seu humor?"
                                        rows={4}
                                        className="form-input form-textarea"
                                    />
                                </div>

                                <div className="modal-actions">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setMostrarModal(false);
                                            setErroData("");
                                        }}
                                        className="btn-cancelar-registro"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn-salvar-registro"
                                        disabled={!!erroData}
                                    >
                                        Salvar Registro
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Modal de Edição */}
                {mostrarModalEdicao && (
                    <div className="modal-overlay" onClick={() => setMostrarModalEdicao(false)}>
                        <div className="modal" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Editar Registro</h2>
                                <button className="modal-close" onClick={() => setMostrarModalEdicao(false)}>×</button>
                            </div>

                            <form onSubmit={handleEditar} className="form-registro">
                                {/* Seleção de Humor */}
                                <div className="form-group">
                                    <label>Como você estava se sentindo?</label>
                                    <div className="dropdown-humor">
                                        <button
                                            type="button"
                                            className="dropdown-toggle"
                                            onClick={() => setDropdownEdicaoAberto(!dropdownEdicaoAberto)}
                                        >
                                            {registroEditando.Fk_Humor ? (
                                                <div className="dropdown-div">
                                                    <span className="dropdown-emoji">
                                                        <img
                                                            src={`/humores${humores.find(h => h.id_humor === registroEditando.Fk_Humor)?.icone}`}
                                                            alt=""
                                                        />
                                                    </span>
                                                    <span>
                                                        {humores.find(h => h.id_humor === registroEditando.Fk_Humor)?.nome}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span>Selecione seu humor...</span>
                                            )}

                                            <div className={`icon ${dropdownEdicaoAberto ? 'rotated' : ''}`}>
                                                <MoveUp size={20} />
                                            </div>
                                        </button>

                                        {dropdownEdicaoAberto && (
                                            <div className="dropdown-content">
                                                {humores.map(humor => (
                                                    <button
                                                        key={humor.id_humor}
                                                        type="button"
                                                        className="dropdown-item"
                                                        onClick={() => {
                                                            setRegistroEditando({ ...registroEditando, Fk_Humor: humor.id_humor });
                                                            setDropdownEdicaoAberto(false);
                                                        }}
                                                    >
                                                        <span className="dropdown-emoji">
                                                            <img src={`/humores${humor.icone}`} alt="" />
                                                        </span>
                                                        <span className="dropdown-nome">{humor.nome}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Data */}
                                <div className="form-group">
                                    <label>Data do registro</label>
                                    <input
                                        type="date"
                                        value={registroEditando.Data}
                                        onChange={(e) => handleDataEdicaoChange(e.target.value)}
                                        required
                                        className={`form-input ${erroData ? 'input-error' : ''}`}
                                    />
                                    {erroData && <div className="error-message">{erroData}</div>}
                                </div>

                                {/* Observações */}
                                <div className="form-group">
                                    <label>Observações (opcional)</label>
                                    <textarea
                                        value={registroEditando.Observacao}
                                        onChange={(e) => setRegistroEditando({ ...registroEditando, Observacao: e.target.value })}
                                        placeholder="Como foi seu dia? O que influenciou seu humor?"
                                        rows={4}
                                        className="form-input form-textarea"
                                    />
                                </div>

                                {/* Ações */}
                                <div className="modal-actions">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setMostrarModalEdicao(false);
                                            setErroData("");
                                        }}
                                        className="btn-cancelar-registro"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn-salvar-registro"
                                        disabled={!!erroData || !registroEditando.Fk_Humor || !registroEditando.Data}
                                    >
                                        Atualizar Registro
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}


                {carregando ? (
                    <div className="carregando">
                        <div className="spinner"></div>
                        <p>Carregando seus registros...</p>
                    </div>
                ) : registrosFiltrados.length === 0 ? (
                    <div className="estado-vazio">
                        <p>Não há registros para o período selecionado.</p>
                        <p>Que tal adicionar seu primeiro registro?</p>
                    </div>
                ) : (
                    <>
                        {/* Estatísticas */}
                        <div className="humor-estatisticas">
                            <div className="estatistica-card">
                                <div className="estatistica-header">
                                    <div className="estatistica-icon"><ChartSpline /></div>
                                    <h3>Humor Médio</h3>
                                </div>
                                <p className="estatistica-valor">{estatisticas.media}</p>
                                <p className="estatistica-desc">nos últimos registros</p>
                            </div>

                            <div className="estatistica-card">
                                <div className="estatistica-header">
                                    <div className="estatistica-icon"><Calendar size={25} /></div>
                                    <h3>Total de Registros</h3>
                                </div>
                                <p className="estatistica-valor">{estatisticas.total}</p>
                                <p className="estatistica-desc">registros salvos</p>
                            </div>

                            <div className="estatistica-card">
                                <div className="estatistica-header">
                                    <div className="estatistica-icon"><Laugh /></div>
                                    <h3>Escala de humor</h3>
                                </div>
                                <p className="estatistica-valor">{calcularHumorPredominante()}</p>
                                <p className="estatistica-desc"> É seu humor predominante</p>
                            </div>
                        </div>

                        {/* Filtro de período */}
                        <div className="filtro-periodo">
                            <div className="filtro-container">
                                <div className="filtro-icon"><Funnel /></div>
                                <span className="filtro-label">Período:</span>
                                <select
                                    value={periodo}
                                    onChange={(e) => setPeriodo(e.target.value)}
                                    className="filtro-select"
                                >
                                    <option value="semana">Última Semana</option>
                                    <option value="mes">Último Mês</option>
                                    <option value="ano">Último Ano</option>
                                    <option value="todo">Todo Tempo</option>
                                </select>
                            </div>
                        </div>

                        {/* Gráfico */}
                        <div className="humor-grafico-section">
                            <h2>
                                <div className="grafico-icon"><ChartNoAxesCombined size={30} /></div>
                                Evolução do Humor
                            </h2>
                            <div className="grafico-container">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={dadosGrafico} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                                        <XAxis
                                            dataKey="data"
                                            stroke="#6b7280"
                                            fontSize={12}
                                        />
                                        <YAxis
                                            domain={[1, 5]}
                                            ticks={[1, 2, 3, 4, 5]}
                                            stroke="#6b7280"
                                            fontSize={12}
                                        />
                                        <Tooltip
                                            formatter={(value, name, props) => [`Nível: ${value}`, props.payload.humor]}
                                            contentStyle={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                border: 'none',
                                                borderRadius: '12px',
                                                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                                            }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="nivel"
                                            stroke="url(#colorGradient)"
                                            strokeWidth={3}
                                            dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 6 }}
                                            activeDot={{ r: 8, fill: '#7c3aed' }}
                                        />
                                        <defs>
                                            <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                                                <stop offset="0%" stopColor="#8b5cf6" />
                                                <stop offset="100%" stopColor="#3b82f6" />
                                            </linearGradient>
                                        </defs>
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Lista de Registros */}
                        <div className="humor-lista-section">
                            <h2>
                                <div className="lista-icon"> <CalendarDays size={30} /></div>
                                Histórico de Registros
                            </h2>
                            <div className="registros-lista">
                                {registrosFiltrados
                                    .sort((a, b) => b.data - a.data)
                                    .map((registro) => (
                                        <div key={registro.id} className="registro-card">
                                            <div className="registro-cabecalho">
                                                <div className="registro-info">
                                                    <div className="registro-emoji"><img src={`/humores${registro.emoji}`} alt="" /></div>
                                                    <div className="registro-texto">
                                                        <h3>{registro.humor}</h3>
                                                        <p className="registro-data">{registro.data.toLocaleDateString('pt-BR')}</p>
                                                    </div>
                                                </div>
                                                <div className="registro-acoes">
                                                    <div className="registro-nivel">
                                                        {Array.from({ length: 5 }).map((_, i) => (
                                                            <div
                                                                key={i}
                                                                className={`nivel-ponto ${i < registro.nivel ? "ativo" : ""}`}
                                                                data-nivel={registro.nivel}
                                                            />
                                                        ))}
                                                    </div>
                                                    <button
                                                        className="btn-editar"
                                                        onClick={() => abrirModalEdicao(registro)}
                                                        title="Editar registro"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        className="btn-editar"
                                                        onClick={() => handleDelete(registro.id)}
                                                        title="Excluir registro"
                                                    >
                                                        <Trash size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                            {registro.descricao && (
                                                <p className="registro-descricao">"{registro.descricao}"</p>
                                            )}
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default RegistroHumor;