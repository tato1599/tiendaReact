import React, { useState, useEffect } from 'react';
import { usarAutenticacion } from '../context/ContextoAutenticacion';
import { useNavigate } from 'react-router-dom';
import { bd } from '../utils/bd';

const PerfilUsuario = () => {
    const { usuario, estaAutenticado, establecerEstadoUsuario } = usarAutenticacion();
    const navigate = useNavigate();

    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
    const [procesando, setProcesando] = useState(false);

    useEffect(() => {
        if (!estaAutenticado) {
            navigate('/iniciar-sesion');
        } else if (usuario) {
            setNombre(usuario.name);
            setEmail(usuario.email);
        }
    }, [estaAutenticado, usuario, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje({ tipo: '', texto: '' });

        if (password && password !== confirmPassword) {
            setMensaje({ tipo: 'error', texto: 'Las contraseñas no coinciden' });
            return;
        }

        if (password && password.length < 6) {
            setMensaje({ tipo: 'error', texto: 'La contraseña debe tener al menos 6 caracteres' });
            return;
        }

        setProcesando(true);

        try {
            const datos = { name: nombre, email: email };
            if (password) {
                datos.password = password;
            }

            const resultado = await bd.actualizarPerfil(usuario.id, datos);

            if (resultado.success) {
                setMensaje({ tipo: 'exito', texto: 'Perfil actualizado correctamente' });
                establecerEstadoUsuario({ ...usuario, ...resultado.user });
                setPassword('');
                setConfirmPassword('');
            } else {
                setMensaje({ tipo: 'error', texto: resultado.message || 'Error al actualizar perfil' });
            }
        } catch (error) {
            setMensaje({ tipo: 'error', texto: 'Error de conexión: ' + error.message });
        } finally {
            setProcesando(false);
        }
    };

    if (!usuario) return null;

    return (
        <div className="container mx-auto px-4 py-8 max-w-lg">
            <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-white">Mi Perfil</h1>

            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                {mensaje.texto && (
                    <div className={`mb-4 px-4 py-3 rounded ${mensaje.tipo === 'error' ? 'bg-red-100 border border-red-400 text-red-700' : 'bg-green-100 border border-green-400 text-green-700'}`}>
                        {mensaje.texto}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="nombre">
                            Nombre
                        </label>
                        <input
                            type="text"
                            id="nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="email">
                            Correo Electrónico
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                            required
                        />
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Cambiar Contraseña (Opcional)</h3>

                        <div className="mb-4">
                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="password">
                                Nueva Contraseña
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                                placeholder="Dejar en blanco para no cambiar"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="confirmPassword">
                                Confirmar Nueva Contraseña
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={procesando}
                        className={`w-full font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-200 ${procesando ? 'bg-gray-400 cursor-not-allowed text-gray-800' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                    >
                        {procesando ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PerfilUsuario;
