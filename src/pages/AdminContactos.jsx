import React, { useState, useEffect } from 'react';

const AdminContactos = () => {
    const [contactos, setContactos] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchContactos = async () => {
        try {

            const response = await fetch('http://localhost:8000/listar_contactos.php');
            const result = await response.json();

            if (result.success) {
                setContactos(result.data);
            } else {
                setError('Error al obtener datos: ' + result.message);
            }
        } catch (err) {
            console.error(err);
            setError('Error de conexión con el servidor PHP. Asegúrate de ejecutar: php -S localhost:8000 -t backend');

            setContactos([
                { id: 1, nombre: 'Juan Pérez (Demo)', email: 'juan@test.com', comentarios: 'Este es un dato de prueba porque falló la conexión.', fecha: '2023-12-06 12:00:00' }
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContactos();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar este contacto?')) return;

        try {
            const response = await fetch('http://localhost:8000/eliminar_contacto.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            const result = await response.json();

            if (result.success) {
                setContactos(contactos.filter(c => c.id !== id));
                alert('Contacto eliminado');
            } else {
                alert('Error al eliminar: ' + result.message);
            }
        } catch (err) {
            alert('Error de conexión');
        }
    };

    if (loading) return <div className="text-center p-10">Cargando contactos...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Panel de Administración - Contactos</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow-md rounded-lg">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Fecha
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Nombre
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Email
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Comentarios
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {contactos.map((contacto) => (
                            <tr key={contacto.id} className="border-b border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="px-5 py-5 text-sm bg-white dark:bg-gray-800">
                                    <p className="text-gray-900 dark:text-gray-300 whitespace-no-wrap">
                                        {contacto.fecha}
                                    </p>
                                </td>
                                <td className="px-5 py-5 text-sm bg-white dark:bg-gray-800">
                                    <p className="text-gray-900 dark:text-gray-300 whitespace-no-wrap">
                                        {contacto.nombre}
                                    </p>
                                </td>
                                <td className="px-5 py-5 text-sm bg-white dark:bg-gray-800">
                                    <p className="text-gray-900 dark:text-gray-300 whitespace-no-wrap">
                                        {contacto.email}
                                    </p>
                                </td>
                                <td className="px-5 py-5 text-sm bg-white dark:bg-gray-800">
                                    <p className="text-gray-900 dark:text-gray-300">
                                        {contacto.comentarios}
                                    </p>
                                </td>
                                <td className="px-5 py-5 text-sm bg-white dark:bg-gray-800">
                                    <button
                                        onClick={() => handleDelete(contacto.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {contactos.length === 0 && (
                            <tr>
                                <td colSpan="5" className="text-center py-4 text-gray-500">
                                    No hay contactos registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminContactos;
