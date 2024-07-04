// src/App.js

import React from 'react';
import FormularioEnvio from './FormularioEnvio';

/**
 * Componente principal da aplicação React.
 * 
 * Este componente renderiza o formulário de envio (FormularioEnvio).
 */
const App = () => {
    return (
        <>
        <div>
            <FormularioEnvio /> {/* Renderiza o componente FormularioEnvio */}
        </div>
        </>
        
    );
};

export default App;
