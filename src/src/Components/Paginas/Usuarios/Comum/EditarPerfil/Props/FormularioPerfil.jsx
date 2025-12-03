import React, { useState } from 'react';
import FotoPerfilSection from './FotoPerfilSection';

const FormularioPerfil = ({
  usuario,
  opcoesPronomes,
  mensagem,
  erro,
  onChange,
  onPronomesChange,
  onFotoChange,
  onSubmit,
}) => {
  const [localErro, setLocalErro] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalErro('');

    if (!usuario.nametag || usuario.nametag.trim() === '') {
      setLocalErro('Nametag é obrigatória.');
      return;
    }

    onSubmit(usuario);
  };

  const pronomesSelecionados = Array.isArray(usuario.pronomes)
    ? usuario.pronomes.map((p) => p.toLowerCase().trim())
    : [];

  return (
    <form className="form-editar-perfil" onSubmit={handleSubmit}>
      {/* Foto - Simplificado: só passa a foto atual */}
      <FotoPerfilSection
        foto={usuario.foto}
        onFotoChange={onFotoChange}
      />

      <div className="form-grid">
        {/* Nametag */}
        <div className="form-group">
          <label htmlFor="nametag">Nome de usuário</label>
          <div className="input-com-icone">
            <input
              type="text"
              id="nametag"
              name="nametag"
              value={usuario.nametag || ''}
              onChange={onChange}
              placeholder="Seu nome de usuário único"
            />
          </div>
          <span className="input-hint">
            Este é seu identificador único na plataforma
          </span>
        </div>

        {/* Apelido */}
        <div className="form-group">
          <label htmlFor="apelido">Apelido</label>
          <div className="input-com-icone">
            <input
              type="text"
              id="apelido"
              name="apelido"
              value={usuario.apelido || ''}
              onChange={onChange}
              placeholder="Como gostaria de ser chamado"
            />
          </div>
        </div>
        
        {/* Pronomes */}
        <div className="form-group full-width">
          <label>Pronomes</label>
          <div className="pronomes-container">
            {opcoesPronomes.map((opcao) => {
              const selecionado = pronomesSelecionados.includes(
                opcao.valor.toLowerCase()
              );

              return (
                <div
                  key={opcao.valor}
                  className={`pronome-opcao ${selecionado ? 'selecionado' : ''}`}
                  onClick={() => onPronomesChange(opcao.valor)}
                >
                  {opcao.label}
                </div>
              );
            })}
          </div>

          <span className="input-hint">
            Selecione todos os pronomes com os quais você se identifica
          </span>
        </div>

        {/* Bio */}
        <div className="form-group full-width">
          <label htmlFor="bio">Bio</label>
          <div className="textarea-com-icone">
            <textarea
              id="bio"
              name="bio"
              value={usuario.bio || ''}
              onChange={onChange}
              placeholder="Conte um pouco sobre você..."
              rows="4"
              maxLength="500"
            />
          </div>
          <div className="contador-caracteres">
            <span>{(usuario.bio || '').length}/500</span>
          </div>
        </div>
      </div>

      {/* Mensagens */}
      {localErro && <div className="mensagem-erro">{localErro}</div>}
      {erro && <div className="mensagem-erro">{erro}</div>}
      {mensagem && <div className="mensagem-sucesso">{mensagem}</div>}

      {/* Ações */}
      <div className="form-actions">
        <button type="submit" className="btn-salvar">
          Salvar Alterações
        </button>
        <button
          type="button"
          className="btn-cancelar"
          onClick={() => window.location.reload()}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default FormularioPerfil;