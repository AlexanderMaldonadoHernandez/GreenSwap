import React, { useState } from 'react';

public default function Login({ setUsuario, setPantalla }) {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correoElectronico: correo, passwordHash: password })
    })
    .then(res => {
      if(!res.ok) throw new Error();
      return res.json();
    })
    .then(data => {
      localStorage.setItem('usuario', JSON.stringify(data));
      setUsuario(data);
      setPantalla('catalogo');
    })
    .catch(() => alert('Credenciales de acceso incorrectas, bro. Inténtalo de nuevo.'));
  };

  return (
    <div className="container" style={{ maxWidth: '400px', marginTop: '4rem' }}>
      <div className="card">
        <h2 style={{ textAlign: 'center', color: '#2e7d32', marginTop: 0 }}>Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Correo Institucional o Personal:</label>
            <input type="email" value={correo} onChange={e => setCorreo(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Contraseña:</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn">Entrar al Sistema</button>
        </form>
        <p style={{ textAlign: 'center', fontSize: '0.9rem', marginTop: '1.2rem' }}>
          ¿No tienes cuenta? <a href="#" onClick={() => setPantalla('registro')}>Crea una aquí</a>
        </p>
      </div>
    </div>
  );
}
