import { useState, useEffect } from 'react';

const ESTADOS_COLOR = {
  PENDIENTE: { bg: '#fff8e1', color: '#f57f17', label: 'Pendiente' },
  APROBADO:  { bg: '#e8f5e9', color: '#2e7d32', label: 'Aprobado'  },
  RECHAZADO: { bg: '#ffebee', color: '#c62828', label: 'Rechazado' },
};

const CONFIG_INTERCAMBIO = {
  PENDIENTE:  { color: '#f57f17', bg: '#fff8e1', label: 'Pendiente' },
  ACEPTADA:   { color: '#1565c0', bg: '#e3f2fd', label: 'Aceptada' },
  ENTREGADO:  { color: '#6a1b9a', bg: '#f3e5f5', label: 'Entregado' },
  COMPLETADA: { color: '#2e7d32', bg: '#e8f5e9', label: 'Completada' },
  RECHAZADA:  { color: '#c62828', bg: '#ffebee', label: 'Rechazada' },
};

export default function PanelAdmin() {
  const [seccion, setSeccion] = useState('publicaciones');
  const [articulos, setArticulos] = useState([]);
  const [intercambios, setIntercambios] = useState([]);
  const [filtroIntercambio, setFiltroIntercambio] = useState('COMPLETADA');
  const [filtro, setFiltro] = useState('PENDIENTE');

  const [motivoModal, setMotivoModal] = useState(null);
  const [motivoTexto, setMotivoTexto] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [reportes, setReportes] = useState([]);

  const token = localStorage.getItem('greenswap_token');

  const cargarReportes = () => {
    fetch('http://localhost:8080/api/admin/reportes', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
        .then(r => r.json())
        .then(data => setReportes(Array.isArray(data) ? data : []))
        .catch(() => setReportes([]));
  };

  const cargarIntercambios = (estado = '') => {
    const url = estado
        ? `http://localhost:8080/api/admin/intercambios?estado=${estado}`
        : 'http://localhost:8080/api/admin/intercambios';

    fetch(url, { headers: { 'Authorization': `Bearer ${token}` } })
        .then(r => {
          if (!r.ok) throw new Error('Error en la petición');
          return r.json();
        })
        .then(data => setIntercambios(Array.isArray(data) ? data : []))
        .catch(() => setIntercambios([]));
  };

  const cargarUsuarios = () => {
    fetch('http://localhost:8080/api/usuarios', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
        .then(r => r.json())
        .then(data => { setUsuarios(Array.isArray(data) ? data : []); })
        .catch(() => setUsuarios([]));
  };

  const confirmarEliminarUsuario = (idUsuario) => {
    if (window.confirm('¿Es completamente seguro de eliminar a este usuario? Todos sus artículos también serán borrados.')) {
      fetch(`http://localhost:8080/api/usuarios/${idUsuario}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
          .then(res => {
            if (!res.ok) throw new Error('Error al eliminar al usuario');
            setMensaje('Usuario eliminado exitosamente.');
            cargarUsuarios();
          })
          .catch(err => {
            alert('Hubo un error al intentar eliminar al usuario.');
          });
    }
  };

  useEffect(() => {
    if (seccion === 'intercambios') cargarIntercambios(filtroIntercambio);
    if (seccion === 'usuarios') cargarUsuarios();
    if (seccion === 'reportes') cargarReportes();
  }, [seccion, filtroIntercambio]);

  const cargar = () => {
    fetch('http://localhost:8080/api/admin/articulos/pendientes', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
        .then(r => r.json())
        .then(data => setArticulos(Array.isArray(data) ? data : []))
        .catch(() => setArticulos([]));
  };

  useEffect(() => {
    if (seccion === 'publicaciones') cargar();
  }, [seccion]);

  useEffect(() => { cargar(); }, []);

  const aprobar = (id) => {
    fetch(`http://localhost:8080/api/admin/articulos/${id}/aprobar`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    })
        .then(() => { setMensaje('Publicación aprobada.'); cargar(); });
  };

  const abrirRechazo = (articulo) => {
    setMotivoModal(articulo);
    setMotivoTexto('');
  };

  const confirmarRechazo = () => {
    if (!motivoTexto.trim()) return;
    fetch(`http://localhost:8080/api/admin/articulos/${motivoModal.idArticulo}/rechazar`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ motivo: motivoTexto })
    }).then(() => {
      setMensaje('Publicación rechazada y usuario notificado.');
      setMotivoModal(null);
      cargar();
    });
  };

  const eliminar = (articulo) => {
    setMotivoModal({ ...articulo, accion: 'eliminar' });
    setMotivoTexto('');
  };

  const confirmarEliminar = () => {
    if (!motivoTexto.trim()) return;
    fetch(`http://localhost:8080/api/admin/articulos/${motivoModal.idArticulo}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ motivo: motivoTexto })
    }).then(() => {
      setMensaje('Publicación eliminada y usuario notificado.');
      setMotivoModal(null);
      cargar();
    });
  };

  const ignorarReporte = (id) => {
    fetch(`http://localhost:8080/api/admin/reportes/${id}/ignorar`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(() => {
      setMensaje('Reporte ignorado.');
      cargarReportes();
    });
  };

  const eliminarUsuarioReportado = (idReportado, idReporte) => {
    if (window.confirm('¿Seguro que deseas BORRAR la cuenta del usuario acusado? Se perderán todos sus artículos.')) {
      fetch(`http://localhost:8080/api/usuarios/${idReportado}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(() => {
        // Una vez borrado el usuario, marcamos el reporte como procesado
        fetch(`http://localhost:8080/api/admin/reportes/${idReporte}/sancionar`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${token}` }
        }).then(() => {
          setMensaje('Usuario eliminado y reporte cerrado correctamente.');
          cargarReportes();
        });
      }).catch(() => alert('Error al borrar la cuenta de usuario.'));
    }
  };

  return (
      <div className="container">
        <h2 style={{ color: '#2e7d32' }}>Panel de Administración</h2>

        <div style={{ display: 'flex', gap: '0', marginBottom: '1.5rem', borderBottom: '2px solid #e0e0e0' }}>
          {[
            { key: 'publicaciones', label: 'Publicaciones' },
            { key: 'intercambios', label: 'Intercambios' },
            { key: 'usuarios', label: 'Usuarios' },
            { key: 'reportes', label: 'Reportes de chat' }
          ].map(t => (
              <button key={t.key} onClick={() => setSeccion(t.key)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '10px 20px', fontWeight: seccion === t.key ? 'bold' : 'normal', color: seccion === t.key ? '#2e7d32' : '#666', borderBottom: seccion === t.key ? '3px solid #2e7d32' : '3px solid transparent', fontSize: '1rem' }}>
                {t.label}
              </button>
          ))}
        </div>

        {mensaje && (
            <div style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '10px', borderRadius: '6px', marginBottom: '1rem' }}>
              {mensaje}
              <button onClick={() => setMensaje('')} style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
            </div>
        )}

        {seccion === 'intercambios' && (
            <div>
              {intercambios.length === 0 && <div className="card" style={{ textAlign: 'center', color: '#666' }}>No hay intercambios completados aún.</div>}
              {intercambios.map(s => {
                const c = CONFIG_INTERCAMBIO[s.estado] || CONFIG_INTERCAMBIO.PENDIENTE;
                return (
                    <div className="card" key={s.idSolicitud} style={{ marginBottom: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                        <strong style={{ fontSize: '1.05rem', color: '#1f3b57' }}>{s.tituloArticulo}</strong>
                        <span style={{ fontSize: '0.78rem', padding: '3px 10px', borderRadius: '6px', backgroundColor: c.bg, color: c.color, fontWeight: 'bold', whiteSpace: 'nowrap', marginLeft: '10px' }}>
                    {c.label}
                  </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
                        <div style={{ flex: 1, backgroundColor: '#f1f8f1', borderRadius: '8px', padding: '8px 12px', textAlign: 'center' }}>
                          <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '2px' }}>VENDEDOR</div>
                          <strong>{s.vendedor}</strong>
                        </div>
                        <span style={{ fontSize: '1.3rem', color: '#2e7d32' }}>➔</span>
                        <div style={{ flex: 1, backgroundColor: '#e3f2fd', borderRadius: '8px', padding: '8px 12px', textAlign: 'center' }}>
                          <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '2px' }}>COMPRADOR</div>
                          <strong>{s.comprador}</strong>
                        </div>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#999', marginTop: '8px', textAlign: 'right' }}>
                        {new Date(s.fecha).toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' })}
                      </div>
                    </div>
                );
              })}
            </div>
        )}

        {seccion === 'publicaciones' && <>
          {articulos.filter(a => a.estadoPublicacion === 'PENDIENTE').length === 0 && (
              <div className="card" style={{ textAlign: 'center', color: '#666' }}>
                No hay publicaciones pendientes de revisión.
              </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
            {articulos.filter(a => a.estadoPublicacion === 'PENDIENTE').map(art => (
                <div className="card" key={art.idArticulo} style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <img
                      src={art.urlImagen}
                      alt={art.tituloArticulo}
                      style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: '8px', backgroundColor: '#f1f5f9' }}
                      onError={e => { e.target.src = 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500'; }}
                  />
                  <p style={{ margin: 0, fontWeight: 700, fontSize: '0.88rem', color: '#1f3b57' }}>{art.tituloArticulo}</p>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: '#666', lineHeight: 1.4,
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {art.descripcionDetallada}
                  </p>
                  <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                    <button className="btn" style={{ flex: 1, fontSize: '0.78rem', padding: '6px 0' }} onClick={() => aprobar(art.idArticulo)}>
                      ✓ Aprobar
                    </button>
                    <button className="btn btn-danger" style={{ flex: 1, fontSize: '0.78rem', padding: '6px 0' }} onClick={() => abrirRechazo(art)}>
                      ✕ Rechazar
                    </button>
                  </div>
                </div>
            ))}
          </div>
        </>}

        {seccion === 'usuarios' && (
            <div>
              {usuarios.length === 0 && (
                  <div className="card" style={{ textAlign: 'center', color: '#666' }}>
                    No hay usuarios registrados o no se pudo conectar con el servidor.
                  </div>
              )}
              {usuarios.map(u => (
                  <div className="card" key={u.idUsuario} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', padding: '15px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <h4 style={{ margin: '0 0 5px 0', color: '#1f3b57' }}>{u.nombreCompleto || u.nombre}</h4>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#555' }}><strong>Correo:</strong> {u.correoElectronico || u.correo}</p>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <span style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: '6px', backgroundColor: u.rol === 'ADMIN' ? '#e3f2fd' : '#f5f5f5', color: u.rol === 'ADMIN' ? '#1565c0' : '#666', fontWeight: 'bold' }}>
                    Rol: {u.rol || 'USER'}
                  </span>
                        {!u.cuentaActiva && (
                            <span style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: '6px', backgroundColor: '#ffebee', color: '#c62828', fontWeight: 'bold' }}>
                      Inactivo (Sin validar)
                    </span>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <button
                          className="btn btn-danger"
                          onClick={() => confirmarEliminarUsuario(u.idUsuario)}
                          disabled={u.rol === 'ADMIN'}
                          style={{ opacity: u.rol === 'ADMIN' ? 0.5 : 1, cursor: u.rol === 'ADMIN' ? 'not-allowed' : 'pointer', margin: 0 }}
                          title={u.rol === 'ADMIN' ? 'No puedes eliminar a un administrador' : 'Eliminar usuario'}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
              ))}
            </div>
        )}

        {seccion === 'reportes' && (
            <div>
              {reportes.length === 0 && (
                  <div className="card" style={{ textAlign: 'center', color: '#666' }}>
                    No hay reportes de abuso pendientes.
                  </div>
              )}
              {reportes.map(r => (
                  <div className="card" key={r.idReporte} style={{ marginBottom: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ margin: '0 0 10px 0', color: '#c62828' }}>Reporte de abuso en chat</h4>
                      <span style={{ fontSize: '0.8rem', color: '#888' }}>
                         {new Date(r.fecha).toLocaleDateString()}
                      </span>
                    </div>
                    <div style={{ backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '6px', marginBottom: '10px' }}>
                      <p style={{ margin: '0 0 5px 0' }}><strong>Acusado:</strong> {r.nombreReportado}</p>
                      <p style={{ margin: '0 0 5px 0' }}><strong>Reportante:</strong> {r.nombreReportante}</p>
                      <p style={{ margin: '10px 0 0 0', color: '#333' }}><strong>Motivo dado:</strong> {r.motivo}</p>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                      <button className="btn btn-danger" onClick={() => eliminarUsuarioReportado(r.idReportado, r.idReporte)}>
                        Borrar cuenta del acusado
                      </button>
                      <button className="btn" style={{ backgroundColor: '#757575' }} onClick={() => ignorarReporte(r.idReporte)}>
                        Ignorar Reporte
                      </button>
                    </div>
                  </div>
              ))}
            </div>
        )}

        {motivoModal && (
            <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
              <div className="card" style={{ maxWidth: '420px', width: '90%' }}>
                <h3 style={{ marginTop: 0, color: '#c62828' }}>
                  {motivoModal.accion === 'eliminar' ? 'Eliminar publicación' : 'Rechazar publicación'}
                </h3>
                <p style={{ color: '#555' }}>
                  <strong>{motivoModal.tituloArticulo}</strong> – escribe el motivo que recibirá el usuario:
                </p>
                <div className="form-group">
              <textarea
                  rows="3"
                  value={motivoTexto}
                  onChange={e => setMotivoTexto(e.target.value)}
                  placeholder="Ej: La imagen no corresponde al artículo descrito."
                  style={{ width: '100%' }}
              />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="btn btn-danger" style={{ flex: 1 }}
                          onClick={motivoModal.accion === 'eliminar' ? confirmarEliminar : confirmarRechazo}
                          disabled={!motivoTexto.trim()}
                  >
                    Confirmar
                  </button>
                  <button className="btn" style={{ flex: 1, backgroundColor: '#666' }} onClick={() => setMotivoModal(null)}>
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
}