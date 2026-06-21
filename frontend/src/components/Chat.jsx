import { useState, useEffect, useRef } from 'react';

export default function Chat({ tipo, idReferencia, idUsuarioActual, titulo }) {
  const [mensajes, setMensajes] = useState([]);
  const [texto, setTexto] = useState('');
  const bottomRef = useRef(null);
  const prevUltimoId = useRef(null);

  // Estados para el reporte
  const [modalReporte, setModalReporte] = useState(null);
  const [motivoReporte, setMotivoReporte] = useState('');

  const url = tipo === 'INTERCAMBIO'
      ? `http://localhost:8080/api/chat/intercambio/${idReferencia}`
      : `http://localhost:8080/api/chat/soporte/${idReferencia}`;

  const token = localStorage.getItem('greenswap_token');

  // ... mantén las funciones cargar(), los useEffect() y enviar() igual ...
  // (Copia aquí tus funciones de cargar, useEffect y enviar sin cambios)

  const cargar = () => {
    fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(r => r.json()).then(data => {
      if (Array.isArray(data)) setMensajes(data);
    }).catch(() => {});
  };

  useEffect(() => {
    cargar();
    const intervalo = setInterval(cargar, 3000);
    return () => clearInterval(intervalo);
  }, [idReferencia]);

  useEffect(() => {
    if (mensajes.length === 0) return;
    const ultimo = mensajes[mensajes.length - 1];
    if (ultimo?.idMensaje !== prevUltimoId.current) {
      prevUltimoId.current = ultimo?.idMensaje;
      if (ultimo?.idRemitente !== idUsuarioActual) {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [mensajes]);

  const enviar = (e) => {
    e.preventDefault();
    if (!texto.trim()) return;

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ idRemitente: idUsuarioActual, contenido: texto })
    }).then(() => {
      setTexto('');
      cargar();
    });
  };

  const enviarReporte = () => {
    if (!motivoReporte.trim()) return;
    const usuarioStorage = JSON.parse(localStorage.getItem('usuario'));
    const nombreActual = usuarioStorage?.nombre || usuarioStorage?.nombreCompleto || "Usuario";

    fetch('http://localhost:8080/api/reportes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        idReportante: idUsuarioActual,
        nombreReportante: nombreActual,
        idReportado: modalReporte.idReportado,
        nombreReportado: modalReporte.nombreReportado,
        motivo: motivoReporte
      })
    }).then(() => {
      setModalReporte(null);
      setMotivoReporte('');
      alert('Reporte enviado correctamente al administrador.');
    });
  };

  return (
      <div style={{ position: 'relative', border: '1px solid #e0e0e0', borderRadius: '10px', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '350px' }}>
        {modalReporte && (
            <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
              <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', width: '85%' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#d32f2f' }}>Reportar a {modalReporte.nombreReportado}</h4>
                <textarea
                    rows="3"
                    placeholder="Escribe la razón del reporte (ej. insultos, spam...)"
                    style={{ width: '100%', marginBottom: '10px', padding: '8px', boxSizing: 'border-box' }}
                    value={motivoReporte}
                    onChange={e => setMotivoReporte(e.target.value)}
                />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={enviarReporte} style={{ flex: 1, background: '#d32f2f', color: '#fff', border: 'none', padding: '8px', borderRadius: '4px', cursor: 'pointer' }}>Enviar Reporte</button>
                  <button onClick={() => setModalReporte(null)} style={{ flex: 1, background: '#ccc', border: 'none', padding: '8px', borderRadius: '4px', cursor: 'pointer' }}>Cancelar</button>
                </div>
              </div>
            </div>
        )}

        <div style={{ backgroundColor: '#2e7d32', color: '#fff', padding: '10px 14px', fontWeight: 'bold', fontSize: '0.9rem' }}>
          {titulo}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', backgroundColor: '#fafafa' }}>
          {mensajes.length === 0 && (
              <p style={{ textAlign: 'center', color: '#aaa', fontSize: '0.85rem', marginTop: '2rem' }}>
                ¡Sé el primero en escribir!
              </p>
          )}
          {mensajes.map(m => {
            const esMio = m.idRemitente === idUsuarioActual;
            return (
                <div key={m.idMensaje} style={{ display: 'flex', flexDirection: 'column', alignItems: esMio ? 'flex-end' : 'flex-start' }}>
                  {!esMio && (
                      <span style={{ fontSize: '0.72rem', color: '#888', marginBottom: '2px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                      {m.nombreRemitente}
                        <button
                            onClick={() => setModalReporte({ idReportado: m.idRemitente, nombreReportado: m.nombreRemitente })}
                            style={{ background: 'none', border: 'none', color: '#d32f2f', cursor: 'pointer', fontSize: '0.65rem', padding: 0 }}
                            title="Reportar usuario por abuso de chat"
                        >
                        Reportar
                      </button>
                    </span>
                  )}
                  <div style={{
                    maxWidth: '75%', padding: '8px 12px', borderRadius: esMio ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                    backgroundColor: esMio ? '#2e7d32' : '#fff',
                    color: esMio ? '#fff' : '#333',
                    fontSize: '0.88rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }}>
                    {m.contenido}
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#bbb', marginTop: '2px' }}>
                    {new Date(m.fecha).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={enviar} style={{ display: 'flex', gap: '8px', padding: '10px', borderTop: '1px solid #e0e0e0', backgroundColor: '#fff' }}>
          <input
              type="text"
              value={texto}
              onChange={e => setTexto(e.target.value)}
              placeholder="Escribe un mensaje..."
              style={{ flex: 1, padding: '8px 12px', borderRadius: '20px', border: '1px solid #ccc', fontSize: '0.9rem', outline: 'none' }}
          />
          <button type="submit" style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#2e7d32', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="18" height="18">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </form>
      </div>
  );
}