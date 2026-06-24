import { Link } from 'react-router-dom';
import logo from '../assets/greenswap-logo.png';
import heroLogo from '../assets/hero-logo.png';

const heroStyle = `
.hero-section {
  background: transparent;
}
`;

export default function Inicio({ usuario }) {
  return (
    <main>
      <style>{heroStyle}</style>
      <section className="hero-section">
        {/* Hero */}
        <div
          className="container"
          style={{
            minHeight: '430px',
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <img
            src={heroLogo}
            alt="GreenSwap"
            style={{
              position: 'absolute',
              right: '3rem',
              top: '50%',
              transform: 'translateY(-50%)',
              width: 'min(360px, 40vw)',
              opacity: 1,
              pointerEvents: 'none',
              filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.10))'
            }}
          />

          <div style={{ maxWidth: '680px', position: 'relative', zIndex: 1 }}>
            <p style={{ color: '#2e7d32', fontWeight: 700, margin: '0 0 0.8rem' }}>
              Intercambio responsable en comunidad
            </p>

            <h1 style={{ fontSize: '3rem', lineHeight: 1.05, margin: '0 0 1rem', color: '#1f3b57' }}>
              GreenSwap
            </h1>

            <p style={{ fontSize: '1.1rem', lineHeight: 1.6, color: '#4b5563', margin: '0 0 1.5rem' }}>
              Una plataforma para publicar, encontrar e intercambiar articulos
              domesticos utiles dentro de una zona cercana.
            </p>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link
                to={usuario ? '/catalogo' : '/registro'}
                style={{
                  display: 'inline-block', textDecoration: 'none',
                  background: '#2e7d32', color: '#ffffff',
                  border: '2px solid #2e7d32', borderRadius: '8px',
                  padding: '0.75rem 1.75rem', fontWeight: 700,
                  fontSize: '0.95rem', minWidth: '150px', textAlign: 'center'
                }}
              >
                {usuario ? 'Ver catalogo' : 'Crear cuenta'}
              </Link>

              <Link
                to={usuario ? '/panel' : '/login'}
                style={{
                  display: 'inline-block', textDecoration: 'none',
                  color: '#2e7d32', border: '2px solid #2e7d32',
                  borderRadius: '8px', padding: '0.75rem 1.75rem',
                  fontWeight: 700, fontSize: '0.95rem',
                  minWidth: '150px', textAlign: 'center', background: '#ffffff'
                }}
              >
                {usuario ? 'Ir a mi panel' : 'Iniciar sesion'}
              </Link>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div style={{ padding: '0 2rem 2.5rem', maxWidth: '1200px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          <div className="card">
            <h3 style={{ color: '#2e7d32', marginTop: 0 }}>Publica articulos</h3>
            <p style={{ color: '#555', lineHeight: 1.5 }}>
              Sube objetos que ya no usas y permite que alguien mas les de una segunda vida.
            </p>
          </div>

          <div className="card">
            <h3 style={{ color: '#2e7d32', marginTop: 0 }}>Explora cerca de ti</h3>
            <p style={{ color: '#555', lineHeight: 1.5 }}>
              Consulta articulos por categoria o revisa opciones cercanas desde el catalogo con radar geografico.
            </p>
          </div>

          <div className="card">
            <h3 style={{ color: '#2e7d32', marginTop: 0 }}>Reduce desperdicio</h3>
            <p style={{ color: '#555', lineHeight: 1.5 }}>
              Fomenta el intercambio local y ayuda a disminuir residuos dentro de la comunidad.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
