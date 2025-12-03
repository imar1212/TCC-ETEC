import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getConteudoById, updateConteudo } from "../../../../../services/api";
import { StepBack } from "lucide-react";
import "../CriarConteudo/CriarConteudo.css";

const EditarConteudo = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    Titulo: "",
    Resumo: "",
    Conteudo: "",
    Status: "ativo",
    Tipo: "historia",
    Imagem: null, // Nova imagem selecionada
  });

  const [preview, setPreview] = useState(null);
  const [imagemAtual, setImagemAtual] = useState(null); // Armazena imagem atual do conteúdo
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Carregar usuário logado
  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    if (storedUser) setUsuarioLogado(storedUser);
    else {
      alert("Usuário não logado!");
      navigate("/login");
    }
  }, [navigate]);

  // Carregar conteúdo existente
  useEffect(() => {
    const fetchConteudo = async () => {
      try {
        const response = await getConteudoById(id);
        const data = response.data;

        setForm({
          Titulo: data.Titulo || "",
          Resumo: data.Resumo || "",
          Conteudo: data.Conteudo || "",
          Status: data.Status || "ativo",
          Tipo: data.Tipo || "historia",
          Imagem: null, // nova imagem opcional
        });

        setImagemAtual(data.Imagem || null); // mantém a imagem atual
        setPreview(data.Imagem || null); // preview inicial
      } catch (error) {
        console.error("Erro ao carregar conteúdo:", error);
        alert("Erro ao carregar conteúdo.");
      }
    };
    fetchConteudo();
  }, [id]);

  // Validação de campos
  const validateField = (name, value) => {
    const newErrors = { ...errors };
    switch (name) {
      case "Titulo":
        if (!value.trim()) newErrors.Titulo = "Título é obrigatório";
        else if (value.length < 5) newErrors.Titulo = "Título deve ter pelo menos 5 caracteres";
        else delete newErrors.Titulo;
        break;
      case "Resumo":
        if (!value.trim()) newErrors.Resumo = "Resumo é obrigatório";
        else if (value.length < 10) newErrors.Resumo = "Resumo deve ter pelo menos 10 caracteres";
        else delete newErrors.Resumo;
        break;
      case "Conteudo":
        if (!value.trim()) newErrors.Conteudo = "Conteúdo é obrigatório";
        else if (value.length < 20) newErrors.Conteudo = "Conteúdo deve ter pelo menos 20 caracteres";
        else delete newErrors.Conteudo;
        break;
      default:
        break;
    }
    setErrors(newErrors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    validateField(name, value);
  };

  // Input de arquivo (imagem)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, Imagem: file });

    if (file) {
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
      if (!validTypes.includes(file.type)) {
        setErrors({ ...errors, Imagem: "Formato de imagem inválido" });
        setPreview(imagemAtual);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, Imagem: "Imagem muito grande. Máximo 5MB." });
        setPreview(imagemAtual);
        return;
      }

      const newErrors = { ...errors };
      delete newErrors.Imagem;
      setErrors(newErrors);

      // Preview da nova imagem
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      // Volta para a imagem atual se usuário remove o input
      setPreview(imagemAtual);
      setForm({ ...form, Imagem: null });
    }
  };

  // Remover imagem completamente
  const handleRemoveImage = () => {
    setForm({ ...form, Imagem: null });
    setPreview(null);
    setImagemAtual(null); // indica que backend deve remover imagem
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!usuarioLogado) return;

    const newErrors = {};
    if (!form.Titulo.trim() || form.Titulo.length < 5) newErrors.Titulo = "Título inválido";
    if (!form.Resumo.trim() || form.Resumo.length < 10) newErrors.Resumo = "Resumo inválido";
    if (!form.Conteudo.trim() || form.Conteudo.length < 20) newErrors.Conteudo = "Conteúdo inválido";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("Titulo", form.Titulo);
      formData.append("Resumo", form.Resumo);
      formData.append("Conteudo", form.Conteudo);
      formData.append("Tipo", form.Tipo);
      formData.append("Status", form.Status);
      formData.append("Fk_usuario", usuarioLogado.Id_usuario);

      // Se houver nova imagem, envia ela
      if (form.Imagem) {
        formData.append("Imagem", form.Imagem);
      } else if (imagemAtual === null) {
        // Usuário removeu a imagem atual: envia flag para backend
        formData.append("RemoverImagem", true);
      }

      await updateConteudo(id, formData, { headers: { "Content-Type": "multipart/form-data" } });

      alert("Conteúdo atualizado com sucesso!");
      navigate("/admin/conteudo");
    } catch (error) {
      console.error("Erro ao atualizar conteúdo:", error);
      alert("Erro ao atualizar conteúdo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="criar-conteudo-container">
        <button className="voltar-btn" onClick={() => navigate(-1)}>
          <StepBack size={10}/> Voltar
        </button>

        <h1>Editar Conteúdo</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Título:
            <input
              type="text"
              name="Titulo"
              value={form.Titulo}
              onChange={handleChange}
              className={errors.Titulo ? "input-error" : ""}
              required
              placeholder="Digite o título do conteúdo"
            />
            {errors.Titulo && <span className="error-message">{errors.Titulo}</span>}
          </label>

          <label>
            Resumo:
            <textarea
              name="Resumo"
              value={form.Resumo}
              onChange={handleChange}
              className={errors.Resumo ? "input-error" : ""}
              required
              placeholder="Digite um resumo do conteúdo"
            />
            {errors.Resumo && <span className="error-message">{errors.Resumo}</span>}
          </label>

          <label>
            Conteúdo:
            <textarea
              name="Conteudo"
              value={form.Conteudo}
              onChange={handleChange}
              className={errors.Conteudo ? "input-error" : ""}
              required
              placeholder="Digite o conteúdo completo"
            />
            {errors.Conteudo && <span className="error-message">{errors.Conteudo}</span>}
          </label>

          <label>
            Tipo (Categoria):
            <select name="Tipo" value={form.Tipo} onChange={handleChange}>
              <option value="educacao">Educação</option>
              <option value="saude">Saúde</option>
              <option value="noticias">Notícia</option>
              <option value="depoimento">Depoimento</option>
              <option value="suporte">Suporte</option>
              <option value="cultura">Cultura</option>
            </select>
          </label>

          <label>
            Status:
            <select name="Status" value={form.Status} onChange={handleChange}>
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </select>
          </label>

          <label>
            Imagem:
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className={errors.Imagem ? "input-error" : ""}
            />
            {errors.Imagem && <span className="error-message">{errors.Imagem}</span>}
          </label>

          {preview && (
            <div className="image-preview">
              <img src={preview} alt="Preview da imagem" />
              <button
                type="button"
                className="remove-image-button"
                onClick={handleRemoveImage}
              >
                Remover Imagem
              </button>
            </div>
          )}
          <button type="submit" disabled={loading || Object.keys(errors).length > 0}>
            {loading ? "Atualizando..." : "Atualizar Conteúdo"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditarConteudo;
