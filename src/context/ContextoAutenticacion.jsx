import { createContext, useState, useEffect, useContext } from 'react';
import { bd } from '../utils/bd';

const ContextoAutenticacion = createContext();

export const usarAutenticacion = () => useContext(ContextoAutenticacion);

export const ProveedorAutenticacion = ({ children }) => {
    const [usuario, setUsuario] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [estaAutenticado, setEstaAutenticado] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const usuarioGuardado = localStorage.getItem('usuario');

        if (token && usuarioGuardado) {
            try {
                setUsuario(JSON.parse(usuarioGuardado));
                setEstaAutenticado(true);
            } catch (error) {
                console.error("Error parsing user data from localStorage:", error);
                localStorage.removeItem('token');
                localStorage.removeItem('usuario');
            }
        }
        setCargando(false);
    }, []);

    const iniciarSesion = async (email, password) => {
        try {
            const data = await bd.iniciarSesion(email, password);

            localStorage.setItem('token', data.token);
            localStorage.setItem('usuario', JSON.stringify(data.user));
            setUsuario(data.user);
            setEstaAutenticado(true);

            return data;
        } catch (error) {
            throw error;
        }
    };

    const registrarse = async (name, email, password) => {
        try {
            const data = await bd.registrarse(name, email, password);

            localStorage.setItem('token', data.token);
            setUsuario(data.user);
            setEstaAutenticado(true);
            localStorage.setItem('usuario', JSON.stringify(data.user));

            return data;
        } catch (error) {
            throw error;
        }
    };

    const cerrarSesion = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        setUsuario(null);
        setEstaAutenticado(false);
    };

    const establecerEstadoUsuario = (datosUsuario) => {
        setUsuario(datosUsuario);
        setEstaAutenticado(true);
        localStorage.setItem('usuario', JSON.stringify(datosUsuario));
    };

    return (
        <ContextoAutenticacion.Provider value={{ usuario, iniciarSesion, registrarse, cerrarSesion, estaAutenticado, cargando, establecerEstadoUsuario }}>
            {children}
        </ContextoAutenticacion.Provider>
    );
};
