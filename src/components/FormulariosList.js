import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'jspdf-autotable';
import { styled } from '@mui/system';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import './FormulariosList.css';

const useStyles = {
    root: {
        width: '90%',
        margin: '40px auto',
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    container: {
        maxHeight: 440,
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
    },
    logoutButton: {
        marginBottom: '10px',
        width: 'fit-content',
    },
};

const Root = styled(Paper)(useStyles.root);
const Container = styled(TableContainer)(useStyles.container);
const Header = styled('div')(useStyles.header);
const LogoutButton = styled(Button)(useStyles.logoutButton);

const FormulariosList = ({ token, onLogout }) => {
    const [formularios, setFormularios] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFormularios = async () => {
            try {
                const response = await axios.get('http://localhost:8080/formulario/list', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setFormularios(response.data);
            } catch (error) {
                console.error('Erro ao carregar formulários:', error);
            }
        };
        fetchFormularios();
    }, [token]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        onLogout();
        navigate('/auth/login');
    };

    const downloadPDF = async (formulario) => {
        try {
            const response = await axios.get(`http://localhost:8080/formulario/${formulario.id}/download`, {
                responseType: 'blob',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `'${formulario.arquivo}'${formulario.id}.pdf`);

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Erro ao baixar o PDF:', error);
        }
    };

    return (
        <Root>
            <Header>
                <h2>Formulários Recebidos</h2>
                <LogoutButton onClick={handleLogout} variant="contained" color="primary">
                    Sair
                </LogoutButton>
            </Header>
            <Container>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Id</TableCell>
                            <TableCell>Nome</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Telefone</TableCell>
                            <TableCell>Cargo Desejado</TableCell>
                            <TableCell>Observação</TableCell>
                            <TableCell>Arquivo</TableCell>
                            <TableCell>Download PDF</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {formularios.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((formulario) => (
                            <TableRow hover role="checkbox" tabIndex={-1} key={formulario.id}>
                                <TableCell>{formulario.id}</TableCell>
                                <TableCell>{formulario.nome}</TableCell>
                                <TableCell>{formulario.email}</TableCell>
                                <TableCell>{formulario.telefone}</TableCell>
                                <TableCell>{formulario.cargoDesejado}</TableCell>
                                <TableCell>{formulario.observacao}</TableCell>
                                <TableCell>{formulario.arquivo}</TableCell>
                                <TableCell>
                                    <Button onClick={() => downloadPDF(formulario)} variant="contained" color="secondary">
                                        Baixar PDF
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Container>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={formularios.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Root>
    );
};

export default FormulariosList;
