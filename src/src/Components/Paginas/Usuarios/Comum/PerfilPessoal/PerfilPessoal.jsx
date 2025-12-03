import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import PerfilHeader from "../EditarPerfil/Props/PerfilHeader";
// As seções são importadas de arquivos separados, mantendo o JSX principal limpo.
import SecaoDesabafos from "./SecaoDesabafos";
import SecaoRespostas from "./SecaoRespostas";
import SecaoCurtidas from "./SecaoCurtidas";

import {
  getUserById,
  getDesabafosByUser,
  getRespostasByUser,
  getCurtidasByUser,
} from "../../../../../services/api";

// Importa os estilos principais do Perfil Pessoal e do Editar Perfil
import "../EditarPerfil/EditarPerfil.css";
import "./PerfilPessoal.css";

// Função utilitária para garantir que a resposta da API seja um array (a sua versão original continha isso)
const safeArray = (res) => {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if (res.data) {
    if (Array.isArray(res.data)) return res.data;
    if (Array.isArray(res.data.data)) return res.data.data;
    if (Array.isArray(res.data.result)) return res.data.result;
    if (Array.isArray(res.data.items)) return res.data.items;
  }
  return [];
};

// Componente: Informações Fixas do Perfil (Com layout do Editar Perfil)
const InfoPerfilFixa = ({ usuario, onEditarClick }) => (
  <div className="info-perfil-fixa form-section">
    <h2 className="subtitulo-secao">Informações do Perfil</h2>

    <div className="foto-e-dados">
      <img
        src={usuario.foto || "/url_foto_padrao.png"}
        alt="Foto de Perfil"
        className="foto-preview"
      />
      <div className="dados-principais">
        <h1>{usuario.apelido || usuario.nametag}</h1>
        <p className="nametag">@{usuario.nametag}</p>
        <p className="email">{usuario.email}</p>
        {usuario.pronomes?.length > 0 && (
          <p className="pronomes">Pronomes: {usuario.pronomes.join(", ")}</p>
        )}
        <p className="bio">{usuario.bio || "Sem biografia."}</p>
      </div>
    </div>
    <div className="form-actions">
      <button className="btn-perfil" onClick={onEditarClick}>
        Configurar Perfil
      </button>
    </div>
  </div>
);


const MeuPerfil = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const userData = JSON.parse(sessionStorage.getItem("user") || "{}");
  const userId = userData?.id;

  const [usuario, setUsuario] = useState({});
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const [desabafosUsuario, setDesabafosUsuario] = useState([]);
  const [respostasUsuario, setRespostasUsuario] = useState([]);
  const [curtidasUsuario, setCurtidasUsuario] = useState([]);
  const [abaConteudoAtiva, setAbaConteudoAtiva] = useState("desabafos");

  // Handlers para atualizar as listas (necessários para as seções filhas)
  const handlePostAtualizado = (id, novoConteudo) =>
    setDesabafosUsuario((prev) => prev.map((p) => p.Id_desabafo === id ? { ...p, Conteudo: novoConteudo } : p));
  const handlePostDeletado = (id) =>
    setDesabafosUsuario((prev) => prev.filter((p) => p.Id_desabafo !== id));
  const handleComentarioDeletado = (id) =>
    setRespostasUsuario((prev) => prev.filter((r) => r.Id_interacao !== id));
  const handleDescurtido = (desabafoId) =>
    setCurtidasUsuario((prev) => prev.filter((c) => c.Id_desabafo !== desabafoId));


  useEffect(() => {
    const fetchUserAndContent = async () => {
      if (!token || !userId) {
        navigate("/");
        return;
      }

      try {
        const resPerfil = await getUserById(userId);

        if (resPerfil.data) {
          setUsuario({
            foto: resPerfil.data.Foto,
            nametag: resPerfil.data.nametag || "",
            apelido: resPerfil.data.Apelido || "",
            bio: resPerfil.data.bio || "",
            email: resPerfil.data.email || "",
            pronomes: Array.isArray(resPerfil.data.pronomes)
              ? resPerfil.data.pronomes.map((p) => p.toLowerCase())
              : [],
          });
        }

        const [resDesabafos, resCurtidas, resRespostas] = await Promise.all([
          getDesabafosByUser(userId).catch(e => ({ data: {} })),
          getCurtidasByUser(userId).catch(e => ({ data: {} })),
          getRespostasByUser(userId).catch(e => ({ data: {} })),
        ]);

        setDesabafosUsuario(safeArray(resDesabafos.data));
        setCurtidasUsuario(safeArray(resCurtidas.data));
        setRespostasUsuario(safeArray(resRespostas.data));
      } catch (err) {
        console.error("Erro ao carregar perfil:", err);
        setErro("Erro ao carregar perfil");
      } finally {
        setCarregando(false);
      }
    };

    fetchUserAndContent();
  }, [userId, navigate, token]);

  const handleGoToEdit = () => {
    navigate("/editar/perfil");
  };

  if (carregando) {
    return (
      <div className="container">
        <div className="editar-perfil-container">
          <div className="carregando">Carregando perfil...</div>
        </div>
      </div>
    );
  }

  if (erro || !userId) {
    return (
      <div className="container">
        <div className="editar-perfil-container">
          <div className="erro">{erro || "Usuário não autenticado"}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Classe principal reutilizada de EditarPerfil.css */}
      <div className="editar-perfil-container">
        <PerfilHeader
          titulo="Meu Perfil"
          subtitulo="Sua central de conteúdo pessoal"
        />

        {/* CONTEÚDO PRINCIPAL DO PERFIL - AGORA ABRANGENDO TUDO */}
        <div className="perfil-content">
          
          {/* Informações Fixas do Usuário */}
          <InfoPerfilFixa usuario={usuario} onEditarClick={handleGoToEdit} />

          {/* Abas de Conteúdo do Usuário */}
          <div className="abas-navegacao">
            <button
              className={`aba ${abaConteudoAtiva === "desabafos" ? "ativa" : ""}`}
              onClick={() => setAbaConteudoAtiva("desabafos")}
            >
              Desabafos ({desabafosUsuario.length})
            </button>
            <button
              className={`aba ${abaConteudoAtiva === "respostas" ? "ativa" : ""}`}
              onClick={() => setAbaConteudoAtiva("respostas")}
            >
              Respostas ({respostasUsuario.length})
            </button>
            <button
              className={`aba ${abaConteudoAtiva === "curtidas" ? "ativa" : ""}`}
              onClick={() => setAbaConteudoAtiva("curtidas")}
            >
              Curtidas ({curtidasUsuario.length})
            </button>
          </div>

          {/* Conteúdo da Aba Ativa */}
          <div className="conteudo-aba-ativa">
            {abaConteudoAtiva === "desabafos" && (
              <SecaoDesabafos
                desabafos={desabafosUsuario}
                onPostAtualizado={handlePostAtualizado}
                onPostDeletado={handlePostDeletado}
                className="form-section"
              />
            )}
            {abaConteudoAtiva === "respostas" && (
              <SecaoRespostas
                respostas={respostasUsuario}
                onComentarioAtualizado={() => console.log('Comentário atualizado.')}
                onComentarioDeletado={handleComentarioDeletado}
                className="form-section"
              />
            )}
            {abaConteudoAtiva === "curtidas" && (
              <SecaoCurtidas
                curtidas={curtidasUsuario}
                onDescurtido={handleDescurtido}
                className="form-section"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeuPerfil;