# ITCJ SERVICIOS - Tienda en Línea

Aplicación web desarrollada con React y Vite para la gestión de servicios y productos del ITCJ. Este proyecto demuestra el uso de tecnologías modernas de frontend, manejo de estado global y persistencia de datos local.

## 🚀 Características

- **Catálogo de Servicios/Productos**: Visualización de productos con detalles individuales.
- **Carrito de Compras**: Funcionalidad completa de carrito (agregar, eliminar, vaciar, calcular total) utilizando Context API.
- **Autenticación de Usuarios**: Sistema de login y registro simulado con persistencia.
- **Gestión de Datos Persistente**:
  - Los datos (usuarios, carritos, órdenes, comentarios) se guardan en archivos JSON locales (`src/data/`) mediante un middleware personalizado de Vite.
  - Persistencia entre recargas de página.
- **Nuevas Vistas**:
  - **¿Quiénes Somos?**: Misión, Visión e Historia de la empresa.
  - **Ubicación y Contacto**:
    - Mapa interactivo de Google Maps.
    - Información de contacto (Dirección, Teléfono, Correo).
    - Formulario de contacto funcional con validaciones y guardado de comentarios.
- **Diseño Responsivo**: Interfaz adaptable a dispositivos móviles y escritorio utilizando **Tailwind CSS**.
- **Modo Oscuro**: Soporte para tema claro y oscuro.

## 🛠️ Tecnologías Utilizadas

- **React 19**: Biblioteca principal para la interfaz de usuario.
- **Vite**: Entorno de desarrollo y empaquetador.
- **Tailwind CSS**: Framework de estilos utilitarios.
- **React Router DOM**: Manejo de rutas y navegación.
- **Context API**: Manejo del estado global (Autenticación y Carrito).
- **Node.js (fs)**: Utilizado en el middleware de Vite para la persistencia de archivos.

## 📦 Instalación y Ejecución

1.  **Clonar el repositorio** (o descargar los archivos):
    ```bash
    git clone <url-del-repositorio>
    cd tienda
    ```

2.  **Instalar dependencias**:
    ```bash
    npm install
    ```

3.  **Ejecutar el servidor de desarrollo**:
    ```bash
    npm run dev
    ```

4.  **Abrir en el navegador**:
    La aplicación estará disponible generalmente en `http://localhost:5173`.

## 📂 Estructura del Proyecto

- `src/components`: Componentes reutilizables (BarraNavegacion, Footer, etc.).
- `src/context`: Contextos de React para estado global (Auth, Carrito).
- `src/data`: Archivos JSON que actúan como base de datos local.
- `src/pages`: Vistas principales de la aplicación (Inicio, Servicios, Contacto, etc.).
- `src/utils`: Utilidades, incluyendo `bd.js` para la lógica de persistencia.

## 📝 Funcionalidades Específicas (Rúbrica)

- **Eventos**: Se implementaron eventos como `onFocus`, `onBlur`, `onMouseOver`, `onMouseOut`, `onChange`, `onClick` en el formulario de contacto.
- **Validación**: El formulario de contacto valida campos vacíos y formato de correo electrónico.
- **Persistencia**: Los comentarios enviados desde el formulario se guardan permanentemente en `src/data/comentarios.json`.

---
Desarrollado para la materia de Programación Web - ITCJ.
