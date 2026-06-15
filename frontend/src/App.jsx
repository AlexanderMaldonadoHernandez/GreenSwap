import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './paginas/Login';
import Registro from './paginas/Registro';
import CatalogoMapa from './paginas/CatalogoMapa';
import Panel from './paginas/Panel';
import PanelAdmin from './paginas/PanelAdmin';

export default function App() {
  const [usuario, setUsuario] = useState(() => {
  try{
    const sesionGuardada = localStorage.getItem('usuario');
    return sesionGuardada ? JSON.parse(sesionGuardada) : null;
  } catch (error){
    localStorage.removeItem('usuario');
    localStorage.removeItem('greenswap_token');
    return null;
  }
});

  return (
  <div>
      <Navbar usuario={usuario} setUsuario={setUsuario} />

      <Routes>
      <Route
        path="/"
        element={<Navigate to={usuario ? '/catalogo' : '/login'} replace />}
      />

      <Route
        path="/login"
        element={
          usuario ? (
            <Navigate to="/catalogo" replace />
          ) : (
            <Login setUsuario={setUsuario} />
          )
        }
      />

      <Route
        path="/registro"
        element={
          usuario ? (
            <Navigate to="/catalogo" replace />
          ) : (
            <Registro />
          )
        }
      />

      <Route path="/catalogo" element={<CatalogoMapa />} />

      <Route
        path="/panel"
        element={
          usuario ? (
            <Panel usuario={usuario} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/admin"
        element={
          usuario?.rol === 'ADMIN' ? (
            <PanelAdmin />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
     </Routes>
  </div>
);
}
