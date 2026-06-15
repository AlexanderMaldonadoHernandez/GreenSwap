import { useState, useEffect } from 'react';
import MapaArticulos from '../components/MapaArticulos';

export default function CatalogoMapa() {
  const [articulos, setArticulos] = useState([]);
  const [cat, setCat] = useState('');
  const [proximidad, setProximidad] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

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
    } else if (cat) {
      url += `?categoriaId=${cat}`;
    }

    setCargando(true);
    setError('');

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
  }, [cat, proximidad]);

  const manejarErrorImagen = (e) => {
    e.target.src = imagenDefault;
  };

  return (
    <div className="container">
      <MapaArticulos />

      <div
        className="card"
        style={{
          backgroundColor: '#e8f5e9',
          marginBottom: '2rem',
          border: '1px solid #c8e6c9'
        }}
      >
        <h3 style={{ color: '#2e7d32', margin: '0 0 5px 0' }}>
          🗺️ Radar Geográfico (Zona Zacatenco)
        </h3>

        <p style={{ fontSize: '0.9rem', margin: '0 0 10px 0', color: '#555' }}>
          Filtra las publicaciones en tiempo real por proximidad física.
        </p>

        <label
          style={{
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <input
            type="checkbox"
            checked={proximidad}
            onChange={e => {
              setProximidad(e.target.checked);
              setCat('');
            }}
          />
          Mostrar solo artículos a menos de 5 km de ESCOM / IPN
        </label>
      </div>

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

        <div style={{ width: '240px' }} className="form-group">
          <select
            value={cat}
            onChange={e => {
              setCat(e.target.value);
              setProximidad(false);
            }}
          >
            <option value="">Todas las categorías</option>
            <option value="1">Electrodomésticos</option>
            <option value="2">Muebles</option>
            <option value="3">Deportes</option>
            <option value="4">Cocina</option>
            <option value="5">Decoración</option>
          </select>
        </div>
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

                <p
                  style={{
                    fontSize: '0.95rem',
                    color: '#555',
                    margin: '12px 0',
                    lineHeight: '1.4'
                  }}
                >
                  {art.descripcionDetallada || 'Sin descripción disponible.'}
                </p>
              </div>

              <button
                className="btn"
                onClick={() =>
                  alert('¡Solicitud enviada! El propietario se pondrá en contacto contigo pronto.')
                }
              >
                Me interesa
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
