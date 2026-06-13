import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Login from './paginas/Login';
import Registro from './paginas/Registro';
import CatalogoMapa from './paginas/CatalogoMapa';
import Panel from './paginas/Panel';

public default function App() {
  const [usuario, setUsuario] = useState(() => {
    const sesionGuardada = localStorage.getItem('usuario');
    return sesionGuardada ? JSON.parse(sesionGuardada) : null;
  });
  const [pantalla, setPantalla] = useState(usuario ? 'catalogo' : 'login');

  return (
    <div>
      <Navbar usuario={usuario} setUsuario={setUsuario} setPantalla={setPantalla} />
      {pantalla === 'login' && <Login setUsuario={setUsuario} setPantalla={setPantalla} />}
      {pantalla === 'registro' && <Registro setPantalla={setPantalla} />}
      {pantalla === 'catalogo' && <CatalogoMapa />}
      {pantalla === 'panel' && <Panel usuario={usuario} />}
    </div>
  );
}
