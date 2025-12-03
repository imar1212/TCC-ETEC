import React, { useState } from "react";
import { updateDesabafo, getDesabafos } from "../../../../../services/api";
 import "./Editar.css";

function EditarPost({ post, onCancel, onSuccess }) {
    const [novoTexto, setNovoTexto] = useState(post.Texto || "");
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState("");

    const salvarEdicao = async () => {
        if (!novoTexto.trim()) {
            setErro("O post não pode estar vazio.");
            return;
        }

        try {
            setLoading(true);
            const dadosParaApi = {
                texto: novoTexto,
                status: post.Status 
            };
            await updateDesabafo(post.Id_desabafo, dadosParaApi);

            // --- FIM DA ALTERAÇÃO ---


            onSuccess(post.Id_desabafo, novoTexto);
            onCancel();
        } catch (err) {
            console.error("Erro ao editar post:", err);
            setErro("Erro ao editar post.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="editar-post">
            <textarea
                value={novoTexto}
                onChange={(e) => setNovoTexto(e.target.value)}
                maxLength={300} />
            {erro && <p className="erro">{erro}</p>}
            <div className="editar-post-acoes">
                <button onClick={onCancel} disabled={loading}>Cancelar</button>
                <button onClick={salvarEdicao} disabled={loading || !novoTexto.trim()}>
                    {loading ? "Salvando..." : "Salvar"}
                </button>
            </div>
        </div>
    );
}

export default EditarPost;