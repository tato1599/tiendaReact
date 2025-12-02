import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProveedorAutenticacion } from './context/ContextoAutenticacion';
import { ProveedorCarrito } from './context/ContextoCarrito';
import BarraNavegacion from './components/BarraNavegacion';
import PaginaInicio from './pages/PaginaInicio';
import Servicios from './pages/Servicios';
import IniciarSesion from './pages/IniciarSesion';
import Registro from './pages/Registro';
import DetalleProducto from './pages/DetalleProducto';
import Carrito from './pages/Carrito';

function App() {
  return (
    <Router>
      <ProveedorAutenticacion>
        <ProveedorCarrito>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <BarraNavegacion />
            <Routes>
              <Route path="/" element={<PaginaInicio />} />
              <Route path="/servicios" element={<Servicios />} />
              <Route path="/servicios/:id" element={<DetalleProducto />} />
              <Route path="/carrito" element={<Carrito />} />
              <Route path="/iniciar-sesion" element={<IniciarSesion />} />
              <Route path="/registro" element={<Registro />} />
            </Routes>
          </div>
        </ProveedorCarrito>
      </ProveedorAutenticacion>
    </Router>
  );
}

export default App;
