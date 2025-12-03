import React from 'react';

const PerfilHeader = ({ titulo, subtitulo }) => {
  return (
    <div className="perfil-header">
      <h1 className='Titulo'>{titulo}</h1>
      <p>{subtitulo}</p>
    </div>
  );
};

export default PerfilHeader;