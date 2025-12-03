import React, { useState } from 'react';
import { bd } from '../utils/bd';

const UbicacionContacto = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        comentarios: ''
    });
    const [errors, setErrors] = useState({});
    const [mensaje, setMensaje] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        // Limpiar error al escribir
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    const validate = () => {
        let tempErrors = {};
        if (!formData.nombre.trim()) tempErrors.nombre = "El nombre es obligatorio";
        if (!formData.email.trim()) {
            tempErrors.email = "El correo es obligatorio";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            tempErrors.email = "El correo no es válido";
        }
        if (!formData.comentarios.trim()) tempErrors.comentarios = "El comentario es obligatorio";

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            try {
                await bd.guardarComentario(formData);
                setMensaje('¡Gracias por tus comentarios! Se han enviado correctamente.');
                setFormData({ nombre: '', email: '', comentarios: '' });
                setTimeout(() => setMensaje(''), 3000);
            } catch (error) {
                console.error('Error al guardar comentario:', error);
                setMensaje('Hubo un error al enviar tu comentario. Inténtalo de nuevo.');
            }
        }
    };

    // Event Handlers demostrativos
    const handleFocus = (e) => console.log(`Focus en: ${e.target.name}`);
    const handleBlur = (e) => console.log(`Blur en: ${e.target.name}`);
    const handleMouseOver = (e) => console.log('Mouse Over formulario');
    const handleMouseOut = (e) => console.log('Mouse Out formulario');

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-white">Ubicación y Contacto</h1>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Sección de Ubicación */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold mb-6 text-indigo-600 dark:text-indigo-400">Nuestra Ubicación</h2>
                    <div className="space-y-4 text-gray-600 dark:text-gray-300">
                        <div>
                            <h3 className="font-bold text-lg">Dirección:</h3>
                            <p>Instituto Tecnológico de Ciudad Juárez (ITCJ)</p>
                            <p>Av. Tecnológico 1340, Fuentes del Valle</p>
                            <p>Ciudad Juárez, Chihuahua, México</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Teléfono:</h3>
                            <p>+52 (656) 123-4567</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Correo Electrónico:</h3>
                            <p>contacto@tiendaitcj.com</p>
                        </div>
                    </div>
                    <div className="mt-6 h-64 bg-gray-200 rounded-lg overflow-hidden shadow-md">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4215.795192209641!2d-106.42394532362225!3d31.72005227412319!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x86e75dc249fd3e4b%3A0x58a769357165487b!2sTecNM%20-%20Campus%20Cd.%20Ju%C3%A1rez!5e1!3m2!1ses!2smx!4v1764735533190!5m2!1ses!2smx"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Mapa de Ubicación ITCJ"
                        ></iframe>
                    </div>
                </div>

                {/* Sección de Contacto */}
                <div
                    className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
                    onMouseOver={handleMouseOver}
                    onMouseOut={handleMouseOut}
                >
                    <h2 className="text-2xl font-semibold mb-6 text-indigo-600 dark:text-indigo-400">Envíanos un Mensaje</h2>

                    {mensaje && (
                        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-center">
                            {mensaje}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="nombre">Nombre</label>
                            <input
                                type="text"
                                id="nombre"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                className={`w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white ${errors.nombre ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Tu nombre"
                            />
                            {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
                        </div>

                        <div>
                            <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="email">Correo Electrónico</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                className={`w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="tu@correo.com"
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="comentarios">Comentarios</label>
                            <textarea
                                id="comentarios"
                                name="comentarios"
                                value={formData.comentarios}
                                onChange={handleChange}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                rows="4"
                                className={`w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white ${errors.comentarios ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Escribe tus preguntas o comentarios aquí..."
                            ></textarea>
                            {errors.comentarios && <p className="text-red-500 text-sm mt-1">{errors.comentarios}</p>}
                        </div>

                        <button
                            type="submit"
                            onClick={(e) => console.log('Click en enviar')}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                        >
                            Enviar Mensaje
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UbicacionContacto;
