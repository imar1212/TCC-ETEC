import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getConteudos } from "../../../../../services/api";
import "./Conteudos.css";

const categorias = [
  { key: "educacao", nome: "Educação", cor: "#4f46e5", degrade: "#ec4899", desc: "Aprendizado e desenvolvimento educacional." }, // roxo → rosa
  { key: "saude", nome: "Saúde", cor: "#10b981", degrade: "#3b82f6", desc: "Informações e dicas sobre saúde e bem-estar." }, // verde → azul
  { key: "noticias", nome: "Notícias", cor: "#3b82f6", degrade: "#06b6d4", desc: "Atualizações e novidades sobre o mundo." }, // azul → ciano
  { key: "depoimento", nome: "Depoimentos", cor: "#ec4899", degrade: "#8b5cf6", desc: "Relatos e experiências inspiradoras." }, // rosa → roxo
  { key: "suporte", nome: "Suporte", cor: "#f59e0b", degrade: "#ef4444", desc: "Ajuda e tutoriais para usuários." }, // laranja → vermelho
  { key: "cultura", nome: "Cultura", cor: "#8b5cf6", degrade: "#ec4899", desc: "Eventos e curiosidades culturais." }, // lilás → rosa
];

const Conteudos = () => {
  const [conteudos, setConteudos] = useState([]);
  const [filtro, setFiltro] = useState("todas");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🔒 VERIFICAÇÃO DE LOGIN
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const user = JSON.parse(sessionStorage.getItem('user'));

    if (!token || !user) {
      navigate('/');
      return;
    }

    if (user.tipo !== 'usuario') {
      alert('Você não tem permissão para acessar esta página.');
      navigate('/inicio_admin');
      return;
    }
  }, [navigate]);

  // 🔁 BUSCA DE CONTEÚDOS
  useEffect(() => {
    const fetchConteudos = async () => {
      try {
        setLoading(true);
        const response = await getConteudos();
        const data = response.data.data || [];
        const ativos = data.filter(c => c.Status?.toLowerCase() === "ativo");
        setConteudos(ativos);
      } catch (err) {
        console.error("Erro ao buscar conteúdos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchConteudos();
  }, []);

  // 🔍 FILTRAGEM
  const filtrados =
    filtro === "todas"
      ? conteudos
      : conteudos.filter(c => c.Tipo?.toLowerCase() === filtro);

  // 🌈 função helper para pegar degradê de cada categoria
  const getGradient = (catKey) => {
    if (catKey === "todas") {
      return "linear-gradient(135deg, #6b7280, #9ca3af)";
    }
    const cat = categorias.find(c => c.key === catKey);
    return `linear-gradient(135deg, ${cat.cor}, ${cat.degrade})`;
  };

  return (
    <div className="container">
      <div className="pp-container">
        <header className="pp-header fade-in-top">
          <h1>Conteúdos Informativos</h1>
          <p>Explore conteúdos organizados por categoria.</p>
        </header>

        {/* 🔘 FILTROS */}
        <div className="pp-filtros fade-in">

          {/* Botão TODAS */}
          <button
            className={`pp-btn ${filtro === "todas" ? "ativo" : ""}`}
            onClick={() => setFiltro("todas")}
            style={{
              background: filtro === "todas" ? getGradient("todas") : "white",
              color: filtro === "todas" ? "#fff" : "#374151",
              borderColor: "#9ca3af"
            }}
          >
            Todas
          </button>

          {categorias.map(cat => (
            <button
              key={cat.key}
              className={`pp-btn ${filtro === cat.key ? "ativo" : ""}`}
              onClick={() => setFiltro(cat.key)}
              style={{
                background: filtro === cat.key ? getGradient(cat.key) : "white",
                borderColor: cat.cor,
                color: filtro === cat.key ? "#fff" : "#374151",
              }}
            >
              {cat.nome}
            </button>
          ))}
        </div>

        {/* 🌀 LOADING */}
        {loading ? (
          <div className="pp-loading fade-in">
            <div className="pp-spinner"></div>
            <p>Carregando publicações...</p>
          </div>
        ) : (
          <div className="pp-grid">
            {categorias
              .filter(cat => filtro === "todas" || cat.key === filtro)
              .map(cat => {
                const items = filtrados.filter(c => c.Tipo?.toLowerCase() === cat.key);

                return (
                  <section key={cat.key} className="pp-section fade-in">
                    <div
                      className="pp-titulo"
                      style={{ borderLeft: `6px solid ${cat.cor}` }}
                    >
                      <h2 style={{ color: cat.cor }}>{cat.nome}</h2>
                      <p>{cat.desc}</p>
                    </div>

                    <div className="pp-cards">
                      {items.length > 0 ? (
                        items.map((c, i) => (
                          <div
                            key={c.Id_conteudo}
                            className="pp-card fade-up"
                            style={{
                              "--hover-cor": cat.cor,
                            }}
                            onClick={() => navigate(`/conteudo/${c.Id_conteudo}`)}
                          >
                            {c.Imagem && (
                              <div className="pp-img-wrapper">
                                <img
                                  src={c.Imagem}
                                  alt={c.Titulo}
                                  className="pp-img"
                                />
                              </div>
                            )}

                            <div className="pp-card-body">
                              <h3>{c.Titulo}</h3>
                              <p className="pp-card-resumo">{c.Resumo}</p>
                              <div className="pp-meta">
                                <span className="pp-date">
                                  {c.DataCriacao
                                    ? new Date(c.DataCriacao.replace(" ", "T")).toLocaleString("pt-BR", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })
                                    : "Data não informada"}
                                </span>

                                {c.Apelido && (
                                  <span className="pp-author">• {c.Apelido}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="pp-empty">Nenhum conteúdo em {cat.nome}.</p>
                      )}
                    </div>
                  </section>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Conteudos;
