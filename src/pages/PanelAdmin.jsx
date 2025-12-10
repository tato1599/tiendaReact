import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usarAutenticacion } from '../context/ContextoAutenticacion';
import FormularioProducto from '../components/FormularioProducto';

import { bd } from '../utils/bd';

const PanelAdmin = () => {
    const { usuario, estaAutenticado, cargando } = usarAutenticacion();
    const navigate = useNavigate();
    const [stats, setStats] = useState({ ventas_totales: 0, cantidad_ordenes: 0 });
    const [ordenesRecientes, setOrdenesRecientes] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const [error, setError] = useState('');
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    // Estado para detalles de orden
    const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);
    const [mostrarDetalles, setMostrarDetalles] = useState(false);
    const [cargandoDetalles, setCargandoDetalles] = useState(false);

    useEffect(() => {
        if (!cargando && (!estaAutenticado || usuario?.role !== 'admin')) {
            navigate('/');
        }
    }, [estaAutenticado, usuario, cargando, navigate]);

    const [comentarios, setComentarios] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/estadisticas_admin.php');
                const result = await response.json();

                if (result.success) {
                    setStats(result.stats);
                    setOrdenesRecientes(result.recent_orders);
                } else {
                    setError('Error al cargar estadísticas: ' + result.message);
                }

                const comentariosData = await bd.obtenerComentarios();
                setComentarios(comentariosData);

            } catch (err) {
                console.error(err);
                setError('Error de conexión al cargar datos.');
            } finally {
                setLoadingData(false);
            }
        };

        if (estaAutenticado && usuario?.role === 'admin') {
            fetchStats();
        }
    }, [estaAutenticado, usuario]);

    const handleProductoGuardado = (producto) => {
        alert(`Producto "${producto.name}" agregado correctamente.`);
        setMostrarFormulario(false);
    };

    const verDetallesOrden = async (id) => {
        setCargandoDetalles(true);
        setOrdenSeleccionada(null);
        setMostrarDetalles(true);
        try {
            const data = await bd.obtenerOrdenPorId(id);
            if (data.success) {
                setOrdenSeleccionada(data.order);
            } else {
                alert('No se pudieron cargar los detalles de la orden');
                setMostrarDetalles(false);
            }
        } catch (error) {
            console.error(error);
            alert('Error al cargar detalles');
            setMostrarDetalles(false);
        } finally {
            setCargandoDetalles(false);
        }
    };

    if (cargando || (estaAutenticado && usuario?.role === 'admin' && loadingData)) {
        return <div className="text-center p-10">Cargando panel...</div>;
    }

    if (!estaAutenticado || usuario?.role !== 'admin') {
        return null;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Panel de Administración</h1>
                <button
                    onClick={() => setMostrarFormulario(true)}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded shadow flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Nuevo Producto
                </button>
            </div>

            {mostrarFormulario && (
                <FormularioProducto
                    alGuardar={handleProductoGuardado}
                    alCancelar={() => setMostrarFormulario(false)}
                />
            )}

            {/* Modal Detalles Orden */}
            {mostrarDetalles && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-4 my-8 p-6 relative">
                        <button
                            onClick={() => setMostrarDetalles(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Detalles de Orden</h2>

                        {cargandoDetalles ? (
                            <div className="text-center py-8">Cargando detalles...</div>
                        ) : ordenSeleccionada ? (
                            <div>
                                <div className="grid grid-cols-2 gap-4 mb-6 text-sm text-gray-600 dark:text-gray-300">
                                    <p><strong>ID Orden:</strong> {ordenSeleccionada.id}</p>
                                    <p><strong>Fecha:</strong> {ordenSeleccionada.date}</p>
                                    <p><strong>Usuario:</strong> {ordenSeleccionada.email || 'Desconocido'}</p>
                                    <p><strong>Total:</strong> ${ordenSeleccionada.total.toFixed(2)}</p>
                                </div>

                                <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Productos</h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full leading-normal">
                                        <thead>
                                            <tr>
                                                <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Producto</th>
                                                <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Precio</th>
                                                <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Cant.</th>
                                                <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {ordenSeleccionada.items && ordenSeleccionada.items.map((item, index) => (
                                                <tr key={index} className="border-b border-gray-200 dark:border-gray-700 text-sm">
                                                    <td className="px-5 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                                                        <div className="flex items-center">
                                                            {item.image && <img src={item.image} alt={item.name} className="w-10 h-10 object-cover mr-3 rounded" />}
                                                            <span>{item.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-3 bg-white dark:bg-gray-800 text-right text-gray-900 dark:text-white">${item.price.toFixed(2)}</td>
                                                    <td className="px-5 py-3 bg-white dark:bg-gray-800 text-right text-gray-900 dark:text-white">{item.quantity}</td>
                                                    <td className="px-5 py-3 bg-white dark:bg-gray-800 text-right font-semibold text-gray-900 dark:text-white">${(item.price * item.quantity).toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-red-500">Error cargando información.</div>
                        )}

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setMostrarDetalles(false)}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                    <h2 className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider">Ventas Totales</h2>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                        ${parseFloat(stats.ventas_totales).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-green-500">
                    <h2 className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider">Total de Órdenes</h2>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                        {stats.cantidad_ordenes}
                    </p>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Órdenes Recientes</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr>
                                <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                    ID Orden
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                    Usuario
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                    Fecha
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                    Total
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {ordenesRecientes.map((orden) => (
                                <tr key={orden.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                                        <p className="text-gray-900 dark:text-white whitespace-no-wrap font-mono">
                                            {orden.id}
                                        </p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                                        <p className="text-gray-900 dark:text-white whitespace-no-wrap">
                                            {orden.email || 'Desconocido'}
                                        </p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                                        <p className="text-gray-900 dark:text-white whitespace-no-wrap">
                                            {orden.date}
                                        </p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-right">
                                        <p className="text-gray-900 dark:text-white whitespace-no-wrap font-bold">
                                            ${parseFloat(orden.total).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                        </p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-center">
                                        <button
                                            onClick={() => verDetallesOrden(orden.id)}
                                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 font-semibold"
                                        >
                                            Ver Detalles
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {ordenesRecientes.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center py-4 text-gray-500 dark:text-gray-400">
                                        No hay órdenes recientes.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Sección de Comentarios */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mt-8">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Comentarios Recientes de Usuarios</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr>
                                <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Fecha</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Nombre</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Email</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Comentario</th>
                            </tr>
                        </thead>
                        <tbody>
                            {comentarios.map((comentario, index) => (
                                <tr key={comentario.id || index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm whitespace-nowrap text-gray-900 dark:text-white">
                                        {comentario.fecha}
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-900 dark:text-white">
                                        {comentario.nombre}
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-500 dark:text-gray-400">
                                        {comentario.email}
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300">
                                        {comentario.comentarios}
                                    </td>
                                </tr>
                            ))}
                            {comentarios.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="text-center py-4 text-gray-500 dark:text-gray-400">
                                        No hay comentarios registrados.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PanelAdmin;
