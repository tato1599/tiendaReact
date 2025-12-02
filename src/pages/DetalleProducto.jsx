import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bd } from '../utils/bd';
import { usarCarrito } from '../context/ContextoCarrito';
import { usarAutenticacion } from '../context/ContextoAutenticacion';

const DetalleProducto = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { agregarAlCarrito } = usarCarrito();
    const { estaAutenticado } = usarAutenticacion();
    const [producto, setProducto] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [cantidad, setCantidad] = useState(1);

    useEffect(() => {
        const cargarProducto = async () => {
            try {
                const data = await bd.obtenerProductoPorId(id);
                setProducto(data);
            } catch (error) {
                console.error('Error cargando producto:', error);
            } finally {
                setCargando(false);
            }
        };

        cargarProducto();
    }, [id]);

    const manejarAgregarAlCarrito = async () => {
        if (!estaAutenticado) {
            navigate('/iniciar-sesion');
            return;
        }
        await agregarAlCarrito(producto.id, cantidad);
        alert('Producto agregado al carrito');
    };

    if (cargando) {
        return <div className="flex justify-center items-center min-h-screen">Cargando...</div>;
    }

    if (!producto) {
        return <div className="flex justify-center items-center min-h-screen">Producto no encontrado</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                    <div className="md:flex">
                        <div className="md:flex-shrink-0 md:w-1/2">
                            <img
                                className="h-96 w-full object-cover md:h-full"
                                src={producto.image}
                                alt={producto.name}
                            />
                        </div>
                        <div className="p-8 md:w-1/2 flex flex-col justify-center">
                            <div className="uppercase tracking-wide text-sm text-blue-600 dark:text-blue-400 font-semibold">
                                {producto.category}
                            </div>
                            <h1 className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                                {producto.name}
                            </h1>
                            <p className="mt-4 text-xl text-gray-500 dark:text-gray-300">
                                {producto.description}
                            </p>
                            <div className="mt-8 flex items-center">
                                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                                    ${producto.price.toFixed(2)}
                                </span>
                            </div>

                            <div className="mt-8 flex items-center gap-4">
                                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md">
                                    <button
                                        onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                                        className="px-3 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        -
                                    </button>
                                    <span className="px-3 py-1 text-gray-900 dark:text-white">{cantidad}</span>
                                    <button
                                        onClick={() => setCantidad(cantidad + 1)}
                                        className="px-3 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        +
                                    </button>
                                </div>
                                <button
                                    onClick={manejarAgregarAlCarrito}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1"
                                >
                                    Agregar al Carrito
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetalleProducto;
