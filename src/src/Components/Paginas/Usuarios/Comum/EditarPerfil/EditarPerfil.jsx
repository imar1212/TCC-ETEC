import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getUserById,
  updateUser,
  updatePassword
} from '../../../../../services/api';
import PerfilHeader from './Props/PerfilHeader';
import AbasNavegacao from './Props/AbasNavegacao';
import FormularioPerfil from './Props/FormularioPerfil';
import FormularioSenha from './Props/FormularioSenha';
import DenunciasSection from './Props/Denuncia/DenunciasSection';
import './EditarPerfil.css';

const EditarPerfil = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem('token');
  const userData = JSON.parse(sessionStorage.getItem('user'));
  const userId = userData?.id;

  const [usuario, setUsuario] = useState({
    foto: '',
    nametag: '',
    apelido: '',
    bio: '',
    email: '',
    pronomes: [],
  });
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const [abaAtiva, setAbaAtiva] = useState('perfil');
  const [carregando, setCarregando] = useState(true);
  const [denuncias, setDenuncias] = useState([]);

  const opcoesPronomes = [
    { valor: 'ele/dele', label: 'ele/dele' },
    { valor: 'ela/dela', label: 'ela/dela' },
    { valor: 'elu/delu', label: 'elu/delu' },
  ];

  // Carrega usuário
  useEffect(() => {
    const fetchUser = async () => {
      if (!token || !userId) {
        navigate('/');
        return;
      }

      try {
        const res = await getUserById(userId);
        if (res.data) {
          const pronomes = Array.isArray(res.data.pronomes)
            ? res.data.pronomes.map((p) => p.toLowerCase())
            : [];
          setUsuario({
            foto: res.data.Foto,
            nametag: res.data.nametag || '',
            apelido: res.data.Apelido || '',
            bio: res.data.bio || '',
            email: res.data.email || '',
            pronomes,
          });
        }
      } catch (err) {
        console.error(err);
        setErro('Erro ao carregar perfil');
      } finally {
        setCarregando(false);
      }
    };

    fetchUser();
  }, [userId, navigate, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario((prev) => ({ ...prev, [name]: value }));
  };

  const handlePronomesChange = (valor) => {
    const valorNormalizado = valor.toLowerCase();
    setUsuario((prev) => {
      const pronomesAtuais = Array.isArray(prev.pronomes)
        ? prev.pronomes.map((p) => p.toLowerCase())
        : [];
      const novosPronomes = pronomesAtuais.includes(valorNormalizado)
        ? pronomesAtuais.filter((p) => p !== valorNormalizado)
        : [...pronomesAtuais, valorNormalizado];
      return { ...prev, pronomes: novosPronomes };
    });
  };

  const handleFotoChange = (url) => {
    setUsuario(prev => ({ ...prev, foto: url }));
  };

  const handleSubmitPerfil = async (usuarioAtualizado) => {
    try {
      const dadosParaEnviar = {
        apelido: usuarioAtualizado.apelido,
        nametag: usuarioAtualizado.nametag,
        bio: usuarioAtualizado.bio,
        pronomes: usuarioAtualizado.pronomes,
        foto: usuarioAtualizado.foto,
      };

      await updateUser(userId, dadosParaEnviar);

      setUsuario(prev => ({ ...prev, ...dadosParaEnviar }));
      
      const userStorage = JSON.parse(sessionStorage.getItem('user')) || {};
      sessionStorage.setItem('user', JSON.stringify({ 
        ...userStorage, 
        ...dadosParaEnviar 
      }));

      setMensagem('Perfil atualizado com sucesso!');
      setErro('');
      setTimeout(() => setMensagem(''), 3000);
    } catch (err) {
      console.error(err);
      setErro(err.response?.data?.message || 'Erro ao atualizar perfil');
    }
  };

  const handleSubmitSenha = async ({ senhaAtual, novaSenha }) => {
    try {
      setMensagem('');
      setErro('');

      await updatePassword(userId, { senhaAtual, senhaNova: novaSenha });

      setMensagem('Senha atualizada com sucesso!');
      setErro('');
    } catch (err) {
      console.error(err);
      setErro(err.response?.data?.message || 'Erro ao atualizar senha');
      setMensagem('');
    }
  };

  const handleMudancaAba = (aba) => {
    setAbaAtiva(aba);
    setMensagem('');
    setErro('');
  };

  if (carregando) {
    return (
      <div className="container">
        <div className="editar-perfil-container">
          <div className="carregando">Carregando...</div>
        </div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="container">
        <div className="editar-perfil-container">
          <div className="erro">Usuário não autenticado</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="editar-perfil-container">
        <PerfilHeader
          titulo="Configurar perfil"
          subtitulo="Personalize sua presença na plataforma"
        />

        <AbasNavegacao abaAtiva={abaAtiva} onMudancaAba={handleMudancaAba} />

        <div className="perfil-content">
          {abaAtiva === 'perfil' && (
            <FormularioPerfil
              usuario={usuario}
              opcoesPronomes={opcoesPronomes}
              mensagem={mensagem}
              erro={erro}
              onChange={handleChange}
              onPronomesChange={handlePronomesChange}
              onFotoChange={handleFotoChange}
              onSubmit={() => handleSubmitPerfil(usuario)}
            />
          )}

          {abaAtiva === 'senha' && (
            <FormularioSenha
              onSubmit={handleSubmitSenha}
              mensagem={mensagem}
              erro={erro}
            />
          )}

          {abaAtiva === 'denuncias' && (
            <DenunciasSection 
              userId={userId}
              onCarregarDenuncias={setDenuncias}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EditarPerfil;