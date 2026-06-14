export default function Navbar({ usuario, setUsuario, setPantalla }) {
  const cerrarSesion = (e) => {
    e.preventDefault();

    localStorage.removeItem('usuario');
    localStorage.removeItem('greenswap_token');

    setUsuario(null);
    setPantalla('login');
  };

  return (
    <nav className="navbar">
      <div
        style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
        onClick={() => setPantalla(usuario ? 'catalogo' : 'login')}
      >
        <strong style={{ fontSize: '1.4rem' }}>♻️ GreenSwap</strong>
      </div>

      <div>
        {usuario ? (
          <>
            <span style={{ marginRight: '15px' }}>
              Usuario: <b>{usuario.nombre || usuario.nombreCompleto || 'Sin nombre'}</b>
            </span>

            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setPantalla('catalogo');
              }}
            >
              Catálogo Radar
            </a>

            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setPantalla('panel');
              }}
            >
              Mi Panel
            </a>

            <a
              href="#"
              style={{ color: '#ff8a80' }}
              onClick={cerrarSesion}
            >
              Salir
            </a>
          </>
        ) : (
          <>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setPantalla('login');
              }}
            >
              Entrar
            </a>

            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setPantalla('registro');
              }}
            >
              Registrarse
            </a>
          </>
        )}
      </div>
    </nav>
  );
}