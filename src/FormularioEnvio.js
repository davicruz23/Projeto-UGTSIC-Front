import React, { useState } from 'react';
import axios from 'axios';
import InputMask from 'react-input-mask';
import './FormularioEnvio.css';

const FormularioEnvio = () => {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [cargoDesejado, setCargoDesejado] = useState('');
    const [escolaridade, setEscolaridade] = useState('');
    const [observacao, setObservacao] = useState('');
    const [arquivo, setArquivo] = useState(null);
    const [erroArquivo, setErroArquivo] = useState('');
    const [erroTelefone, setErroTelefone] = useState('');
    const [erroEmail, setErroEmail] = useState(''); // Estado para controlar o erro específico de email

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const allowedExtensions = /(\.doc|\.docx|\.pdf)$/i;

        if (file && file.size > 1048576) { // 1MB = 1048576 bytes
            setErroArquivo('O arquivo deve ter no máximo 1MB.');
            setArquivo(null);
        } else if (file && !allowedExtensions.exec(file.name)) {
            setErroArquivo('Apenas arquivos .doc, .docx ou .pdf são permitidos.');
            setArquivo(null);
        } else {
            setErroArquivo('');
            setArquivo(file);
        }
    };

    const validateForm = () => {
        if (!arquivo) {
            setErroArquivo('Arquivo obrigatório no formato .doc, .docx ou .pdf.');
            return false;
        }

        if (telefone.replace(/\D/g, '').length < 10) {
            setErroTelefone('O telefone deve ter pelo menos 11 dígitos.');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const formData = new FormData();
            formData.append('nome', nome);
            formData.append('email', email);
            formData.append('telefone', telefone);
            formData.append('cargoDesejado', cargoDesejado);
            formData.append('escolaridade', escolaridade);
            formData.append('observacao', observacao);
            formData.append('arquivo', arquivo);

            await axios.post('http://localhost:8080/formulario', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Limpar campos após o envio bem-sucedido
            setNome('');
            setEmail('');
            setTelefone('');
            setCargoDesejado('');
            setEscolaridade('');
            setObservacao('');
            setArquivo(null); // Resetar o estado do arquivo para null
            setErroArquivo('');
            setErroTelefone('');
            setErroEmail(''); // Limpar o erro específico de email

            // Exibir alerta de sucesso e redirecionar
            window.alert('Formulário enviado com sucesso!');
            window.location.href = '/'; // Redirecionar para a página inicial

        } catch (error) {
            if (error.response && error.response.status === 400) {
                // Exibir mensagem de erro do backend
                setErroEmail('Email em uso.');
            } else {
                console.error('Erro ao enviar formulário:', error);
            }
        }
    };

    // Ajustar a validação do telefone para exibir uma mensagem genérica quando inválido
    const handleTelefoneBlur = () => {
        if (telefone.replace(/\D/g, '').length < 10) {
            setErroTelefone('Número inválido.');
        } else {
            setErroTelefone('');
        }
    };

    return (
        <div className="form-container">
            <h2>Enviar Formulário</h2>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label>Nome Completo:</label>
                    <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />
                    <i className="fas fa-user"></i>
                </div>

                <div className="input-group">
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <i className="fas fa-envelope"></i>
                    {erroEmail && <p className="error-message">{erroEmail}</p>} {/* Exibir erro específico de email */}
                </div>

                <div className="input-group">
                    <label>Telefone:</label>
                    <InputMask
                        mask="(99)99999-9999"
                        value={telefone}
                        onChange={(e) => setTelefone(e.target.value)}
                        onBlur={handleTelefoneBlur}
                        required
                    >
                        {(inputProps) => <input {...inputProps} type="text" />}
                    </InputMask>
                    <i className="fas fa-phone"></i>
                    {erroTelefone && <p className="error-message">{erroTelefone}</p>}
                </div>

                <div className="input-group">
                    <label>Cargo Desejado:</label>
                    <input type="text" value={cargoDesejado} onChange={(e) => setCargoDesejado(e.target.value)} required />
                    <i className="fas fa-briefcase"></i>
                </div>

                <div className="input-group">
                    <label>Escolaridade:</label>
                    <select value={escolaridade} onChange={(e) => setEscolaridade(e.target.value)} required>
                        <option value="">Selecione...</option>
                        <option value="fundamental_incompleto">Fundamental Incompleto</option>
                        <option value="fundamental_completo">Fundamental Completo</option>
                        <option value="medio_incompleto">Médio Incompleto</option>
                        <option value="medio_completo">Médio Completo</option>
                        <option value="superior_incompleto">Superior Incompleto</option>
                        <option value="superior_completo">Superior Completo</option>
                        <option value="pos_graduacao_incompleto">Pós-Graduação Incompleto</option>
                        <option value="pos_graduacao_completo">Pós-Graduação Completo</option>
                        <option value="mestrado">Mestrado</option>
                        <option value="doutorado">Doutorado</option>
                    </select>
                    <i className="fas fa-graduation-cap"></i>
                </div>

                <div className="input-group">
                    <label>Observação:</label>
                    <textarea value={observacao} onChange={(e) => setObservacao(e.target.value)} />
                    <i className="fas fa-sticky-note"></i>
                </div>

                <div className="input-group">
                    <label>Anexo:</label>
                    <input type="file" onChange={handleFileChange} required />
                    <i className="fas fa-paperclip"></i>
                    {erroArquivo && <p className="error-message">{erroArquivo}</p>}
                </div>

                <button type="submit">Enviar</button>
            </form>
        </div>
    );
};

export default FormularioEnvio;
