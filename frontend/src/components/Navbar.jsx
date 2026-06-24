import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/greenswap-logo.png';

export default function Navbar({ usuario, setUsuario}) {
  const navigate = useNavigate();
  const location = useLocation();

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
          <strong style={{ fontSize: '1.2rem', color: '#ffffff' }}>GreenSwap</strong>
        </div>
      </div>

      <div className="nav-links">
        {usuario ? (
          <>
            <span className="usuario-nav">
              Hola, <b>{usuario.nombre || usuario.nombreCompleto || 'usuario'}</b>
            </span>

            <NavLink to="/catalogo">Catálogo</NavLink>

            {location.pathname !== '/panel' && (
              <NavLink to="/panel">Mi Panel</NavLink>
            )}

            {usuario.rol === 'ADMIN' && (
              <NavLink to="/admin">Panel de administrador</NavLink>
            )}

            {location.pathname !== '/perfil' && (
              <NavLink to="/perfil">Perfil</NavLink>
            )}

            <a href="#" className="btn-salir" onClick={cerrarSesion}>
              Salir
            </a>
          </>
        ) : (
          <>
            {location.pathname !== '/' && (
              <NavLink to="/">Inicio</NavLink>
            )}

            <NavLink to="/login" className="nav-btn-login">
              Entrar
            </NavLink>

            <NavLink to="/registro" className="nav-btn-register">
              Registrarse
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}
