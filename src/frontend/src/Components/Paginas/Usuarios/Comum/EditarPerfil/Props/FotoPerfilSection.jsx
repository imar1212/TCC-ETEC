import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const fotosPreExistentes = [
  '/avatars/elphaba.png',
  '/avatars/glinda.png',
  '/avatars/dorothy.png',
  '/avatars/homem_lata.png',
  '/avatars/espantalho.png',
  '/avatars/mágico.png',
  '/avatars/sapato.png',
];

const FotoPerfilSection = ({ foto, onFotoChange }) => {
  const [modalAberto, setModalAberto] = useState(false);
  const [tooltipVisivel, setTooltipVisivel] = useState(false);
  const navigate = useNavigate();
  const timeoutRef = useRef(null);

  const handleEscolherFoto = (url) => {
    onFotoChange(url);
    setModalAberto(false);
  };

  const mostrarTooltip = () => {
    clearTimeout(timeoutRef.current);
    setTooltipVisivel(true);
  };

  const esconderTooltipComAtraso = () => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setTooltipVisivel(false), 1000); // 4 segundos
  };

  return (
    <div className="foto-perfil-section">
      <div className="foto-preview">
        <img
          src={foto || '/nenhuma.png'}
          alt="Foto de perfil"
          className="foto-perfil"
          onError={(e) => {
            e.target.src = '/nenhuma.png';
          }}
        />
      </div>

      <div className="foto-acoes">
        <button
          type="button"
          className="btn-foto"
          onClick={() => setModalAberto(true)}
        >
          Alterar Foto
        </button>
      </div>

      {modalAberto && (
        <div className="modal-overlay" onClick={() => setModalAberto(false)}>
          <div className="modal-fotos" onClick={(e) => e.stopPropagation()}>
            <div className="titulo-fotos">
              <h3>Escolha sua nova foto</h3>

              {/* Ícone de ajuda */}
              <div
                className="icone-ajuda"
                onMouseEnter={mostrarTooltip}
                onMouseLeave={esconderTooltipComAtraso}
              >
                ?
                {tooltipVisivel && (
                  <div
                    className="tooltip-ajuda"
                    onMouseEnter={mostrarTooltip}
                    onMouseLeave={esconderTooltipComAtraso}
                  >
                    <p>
                      Nossos ícones são inspirados em <b>O Mágico de Oz</b>!  
                      Cada personagem simboliza uma jornada de crescimento e coragem.
                    </p>
                    <button
                      className="btn-tooltip"
                      onClick={() => navigate('/conteudo/6')}
                    >
                      Saiba mais →
                    </button>
                    <div className="tooltip-seta"></div>
                  </div>
                )}
              </div>
            </div>

            <div className="opcoes-fotos">
              {fotosPreExistentes.map((url) => (
                <img
                  key={url}
                  src={url}
                  alt="Opção de avatar"
                  className={`opcao-foto ${foto === url ? 'selecionada' : ''}`}
                  onClick={() => handleEscolherFoto(url)}
                  onError={(e) => {
                    e.target.src = '/nenhuma.png';
                  }}
                />
              ))}
            </div>
            <button
              type="button"
              className="btn-cancelar"
              onClick={() => setModalAberto(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FotoPerfilSection;
