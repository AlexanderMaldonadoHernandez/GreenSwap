import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login({ setUsuario}) {
  const navigate = useNavigate();

  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Estado para manejar errores sin usar alert()

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); // Limpiamos errores previos al intentar de nuevo

    fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correoElectronico: correo, passwordHash: password })
    })
        .then(async res => {
          if(!res.ok) {
            // Intentamos leer el mensaje de error que manda Spring Boot
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.mensaje || 'Credenciales de acceso incorrectas.');
          }
          return res.json();
        })
        .then(data => {
          // El backend ahora devuelve: { token: "...", usuario: { nombre: "...", correo: "..." } }

          // 1. Guardamos el token JWT para futuras peticiones autorizadas
          localStorage.setItem('greenswap_token', data.token);

          // 2. Guardamos la información del usuario en localStorage
          localStorage.setItem('usuario', JSON.stringify(data.usuario));

          // 3. Actualizamos los estados de la aplicación
          setUsuario(data.usuario);
          navigate('/catalogo');
        })
        .catch((err) => {
          // Mostramos el error en la interfaz en lugar de un alert
          setError(err.message || 'Error de conexión. Inténtalo de nuevo.');
        });
  };

  return (
      <div className="container" style={{ maxWidth: '400px', marginTop: '4rem' }}>
        <div className="card">
          <h2 style={{ textAlign: 'center', color: '#2e7d32', marginTop: 0 }}>Iniciar Sesión</h2>

          {/* Renderizado condicional del mensaje de error */}
          {error && (
              <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '5px', marginBottom: '15px', textAlign: 'center', fontSize: '0.9rem' }}>
                {error}
              </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Correo Institucional o Personal:</label>
              <input type="email" value={correo} onChange={e => setCorreo(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Contraseña:</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn" style={{ width: '100%', marginTop: '1rem' }}>
              Iniciar Sesión
            </button>
          </form>

          <div style={{ marginTop: '1.5rem' }}>
            <p style={{ textAlign: 'center', fontSize: '0.9rem', margin: '0.5rem 0' }}>
              ¿No tienes cuenta? <Link to="/registro" style={{ color: '#2e7d32', fontWeight: 'bold' }}>Crea una aquí</Link>
            </p>
            <p style={{ textAlign: 'center', fontSize: '0.9rem', margin: '0.5rem 0' }}>
              ¿Olvidaste tu contraseña? <Link to="/recuperar" style={{ color: '#2e7d32', fontWeight: 'bold' }}>Recupérala aquí</Link>
            </p>
          </div>
        </div>
      </div>
  );
}