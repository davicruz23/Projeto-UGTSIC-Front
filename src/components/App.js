import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import FormulariosList from './FormulariosList';
import FormularioEnvio from './FormularioEnvio';

const App = () => {
    const [token, setToken] = useState(localStorage.getItem('token'));

    const handleLogin = (newToken) => {
        setToken(newToken);
        localStorage.setItem('token', newToken);
    };

    const handleLogout = () => {
        setToken(null);
        localStorage.removeItem('token');
    };

    return (
        <Router>
            <Routes>
                <Route path="/auth/login" element={<LoginForm onLogin={handleLogin} />} />
                <Route path="/formulario/enviar" element={<FormularioEnvio />} />
                <Route path="/formularios/list" element={token ? <FormulariosList token={token} onLogout={handleLogout} /> : <Navigate to="/auth/login" />} />
                <Route path="/" element={<Navigate to="/formulario/enviar" />} />
            </Routes>
        </Router>
    );
};

export default App;
