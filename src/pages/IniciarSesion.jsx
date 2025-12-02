import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { usarAutenticacion } from '../context/ContextoAutenticacion';

const IniciarSesion = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { iniciarSesion } = usarAutenticacion();
    const navigate = useNavigate();

    const manejarEnvio = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const resultado = await iniciarSesion(email, password);
            if (resultado) {
                navigate('/');
            }
        } catch (err) {
            setError('Error al iniciar sesión');
        }
    };

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-white dark:bg-gray-900">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white">
                    Inicia sesión en tu cuenta
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" onSubmit={manejarEnvio}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                            Correo electrónico
                        </label>
                        <div className="mt-2">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 dark:bg-gray-800 dark:text-white dark:ring-gray-700"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                                Contraseña
                            </label>
                        </div>
                        <div className="mt-2">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 dark:bg-gray-800 dark:text-white dark:ring-gray-700"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-600 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                        >
                            Iniciar sesión
                        </button>
                    </div>
                </form>

                <p className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
                    ¿No tienes una cuenta?{' '}
                    <Link to="/registro" className="font-semibold leading-6 text-blue-600 hover:text-blue-500 dark:text-blue-400">
                        Regístrate aquí
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default IniciarSesion;
