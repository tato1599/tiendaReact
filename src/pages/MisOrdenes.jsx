import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usarAutenticacion } from '../context/ContextoAutenticacion';
import { bd } from '../utils/bd';

const MisOrdenes = () => {
    const { usuario, estaAutenticado, cargando } = usarAutenticacion();
    const navigate = useNavigate();
    const [ordenes, setOrdenes] = useState([]);
    const [cargandoDatos, setCargandoDatos] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!cargando && !estaAutenticado) {
            navigate('/iniciar-sesion');
        }
    }, [estaAutenticado, cargando, navigate]);

    useEffect(() => {
        const cargarOrdenes = async () => {
            if (usuario?.id) {
                try {
                    const data = await bd.obtenerOrdenes(usuario.id);
                    setOrdenes(data);
                } catch (err) {
                    console.error("Error cargando órdenes:", err);
                    setError("No se pudieron cargar tus órdenes.");
                } finally {
                    setCargandoDatos(false);
                }
            }
        };

        if (estaAutenticado && usuario) {
            cargarOrdenes();
        }
    }, [estaAutenticado, usuario]);

    if (cargando || cargandoDatos) {
        return <div className="text-center p-10 dark:text-white">Cargando tus órdenes...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8 min-h-screen">
            <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Mis Órdenes</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {ordenes.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
                    <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">No has realizado ninguna orden todavía.</p>
                    <button
                        onClick={() => navigate('/servicios')}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Explorar Servicios
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    {ordenes.map((orden) => (
                        <div key={orden.id} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700">
                            <div className="bg-gray-50 dark:bg-gray-900 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex flex-wrap justify-between items-center">
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">Orden Realizada</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{orden.date}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold text-right">Total</p>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white">${orden.total.toFixed(2)}</p>
                                </div>
                                <div className="w-full sm:w-auto mt-2 sm:mt-0 text-xs text-gray-400 font-mono">
                                    ID: {orden.id}
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Detalles del Servicio</h3>
                                <div className="space-y-4">
                                    {orden.items && orden.items.map((item, index) => (
                                        <div key={index} className="flex items-center">
                                            {item.image ? (
                                                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded border dark:border-gray-600 flex-shrink-0" />
                                            ) : (
                                                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center flex-shrink-0">
                                                    <span className="text-xs text-gray-500">Sin img</span>
                                                </div>
                                            )}
                                            <div className="ml-4 flex-1">
                                                <h4 className="text-md font-semibold text-gray-800 dark:text-white">{item.name}</h4>
                                                <p className="text-sm text-blue-600 dark:text-blue-400">${item.price.toFixed(2)} x {item.quantity}</p>
                                            </div>
                                            <div className="font-bold text-gray-800 dark:text-white">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MisOrdenes;
