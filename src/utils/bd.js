import { v4 as uuidv4 } from 'uuid';

const API_BASE = 'http://localhost:8000/api';

const handleResponse = async (response) => {
    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Error en la petición');
    }
    return response.json();
};

export const bd = {
    iniciarBD: () => {
        // Ya no es necesario inicializar localstorage
        console.log('Sistema conectado a BD MySQL vía API PHP');
    },

    // Autenticación
    iniciarSesion: async (email, password) => {
        const response = await fetch(`${API_BASE}/usuarios.php?action=login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        return handleResponse(response);
    },

    registrarse: async (name, email, password) => {
        const response = await fetch(`${API_BASE}/usuarios.php?action=register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: uuidv4(),
                name,
                email,
                password
            })
        });
        return handleResponse(response);
    },

    // Productos
    obtenerProductos: async () => {
        const response = await fetch(`${API_BASE}/productos.php`);
        return handleResponse(response);
    },

    obtenerProductoPorId: async (id) => {
        const response = await fetch(`${API_BASE}/productos.php?id=${id}`);
        return handleResponse(response);
    },

    // Carrito
    obtenerCarrito: async (usuarioId) => {
        const response = await fetch(`${API_BASE}/carritos.php?userId=${usuarioId}`);
        return handleResponse(response);
    },

    agregarAlCarrito: async (usuarioId, productoId, cantidad) => {
        const response = await fetch(`${API_BASE}/carritos.php?action=add&userId=${usuarioId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                productId,
                quantity: cantidad
            })
        });
        return handleResponse(response);
    },

    eliminarDelCarrito: async (usuarioId, productoId) => {
        const response = await fetch(`${API_BASE}/carritos.php?userId=${usuarioId}&productId=${productoId}`, {
            method: 'DELETE'
        });
        return handleResponse(response);
    },

    vaciarCarrito: async (usuarioId) => {
        const response = await fetch(`${API_BASE}/carritos.php?action=clear&userId=${usuarioId}`, {
            method: 'POST'
        });
        return handleResponse(response);
    },

    // Ordenes
    crearOrden: async (usuarioId) => {
        const response = await fetch(`${API_BASE}/ordenes.php?userId=${usuarioId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: uuidv4()
            })
        });
        return handleResponse(response);
    },

    obtenerOrdenes: async (usuarioId) => {
        const response = await fetch(`${API_BASE}/ordenes.php?userId=${usuarioId}`);
        return handleResponse(response);
    },

    // Comentarios
    guardarComentario: async (comentario) => {
        const response = await fetch(`${API_BASE}/comentarios.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...comentario,
                fecha: new Date().toISOString()
            })
        });
        return handleResponse(response);
    }
};
