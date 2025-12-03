import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser, checkEmail, checkNametag } from '../../../../services/api';
import './CadastroUsuario.css';

const CadastroUsuario = () => {
  const [formData, setFormData] = useState({
    nametag: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    tipo: 'usuario',
    status: 'ativo',
    apelido: ''
  });

  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const [campoErros, setCampoErros] = useState({});

  const navigate = useNavigate();
  const token = sessionStorage.getItem('token');

  // 🔁 Redirecionamento se usuário já estiver logado
  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem('user'));
    if (token && userData) {
      if (userData.tipo === 'usuario') {
        navigate('/inicio_usuario');
      } else if (userData.tipo === 'administrador') {
        navigate('/inicio_admin');
      }
    }
  }, [navigate, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setCampoErros(prev => ({ ...prev, [name]: '' }));
  };

  const validarFormulario = async () => {
    const erros = {};
    let valido = true;

    // Email
    if (!formData.email) {
      erros.email = 'Email é obrigatório';
      valido = false;
    } else {
      try {
        const res = await checkEmail(formData.email);
        if (!res.data.available) {
          erros.email = 'Este email já está em uso';
          valido = false;
        }
      } catch {
        erros.email = 'Erro ao verificar email';
        valido = false;
      }
    }

    // Senha - VALIDAÇÃO DE MÍNIMO 6 CARACTERES
    if (!formData.senha) {
      erros.senha = 'Senha é obrigatória';
      valido = false;
    } else if (formData.senha.length < 6) {
      erros.senha = 'A senha deve ter pelo menos 6 caracteres';
      valido = false;
    }

    // Confirmar senha
    if (!formData.confirmarSenha) {
      erros.confirmarSenha = 'Confirmar senha é obrigatório';
      valido = false;
    } else if (formData.senha !== formData.confirmarSenha) {
      erros.confirmarSenha = 'As senhas não coincidem';
      valido = false;
    }

    // Nametag
    if (!formData.nametag) {
      erros.nametag = 'Nametag é obrigatória';
      valido = false;
    } else {
      try {
        const res = await checkNametag(formData.nametag);
        if (!res.data.available) {
          erros.nametag = 'Esta nametag já está em uso';
          valido = false;
        }
      } catch {
        erros.nametag = 'Erro ao verificar nametag';
        valido = false;
      }
    }

    setCampoErros(erros);
    return valido;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem('');
    setErro('');

    const ok = await validarFormulario();
    if (!ok) return;

    try {
      const payload = { ...formData, apelido: formData.nametag };
      await createUser(payload);

      setMensagem('Usuário cadastrado com sucesso!');
      setFormData({
        nametag: '',
        email: '',
        senha: '',
        confirmarSenha: '',
        tipo: 'usuario',
        status: 'ativo',
        apelido: ''
      });
    } catch (error) {
      setErro(error.message || 'Erro ao cadastrar usuário');
    }
  };

  return (
    <div className="container">
      <div className="cadastro-container">
        <h1 className="Titulo">Cadastro de Usuário</h1>

        {mensagem && <div className="mensagem sucesso">{mensagem}</div>}
        {erro && <div className="mensagem erro">{erro}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className={campoErros.email ? 'erro-label' : ''}>Email*</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={campoErros.email ? 'erro-input' : 'cd-input'}
            />
            {campoErros.email && <span className="erro-text">{campoErros.email}</span>}
          </div>

          <div className="form-group">
            <label className={campoErros.senha ? 'erro-label' : ''}>Senha*</label>
            <input
              type="password"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              className={campoErros.senha ? 'erro-input' :'cd-input'}
              minLength="6"
            />
            {campoErros.senha && <span className="erro-text">{campoErros.senha}</span>}
          </div>

          <div className="form-group">
            <label className={campoErros.confirmarSenha ? 'erro-label' : ''}>Confirmar Senha*</label>
            <input
              type="password"
              name="confirmarSenha"
              value={formData.confirmarSenha}
              onChange={handleChange}
              className={campoErros.confirmarSenha ? 'erro-input' : 'cd-input'}
            />
            {campoErros.confirmarSenha && <span className="erro-text">{campoErros.confirmarSenha}</span>}
          </div>

          <div className="form-group">
            <label className={campoErros.nametag ? 'erro-label' : ''}>Nome de Usuário*</label>
            <input
              type="text"
              name="nametag"
              value={formData.nametag}
              onChange={handleChange}
              className={campoErros.nametag ? 'erro-input' : 'cd-input'}
            />
            {campoErros.nametag && <span className="erro-text">{campoErros.nametag}</span>}
          </div>

          <div className="form-buttons">
            <button type="submit" className="btn-primary">Cadastrar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CadastroUsuario;