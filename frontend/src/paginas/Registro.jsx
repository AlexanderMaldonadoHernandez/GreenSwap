import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Registro() {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [mostrarTerminos, setMostrarTerminos] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (!aceptaTerminos) {
      setError('Debes aceptar los Términos y Condiciones para continuar.');
      return;
    }

    fetch('http://localhost:8080/api/auth/registro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombreCompleto: nombre,
        correoElectronico: correo,
        passwordHash: password
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
          navigate('/login');
        }, 2000);
      })
      .catch(err => {
        setError(err.message || 'Error de conexión. Inténtalo de nuevo.');
      });
  };

  return (
    <div className="fondo-dinamico">
      <div className="card" style={{ width: '100%', maxWidth: '450px' }}>
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

          {/* Checkbox de términos */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', margin: '1.2rem 0 0.5rem' }}>
            <input
              type="checkbox"
              id="terminos"
              checked={aceptaTerminos}
              onChange={e => setAceptaTerminos(e.target.checked)}
              disabled={!!success}
              style={{ marginTop: '3px', cursor: 'pointer', accentColor: '#2e7d32', width: '16px', height: '16px', flexShrink: 0 }}
            />
            <label htmlFor="terminos" style={{ fontSize: '0.85rem', color: '#374151', lineHeight: 1.5, cursor: 'pointer' }}>
              He leído y acepto los{' '}
              <span
                onClick={() => setMostrarTerminos(true)}
                style={{ color: '#2e7d32', fontWeight: 700, textDecoration: 'underline', cursor: 'pointer' }}
              >
                Términos y Condiciones
              </span>
              , incluyendo el uso de mi ubicación geográfica para mostrar artículos cercanos.
            </label>
          </div>

          <button
            type="submit"
            className="btn"
            style={{ width: '100%', marginTop: '1rem', opacity: aceptaTerminos ? 1 : 0.6 }}
            disabled={!!success}
          >
            {success ? 'Redirigiendo...' : 'Dar de alta cuenta'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.9rem', marginTop: '1.2rem' }}>
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
        </p>
      </div>

      {/* Modal de Términos y Condiciones */}
      {mostrarTerminos && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem'
        }}>
          <div style={{
            background: '#fff', borderRadius: '12px', padding: '2rem',
            maxWidth: '520px', width: '100%', maxHeight: '80vh',
            overflowY: 'auto', boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
          }}>
            <h3 style={{ color: '#2e7d32', marginTop: 0 }}>Términos y Condiciones de Uso — GreenSwap</h3>

            <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: '1.2rem' }}>Última actualización: Junio 2026</p>

            <h4 style={{ color: '#1f3b57', marginBottom: '6px' }}>1. Descripción del servicio</h4>
            <p style={{ fontSize: '0.88rem', color: '#374151', lineHeight: 1.6 }}>
              GreenSwap es una plataforma de intercambio de artículos domésticos en comunidad. Permite a los usuarios publicar, descubrir y solicitar artículos dentro de una zona geográfica cercana, fomentando el consumo responsable.
            </p>

            <h4 style={{ color: '#1f3b57', marginBottom: '6px' }}>2. Uso de ubicación geográfica</h4>
            <p style={{ fontSize: '0.88rem', color: '#374151', lineHeight: 1.6 }}>
              Al publicar un artículo, GreenSwap solicita acceso a tu ubicación GPS con el único fin de asociar el artículo a tu zona y permitir que otros usuarios cercanos lo encuentren. Tu ubicación <strong>no se comparte públicamente</strong> de forma exacta; únicamente se usa para calcular distancias aproximadas. Puedes denegar el permiso en cualquier momento desde la configuración de tu navegador.
            </p>

            <h4 style={{ color: '#1f3b57', marginBottom: '6px' }}>3. Responsabilidad del usuario</h4>
            <p style={{ fontSize: '0.88rem', color: '#374151', lineHeight: 1.6 }}>
              El usuario es responsable de la veracidad de la información que publica. GreenSwap no se hace responsable de disputas entre usuarios derivadas de los intercambios realizados fuera de la plataforma.
            </p>

            <h4 style={{ color: '#1f3b57', marginBottom: '6px' }}>4. Privacidad de datos</h4>
            <p style={{ fontSize: '0.88rem', color: '#374151', lineHeight: 1.6 }}>
              Los datos personales (nombre, correo electrónico, ubicación aproximada) son almacenados de forma segura y no serán vendidos ni compartidos con terceros. El correo se usa exclusivamente para autenticación y comunicaciones del servicio.
            </p>

            <h4 style={{ color: '#1f3b57', marginBottom: '6px' }}>5. Contenido prohibido</h4>
            <p style={{ fontSize: '0.88rem', color: '#374151', lineHeight: 1.6 }}>
              Queda prohibida la publicación de artículos ilegales, peligrosos, o que infrinjan derechos de terceros. GreenSwap se reserva el derecho de eliminar publicaciones que incumplan estas normas.
            </p>

            <h4 style={{ color: '#1f3b57', marginBottom: '6px' }}>6. Modificaciones</h4>
            <p style={{ fontSize: '0.88rem', color: '#374151', lineHeight: 1.6 }}>
              GreenSwap puede actualizar estos términos en cualquier momento. Los usuarios serán notificados por correo electrónico ante cambios significativos.
            </p>

            <div style={{ display: 'flex', gap: '10px', marginTop: '1.5rem' }}>
              <button
                className="btn"
                style={{ flex: 1 }}
                onClick={() => { setAceptaTerminos(true); setMostrarTerminos(false); }}
              >
                Acepto los términos
              </button>
              <button
                className="btn"
                style={{ flex: 1, backgroundColor: '#757575' }}
                onClick={() => setMostrarTerminos(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}