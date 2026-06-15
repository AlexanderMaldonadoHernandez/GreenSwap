import { useEffect, useMemo, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

const ubicacionDefault = [19.5046, -99.1467];

const articulosPrueba = [
  {
    id: 1,
    nombre: 'Licuadora Oster',
    descripcion: 'Funciona bien, solo necesita vaso nuevo.',
    latitud: 19.5061,
    longitud: -99.1482
  },
  {
    id: 2,
    nombre: 'Silla de escritorio',
    descripcion: 'Silla en buen estado para estudio o trabajo.',
    latitud: 19.5018,
    longitud: -99.1444
  },
  {
    id: 3,
    nombre: 'Balon de futbol',
    descripcion: 'Balon usado, ideal para entrenamiento.',
    latitud: 19.5084,
    longitud: -99.1429
  }
];

L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl
});

function calcularDistanciaKm(origen, destino) {
  const radioTierra = 6371;
  const convertirARadianes = grados => (grados * Math.PI) / 180;
  const diferenciaLat = convertirARadianes(destino[0] - origen[0]);
  const diferenciaLng = convertirARadianes(destino[1] - origen[1]);
  const latOrigen = convertirARadianes(origen[0]);
  const latDestino = convertirARadianes(destino[0]);

  const a =
    Math.sin(diferenciaLat / 2) * Math.sin(diferenciaLat / 2) +
    Math.cos(latOrigen) *
      Math.cos(latDestino) *
      Math.sin(diferenciaLng / 2) *
      Math.sin(diferenciaLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return radioTierra * c;
}

function CentrarMapa({ ubicacion }) {
  const mapa = useMap();

  useEffect(() => {
    mapa.setView(ubicacion, mapa.getZoom());
  }, [mapa, ubicacion]);

  return null;
}

export default function MapaArticulos() {
  const [ubicacionUsuario, setUbicacionUsuario] = useState(ubicacionDefault);
  const [ubicacionDetectada, setUbicacionDetectada] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      posicion => {
        setUbicacionUsuario([
          posicion.coords.latitude,
          posicion.coords.longitude
        ]);
        setUbicacionDetectada(true);
      },
      () => {
        setUbicacionUsuario(ubicacionDefault);
        setUbicacionDetectada(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 8000
      }
    );
  }, []);

  const articulosConDistancia = useMemo(
    () =>
      articulosPrueba.map(articulo => ({
        ...articulo,
        distancia: calcularDistanciaKm(ubicacionUsuario, [
          articulo.latitud,
          articulo.longitud
        ])
      })),
    [ubicacionUsuario]
  );

  return (
    <div
      className="card"
      style={{
        marginBottom: '2rem',
        padding: 0,
        overflow: 'hidden'
      }}
    >
      <div style={{ padding: '1.2rem 1.2rem 0.8rem' }}>
        <h3 style={{ margin: '0 0 5px 0', color: '#2e7d32' }}>
          Mapa / Articulos cerca de ti
        </h3>
        <p style={{ margin: 0, color: '#666', fontSize: '0.95rem' }}>
          {ubicacionDetectada
            ? 'Ubicacion detectada correctamente.'
            : 'Usando ubicacion aproximada cerca de IPN Zacatenco.'}
        </p>
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

        <Marker position={ubicacionUsuario}>
          <Popup>
            <strong>Tu ubicacion</strong>
            <br />
            {ubicacionDetectada
              ? 'Marcador basado en tu GPS.'
              : 'Ubicacion por defecto: IPN Zacatenco.'}
          </Popup>
        </Marker>

        {articulosConDistancia.map(articulo => (
          <Marker
            key={articulo.id}
            position={[articulo.latitud, articulo.longitud]}
          >
            <Popup>
              <strong>{articulo.nombre}</strong>
              <br />
              {articulo.descripcion}
              <br />
              Distancia aproximada: {articulo.distancia.toFixed(2)} km
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
