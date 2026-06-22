import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Perfil({ usuario, setUsuario }) {
    const navigate = useNavigate();

    const idToUse = usuario?.idUsuario || usuario?.id_usuario || usuario?.id;

    const [editando, setEditando] = useState(false);
    const [nombre, setNombre] = useState(usuario?.nombre || usuario?.nombreCompleto || '');
    const [correo, setCorreo] = useState(usuario?.correo || usuario?.correoElectronico || '');

    const [mostrarModalPass, setMostrarModalPass] = useState(false);
    const [passActual, setPassActual] = useState('');
    const [passNueva, setPassNueva] = useState('');
    const [passConfirm, setPassConfirm] = useState('');
    const [errorPass, setErrorPass] = useState('');

    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);

    const handleGuardar = (e) => {
        e.preventDefault();
        setMensaje(''); setError(''); setCargando(true);

        if (!idToUse) {
            setError('Error interno: No se pudo localizar el ID del usuario.');
            setCargando(false);
            return;
        }

        fetch(`http://localhost:8080/api/usuarios/${idToUse}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('greenswap_token')}`
            },
            body: JSON.stringify({
                nombreCompleto: nombre,
                correoElectronico: correo
            })
        })
            .then(async res => {
                const data = await res.json().catch(() => ({}));
                if (!res.ok) throw new Error(data.mensaje || 'Error al actualizar el perfil. Verifica tus datos o tu conexión.');
                return data;
            })
            .then(data => {
                if (data.requiereReinicio) {
                    setMensaje(data.mensaje + ' Redirigiendo en 3 segundos...');
                    setEditando(false);

                    setTimeout(() => {
                        setUsuario(null);
                        localStorage.removeItem('usuario');
                        localStorage.removeItem('greenswap_token');
                        navigate('/login');
                    }, 3000);
                    return;
                }

                const usuarioActualizado = { ...usuario, nombre, correo };
                setUsuario(usuarioActualizado);
                localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));

                setMensaje('Perfil actualizado correctamente.');
                setEditando(false);
                setCargando(false);
            })
            .catch(err => {
                setError(err.message);
                setCargando(false);
            });
    };

    const handleCambiarPassword = (e) => {
        e.preventDefault();
        setErrorPass('');

        if (!idToUse) {
            setErrorPass('Error interno: No se pudo localizar el ID del usuario.');
            return;
        }

        if (passNueva !== passConfirm) {
            setErrorPass('La nueva contraseña y la confirmación no coinciden.');
            return;
        }

        if (passNueva.length < 6) {
            setErrorPass('La nueva contraseña debe tener al menos 6 caracteres.');
            return;
        }

        setCargando(true);

        fetch(`http://localhost:8080/api/usuarios/${idToUse}/password`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('greenswap_token')}`
            },
            body: JSON.stringify({
                passwordActual: passActual,
                nuevaPassword: passNueva
            })
        })
            .then(async res => {
                const data = await res.json().catch(() => ({}));
                if (!res.ok) throw new Error(data.mensaje || 'Error al cambiar la contraseña. Verifica tu contraseña actual.');
                return data;
            })
            .then(() => {
                setMensaje('Contraseña actualizada con éxito.');
                cerrarModalPass();
            })
            .catch(err => {
                setErrorPass(err.message);
            })
            .finally(() => {
                setCargando(false);
            });
    };

    const cerrarModalPass = () => {
        setMostrarModalPass(false);
        setPassActual('');
        setPassNueva('');
        setPassConfirm('');
        setErrorPass('');
    };

    const handleEliminar = () => {
        if (!idToUse) {
            setError('Error interno: No se pudo localizar el ID del usuario.');
            return;
        }

        const confirmar = window.confirm(
            "¿Estás completamente seguro de que deseas eliminar tu cuenta? Esta acción es irreversible y perderás todos tus artículos."
        );

        if (confirmar) {
            setCargando(true);
            fetch(`http://localhost:8080/api/usuarios/${idToUse}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('greenswap_token')}`
                }
            })
                .then(res => {
                    if (!res.ok) throw new Error('Error al eliminar la cuenta.');

                    setUsuario(null);
                    localStorage.removeItem('usuario');
                    localStorage.removeItem('greenswap_token');
                    navigate('/registro');
                })
                .catch(err => {
                    setError(err.message);
                    setCargando(false);
                });
        }
    };

    return (
        <div className="container" style={{ maxWidth: '500px', marginTop: '4rem', position: 'relative' }}>
            <div className="card">
                <h2 style={{ textAlign: 'center', color: '#2e7d32', marginTop: 0 }}>Mi Perfil</h2>

                {error && <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '5px', marginBottom: '15px', textAlign: 'center', fontSize: '0.9rem' }}>{error}</div>}
                {mensaje && <div style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '10px', borderRadius: '5px', marginBottom: '15px', textAlign: 'center', fontSize: '0.9rem' }}>{mensaje}</div>}

                <form onSubmit={handleGuardar}>
                    <div className="form-group">
                        <label>Nombre Completo:</label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={e => setNombre(e.target.value)}
                            disabled={!editando || cargando}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Correo Electrónico:</label>
                        <input
                            type="email"
                            value={correo}
                            onChange={e => setCorreo(e.target.value)}
                            disabled={!editando || cargando}
                            required
                        />
                    </div>

                    {editando ? (
                        <div style={{ display: 'flex', gap: '10px', marginTop: '1.5rem' }}>
                            <button key="btn-guardar" type="submit" className="btn" style={{ flex: 1 }} disabled={cargando}>
                                {cargando ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                            <button key="btn-cancelar" type="button" className="btn" style={{ flex: 1, backgroundColor: '#757575' }} onClick={() => {
                                setNombre(usuario?.nombre || usuario?.nombreCompleto || '');
                                setCorreo(usuario?.correo || usuario?.correoElectronico || '');
                                setError('');
                                setEditando(false);
                            }} disabled={cargando}>
                                Cancelar
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', gap: '10px', marginTop: '1.5rem' }}>
                            <button
                                key="btn-editar"
                                type="button"
                                className="btn"
                                style={{ flex: 1 }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setEditando(true);
                                }}
                                disabled={cargando}
                            >
                                Editar Perfil
                            </button>
                            <button
                                key="btn-pass"
                                type="button"
                                className="btn"
                                style={{ flex: 1, backgroundColor: '#1976d2' }}
                                onClick={() => setMostrarModalPass(true)}
                                disabled={cargando}
                            >
                                Cambiar Contraseña
                            </button>
                        </div>
                    )}
                </form>

                <hr style={{ margin: '2rem 0', borderColor: '#eee' }} />

                <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1rem' }}>
                        Zona de peligro. Al eliminar tu cuenta, todos tus datos y artículos asociados serán borrados del sistema.
                    </p>
                    <button
                        type="button"
                        className="btn"
                        style={{ backgroundColor: '#c62828', width: '100%' }}
                        onClick={handleEliminar}
                        disabled={cargando}
                    >
                        {cargando ? 'Procesando...' : 'Eliminar Cuenta Permanentemente'}
                    </button>
                </div>
            </div>

            {/* POP-UP Modal para Cambiar Contraseña */}
            {mostrarModalPass && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div className="card" style={{ width: '90%', maxWidth: '400px', backgroundColor: '#fff', padding: '2rem', borderRadius: '8px' }}>
                        <h3 style={{ color: '#2e7d32', marginTop: 0, textAlign: 'center' }}>Actualizar Contraseña</h3>

                        {errorPass && <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '5px', marginBottom: '15px', textAlign: 'center', fontSize: '0.85rem' }}>{errorPass}</div>}

                        <form onSubmit={handleCambiarPassword}>
                            <div className="form-group">
                                <label>Contraseña Actual:</label>
                                <input
                                    type="password"
                                    value={passActual}
                                    onChange={e => setPassActual(e.target.value)}
                                    required
                                    disabled={cargando}
                                />
                            </div>
                            <div className="form-group">
                                <label>Nueva Contraseña:</label>
                                <input
                                    type="password"
                                    value={passNueva}
                                    onChange={e => setPassNueva(e.target.value)}
                                    required
                                    disabled={cargando}
                                    minLength="6"
                                />
                            </div>
                            <div className="form-group">
                                <label>Confirmar Nueva Contraseña:</label>
                                <input
                                    type="password"
                                    value={passConfirm}
                                    onChange={e => setPassConfirm(e.target.value)}
                                    required
                                    disabled={cargando}
                                    minLength="6"
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '10px', marginTop: '1.5rem' }}>
                                <button type="submit" className="btn" style={{ flex: 1 }} disabled={cargando}>
                                    {cargando ? 'Validando...' : 'Confirmar'}
                                </button>
                                <button type="button" className="btn" style={{ flex: 1, backgroundColor: '#757575' }} onClick={cerrarModalPass} disabled={cargando}>
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}