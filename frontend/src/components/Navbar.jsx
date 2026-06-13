export default function Navbar({ usuario, setUsuario, setPantalla }) {
  return (
    <nav className="navbar">
      <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => setPantalla(usuario ? 'catalogo' : 'login')}>
        <strong style={{ fontSize: '1.4rem' }}>♻️ GreenSwap</strong>
      </div>
      <div>
        {usuario ? (
          <>
            <span style={{ marginRight: '15px' }}>Usuario: <b>{usuario.nombreCompleto}</b></span>
            <a href="#" onClick={() => setPantalla('catalogo')}>Catálogo Radar</a>
            <a href="#" onClick={() => setPantalla('panel')}>Mi Panel</a>
            <a href="#" style={{ color: '#ff8a80' }} onClick={() => { localStorage.clear(); setUsuario(null); setPantalla('login'); }}>Salir</a>
          </>
        ) : (
          <>
            <a href="#" onClick={() => setPantalla('login')}>Entrar</a>
            <a href="#" onClick={() => setPantalla('registro')}>Registrarse</a>
          </>
        )}
      </div>
    </nav>
  );
}
