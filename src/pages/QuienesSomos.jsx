import React from 'react';

const QuienesSomos = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-white">¿Quiénes Somos?</h1>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold mb-4 text-indigo-600 dark:text-indigo-400">Nuestra Misión</h2>
                    <p className="text-gray-600 dark:text-gray-300">
                        Ofrecer a nuestros clientes los mejores productos con la más alta calidad y al mejor precio,
                        brindando una experiencia de compra única y satisfactoria, superando siempre sus expectativas.
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold mb-4 text-indigo-600 dark:text-indigo-400">Nuestra Visión</h2>
                    <p className="text-gray-600 dark:text-gray-300">
                        Ser la tienda líder en el mercado, reconocida por nuestra excelencia en servicio,
                        innovación constante y compromiso con la satisfacción total de nuestros clientes.
                    </p>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-6 text-indigo-600 dark:text-indigo-400 text-center">Nuestra Historia</h2>
                <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 space-y-4">
                    <p>
                        Fundada en 2024, nuestra empresa nació con el sueño de conectar a las personas con los productos que aman.
                        Lo que comenzó como un pequeño emprendimiento local, rápidamente creció gracias a la confianza de nuestros clientes.
                    </p>
                    <p>
                        A lo largo de nuestra trayectoria, hemos mantenido firmes nuestros valores de honestidad, integridad y pasión por el servicio.
                        Cada paso que damos está pensado en mejorar la vida de quienes confían en nosotros.
                    </p>
                    <p>
                        Hoy en día, seguimos innovando y expandiendo nuestro catálogo para ofrecerte siempre lo último y lo mejor.
                        Gracias por ser parte de nuestra historia.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default QuienesSomos;
