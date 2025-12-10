import React, { useState } from 'react';
import { bd } from '../utils/bd';

const FormularioProducto = ({ alGuardar, alCancelar, producto = null }) => {
    const [nombre, setNombre] = useState(producto ? producto.name : '');
    const [descripcion, setDescripcion] = useState(producto ? producto.description : '');
    const [precio, setPrecio] = useState(producto ? producto.price : '');
    const [categoria, setCategoria] = useState(producto ? producto.category : '');
    const [imagen, setImagen] = useState(null);
    const [preview, setPreview] = useState(producto ? producto.image : null);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState('');

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagen(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCargando(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('name', nombre);
            formData.append('description', descripcion);
            formData.append('price', precio);
            formData.append('category', categoria);
            if (imagen) {
                formData.append('image', imagen);
            }
            if (producto) {
                formData.append('id', producto.id);
            }

            const resultado = producto
                ? await bd.actualizarProducto(formData)
                : await bd.crearProducto(formData);

            if (resultado.success) {
                alGuardar(resultado.product);
            } else {
                setError(resultado.message || 'Error al guardar producto');
            }
        } catch (err) {
            setError('Error de conexión al guardar producto');
            console.error(err);
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 my-8 p-6 relative">
                <button
                    onClick={alCancelar}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
                    {producto ? 'Editar Producto' : 'Nuevo Producto'}
                </h2>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre</label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                            className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción</label>
                        <textarea
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            rows="3"
                            className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Precio</label>
                            <input
                                type="number"
                                step="0.01"
                                value={precio}
                                onChange={(e) => setPrecio(e.target.value)}
                                required
                                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categoría</label>
                            <input
                                type="text"
                                value={categoria}
                                onChange={(e) => setCategoria(e.target.value)}
                                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Imagen</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-gray-300"
                        />
                        {preview && (
                            <div className="mt-2">
                                <img src={preview} alt="Vista previa" className="h-32 w-auto object-cover rounded border dark:border-gray-600" />
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={alCancelar}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={cargando}
                            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
                        >
                            {cargando ? 'Guardando...' : 'Guardar Producto'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormularioProducto;
