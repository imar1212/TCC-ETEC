import React, { useState } from 'react';

const FormularioSenha = ({ onSubmit, mensagem, erro }) => {
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erroLocal, setErroLocal] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErroLocal('');

    if (!senhaAtual) {
      setErroLocal('Por favor, digite sua senha atual.');
      return;
    }

    if (novaSenha.length < 6) {
      setErroLocal('A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setErroLocal('As senhas não coincidem.');
      return;
    }

    // Envia dados para o callback do pai
    onSubmit({ senhaAtual, novaSenha });

    // Limpa campos
    setSenhaAtual('');
    setNovaSenha('');
    setConfirmarSenha('');
    setErroLocal('');
  };

  return (
    <form className="form-editar-perfil" onSubmit={handleSubmit}>
      <h2 className="subtitulo-secao">Alterar Senha</h2>

      <div className="form-grid">
        <div className="form-group full-width">
          <label htmlFor="senhaAtual">Senha Atual</label>
          <div className="input-com-icone">
            <input
              type="password"
              id="senhaAtual"
              value={senhaAtual}
              onChange={(e) => setSenhaAtual(e.target.value)}
              placeholder="Digite sua senha atual"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="novaSenha">Nova Senha</label>
          <div className="input-com-icone">
            <input
              type="password"
              id="novaSenha"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              placeholder="Digite a nova senha"
              required
              minLength={6}
            />
          </div>
          <span className="input-hint">Mínimo de 6 caracteres</span>
        </div>

        <div className="form-group">
          <label htmlFor="confirmarSenha">Confirmar Senha</label>
          <div className="input-com-icone">
            <input
              type="password"
              id="confirmarSenha"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              placeholder="Confirme a nova senha"
              required
              minLength={6}
            />
          </div>
        </div>
      </div>

      {/* Mensagens de erro e sucesso */}
      {erroLocal && <div className="mensagem-erro"><span>✗</span> {erroLocal}</div>}
      {!erroLocal && erro && <div className="mensagem-erro"><span>✗</span> {erro}</div>}
      {!erroLocal && mensagem && <div className="mensagem-sucesso"><span>✓</span> {mensagem}</div>}

      <div className="form-actions">
        <button type="submit" className="btn-salvar">
          Alterar Senha
        </button>
      </div>
    </form>
  );
};

export default FormularioSenha;
