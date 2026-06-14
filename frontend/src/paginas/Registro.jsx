import { useState } from 'react';

export default function Registro({ setPantalla }) {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [tel, setTel] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const manejarTelefono = (e) => {
    // Elimina todo lo que no sea número
    const soloNumeros = e.target.value.replace(/\D/g, '');

    // Limita a 10 dígitos
    if (soloNumeros.length <= 10) {
      setTel(soloNumeros);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (tel.length !== 10) {
      setError('El teléfono celular debe tener exactamente 10 dígitos.');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    fetch('http://localhost:8080/api/auth/registro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombreCompleto: nombre,
        correoElectronico: correo,
        passwordHash: password,
        telefonoContacto: tel
      })
    })
      .then(async res => {
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.mensaje || 'Error al intentar registrar la cuenta.');
        }
        return res.json();
      })
      .then(data => {
        setSuccess(data.mensaje || '¡Cuenta de E-Block/GreenSwap creada con éxito!');

        setTimeout(() => {
          setPantalla('login');
        }, 2000);
      })
      .catch(err => {
        setError(err.message || 'Error de conexión. Inténtalo de nuevo.');
      });
  };

  return (
    <div className="container" style={{ maxWidth: '450px', marginTop: '2rem' }}>
      <div className="card">
        <h2 style={{ textAlign: 'center', color: '#2e7d32', marginTop: 0 }}>
          Registro en la Plataforma
        </h2>

        {error && (
          <div
            style={{
              backgroundColor: '#ffebee',
              color: '#c62828',
              padding: '10px',
              borderRadius: '5px',
              marginBottom: '15px',
              textAlign: 'center',
              fontSize: '0.9rem'
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            style={{
              backgroundColor: '#e8f5e9',
              color: '#2e7d32',
              padding: '10px',
              borderRadius: '5px',
              marginBottom: '15px',
              textAlign: 'center',
              fontSize: '0.9rem'
            }}
          >
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre Completo:</label>
            <input
              type="text"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              required
              disabled={!!success}
            />
          </div>

          <div className="form-group">
            <label>Correo Electrónico:</label>
            <input
              type="email"
              value={correo}
              onChange={e => setCorreo(e.target.value)}
              required
              disabled={!!success}
            />
          </div>

          <div className="form-group">
            <label>Contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              disabled={!!success}
              minLength="6"
            />
          </div>

          <div className="form-group">
            <label>Teléfono Celular:</label>
            <input
              type="tel"
              value={tel}
              onChange={manejarTelefono}
              placeholder="5512345678"
              maxLength="10"
              required
              disabled={!!success}
            />
            <small style={{ color: '#666' }}>
              Debe contener exactamente 10 dígitos.
            </small>
          </div>

          <button
            type="submit"
            className="btn"
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={!!success}
          >
            {success ? 'Redirigiendo...' : 'Dar de alta cuenta'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.9rem', marginTop: '1.2rem' }}>
          ¿Ya tienes cuenta?{' '}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setPantalla('login');
            }}
          >
            Inicia sesión aquí
          </a>
        </p>
      </div>
    </div>
  );
}