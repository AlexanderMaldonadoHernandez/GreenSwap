import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function RecuperarPassword() {
    const navigate = useNavigate();

    const [paso, setPaso] = useState(1); // Paso 1: Pedir correo. Paso 2: Pedir código y nueva clave
    const [correo, setCorreo] = useState('');
    const [codigo, setCodigo] = useState('');
    const [nuevaPassword, setNuevaPassword] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);

    // Paso 1: Enviar correo al Backend
    const solicitarCodigo = (e) => {
        e.preventDefault();
        setMensaje(''); setError(''); setCargando(true);

        fetch('http://localhost:8080/api/auth/solicitar-recuperacion', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ correoElectronico: correo })
        })
            .then(res => res.json())
            .then(data => {
                setMensaje('Código enviado con éxito. Revisa tu bandeja de entrada o SPAM.');
                setPaso(2); // Pasamos al siguiente formulario
            })
            .catch(() => setError('Error de conexión al servidor.'))
            .finally(() => setCargando(false));
    };

    // Paso 2: Validar código y cambiar clave
    const cambiarPassword = (e) => {
        e.preventDefault();
        setMensaje(''); setError(''); setCargando(true);

        fetch('http://localhost:8080/api/auth/restablecer-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ correoElectronico: correo, codigo: codigo, nuevaPassword: nuevaPassword })
        })
            .then(async res => {
                if (!res.ok) throw new Error((await res.json()).mensaje || 'Error al restablecer');
                return res.json();
            })
            .then(data => {
                setMensaje('¡Contraseña cambiada con éxito! Redirigiendo al login...');
                setTimeout(() => navigate('/login'), 3000); // Lo mandamos de regreso
            })
            .catch(err => setError(err.message))
            .finally(() => setCargando(false));
    };

    return (
        <div className="container" style={{ maxWidth: '400px', marginTop: '4rem' }}>
            <div className="card">
                <h2 style={{ textAlign: 'center', color: '#2e7d32', marginTop: 0 }}>Recuperar Contraseña</h2>

                {error && <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '5px', marginBottom: '15px', textAlign: 'center', fontSize: '0.9rem' }}>{error}</div>}
                {mensaje && <div style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '10px', borderRadius: '5px', marginBottom: '15px', textAlign: 'center', fontSize: '0.9rem' }}>{mensaje}</div>}

                {paso === 1 ? (
                    <form onSubmit={solicitarCodigo}>
                        <p style={{ fontSize: '0.9rem', color: '#555', marginBottom: '1rem' }}>Ingresa tu correo y te enviaremos una clave de 6 dígitos para validar tu identidad.</p>
                        <div className="form-group">
                            <label>Correo Registrado:</label>
                            <input type="email" value={correo} onChange={e => setCorreo(e.target.value)} required />
                        </div>
                        <button type="submit" className="btn" style={{ width: '100%', marginTop: '1rem' }} disabled={cargando}>
                            {cargando ? 'Enviando...' : 'Enviar código'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={cambiarPassword}>
                        <p style={{ fontSize: '0.9rem', color: '#555', marginBottom: '1rem' }}>Ingresa el código que recibiste en <strong>{correo}</strong> y tu nueva contraseña.</p>
                        <div className="form-group">
                            <label>Código de 6 dígitos:</label>
                            <input type="text" maxLength="6" value={codigo} onChange={e => setCodigo(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label>Nueva Contraseña:</label>
                            <input type="password" value={nuevaPassword} onChange={e => setNuevaPassword(e.target.value)} required minLength="6" />
                        </div>
                        <button type="submit" className="btn" style={{ width: '100%', marginTop: '1rem' }} disabled={cargando}>
                            {cargando ? 'Validando...' : 'Cambiar Contraseña'}
                        </button>
                    </form>
                )}

                <p style={{ textAlign: 'center', fontSize: '0.9rem', marginTop: '1.2rem' }}>
                    <Link to="/login">Volver al inicio de sesión</Link>
                </p>
            </div>
        </div>
    );
}