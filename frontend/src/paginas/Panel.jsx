import React, { useState, useEffect } from 'react';

public default function Panel({ usuario }) {
  const [misArticulos, setMisArticulos] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [desc, setDesc] = useState('');
  const [estado, setEstado] = useState('Nuevo');
  const [cat, setCat] = useState('1');
  const [imgUrl, setImgUrl] = useState('');

  const cargarMisArticulos = () => {
    fetch(`http://localhost:8080/api/articulos/usuario/${usuario.idUsuario}`)
      .then(res => res.json())
      .then(data => setMisArticulos(data));
  };

  useEffect(() => { cargarMisArticulos(); }, []);

  const handlePublicar = (e) => {
    e.preventDefault();
    const nuevo = {
      tituloArticulo: titulo,
      descripcionDetallada: desc,
      estadoConservacion: estado,
      idCategoria: parseInt(cat),
      urlImagen: imgUrl || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500',
      idUsuarioPropietario: usuario.idUsuario,
      // Georreferenciación simulada en el área de Zacatenco
      latitudUbicacion: 19.5046 + (Math.random() - 0.5) * 0.01,
      longitudUbicacion: -99.1467 + (Math.random() - 0.5) * 0.01
    };

    fetch('http://localhost:8080/api/articulos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevo)
    })
    .then(() => {
      alert('¡Artículo guardado en la base de datos de GreenSwap!');
      setTitulo(''); setDesc(''); setImgUrl('');
      cargarMisArticulos();
    });
  };

  const handleEliminar = (id) => {
    if(confirm('¿Seguro que deseas dar de baja este artículo del catálogo?')) {
      fetch(`http://localhost:8080/api/articulos/${id}`, { method: 'DELETE' })
        .then(() => cargarMisArticulos());
    }
  };

  return (
    <div className="container" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
      <div className="card" style={{ flex: '1', minWidth: '300px' }}>
        <h2 style={{ color: '#2e7d32', marginTop: 0 }}>🎁 Publicar un Artículo</h2>
        <form onSubmit={handlePublicar}>
          <div className="form-group"><label>Título:</label><input type="text" value={titulo} onChange={e => setTitulo(e.target.value)} required /></div>
          <div className="form-group">
            <label>Categoría:</label>
            <select value={cat} onChange={e => setCat(e.target.value)}>
              <option value="1">Electrodomésticos</option><option value="2">Muebles</option><option value="3">Deportes</option><option value="4">Cocina</option><option value="5">Decoración</option>
            </select>
          </div>
          <div className="form-group">
            <label>Estado Físico:</label>
            <select value={estado} onChange={e => setEstado(e.target.value)}>
              <option value="Nuevo">Nuevo</option><option value="Usado">Usado</option>
            </select>
          </div>
          <div className="form-group"><label>URL de Foto:</label><input type="text" value={imgUrl} onChange={e => setImgUrl(e.target.value)} placeholder="https://..." /></div>
          <div className="form-group"><label>Descripción:</label><textarea rows="3" value={desc} onChange={e => setDesc(e.target.value)} required></textarea></div>
          <button type="submit" className="btn">Subir al Inventario</button>
        </form>
      </div>

      <div style={{ flex: '2', minWidth: '350px' }}>
        <h2>Mis Publicaciones Activas ({misArticulos.length})</h2>
        <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
          {misArticulos.map(art => (
            <div className="card" key={art.idArticulo}>
              <img src={art.urlImagen} alt="" style={{ height: '110px' }} />
              <h4 style={{ margin: '8px 0 12px 0' }}>{art.tituloArticulo}</h4>
              <button className="btn btn-danger" onClick={() => handleEliminar(art.idArticulo)}>Eliminar</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
