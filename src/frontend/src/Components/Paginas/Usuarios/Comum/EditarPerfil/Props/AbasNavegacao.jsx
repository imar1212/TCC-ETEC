import React from 'react';

const AbasNavegacao = ({ abaAtiva, onMudancaAba }) => {
  return (
    <div className="abas-navegacao">
      <button 
        className={`aba ${abaAtiva === 'perfil' ? 'ativa' : ''}`}
        onClick={() => onMudancaAba('perfil')}
      >
        Informações pessoais
      </button>
      <button 
        className={`aba ${abaAtiva === 'senha' ? 'ativa' : ''}`}
        onClick={() => onMudancaAba('senha')}
      >
        Segurança
      </button>
      <button 
        className={`aba ${abaAtiva === 'denuncias' ? 'ativa' : ''}`}
        onClick={() => onMudancaAba('denuncias')}
      >
        Minhas denúncias
      </button>
    </div>
  );
};

export default AbasNavegacao;