import { NavLink, useNavigate } from 'react-router-dom';
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
          flexDirection: 'column',
          lineHeight: '1.1',
          cursor: 'pointer'
        }}
        onClick={() => navigate(usuario ? '/catalogo' : '/login')}
      >
        <strong style={{ fontSize: '1.45rem' }}>♻️ GreenSwap</strong>
        <span style={{ fontSize: '0.75rem', color: '#d8f5dc', marginLeft: '30px' }}>
          Soluciones limpias, sistemas robustos
        </span>
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