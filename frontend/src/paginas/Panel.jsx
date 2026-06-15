import { useState, useEffect, useCallback } from 'react';
import Chat from '../components/Chat';

export default function Panel({ usuario }) {
  const [tab, setTab] = useState('publicaciones');
  const [misArticulos, setMisArticulos] = useState([]);
  const [compras, setCompras] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [desc, setDesc] = useState('');
  const [estado, setEstado] = useState('Nuevo');
  const [cat, setCat] = useState('1');
  const [imgUrl, setImgUrl] = useState('');
  const [subiendoImagen, setSubiendoImagen] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  // Intenta tomar el usuario desde props o desde localStorage
  const usuarioStorage = JSON.parse(localStorage.getItem('usuario') || 'null');
  const usuarioActual = usuario || usuarioStorage;

  // Busca el ID aunque venga con otro nombre
  const usuarioId =
    usuarioActual?.idUsuario ||
    usuarioActual?.id ||
    usuarioActual?.id_usuario ||
    usuarioActual?.usuario?.idUsuario ||
    usuarioActual?.usuario?.id;

  const cargarMisArticulos = () => {
    if (!usuarioId) {
      console.warn('No se encontró el ID del usuario:', usuarioActual);
      return;
    }

    fetch(`http://localhost:8080/api/articulos/usuario/${usuarioId}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Error al cargar artículos del usuario');
        }
        return res.json();
      })
      .then(data => setMisArticulos(data))
      .catch(error => console.error(error));
  };

  const cargarCompras = () => {
    if (!usuarioId) return;
    fetch(`http://localhost:8080/api/solicitudes/compras/${usuarioId}`)
      .then(r => r.json()).then(setCompras).catch(() => {});
  };

  const cargarVentas = () => {
    if (!usuarioId) return;
    fetch(`http://localhost:8080/api/solicitudes/ventas/${usuarioId}`)
      .then(r => r.json()).then(setVentas).catch(() => {});
  };

  const responderVenta = (idSolicitud, accion) => {
    fetch(`http://localhost:8080/api/solicitudes/${idSolicitud}/${accion}`, { method: 'PUT' })
      .then(() => { cargarVentas(); cargarCompras(); });
  };

  useEffect(() => {
    cargarMisArticulos();
    cargarCompras();
    cargarVentas();
  }, [usuarioId]);

  const handlePublicar = (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    if (!usuarioId) {
      setError('No se encontró el usuario. Cierra sesión e inicia sesión otra vez.');
      return;
    }

    const nuevo = {
      tituloArticulo: titulo,
      descripcionDetallada: desc,
      estadoConservacion: estado,
      idCategoria: parseInt(cat),
      urlImagen: imgUrl || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500',
      idUsuarioPropietario: usuarioId,
      latitudUbicacion: 19.5046 + (Math.random() - 0.5) * 0.01,
      longitudUbicacion: -99.1467 + (Math.random() - 0.5) * 0.01
    };

    fetch('http://localhost:8080/api/articulos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevo)
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('El artículo no se pudo guardar');
        }
        return res.json();
      })
      .then(() => {
        setMensaje('¡Artículo publicado con éxito!');
        setTitulo('');
        setDesc('');
        setImgUrl('');
        cargarMisArticulos();
      })
      .catch(error => {
        console.error(error);
        setError('No se pudo publicar el artículo. Verifica que la URL de la imagen sea válida e inténtalo de nuevo.');
      });
  };

  const handleEliminar = (id) => {
    if (!window.confirm('¿Seguro que deseas dar de baja este artículo del catálogo?')) return;
    fetch(`http://localhost:8080/api/articulos/${id}?idUsuario=${usuarioId}`, { method: 'DELETE' })
      .then(res => {
        if (!res.ok) throw new Error();
        cargarMisArticulos();
      })
      .catch(() => setError('No se pudo eliminar el artículo.'));
  };

  return (
    <div className="container" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
      <div className="card" style={{ flex: '1', minWidth: '300px' }}>
        <h2 style={{ color: '#2e7d32', marginTop: 0 }}>Publicar un Artículo</h2>

        {!usuarioId && (
          <p style={{ color: 'red', fontWeight: 'bold' }}>
            No se encontró el ID del usuario. Cierra sesión e inicia sesión otra vez.
          </p>
        )}

        {mensaje && (
          <div style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '10px', borderRadius: '5px', marginBottom: '15px', textAlign: 'center', fontSize: '0.9rem' }}>
            {mensaje}
          </div>
        )}

        {error && (
          <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '5px', marginBottom: '15px', textAlign: 'center', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handlePublicar}>
          <div className="form-group">
            <label>Título:</label>
            <input type="text" value={titulo} onChange={e => setTitulo(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Categoría:</label>
            <select value={cat} onChange={e => setCat(e.target.value)}>
              <option value="1">Electrodomésticos</option>
              <option value="2">Muebles</option>
              <option value="3">Deportes</option>
              <option value="4">Cocina</option>
              <option value="5">Decoración</option>
            </select>
          </div>

          <div className="form-group">
            <label>Estado Físico:</label>
            <select value={estado} onChange={e => setEstado(e.target.value)}>
              <option value="Nuevo">Nuevo</option>
              <option value="Usado">Usado</option>
            </select>
          </div>

          <div className="form-group">
            <label>Foto del artículo (JPG o PNG):</label>
            <input
              type="file"
              accept="image/jpeg,image/png"
              onChange={async e => {
                const archivo = e.target.files[0];
                if (!archivo) return;
                setSubiendoImagen(true);
                const form = new FormData();
                form.append('archivo', archivo);
                try {
                  const res = await fetch('http://localhost:8080/api/upload', { method: 'POST', body: form });
                  const data = await res.json();
                  if (data.url) {
                    setImgUrl(data.url);
                    setMensaje('Imagen cargada correctamente.');
                  } else {
                    setError(data.mensaje || 'Error al subir la imagen.');
                  }
                } catch {
                  setError('No se pudo subir la imagen.');
                } finally {
                  setSubiendoImagen(false);
                }
              }}
            />
            {subiendoImagen && <small style={{ color: '#666' }}>Subiendo imagen...</small>}
            {imgUrl && (
              <img src={imgUrl} alt="Vista previa" style={{ marginTop: '8px', width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px' }} />
            )}
          </div>

          <div className="form-group">
            <label>Descripción:</label>
            <textarea rows="3" value={desc} onChange={e => setDesc(e.target.value)} required />
          </div>

          <button type="submit" className="btn">Subir al Inventario</button>
        </form>
      </div>

      <div style={{ flex: '2', minWidth: '350px' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem', borderBottom: '2px solid #e0e0e0', paddingBottom: '0' }}>
          {[
            { key: 'publicaciones', label: `Mis Publicaciones (${misArticulos.length})` },
            { key: 'compras', label: `Historial de Compras (${compras.length})` },
            { key: 'ventas', label: `Historial de Ventas (${ventas.length})` },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: '8px 12px',
                fontWeight: tab === t.key ? 'bold' : 'normal',
                color: tab === t.key ? '#2e7d32' : '#666',
                borderBottom: tab === t.key ? '3px solid #2e7d32' : '3px solid transparent',
                fontSize: '0.95rem'
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'compras' && (
          <div>
            {compras.length === 0 && <p style={{ color: '#666' }}>No has enviado solicitudes aún.</p>}
            {compras.map(s => {
              const config = {
                PENDIENTE:  { color: '#f57f17', bg: '#fff8e1', label: 'Esperando respuesta del vendedor' },
                ACEPTADA:   { color: '#1565c0', bg: '#e3f2fd', label: 'Aceptada — en camino' },
                ENTREGADO:  { color: '#6a1b9a', bg: '#f3e5f5', label: 'Entregado — confirma que lo recibiste' },
                COMPLETADA: { color: '#2e7d32', bg: '#e8f5e9', label: 'Intercambio completado' },
                RECHAZADA:  { color: '#c62828', bg: '#ffebee', label: 'Solicitud rechazada' },
              };
              const c = config[s.estado] || config.PENDIENTE;
              return (
                <div className="card" key={s.idSolicitud} style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <strong>{s.tituloArticulo}</strong>
                      <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: '#666' }}>
                        {new Date(s.fecha).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <span style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: '6px', backgroundColor: c.bg, color: c.color, fontWeight: 'bold', whiteSpace: 'nowrap', marginLeft: '10px' }}>
                      {c.label}
                    </span>
                  </div>
                  {s.estado === 'ENTREGADO' && (
                    <button className="btn" style={{ width: '100%', marginTop: '10px' }} onClick={() => responderVenta(s.idSolicitud, 'recibido')}>
                      Confirmar que lo recibí
                    </button>
                  )}
                  {['ACEPTADA', 'ENTREGADO', 'COMPLETADA'].includes(s.estado) && (
                    <div style={{ marginTop: '12px' }}>
                      <Chat
                        tipo="INTERCAMBIO"
                        idReferencia={s.idSolicitud}
                        idUsuarioActual={usuarioId}
                        titulo={`Chat — ${s.tituloArticulo}`}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {tab === 'ventas' && (
          <div>
            {ventas.length === 0 && <p style={{ color: '#666' }}>No has recibido solicitudes aún.</p>}
            {ventas.map(s => {
              const config = {
                PENDIENTE:  { color: '#f57f17', bg: '#fff8e1', label: 'Pendiente' },
                ACEPTADA:   { color: '#1565c0', bg: '#e3f2fd', label: 'Aceptada' },
                ENTREGADO:  { color: '#6a1b9a', bg: '#f3e5f5', label: 'Entregado' },
                COMPLETADA: { color: '#2e7d32', bg: '#e8f5e9', label: 'Completada' },
                RECHAZADA:  { color: '#c62828', bg: '#ffebee', label: 'Rechazada' },
              };
              const c = config[s.estado] || config.PENDIENTE;
              return (
                <div className="card" key={s.idSolicitud} style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <strong>{s.tituloArticulo}</strong>
                      <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: '#666' }}>
                        {new Date(s.fecha).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <span style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: '6px', backgroundColor: c.bg, color: c.color, fontWeight: 'bold', marginLeft: '10px' }}>
                      {c.label}
                    </span>
                  </div>

                  {s.estado === 'PENDIENTE' && (
                    <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                      <button className="btn" style={{ flex: 1, fontSize: '0.85rem' }} onClick={() => responderVenta(s.idSolicitud, 'aceptar')}>
                        Aceptar solicitud
                      </button>
                      <button className="btn btn-danger" style={{ flex: 1, fontSize: '0.85rem' }} onClick={() => responderVenta(s.idSolicitud, 'rechazar')}>
                        Rechazar
                      </button>
                    </div>
                  )}

                  {s.estado === 'ACEPTADA' && (
                    <button className="btn" style={{ width: '100%', marginTop: '10px', backgroundColor: '#6a1b9a' }} onClick={() => responderVenta(s.idSolicitud, 'entregar')}>
                      Marcar como entregado
                    </button>
                  )}

                  {s.estado === 'ENTREGADO' && (
                    <p style={{ margin: '10px 0 0 0', fontSize: '0.85rem', color: '#6a1b9a', fontWeight: 'bold' }}>
                      Esperando confirmación del comprador...
                    </p>
                  )}

                  {s.estado === 'COMPLETADA' && (
                    <p style={{ margin: '10px 0 0 0', fontSize: '0.85rem', color: '#2e7d32', fontWeight: 'bold' }}>
                      ¡Intercambio completado exitosamente!
                    </p>
                  )}
                  {['ACEPTADA', 'ENTREGADO', 'COMPLETADA'].includes(s.estado) && (
                    <div style={{ marginTop: '12px' }}>
                      <Chat
                        tipo="INTERCAMBIO"
                        idReferencia={s.idSolicitud}
                        idUsuarioActual={usuarioId}
                        titulo={`Chat — ${s.tituloArticulo}`}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {tab === 'publicaciones' && (
        <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
          {misArticulos.map(art => {
            const colores = {
              PENDIENTE: { bg: '#fff8e1', color: '#f57f17', label: 'Pendiente' },
              APROBADO:  { bg: '#e8f5e9', color: '#2e7d32', label: 'Aprobado'  },
              RECHAZADO: { bg: '#ffebee', color: '#c62828', label: 'Rechazado' },
            };
            const est = colores[art.estadoPublicacion] || colores.PENDIENTE;
            return (
              <div className="card" key={art.idArticulo}>
                <img src={art.urlImagen} alt="" style={{ height: '110px', width: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                <h4 style={{ margin: '8px 0 4px 0' }}>{art.tituloArticulo}</h4>
                <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '6px', backgroundColor: est.bg, color: est.color, fontWeight: 'bold', display: 'inline-block', marginBottom: '6px' }}>
                  {est.label}
                </span>
                {art.estadoPublicacion === 'RECHAZADO' && art.motivoRechazo && (
                  <p style={{ fontSize: '0.8rem', color: '#c62828', margin: '0 0 8px 0' }}>
                    Motivo: {art.motivoRechazo}
                  </p>
                )}
                <button className="btn btn-danger" style={{ width: '100%' }} onClick={() => handleEliminar(art.idArticulo)}>
                  Eliminar
                </button>
              </div>
            );
          })}
        </div>
        )}
      </div>
    </div>
  );
}