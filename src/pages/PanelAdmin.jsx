import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usarAutenticacion } from '../context/ContextoAutenticacion';
import FormularioProducto from '../components/FormularioProducto';

const PanelAdmin = () => {
    const { usuario, estaAutenticado, cargando } = usarAutenticacion();
    const navigate = useNavigate();
    const [stats, setStats] = useState({ ventas_totales: 0, cantidad_ordenes: 0 });
    const [ordenesRecientes, setOrdenesRecientes] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const [error, setError] = useState('');
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    useEffect(() => {
        if (!cargando && (!estaAutenticado || usuario?.role !== 'admin')) {
            navigate('/');
        }
    }, [estaAutenticado, usuario, cargando, navigate]);

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
            } catch (err) {
                console.error(err);
                setError('Error de conexión al cargar estadísticas.');
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
        // Opcional: Actualizar alguna lista si la tuviéramos visible
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
                                </tr>
                            ))}
                            {ordenesRecientes.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="text-center py-4 text-gray-500 dark:text-gray-400">
                                        No hay órdenes recientes.
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
