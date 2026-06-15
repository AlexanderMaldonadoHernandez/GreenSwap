import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../assets/greenswap-logo.png';

export default function Navbar({ usuario, setUsuario}) {
  const navigate = useNavigate();

  const cerrarSesion = (e) => {
    e.preventDefault();

    localStorage.removeItem('usuario');
    localStorage.removeItem('greenswap_token');

    setUsuario(null);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          cursor: 'pointer'
        }}
        onClick={() => navigate('/')}
      >
        <img
          src={logo}
          alt="GreenSwap"
          style={{
            width: '42px',
            height: '42px',
            objectFit: 'contain',
            background: 'white',
            borderRadius: '6px',
            padding: '3px'
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.1' }}>
          <strong style={{ fontSize: '1.45rem' }}>GreenSwap</strong>
          <span style={{ fontSize: '0.75rem', color: '#d8f5dc' }}>
            Soluciones limpias, sistemas robustos
          </span>
        </div>
      </div>

      <div className="nav-links">
        {usuario ? (
          <>
            <span className="usuario-nav">
              Hola, <b>{usuario.nombre || usuario.nombreCompleto || 'usuario'}</b>
            </span>

            <NavLink to="/catalogo">
              Catálogo Radar
            </NavLink>

            <NavLink to="/panel">
              Mi Panel
            </NavLink>

            {usuario.rol === 'ADMIN' && (
              <NavLink to="/admin">
                Panel Admin
              </NavLink>
            )}

            <a href="#" className="btn-salir" onClick={cerrarSesion}>
              Salir
            </a>
          </>
        ) : (
          <>
            <NavLink to="/">
              Inicio
            </NavLink>

            <NavLink to="/login">
              Entrar
            </NavLink>

            <NavLink to="/registro">
              Registrarse
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}
