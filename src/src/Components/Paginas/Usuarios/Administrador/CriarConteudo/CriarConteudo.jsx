import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createConteudo } from "../../../../../services/api";
import { StepBack } from "lucide-react";
import "./CriarConteudo.css";

const CriarConteudo = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    Titulo: "",
    Resumo: "",
    Conteudo: "",
    Status: "ativo",
    Tipo: "historia",
    Imagem: null,
  });

  const [preview, setPreview] = useState(null);
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // 🔁 VERIFICAÇÃO DE LOGIN E PERMISSÕES - MODIFICADO
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const storedUser = JSON.parse(sessionStorage.getItem('user'));

    if (!token || !storedUser) {
      navigate("/");
      return;
    }

    // Verifica se é administrador
    if (storedUser.tipo !== 'administrador') {
      alert('Você não tem permissão para acessar esta página.');
      navigate('/inicio-usuario');
      return;
    }

    setUsuarioLogado(storedUser);
  }, [navigate]);

  // Validação de campos
  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'Titulo':
        if (!value.trim()) newErrors.Titulo = 'Título é obrigatório';
        else if (value.length < 5) newErrors.Titulo = 'Título deve ter pelo menos 5 caracteres';
        else delete newErrors.Titulo;
        break;
      case 'Resumo':
        if (!value.trim()) newErrors.Resumo = 'Resumo é obrigatório';
        else if (value.length < 10) newErrors.Resumo = 'Resumo deve ter pelo menos 10 caracteres';
        else delete newErrors.Resumo;
        break;
      case 'Conteudo':
        if (!value.trim()) newErrors.Conteudo = 'Conteúdo é obrigatório';
        else if (value.length < 20) newErrors.Conteudo = 'Conteúdo deve ter pelo menos 20 caracteres';
        else delete newErrors.Conteudo;
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

  // Inputs de texto
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    validateField(name, value);
  };

  // Input de arquivo
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, Imagem: file });

    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setErrors({ ...errors, Imagem: 'Formato de imagem inválido. Use JPEG, PNG, GIF ou WebP.' });
        setPreview(null);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, Imagem: 'Imagem muito grande. Máximo 5MB.' });
        setPreview(null);
        return;
      }
      const newErrors = { ...errors };
      delete newErrors.Imagem;
      setErrors(newErrors);

      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else setPreview(null);
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!usuarioLogado) return;

    validateField('Titulo', form.Titulo);
    validateField('Resumo', form.Resumo);
    validateField('Conteudo', form.Conteudo);

    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("Titulo", form.Titulo);
      formData.append("Resumo", form.Resumo);
      formData.append("Conteudo", form.Conteudo);
      formData.append("Tipo", form.Tipo);
      formData.append("Status", form.Status);
      formData.append("Fk_usuario", usuarioLogado.Id_usuario || usuarioLogado.id);
      if (form.Imagem) formData.append("Imagem", form.Imagem);

      await createConteudo(formData, { headers: { "Content-Type": "multipart/form-data" } });

      alert("Conteúdo criado com sucesso!");
      navigate("/admin/conteudo");
    } catch (error) {
      console.error("Erro ao criar conteúdo:", error);
      alert("Erro ao criar conteúdo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="criar-conteudo-container">
        {/* Botão Voltar */}
        <button className="voltar-btn" onClick={() => navigate(-1)}>
          <StepBack size={10}/> Voltar
        </button>
        

        <h1>Criar Novo Conteúdo</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Título:
            <input
              type="text"
              name="Titulo"
              value={form.Titulo}
              onChange={handleChange}
              className={errors.Titulo ? 'input-error' : ''}
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
              className={errors.Resumo ? 'input-error' : ''}
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
              className={errors.Conteudo ? 'input-error' : ''}
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
              className={errors.Imagem ? 'input-error' : ''}
            />
            {errors.Imagem && <span className="error-message">{errors.Imagem}</span>}
          </label>

          {preview && (
            <div className="image-preview">
              <img src={preview} alt="Preview da imagem selecionada" />
            </div>
          )}

          <button
            type="submit"
            disabled={loading || Object.keys(errors).length > 0}
            className={Object.keys(errors).length > 0 ? 'btn-disabled' : ''}
          >
            {loading ? "Criando..." : "Criar Conteúdo"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CriarConteudo;
