import React, { useState } from 'react';

public default function Registro({ setPantalla }) {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [tel, setTel] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:8080/api/auth/registro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombreCompleto: nombre, correoElectronico: correo, passwordHash: password, telefonoContacto: tel })
    })
    .then(res => {
      if(!res.ok) return res.text().then(t => { throw new Error(t) });
      return res.json();
    })
    .then(() => {
      alert('¡Cuenta de E-Block/GreenSwap creada con éxito!');
      setPantalla('login');
    })
    .catch(err => alert(err.message));
  };

  return (
    <div className="container" style={{ maxWidth: '450px', marginTop: '2rem' }}>
      <div className="card">
        <h2 style={{ textAlign: 'center', color: '#2e7d32', marginTop: 0 }}>Registro en la Plataforma</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre Completo:</label>
            <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Correo Electrónico:</label>
            <input type="email" value={correo} onChange={e => setCorreo(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Contraseña:</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Teléfono Celular:</label>
            <input type="text" value={tel} onChange={e => setTel(e.target.value)} placeholder="5512345678" />
          </div>
          <button type="submit" className="btn">Dar de alta cuenta</button>
        </form>
      </div>
    </div>
  );
}
