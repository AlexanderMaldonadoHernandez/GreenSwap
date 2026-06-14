export default function Navbar({ usuario, setUsuario, setPantalla }) {
  const cerrarSesion = (e) => {
    e.preventDefault();

    localStorage.removeItem('usuario');
    localStorage.removeItem('greenswap_token');

    setUsuario(null);
    setPantalla('login');
  };

  const irA = (e, pantalla) => {
    e.preventDefault();
    setPantalla(pantalla);
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
        onClick={() => setPantalla(usuario ? 'catalogo' : 'login')}
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

            <a href="#" onClick={(e) => irA(e, 'catalogo')}>
              Catálogo Radar
            </a>

            <a href="#" onClick={(e) => irA(e, 'panel')}>
              Mi Panel
            </a>

            <a href="#" className="btn-salir" onClick={cerrarSesion}>
              Salir
            </a>
          </>
        ) : (
          <>
            <a href="#" onClick={(e) => irA(e, 'login')}>
              Entrar
            </a>

            <a href="#" onClick={(e) => irA(e, 'registro')}>
              Registrarse
            </a>
          </>
        )}
      </div>
    </nav>
  );
}