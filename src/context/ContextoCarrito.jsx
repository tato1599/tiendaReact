import { createContext, useState, useEffect, useContext } from 'react';
import { usarAutenticacion } from './ContextoAutenticacion';
import { bd } from '../utils/bd';

const ContextoCarrito = createContext();

export const usarCarrito = () => useContext(ContextoCarrito);

export const ProveedorCarrito = ({ children }) => {
    const { usuario, estaAutenticado } = usarAutenticacion();
    const [carrito, setCarrito] = useState([]);
    const [cargando, setCargando] = useState(false);

    useEffect(() => {
        if (estaAutenticado && usuario) {
            cargarCarrito();
        } else {
            setCarrito([]);
        }
    }, [estaAutenticado, usuario]);

    const cargarCarrito = async () => {
        try {
            setCargando(true);
            const items = await bd.obtenerCarrito(usuario.id);
            setCarrito(items);
        } catch (error) {
            console.error('Error cargando carrito:', error);
        } finally {
            setCargando(false);
        }
    };

    const agregarAlCarrito = async (productoId, cantidad) => {
        if (!estaAutenticado) return;
        try {
            const items = await bd.agregarAlCarrito(usuario.id, productoId, cantidad);
            setCarrito(items);
        } catch (error) {
            console.error('Error agregando al carrito:', error);
        }
    };

    const eliminarDelCarrito = async (productoId) => {
        if (!estaAutenticado) return;
        try {
            const items = await bd.eliminarDelCarrito(usuario.id, productoId);
            setCarrito(items);
        } catch (error) {
            console.error('Error eliminando del carrito:', error);
        }
    };

    const vaciarCarrito = async () => {
        if (!estaAutenticado) return;
        try {
            const items = await bd.vaciarCarrito(usuario.id);
            setCarrito(items);
        } catch (error) {
            console.error('Error vaciando carrito:', error);
        }
    };

    const crearOrden = async () => {
        if (!estaAutenticado) return;
        try {
            const orden = await bd.crearOrden(usuario.id);
            setCarrito([]);
            return orden;
        } catch (error) {
            console.error('Error creando orden:', error);
            throw error;
        }
    };

    const cantidadCarrito = carrito.reduce((acc, item) => acc + item.quantity, 0);
    const totalCarrito = carrito.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <ContextoCarrito.Provider value={{
            carrito,
            agregarAlCarrito,
            eliminarDelCarrito,
            vaciarCarrito,
            crearOrden,
            cantidadCarrito,
            totalCarrito,
            cargando
        }}>
            {children}
        </ContextoCarrito.Provider>
    );
};
