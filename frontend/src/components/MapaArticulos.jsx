import { useEffect, useMemo, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

const ubicacionDefault = [19.5046, -99.1467];

L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });

const iconoUsuario = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const iconoArticulo = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function calcularDistanciaKm(origen, destino) {
  const r = 6371;
  const rad = g => (g * Math.PI) / 180;
  const dLat = rad(destino[0] - origen[0]);
  const dLng = rad(destino[1] - origen[1]);
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(origen[0])) * Math.cos(rad(destino[0])) * Math.sin(dLng / 2) ** 2;
  return r * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function CentrarMapa({ ubicacion }) {
  const mapa = useMap();
  useEffect(() => { mapa.setView(ubicacion, mapa.getZoom()); }, [mapa, ubicacion]);
  return null;
}

export default function MapaArticulos() {
  const [ubicacionUsuario, setUbicacionUsuario] = useState(null);
  const [estadoUbicacion, setEstadoUbicacion] = useState('solicitando'); // solicitando | concedida | denegada | no-soportada
  const [articulos, setArticulos] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/articulos')
      .then(r => r.json())
      .then(data => setArticulos(Array.isArray(data) ? data : []))
      .catch(() => setArticulos([]));
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setEstadoUbicacion('no-soportada');
      setUbicacionUsuario(ubicacionDefault);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        setUbicacionUsuario([pos.coords.latitude, pos.coords.longitude]);
        setEstadoUbicacion('concedida');
      },
      () => {
        setEstadoUbicacion('denegada');
        setUbicacionUsuario(ubicacionDefault);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const solicitarUbicacion = () => {
    setEstadoUbicacion('solicitando');
    navigator.geolocation.getCurrentPosition(
      pos => {
        setUbicacionUsuario([pos.coords.latitude, pos.coords.longitude]);
        setEstadoUbicacion('concedida');
      },
      () => setEstadoUbicacion('denegada'),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const articulosConDistancia = useMemo(() => {
    if (!ubicacionUsuario) return [];
    return articulos
      .filter(a => a.latitudUbicacion && a.longitudUbicacion)
      .map(a => ({
        ...a,
        distancia: calcularDistanciaKm(ubicacionUsuario, [a.latitudUbicacion, a.longitudUbicacion])
      }));
  }, [articulos, ubicacionUsuario]);

  if (estadoUbicacion === 'solicitando') {
    return (
      <div className="card" style={{ marginBottom: '0', textAlign: 'center', padding: '2rem', borderRadius: '0 0 10px 10px' }}>
        <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📍</div>
        <h3 style={{ color: '#2e7d32', marginTop: 0 }}>Solicitando tu ubicación...</h3>
        <p style={{ color: '#555', fontSize: '0.9rem' }}>
          Acepta el permiso de ubicación en tu navegador para ver los artículos cercanos a ti.
        </p>
      </div>
    );
  }

  if (estadoUbicacion === 'denegada') {
    return (
      <div className="card" style={{ marginBottom: '0', textAlign: 'center', padding: '2rem', borderRadius: '0 0 10px 10px', backgroundColor: '#fff8e1', border: '1px solid #ffe082' }}>
        <div style={{ fontSize: '2rem', marginBottom: '10px' }}>⚠️</div>
        <h3 style={{ color: '#f57f17', marginTop: 0 }}>Ubicación no disponible</h3>
        <p style={{ color: '#555', fontSize: '0.9rem', marginBottom: '1rem' }}>
          Bloqueaste el acceso a tu ubicación. Para ver artículos cercanos, permite el acceso en la configuración de tu navegador y vuelve a intentarlo.
        </p>
        <button className="btn" onClick={solicitarUbicacion}>
          Intentar de nuevo
        </button>
      </div>
    );
  }

  if (estadoUbicacion === 'no-soportada') {
    return (
      <div className="card" style={{ marginBottom: '0', textAlign: 'center', padding: '2rem', borderRadius: '0 0 10px 10px' }}>
        <p style={{ color: '#555' }}>Tu navegador no soporta geolocalización.</p>
      </div>
    );
  }

  return (
    <div className="card" style={{ marginBottom: '0', padding: 0, overflow: 'hidden', borderRadius: '0 0 10px 10px' }}>
      <div style={{ padding: '8px 14px', fontSize: '0.82rem', color: '#555', backgroundColor: '#f9f9f9', borderBottom: '1px solid #eee' }}>
        Ubicación detectada — artículos en el mapa: <strong>{articulosConDistancia.length}</strong>
      </div>
      <MapContainer
        center={ubicacionUsuario}
        zoom={15}
        scrollWheelZoom
        style={{ height: '380px', width: '100%' }}
      >
        <CentrarMapa ubicacion={ubicacionUsuario} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={ubicacionUsuario} icon={iconoUsuario}>
          <Popup><strong>Estás aquí</strong></Popup>
        </Marker>
        {articulosConDistancia.map(art => (
          <Marker key={art.idArticulo} position={[art.latitudUbicacion, art.longitudUbicacion]} icon={iconoArticulo}>
            <Popup>
              <div style={{ minWidth: '160px' }}>
                {art.urlImagen && (
                  <img src={art.urlImagen} alt={art.tituloArticulo}
                    style={{ width: '100%', height: '90px', objectFit: 'cover', borderRadius: '6px', marginBottom: '6px' }}
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                )}
                <strong>{art.tituloArticulo}</strong><br />
                <span style={{ fontSize: '0.8rem', color: '#555' }}>{art.descripcionDetallada}</span><br />
                <span style={{ fontSize: '0.78rem', color: '#2e7d32', fontWeight: 'bold' }}>
                  A {art.distancia.toFixed(2)} km de ti
                </span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
