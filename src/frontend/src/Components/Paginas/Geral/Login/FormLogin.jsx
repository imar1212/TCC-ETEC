import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../../../services/api';
import './Login.css';

const ROUTES = {
  USUARIO: '/inicio/usuario',
  ADMIN: '/inicio_admin'
};

const FormLogin = () => {
  const [formData, setFormData] = useState({ email: '', senha: '' });
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [punicao, setPunicao] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const navigate = useNavigate();
  const token = sessionStorage.getItem('token');

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem('user'));

    if (token && userData) {
      navigate(userData.tipo === 'usuario' ? ROUTES.USUARIO : ROUTES.ADMIN);
    }
  }, [navigate, token]);

  useEffect(() => setIsVisible(true), []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErro('');
    setMensagem('');
    setPunicao(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setMensagem('');
    setPunicao(null);
    setLoading(true);

    if (!formData.email || !formData.senha) {
      setErro('Por favor, preencha todos os campos.');
      setLoading(false);
      return;
    }

    try {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');

      const res = await login(formData);

      if (res.data?.token) {
        sessionStorage.setItem('token', res.data.token);
        sessionStorage.setItem('user', JSON.stringify(res.data.user));

        setMensagem('Login realizado com sucesso!');
        window.dispatchEvent(new Event('authChanged'));

        const { tipo } = res.data.user;
        navigate(tipo === 'usuario' ? ROUTES.USUARIO : ROUTES.ADMIN);
      } else {
        setErro('Falha ao receber token do servidor.');
      }
    } catch (error) {
      const data = error.response?.data;

      if (data?.punicao) {
        // 🔹 Mostra mensagem personalizada se for punição
        setErro(data.message || 'Você está com uma punição ativa.')
      } else {
        // 🔹 Mensagem genérica
        setErro(
          data?.message ||
          error.message ||
          'Erro ao fazer login. Verifique suas credenciais.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`container page-transition ${isVisible ? 'animate-in' : ''}`}>
      <div className="login-container">
        <h1 className="Titulo">Login
        </h1>
      

        {mensagem && <div className="mensagem sucesso">{mensagem}</div>}
        {erro && <div className="mensagem erro">{erro}</div>}


        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={erro ? 'erro-input' : ''}
              required
              aria-invalid={!!erro}
            />
          </div>

          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              className={erro ? 'erro-input' : ''}
              required
              aria-invalid={!!erro}
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormLogin;
