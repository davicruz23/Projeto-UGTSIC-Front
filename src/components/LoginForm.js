import React, { useState } from 'react';
import axios from 'axios';
import './LoginForm.css';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/auth/login', {
                username,
                password,
            });
            const token = response.data.token;
            console.log('Token recebido:', token);
            onLogin(token);
            navigate('/formularios/list');  // Redireciona após o login bem-sucedido
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            setError('Usuário ou senha incorretos. Verifique suas credenciais e tente novamente.');
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleLogin} className="login-form">
                <h2>Login Admin</h2>
                <div className="input-group">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default LoginForm;
