import { useState } from 'react';
import Chat from './Chat';

export default function ChatSoporte({ usuario }) {
  const [abierto, setAbierto] = useState(false);

  if (!usuario) return null;

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 999 }}>
      {abierto && (
        <div style={{ width: '320px', marginBottom: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)', borderRadius: '10px' }}>
          <Chat
            tipo="SOPORTE"
            idReferencia={usuario.idUsuario}
            idUsuarioActual={usuario.idUsuario}
            titulo="Chat de Soporte"
          />
        </div>
      )}
      <button
        onClick={() => setAbierto(a => !a)}
        style={{
          width: '52px', height: '52px', borderRadius: '50%',
          backgroundColor: '#2e7d32', color: '#fff', border: 'none',
          fontSize: '1.4rem', cursor: 'pointer', boxShadow: '0 3px 10px rgba(0,0,0,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
        title="Soporte"
      >
        {abierto ? '✕' : '💬'}
      </button>
    </div>
  );
}
