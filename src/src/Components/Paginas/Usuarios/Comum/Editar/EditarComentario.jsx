import React, { useState } from "react";
import { updateComentario } from "../../../../../services/api";
 import "./Editar.css";

const EditarComentario = ({ comentario, postId, onCancel, onSuccess }) => {
  const [novoTexto, setNovoTexto] = useState(comentario.Text || comentario.texto || comentario.TextoComentario || "");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const salvarEdicao = async () => {
    if (!novoTexto.trim()) {
      setErro("O comentário não pode estar vazio.");
      return;
    }

    try {
      setLoading(true);
      await updateComentario(comentario.Id_interacao, novoTexto);

      const comentarioAtualizado = {
        ...comentario,
        TextoComentario: novoTexto,
        Text: novoTexto,
        texto: novoTexto,
      };

      onSuccess(comentarioAtualizado);
      onCancel(); 
    } catch (err) {
      console.error("Erro ao editar comentário:", err);
      setErro("Erro ao editar comentário.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="editar-comentario">
      <textarea
        value={novoTexto}
        onChange={(e) => setNovoTexto(e.target.value)}
        maxLength={300}
      />
      {erro && <p className="erro">{erro}</p>}
      <div className="editar-comentario-acoes">
        <button onClick={onCancel} disabled={loading}>Cancelar</button>
        <button onClick={salvarEdicao} disabled={loading || !novoTexto.trim()}>
          {loading ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </div>
  );
};

export default EditarComentario;
