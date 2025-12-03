import datosUsuarios from '../data/usuarios.json';
import datosProductos from '../data/productos.json';
import datosCarritos from '../data/carritos.json';
import datosOrdenes from '../data/ordenes.json';
import datosComentarios from '../data/comentarios.json';
import { v4 as uuidv4 } from 'uuid';

const CLAVES_BD = {
    USUARIOS: 'bd_usuarios',
    PRODUCTOS: 'bd_productos',
    CARRITOS: 'bd_carritos',
    ORDENES: 'bd_ordenes',
    COMENTARIOS: 'bd_comentarios'
};

const ARCHIVOS = {
    [CLAVES_BD.USUARIOS]: 'usuarios.json',
    [CLAVES_BD.PRODUCTOS]: 'productos.json',
    [CLAVES_BD.CARRITOS]: 'carritos.json',
    [CLAVES_BD.ORDENES]: 'ordenes.json',
    [CLAVES_BD.COMENTARIOS]: 'comentarios.json'
};

// Ayudante para guardar en el sistema de archivos vía middleware de Vite
const guardarEnArchivo = async (clave, datos) => {
    try {
        await fetch('/api/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                file: ARCHIVOS[clave],
                data: datos
            })
        });
    } catch (error) {
        console.error('Error guardando en archivo:', error);
    }
};

// Inicializar BD desde archivos JSON
const iniciarBD = () => {
    // Siempre recargar productos del JSON para tomar ediciones manuales
    localStorage.setItem(CLAVES_BD.PRODUCTOS, JSON.stringify(datosProductos));

    if (!localStorage.getItem(CLAVES_BD.USUARIOS)) {
        localStorage.setItem(CLAVES_BD.USUARIOS, JSON.stringify(datosUsuarios));
    }
    if (!localStorage.getItem(CLAVES_BD.CARRITOS)) {
        localStorage.setItem(CLAVES_BD.CARRITOS, JSON.stringify(datosCarritos));
    }
    if (!localStorage.getItem(CLAVES_BD.ORDENES)) {
        localStorage.setItem(CLAVES_BD.ORDENES, JSON.stringify(datosOrdenes));
    }
    if (!localStorage.getItem(CLAVES_BD.COMENTARIOS)) {
        localStorage.setItem(CLAVES_BD.COMENTARIOS, JSON.stringify(datosComentarios));
    }
};

const obtener = (clave) => {
    try {
        return JSON.parse(localStorage.getItem(clave) || '[]');
    } catch (e) {
        console.error(`Error parsing localStorage key "${clave}":`, e);
        return [];
    }
};
const establecer = (clave, datos) => {
    localStorage.setItem(clave, JSON.stringify(datos));
    guardarEnArchivo(clave, datos);
};

export const bd = {
    iniciarBD: iniciarBD,

    // Autenticación
    iniciarSesion: async (email, password) => {
        const usuarios = obtener(CLAVES_BD.USUARIOS);
        const usuario = usuarios.find(u => u.email === email && u.password === password);
        if (!usuario) throw new Error('Credenciales inválidas');
        return { token: 'fake-jwt-token', user: { id: usuario.id, name: usuario.name, email: usuario.email } };
    },

    registrarse: async (name, email, password) => {
        const usuarios = obtener(CLAVES_BD.USUARIOS);
        if (usuarios.find(u => u.email === email)) throw new Error('El usuario ya existe');

        const nuevoUsuario = { id: uuidv4(), name, email, password };
        usuarios.push(nuevoUsuario);
        establecer(CLAVES_BD.USUARIOS, usuarios);

        return { token: 'fake-jwt-token', user: { id: nuevoUsuario.id, name: nuevoUsuario.name, email: nuevoUsuario.email } };
    },

    // Productos
    obtenerProductos: async () => {
        return obtener(CLAVES_BD.PRODUCTOS);
    },

    obtenerProductoPorId: async (id) => {
        const productos = obtener(CLAVES_BD.PRODUCTOS);
        return productos.find(p => p.id === parseInt(id));
    },

    // Carrito
    obtenerCarrito: async (usuarioId) => {
        const carritos = obtener(CLAVES_BD.CARRITOS);
        let carrito = carritos.find(c => c.userId === usuarioId);
        if (!carrito) {
            carrito = { userId: usuarioId, items: [] };
            carritos.push(carrito);
            establecer(CLAVES_BD.CARRITOS, carritos);
        }
        return carrito.items;
    },

    agregarAlCarrito: async (usuarioId, productoId, cantidad) => {
        const productos = obtener(CLAVES_BD.PRODUCTOS);
        const producto = productos.find(p => p.id === parseInt(productoId));
        if (!producto) throw new Error('Producto no encontrado');

        const carritos = obtener(CLAVES_BD.CARRITOS);
        let carrito = carritos.find(c => c.userId === usuarioId);
        if (!carrito) {
            carrito = { userId: usuarioId, items: [] };
            carritos.push(carrito);
        }

        const itemExistente = carrito.items.find(item => item.productId === parseInt(productoId));
        if (itemExistente) {
            itemExistente.quantity += cantidad;
        } else {
            carrito.items.push({
                productId: parseInt(productoId),
                name: producto.name,
                price: producto.price,
                image: producto.image,
                quantity: cantidad
            });
        }
        establecer(CLAVES_BD.CARRITOS, carritos);
        return carrito.items;
    },

    eliminarDelCarrito: async (usuarioId, productoId) => {
        const carritos = obtener(CLAVES_BD.CARRITOS);
        const carrito = carritos.find(c => c.userId === usuarioId);
        if (carrito) {
            carrito.items = carrito.items.filter(item => item.productId !== parseInt(productoId));
            establecer(CLAVES_BD.CARRITOS, carritos);
            return carrito.items;
        }
        return [];
    },

    vaciarCarrito: async (usuarioId) => {
        const carritos = obtener(CLAVES_BD.CARRITOS);
        const carrito = carritos.find(c => c.userId === usuarioId);
        if (carrito) {
            carrito.items = [];
            establecer(CLAVES_BD.CARRITOS, carritos);
            return [];
        }
        return [];
    },

    // Ordenes
    crearOrden: async (usuarioId) => {
        const carritos = obtener(CLAVES_BD.CARRITOS);
        const carrito = carritos.find(c => c.userId === usuarioId);
        if (!carrito || carrito.items.length === 0) throw new Error('El carrito está vacío');

        const ordenes = obtener(CLAVES_BD.ORDENES);
        const nuevaOrden = {
            id: uuidv4(),
            userId: usuarioId,
            items: [...carrito.items],
            total: carrito.items.reduce((acc, item) => acc + item.price * item.quantity, 0),
            date: new Date().toISOString()
        };
        ordenes.push(nuevaOrden);
        establecer(CLAVES_BD.ORDENES, ordenes);

        carrito.items = [];
        establecer(CLAVES_BD.CARRITOS, carritos);

        return nuevaOrden;
    },

    obtenerOrdenes: async (usuarioId) => {
        const ordenes = obtener(CLAVES_BD.ORDENES);
        return ordenes.filter(o => o.userId === usuarioId);
    },

    // Comentarios
    guardarComentario: async (comentario) => {
        const comentarios = obtener(CLAVES_BD.COMENTARIOS);
        const nuevoComentario = { ...comentario, id: uuidv4(), fecha: new Date().toISOString() };
        comentarios.push(nuevoComentario);
        establecer(CLAVES_BD.COMENTARIOS, comentarios);
        return nuevoComentario;
    }
};
