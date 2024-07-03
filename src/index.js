import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'; // Importa o componente principal da aplicação
import '@fortawesome/fontawesome-free/css/all.min.css'; // Importa o CSS do FontAwesome

const rootElement = document.getElementById('root'); // Obtém o elemento root da aplicação no HTML

// Renderiza a aplicação React no elemento root usando ReactDOM.createRoot para modo assíncrono
ReactDOM.createRoot(rootElement).render(
    <React.StrictMode> {/* Modo estrito para detectar problemas potenciais na aplicação */}
        <App /> {/* Renderiza o componente principal da aplicação */}
    </React.StrictMode>
);
