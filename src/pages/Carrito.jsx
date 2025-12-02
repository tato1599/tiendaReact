import { useEffect } from 'react';
import { usarCarrito } from '../context/ContextoCarrito';
import { Link, useNavigate } from 'react-router-dom';

const Carrito = () => {
    const { carrito, eliminarDelCarrito, vaciarCarrito, crearOrden, totalCarrito, cargando } = usarCarrito();
    const navigate = useNavigate();

    const manejarPago = async () => {
        try {
            await crearOrden();
            alert('¡Orden creada exitosamente!');
            navigate('/servicios');
        } catch (error) {
            alert('Error al crear la orden');
        }
    };

    if (cargando) {
        return <div className="flex justify-center items-center min-h-screen">Cargando...</div>;
    }

    if (carrito.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Tu carrito está vacío</h2>
                <Link to="/servicios" className="text-blue-600 dark:text-blue-400 hover:underline">
                    Volver a la tienda
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Carrito de Compras</h1>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {carrito.map((item) => (
                            <li key={item.productId} className="p-6 flex items-center">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="h-24 w-24 object-cover rounded-md"
                                />
                                <div className="ml-6 flex-1">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                            {item.name}
                                        </h3>
                                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        Cantidad: {item.quantity} x ${item.price}
                                    </p>
                                </div>
                                <button
                                    onClick={() => eliminarDelCarrito(item.productId)}
                                    className="ml-6 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium"
                                >
                                    Eliminar
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div className="p-6 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-xl font-bold text-gray-900 dark:text-white">Total</span>
                            <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                ${totalCarrito.toFixed(2)}
                            </span>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={vaciarCarrito}
                                className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                            >
                                Vaciar Carrito
                            </button>
                            <button
                                onClick={manejarPago}
                                className="flex-1 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Proceder al Pago
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Carrito;
