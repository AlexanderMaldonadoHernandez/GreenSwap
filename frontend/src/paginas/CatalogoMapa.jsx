import { useState, useEffect } from 'react';
import MapaArticulos from '../components/MapaArticulos';

export default function CatalogoMapa() {
  const [articulos, setArticulos] = useState([]);
  const [cat, setCat] = useState('');
  const [proximidad, setProximidad] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [busquedaActiva, setBusquedaActiva] = useState('');
  const [mapaVisible, setMapaVisible] = useState(true);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [mensajeSolicitud, setMensajeSolicitud] = useState('');
  const [infoVendedores, setInfoVendedores] = useState({});

  const usuario = (() => { try { return JSON.parse(localStorage.getItem('usuario')); } catch { return null; } })();

  // Coordenadas fijas del campus IPN Zacatenco
  const LAT_ZACATENCO = 19.5046;
  const LNG_ZACATENCO = -99.1467;

  const imagenDefault =
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80';

  const categorias = {
    1: 'Electrodomésticos',
    2: 'Muebles',
    3: 'Deportes',
    4: 'Cocina',
    5: 'Decoración'
  };

  useEffect(() => {
    let url = 'http://localhost:8080/api/articulos';
    if (proximidad) {
      url = `http://localhost:8080/api/articulos/cercanos?lat=${LAT_ZACATENCO}&lng=${LNG_ZACATENCO}&radio=5.0`;
    } else if (busquedaActiva) {
      url += `?busqueda=${encodeURIComponent(busquedaActiva)}`;
    } else if (cat) {
      url += `?categoriaId=${cat}`;
    }

    setCargando(true);
    setError('');

    // La obtención del catálogo de artículos es pública, no requiere token
    fetch(url)
        .then(res => {
          if (!res.ok) {
            throw new Error('No se pudo cargar el catálogo.');
          }
          return res.json();
        })
        .then(data => {
          if (Array.isArray(data)) {
            setArticulos(data);
          } else {
            setArticulos([]);
          }
        })
        .catch(err => {
          console.error(err);
          setError('No se pudo cargar el inventario. Revisa que el backend esté encendido.');
          setArticulos([]);
        })
        .finally(() => {
          setCargando(false);
        });
  }, [cat, proximidad, busquedaActiva]);

  useEffect(() => {
    const idsUnicos = [...new Set(articulos.map(a => a.idUsuarioPropietario).filter(Boolean))];
    idsUnicos.forEach(id => {
      if (infoVendedores[id]) return;
      fetch(`http://localhost:8080/api/usuarios/${id}/calificacion`)
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (data) setInfoVendedores(prev => ({ ...prev, [id]: data }));
        })
        .catch(() => {});
    });
  }, [articulos]);

  const manejarErrorImagen = (e) => {
    e.target.src = imagenDefault;
  };

  const handleMeInteresa = (art) => {
    if (!usuario) {
      setMensajeSolicitud('Debes iniciar sesión para solicitar un artículo.');
      return;
    }

    const token = localStorage.getItem('greenswap_token');

    fetch('http://localhost:8080/api/solicitudes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ idArticulo: art.idArticulo, idUsuarioSolicitante: usuario.idUsuario })
    })
        .then(r => r.json())
        .then(data => {
          if (data.mensaje) {
            setMensajeSolicitud(data.mensaje);
          } else {
            setMensajeSolicitud(`Solicitud enviada para "${art.tituloArticulo}". El propietario se pondrá en contacto contigo.`);
          }
        })
        .catch(() => setMensajeSolicitud('No se pudo enviar la solicitud. Intenta de nuevo.'));
  };

  return (
      <div className="container">
          {mensajeSolicitud && (
              <div style={{
                  position: 'fixed',
                  top: 0, left: 0, right: 0, bottom: 0,
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 9999
              }}>
                  <div className="card" style={{
                      width: '90%',
                      maxWidth: '400px',
                      backgroundColor: '#fff',
                      padding: '2rem',
                      borderRadius: '12px',
                      textAlign: 'center',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                  }}>
                      <div style={{ fontSize: '3rem', marginBottom: '10px' }}>
                          {mensajeSolicitud.includes('Debes iniciar sesión') || mensajeSolicitud.includes('Ya enviaste') || mensajeSolicitud.includes('No puedes solicitar') ? '⚠️' : '✅'}
                      </div>

                      <h3 style={{
                          color: mensajeSolicitud.includes('Debes iniciar sesión') || mensajeSolicitud.includes('Ya enviaste') || mensajeSolicitud.includes('No puedes solicitar') ? '#c62828' : '#2e7d32',
                          marginTop: 0
                      }}>
                          {mensajeSolicitud.includes('Debes iniciar sesión') || mensajeSolicitud.includes('Ya enviaste') || mensajeSolicitud.includes('No puedes solicitar') ? 'Aviso' : '¡Éxito!'}
                      </h3>

                      <p style={{ color: '#555', fontSize: '1.05rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                          {mensajeSolicitud}
                      </p>

                      <button
                          className="btn"
                          style={{
                              width: '100%',
                              fontSize: '1rem',
                              backgroundColor: mensajeSolicitud.includes('Debes iniciar sesión') || mensajeSolicitud.includes('Ya enviaste') || mensajeSolicitud.includes('No puedes solicitar') ? '#c62828' : '#2e7d32'
                          }}
                          onClick={() => setMensajeSolicitud('')}
                      >
                          Entendido
                      </button>
                  </div>
              </div>
          )}

        <div
            onClick={() => setMapaVisible(v => !v)}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', padding: '10px 14px', backgroundColor: '#f1f8f1', borderRadius: mapaVisible ? '10px 10px 0 0' : '10px', border: '1px solid #c8e6c9', marginBottom: mapaVisible ? '0' : '1rem', userSelect: 'none' }}
        >
          <span style={{ fontWeight: 'bold', color: '#2e7d32', fontSize: '0.95rem' }}>Mapa / Artículos cerca de ti</span>
          <span style={{ fontSize: '1.1rem', color: '#2e7d32', transition: 'transform 0.2s', display: 'inline-block', transform: mapaVisible ? 'rotate(0deg)' : 'rotate(-90deg)' }}>▼</span>
        </div>

        {mapaVisible && <MapaArticulos />}

        <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '10px',
              marginBottom: '1.5rem'
            }}
        >
          <div>
            <h2 style={{ marginBottom: '0.3rem' }}>
              Artículos domésticos disponibles
            </h2>
            <p style={{ margin: 0, color: '#666' }}>
              Explora artículos publicados por la comunidad GreenSwap.
            </p>
          </div>

          <form
              onSubmit={e => { e.preventDefault(); setBusquedaActiva(busqueda); setCat(''); setProximidad(false); }}
              style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
          >
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                  type="text"
                  value={busqueda}
                  onChange={e => { setBusqueda(e.target.value); if (!e.target.value) setBusquedaActiva(''); }}
                  placeholder="Buscar artículo..."
                  style={{ height: '38px', padding: '0 40px 0 12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '0.9rem', width: '220px', boxSizing: 'border-box' }}
              />
              <button type="submit" style={{
                position: 'absolute', right: '4px',
                height: '30px', width: '30px',
                background: '#2e7d32', border: 'none', borderRadius: '6px',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: 0
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </button>
            </div>

            <select
                value={cat}
                onChange={e => { setCat(e.target.value); setBusqueda(''); setBusquedaActiva(''); setProximidad(false); }}
                style={{ height: '38px', padding: '0 10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '0.9rem', backgroundColor: '#fff', cursor: 'pointer' }}
            >
              <option value="">Todas las categorías</option>
              <option value="1">Electrodomésticos</option>
              <option value="2">Muebles</option>
              <option value="3">Deportes</option>
              <option value="4">Cocina</option>
              <option value="5">Decoración</option>
            </select>
          </form>
        </div>

        {cargando && (
            <div className="card">
              <p style={{ margin: 0 }}>Cargando inventario...</p>
            </div>
        )}

        {!cargando && error && (
            <div
                className="card"
                style={{
                  backgroundColor: '#ffebee',
                  color: '#c62828',
                  border: '1px solid #ffcdd2'
                }}
            >
              <strong>{error}</strong>
            </div>
        )}

        {!cargando && !error && articulos.length === 0 && (
            <div className="card" style={{ textAlign: 'center' }}>
              <h3 style={{ color: '#2e7d32' }}>No hay artículos disponibles</h3>
              <p style={{ color: '#666' }}>
                Todavía no hay publicaciones en esta categoría o zona.
              </p>
            </div>
        )}

        {!cargando && !error && articulos.length > 0 && (
            <div className="card-grid">
              {articulos.map(art => (
                  <div
                      className="card"
                      key={art.idArticulo}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        overflow: 'hidden'
                      }}
                  >
                    <div>
                      <img
                          src={art.urlImagen || imagenDefault}
                          alt={art.tituloArticulo || 'Artículo disponible'}
                          onError={manejarErrorImagen}
                          style={{
                            width: '100%',
                            height: '190px',
                            objectFit: 'cover',
                            borderRadius: '10px',
                            marginBottom: '12px',
                            backgroundColor: '#f1f5f9'
                          }}
                      />
                      <h3
                          style={{
                            margin: '10px 0 6px 0',
                            fontSize: '1.25rem',
                            color: '#1f3b57'
                          }}
                      >
                        {art.tituloArticulo || 'Artículo sin título'}
                      </h3>

                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <span
                      style={{
                        fontSize: '0.75rem',
                        padding: '3px 8px',
                        background: '#e2e8f0',
                        borderRadius: '6px',
                        fontWeight: 'bold'
                      }}
                  >
                    {art.estadoConservacion || 'Sin estado'}
                  </span>
                        <span
                            style={{
                              fontSize: '0.75rem',
                              padding: '3px 8px',
                              background: '#dcfce7',
                              color: '#166534',
                              borderRadius: '6px',
                              fontWeight: 'bold'
                            }}
                        >
                    {categorias[art.idCategoria] || 'Categoría'}
                  </span>
                      </div>

                      <p style={{ fontSize: '0.95rem', color: '#555', margin: '12px 0', lineHeight: '1.4' }}>
                        {art.descripcionDetallada || 'Sin descripción disponible.'}
                      </p>

                      {infoVendedores[art.idUsuarioPropietario] && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 0', borderTop: '1px solid #f0f0f0', marginTop: '4px' }}>
                          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#2e7d32', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
                          </div>
                          <div>
                            <p style={{ margin: 0, fontSize: '0.78rem', fontWeight: 600, color: '#374151' }}>
                              {infoVendedores[art.idUsuarioPropietario].nombre}
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                              {[1,2,3,4,5].map(i => (
                                <span key={i} style={{ fontSize: '0.75rem', color: i <= Math.round(infoVendedores[art.idUsuarioPropietario].promedio) ? '#f59e0b' : '#d1d5db' }}>★</span>
                              ))}
                              <span style={{ fontSize: '0.72rem', color: '#9ca3af', marginLeft: '2px' }}>
                                ({infoVendedores[art.idUsuarioPropietario].total})
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <button className="btn" onClick={() => handleMeInteresa(art)}>
                      Me interesa
                    </button>
                  </div>
              ))}
            </div>
        )}
      </div>
  );
}