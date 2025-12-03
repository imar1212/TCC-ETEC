import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getConteudoById } from "../../../../../services/api";
import "./ConteudoDetalhes.css";
import { CircleUserRound, StepBack } from "lucide-react";

const ConteudoDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [conteudo, setConteudo] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔁 VERIFICAÇÃO DE LOGIN E PERMISSÕES - ADICIONADO
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

  useEffect(() => {
    const fetchConteudo = async () => {
      try {
        setLoading(true);
        const response = await getConteudoById(id);
        const data = response.data?.data || response.data;

        // Ajusta caminho da imagem se for local
        if (data?.Imagem && !data.Imagem.startsWith("http")) {
          data.Imagem = `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/${data.Imagem}`;
        }

        setConteudo(data);
      } catch (err) {
        console.error("Erro ao buscar conteúdo:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchConteudo();
  }, [id]);

  if (loading)
    return (
      <div className="pp-loading">
        <div className="pp-spinner"></div>
        <p>Carregando conteúdo...</p>
      </div>
    );

  if (!conteudo) return <p className="pp-empty">Conteúdo não encontrado.</p>;

  return (
    <div className="detalhes-container">

      <article className="detalhes-card">
        <button className="voltar-btn" onClick={() => navigate(-1)}>
          <StepBack size={10} /> Voltar
        </button>
        {conteudo.Imagem && (
          <img
            src={conteudo.Imagem}
            alt={conteudo.Titulo}
            className="detalhes-img"
          />
        )}

        <header>
          <h1>{conteudo.Titulo}</h1>
          {conteudo.Resumo && (
            <p className="detalhes-resumo">{conteudo.Resumo}</p>
          )}
        </header>

        <section
          className="detalhes-texto"
          dangerouslySetInnerHTML={{ __html: conteudo.Conteudo }}
        />

        <footer className="detalhes-meta">
          {conteudo.DataCriacao && (
            <span>
              📅 {new Date(conteudo.DataCriacao).toLocaleDateString("pt-BR")}
            </span>
          )}
          {conteudo.Apelido && <span> <CircleUserRound size={16} /> {conteudo.Apelido}</span>}
        </footer>
      </article>
    </div>
  );
};

export default ConteudoDetalhes;
