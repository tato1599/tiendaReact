import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usarAutenticacion } from '../context/ContextoAutenticacion';
import { usarCarrito } from '../context/ContextoCarrito';

const BarraNavegacion = () => {
    const { usuario, cerrarSesion, estaAutenticado } = usarAutenticacion();
    const { cantidadCarrito } = usarCarrito();
    const navigate = useNavigate();
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [perfilAbierto, setPerfilAbierto] = useState(false);
    const [tema, setTema] = useState(localStorage.getItem('tema') || 'light');

    useEffect(() => {
        if (tema === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('tema', tema);
    }, [tema]);

    const alternarTema = () => {
        setTema(prev => prev === 'light' ? 'dark' : 'light');
    };

    const manejarCierreSesion = () => {
        cerrarSesion();
        navigate('/iniciar-sesion');
    };

    return (
        <div className="sticky top-0 z-50">
            <header className="">
                <nav className="bg-white dark:bg-gray-800 antialiased shadow-sm">
                    <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0">
                        <div className="py-4 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center flex-1 gap-4">
                                    <Link to="/" className="shrink-0">
                                        <span className="self-center text-2xl font-semibold whitespace-nowrap text-gray-900 dark:text-white">
                                            ITCJ SERVICIOS
                                        </span>
                                    </Link>
                                    <button
                                        onClick={() => setMenuAbierto(!menuAbierto)}
                                        className="lg:hidden p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                                    >
                                        <svg className="w-6 h-6 text-gray-900 dark:text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="hidden lg:block lg:me-8">
                                    <ul className="items-center gap-8 md:flex">
                                        <li>
                                            <Link to="/" className="block text-sm font-medium text-gray-900 hover:text-blue-700 dark:text-white dark:hover:text-blue-500">
                                                Inicio
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/servicios" className="block text-sm font-medium text-gray-900 hover:text-blue-700 dark:text-white dark:hover:text-blue-500">
                                                Servicios
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/quienes-somos" className="block text-sm font-medium text-gray-900 hover:text-blue-700 dark:text-white dark:hover:text-blue-500">
                                                Quiénes Somos
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/ubicacion-contacto" className="block text-sm font-medium text-gray-900 hover:text-blue-700 dark:text-white dark:hover:text-blue-500">
                                                Contacto
                                            </Link>
                                        </li>
                                    </ul>
                                </div>

                                {/* Menú Móvil */}
                                {menuAbierto && (
                                    <div className="lg:hidden absolute top-16 left-0 right-0 z-50 mt-2 bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg mx-4">
                                        <ul className="flex flex-col gap-4">
                                            <li><Link to="/" className="text-gray-900 dark:text-white font-medium" onClick={() => setMenuAbierto(false)}>Inicio</Link></li>
                                            <li><Link to="/servicios" className="text-gray-900 dark:text-white font-medium" onClick={() => setMenuAbierto(false)}>Servicios</Link></li>
                                            <li><Link to="/quienes-somos" className="text-gray-900 dark:text-white font-medium" onClick={() => setMenuAbierto(false)}>Quiénes Somos</Link></li>
                                            <li><Link to="/ubicacion-contacto" className="text-gray-900 dark:text-white font-medium" onClick={() => setMenuAbierto(false)}>Contacto</Link></li>

                                            {estaAutenticado && (
                                                <>
                                                    <li>
                                                        <span className="text-gray-900 dark:text-white font-medium">
                                                            Perfil ({usuario?.name})
                                                        </span>
                                                    </li>
                                                    <li>
                                                        <button onClick={() => { manejarCierreSesion(); setMenuAbierto(false); }} className="w-full text-left text-red-600 dark:text-red-500 font-medium">
                                                            Cerrar sesión
                                                        </button>
                                                    </li>
                                                </>
                                            )}
                                            {!estaAutenticado && (
                                                <>
                                                    <li><Link to="/iniciar-sesion" className="text-gray-900 dark:text-white font-medium" onClick={() => setMenuAbierto(false)}>Iniciar sesión</Link></li>
                                                    <li><Link to="/registro" className="text-gray-900 dark:text-white font-medium" onClick={() => setMenuAbierto(false)}>Registrarse</Link></li>
                                                </>
                                            )}
                                        </ul>
                                    </div>
                                )}

                                <div className="flex items-center justify-end gap-2">
                                    {estaAutenticado && (
                                        <Link to="/carrito" className="relative p-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                            </svg>
                                            {cantidadCarrito > 0 && (
                                                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                                                    {cantidadCarrito}
                                                </span>
                                            )}
                                        </Link>
                                    )}
                                    <button
                                        onClick={alternarTema}
                                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        {tema === 'light' ? (
                                            <svg className="w-6 h-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                            </svg>
                                        ) : (
                                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                            </svg>
                                        )}
                                    </button>

                                    {estaAutenticado ? (
                                        <div className="relative ms-4">
                                            <button
                                                onClick={() => setPerfilAbierto(!perfilAbierto)}
                                                className="inline-flex items-center rounded-lg justify-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium leading-none text-gray-900 dark:text-white"
                                            >
                                                <span className="sr-only">Cuenta</span>
                                                <span className="hidden sm:flex">{usuario?.name}</span>
                                                <svg className="w-4 h-4 text-gray-900 dark:text-white ms-1 hidden sm:flex" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7"></path>
                                                </svg>
                                            </button>

                                            {/* Menú Desplegable */}
                                            {perfilAbierto && (
                                                <>
                                                    <div className="fixed inset-0 z-40" onClick={() => setPerfilAbierto(false)}></div>
                                                    <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700 z-50">
                                                        <div className="space-y-2 px-2 pb-4 pt-2 text-center">
                                                            <div className="w-8 h-8 mx-auto bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold">
                                                                {usuario?.name?.charAt(0).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <p className="truncate text-sm font-semibold leading-tight text-gray-900 dark:text-white">
                                                                    Hola, {usuario?.name}
                                                                </p>
                                                                <p className="truncate text-sm font-normal text-gray-500 dark:text-gray-400">
                                                                    {usuario?.email}
                                                                </p>
                                                            </div>
                                                            <button className="mb-2 me-2 block w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-700">
                                                                Ver Perfil
                                                            </button>
                                                        </div>
                                                        <ul className="p-2 text-start text-sm font-medium text-gray-900 dark:text-white">
                                                            <li>
                                                                <button
                                                                    onClick={manejarCierreSesion}
                                                                    className="inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-500 dark:hover:bg-gray-600"
                                                                >
                                                                    <svg className="h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H8m12 0-4 4m4-4-4-4M9 4H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h2" />
                                                                    </svg>
                                                                    Cerrar sesión
                                                                </button>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ) : (
                                        <>
                                            <div>
                                                <Link to="/iniciar-sesion" className="inline-flex items-center rounded-lg justify-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium leading-none text-gray-900 dark:text-white">
                                                    Iniciar sesión
                                                </Link>
                                            </div>
                                            <div>
                                                <Link to="/registro" className="inline-flex items-center rounded-lg justify-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium leading-none text-gray-900 dark:text-white">
                                                    Registrarse
                                                </Link>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
        </div>
    );
};

export default BarraNavegacion;
