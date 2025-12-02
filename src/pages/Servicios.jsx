import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bd } from '../utils/bd';
import './Servicios.css';

const Servicios = () => {
    const [busqueda, setBusqueda] = useState('');
    const [filtroCategoria, setFiltroCategoria] = useState('Todos');
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const cargarProductos = async () => {
            try {
                const data = await bd.obtenerProductos();
                setProductos(data);
            } catch (error) {
                console.error('Error cargando productos:', error);
            } finally {
                setCargando(false);
            }
        };
        cargarProductos();
    }, []);

    const categorias = ['Todos', ...new Set(productos.map(producto => producto.category))];

    const productosFiltrados = productos.filter(producto => {
        const coincideBusqueda = producto.name.toLowerCase().includes(busqueda.toLowerCase()) ||
            producto.description.toLowerCase().includes(busqueda.toLowerCase());
        const coincideCategoria = filtroCategoria === 'Todos' || producto.category === filtroCategoria;
        return coincideBusqueda && coincideCategoria;
    });

    if (cargando) {
        return <div className="flex justify-center items-center min-h-screen">Cargando...</div>;
    }

    return (
        <div className="bg-white dark:bg-gray-900 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
                        Nuestros Servicios
                    </h2>
                    <p className="mt-4 text-xl text-gray-500 dark:text-gray-300">
                        Encuentra la solución perfecta para tus necesidades tecnológicas
                    </p>
                </div>

                {/* Filtros y Búsqueda */}
                <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="relative w-full md:w-96">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Buscar servicios..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                    </div>
                    <div className="w-full md:w-auto">
                        <select
                            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            value={filtroCategoria}
                            onChange={(e) => setFiltroCategoria(e.target.value)}
                        >
                            {categorias.map(categoria => (
                                <option key={categoria} value={categoria}>{categoria}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Lista de Servicios */}
                <div className="mt-12 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {productosFiltrados.map((producto) => (
                        <div key={producto.id} className="flex flex-col rounded-lg shadow-lg overflow-hidden bg-white dark:bg-gray-800 hover:shadow-xl transition-shadow duration-300">
                            <div className="flex-shrink-0">
                                <img className="h-48 w-full object-cover" src={producto.image} alt={producto.name} />
                            </div>
                            <div className="flex-1 p-6 flex flex-col justify-between">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                        {producto.category}
                                    </p>
                                    <Link to={`/servicios/${producto.id}`} className="block mt-2">
                                        <p className="text-xl font-semibold text-gray-900 dark:text-white">
                                            {producto.name}
                                        </p>
                                        <p className="mt-3 text-base text-gray-500 dark:text-gray-400">
                                            {producto.description}
                                        </p>
                                    </Link>
                                </div>
                                <div className="mt-6 flex items-center justify-between">
                                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                                        ${producto.price.toFixed(2)}
                                    </div>
                                    <Link
                                        to={`/servicios/${producto.id}`}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Ver detalles
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {productosFiltrados.length === 0 && (
                    <div className="text-center mt-12">
                        <p className="text-gray-500 dark:text-gray-400 text-lg">No se encontraron servicios que coincidan con tu búsqueda.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Servicios;
