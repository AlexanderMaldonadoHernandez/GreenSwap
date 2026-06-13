import { useState, useEffect } from 'react';

export default function CatalogoMapa() {
  const [articulos, setArticulos] = useState([]);
  const [cat, setCat] = useState('');
  const [proximidad, setProximidad] = useState(false);
  const [cargando, setCargando] = useState(true);

  // Coordenadas fijas del campus IPN Zacatenco (RF5)
  const LAT_ZACATENCO = 19.5046;
  const LNG_ZACATENCO = -99.1467;

  useEffect(() => {
    let url = 'http://localhost:8080/api/articulos';
    if (proximidad) {
      url = `http://localhost:8080/api/articulos/cercanos?lat=${LAT_ZACATENCO}&lng=${LNG_ZACATENCO}&radio=5.0`;
    } else if (cat) {
      url += `?categoriaId=${cat}`;
    }

    setCargando(true);
    fetch(url)
      .then(res => res.json())
      .then(data => { setArticulos(data); setCargando(false); })
      .catch(() => setCargando(false));
  }, [cat, proximidad]);

  return (
    <div className="container">
      <div className="card" style={{ backgroundColor: '#e8f5e9', marginBottom: '2rem', border: '1px solid #c8e6c9' }}>
        <h3 style={{ color: '#2e7d32', margin: '0 0 5px 0' }}>🗺️ Radar Geográfico (Zona Zacatenco)</h3>
        <p style={{ fontSize: '0.9rem', margin: '0 0 10px 0', color: '#555' }}>Filtra las publicaciones en tiempo real por proximidad física.</p>
        <label style={{ fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <input type="checkbox" checked={proximidad} onChange={e => { setProximidad(e.target.checked); setCat(''); }} /> 
          Mostrar solo artículos a menos de 5 km de ESCOM / IPN
        </label>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <h2>Artículos domésticos disponibles</h2>
        <div style={{ width: '220px' }} className="form-group">
          <select value={cat} onChange={e => { setCat(e.target.value); setProximidad(false); }}>
            <option value="">Todas las categorías</option>
            <option value="1">Electrodomésticos</option>
            <option value="2">Muebles</option>
            <option value="3">Deportes</option>
            <option value="4">Cocina</option>
            <option value="5">Decoración</option>
          </select>
        </div>
      </div>

      {cargando ? <p>Cargando inventario...</p> : (
        <div className="card-grid">
          {articulos.map(art => (
            <div className="card" key={art.idArticulo}>
              <div>
                <img src={art.urlImagen || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500'} alt="" />
                <h3 style={{ margin: '10px 0 5px 0', fontSize: '1.2rem' }}>{art.tituloArticulo}</h3>
                <span style={{ fontSize: '0.75rem', padding: '2px 6px', background: '#e2e8f0', borderRadius: '4px', fontWeight: 'bold' }}>{art.estadoConservacion}</span>
                <p style={{ fontSize: '0.9rem', color: '#666', margin: '8px 0' }}>{art.descripcionDetallada}</p>
              </div>
              <button className="btn" onClick={() => alert('¡Solicitud enviada! El propietario se pondrá en contacto contigo pronto, bro.')}>Me Interesa</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
