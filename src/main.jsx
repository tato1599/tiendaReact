import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { bd } from './utils/bd'

// Inicializar la base de datos (cargar desde JSON si está vacía)
bd.iniciarBD();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
