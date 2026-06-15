import { Link } from 'react-router-dom';
import logo from '../assets/greenswap-logo.png';

export default function Inicio({ usuario }) {
  return (
    <main>
      <section
        style={{
          background: 'linear-gradient(135deg, #e8f5e9 0%, #f4f6f7 70%)',
          borderBottom: '1px solid #dbe7dc'
        }}
      >
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
            src={logo}
            alt="GreenSwap"
            style={{
              position: 'absolute',
              right: '2rem',
              bottom: '35px',
              width: 'min(420px, 44vw)',
              opacity: 0.18,
              pointerEvents: 'none'
            }}
          />

          <div style={{ maxWidth: '680px', position: 'relative', zIndex: 1 }}>
            <p
              style={{
                color: '#2e7d32',
                fontWeight: 700,
                margin: '0 0 0.8rem'
              }}
            >
              Intercambio responsable en comunidad
            </p>

            <h1
              style={{
                fontSize: '3rem',
                lineHeight: 1.05,
                margin: '0 0 1rem',
                color: '#1f3b57'
              }}
            >
              GreenSwap
            </h1>

            <p
              style={{
                fontSize: '1.1rem',
                lineHeight: 1.6,
                color: '#4b5563',
                margin: '0 0 1.5rem'
              }}
            >
              Una plataforma para publicar, encontrar e intercambiar articulos
              domesticos utiles dentro de una zona cercana.
            </p>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link
                to={usuario ? '/catalogo' : '/registro'}
                className="btn"
                style={{
                  width: 'auto',
                  textDecoration: 'none',
                  display: 'inline-block'
                }}
              >
                {usuario ? 'Ver catalogo' : 'Crear cuenta'}
              </Link>

              <Link
                to={usuario ? '/panel' : '/login'}
                style={{
                  color: '#2e7d32',
                  border: '1px solid #2e7d32',
                  borderRadius: '6px',
                  padding: '0.7rem 1.2rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  background: '#ffffff'
                }}
              >
                {usuario ? 'Ir a mi panel' : 'Iniciar sesion'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container" style={{ paddingTop: '1.5rem' }}>
        <div className="card-grid" style={{ marginTop: 0 }}>
          <div className="card">
            <h3 style={{ color: '#2e7d32', marginTop: 0 }}>
              Publica articulos
            </h3>
            <p style={{ color: '#555', lineHeight: 1.5 }}>
              Sube objetos que ya no usas y permite que alguien mas les de una
              segunda vida.
            </p>
          </div>

          <div className="card">
            <h3 style={{ color: '#2e7d32', marginTop: 0 }}>
              Explora cerca de ti
            </h3>
            <p style={{ color: '#555', lineHeight: 1.5 }}>
              Consulta articulos por categoria o revisa opciones cercanas desde
              el catalogo con radar geografico.
            </p>
          </div>

          <div className="card">
            <h3 style={{ color: '#2e7d32', marginTop: 0 }}>
              Reduce desperdicio
            </h3>
            <p style={{ color: '#555', lineHeight: 1.5 }}>
              Fomenta el intercambio local y ayuda a disminuir residuos dentro
              de la comunidad.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
