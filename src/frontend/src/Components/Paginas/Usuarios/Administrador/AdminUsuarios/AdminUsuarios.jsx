import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { updateUserType, updateUserStatus, deleteUser } from '../../../../../services/api';
import { StepBack } from 'lucide-react';
import './AdminUsuarios.css';

const AdminUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosOrdenados, setUsuariosOrdenados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const [modalAberto, setModalAberto] = useState(false);
  const [acao, setAcao] = useState(null);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  const navigate = useNavigate();
  const token = sessionStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem('user'));
    if (!storedUser || storedUser.tipo !== 'administrador') {
      alert('Acesso negado: apenas administradores');
      navigate('/');
    } else {
      setUsuarioLogado(storedUser);
      carregarUsuarios();
    }
  }, [navigate]);

  const carregarUsuarios = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users', config);
      setUsuarios(response.data);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error.response || error);
      setErro('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (usuarios.length > 0 && usuarioLogado) {
      const usuarioAtual = usuarios.find(
        (u) => u.Id_usuario === usuarioLogado.id || u.id === usuarioLogado.id
      );
      const outrosUsuarios = usuarios.filter(
        (u) => u.Id_usuario !== usuarioLogado.id && u.id !== usuarioLogado.id
      );
      setUsuariosOrdenados(usuarioAtual ? [usuarioAtual, ...outrosUsuarios] : usuarios);
    } else {
      setUsuariosOrdenados(usuarios);
    }
  }, [usuarios, usuarioLogado]);

  const atualizarTipoOuStatus = async (id, dadosParciais) => {
    try {
      if (dadosParciais.tipo) {
        await updateUserType(id, dadosParciais.tipo, config);
      } else if (dadosParciais.status) {
        await updateUserStatus(id, dadosParciais.status, config);
      }
      setMensagem('Usuário atualizado com sucesso');
      carregarUsuarios();
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error.response || error);
      setErro('Erro ao atualizar usuário');
    }
  };

  const excluirUsuario = async (id) => {
    try {
      console.log('Excluindo usuário com ID:', id);
      await deleteUser(id, config);
      setMensagem('Usuário excluído com sucesso');
      carregarUsuarios();
    } catch (error) {
      console.error('Erro ao excluir usuário:', error.response || error);
      setErro('Erro ao excluir usuário');
    }
  };

  const abrirModal = (usuario, tipoAcao) => {
    setUsuarioSelecionado(usuario);
    setAcao(tipoAcao);
    setModalAberto(true);
  };

  const confirmarAcao = async () => {
    if (!usuarioSelecionado || !acao) return;

    try {
      const usuarioId = usuarioSelecionado.Id_usuario || usuarioSelecionado.id;

      if (acao === 'excluir') {
        await excluirUsuario(usuarioId);
      } else {
        const dadosParciais = {};
        if (acao === 'admin') {
          dadosParciais.tipo =
            (usuarioSelecionado.Tipo || usuarioSelecionado.tipo) === 'administrador'
              ? 'usuario'
              : 'administrador';
        } else if (acao === 'ativo') {
          dadosParciais.status =
            (usuarioSelecionado.Status || usuarioSelecionado.status) === 'ativo'
              ? 'inativo'
              : 'ativo';
        }

        await atualizarTipoOuStatus(usuarioId, dadosParciais);
      }
    } catch (error) {
      console.error('Erro ao confirmar ação:', error.response || error);
      setErro('Erro ao confirmar ação');
    } finally {
      setModalAberto(false);
      setUsuarioSelecionado(null);
      setAcao(null);
    }
  };

  const cancelarAcao = () => {
    setModalAberto(false);
    setUsuarioSelecionado(null);
    setAcao(null);
  };

  useEffect(() => {
    if (mensagem || erro) {
      const timer = setTimeout(() => {
        setMensagem('');
        setErro('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [mensagem, erro]);

  if (loading) return <div className="loading">Carregando usuários...</div>;

  return (
    <div className="container">
      <div className="admin-container">
          <button className="voltar-btn" onClick={() => window.history.back()}>
              <StepBack size={10}/> Voltar
        </button>

        <h1 className='Titulo'>Gerenciamento de Usuários</h1>

        {mensagem && <div className="mensagem sucesso">{mensagem}</div>}
        {erro && <div className="mensagem erro">{erro}</div>}

        <table className="tabela-usuarios">
          <thead>
            <tr>
              <th>Nametag</th>
              <th>Email</th>
              <th>Tipo</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuariosOrdenados.map((usuario) => {
              const usuarioId = usuario.Id_usuario || usuario.id;
              const isUsuarioLogado =
                usuarioLogado &&
                (usuarioId === usuarioLogado.id || usuarioId === usuarioLogado.Id_usuario);

              return (
                <tr key={usuarioId} className={isUsuarioLogado ? 'usuario-logado' : ''}>
                  <td>
                    {usuario.nametag || usuario.Apelido || usuario.nome}
                    {isUsuarioLogado && <span className="voce-badge">Você</span>}
                  </td>
                  <td>{usuario.Email || usuario.email}</td>
                  <td>{usuario.Tipo || usuario.tipo}</td>
                  <td>{usuario.Status || usuario.status}</td>
                  <td>
                    <div className="acoes-container-horizontal">
                      <button
                        className={`btn-admin ${
                          (usuario.Tipo || usuario.tipo) === 'administrador' ? 'admin-ativo' : ''
                        }`}
                        onClick={() => abrirModal(usuario, 'admin')}
                        disabled={isUsuarioLogado}
                      >
                        {(usuario.Tipo || usuario.tipo) === 'administrador'
                          ? 'Remover Admin'
                          : 'Tornar Admin'}
                      </button>
                      <button
                        className={`btn-status ${
                          (usuario.Status || usuario.status) === 'ativo'
                            ? 'status-ativo'
                            : 'status-inativo'
                        }`}
                        onClick={() => abrirModal(usuario, 'ativo')}
                        disabled={isUsuarioLogado}
                      >
                        {(usuario.Status || usuario.status) === 'ativo' ? 'Desativar' : 'Ativar'}
                      </button>
                      <button
                        className="btn-excluir"
                        onClick={() => abrirModal(usuario, 'excluir')}
                        disabled={isUsuarioLogado}
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {modalAberto && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Confirmar ação</h3>
              <p>
                {acao === 'admin'
                  ? (usuarioSelecionado.Tipo || usuarioSelecionado.tipo) === 'administrador'
                    ? `Remover privilégios de admin de ${usuarioSelecionado.nametag ||
                        usuarioSelecionado.Apelido ||
                        usuarioSelecionado.nome}?`
                    : `Tornar ${usuarioSelecionado.nametag ||
                        usuarioSelecionado.Apelido ||
                        usuarioSelecionado.nome} administrador?`
                  : acao === 'ativo'
                  ? (usuarioSelecionado.Status || usuarioSelecionado.status) === 'ativo'
                    ? `Deseja desativar ${usuarioSelecionado.nametag ||
                        usuarioSelecionado.Apelido ||
                        usuarioSelecionado.nome}?`
                    : `Deseja ativar ${usuarioSelecionado.nametag ||
                        usuarioSelecionado.Apelido ||
                        usuarioSelecionado.nome}?`
                  : `Deseja excluir permanentemente ${usuarioSelecionado.nametag ||
                      usuarioSelecionado.Apelido ||
                      usuarioSelecionado.nome}?`}
              </p>
              <div className="modal-buttons">
                <button className="btn-confirmar" onClick={confirmarAcao}>
                  Confirmar
                </button>
                <button className="btn-cancelar" onClick={cancelarAcao}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsuarios;
