import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container, TextField, Button, Typography, Box, Paper, InputAdornment
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import api from '../services/api';

const LoginPage = () => {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/login', { correo, contrasena });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('rol', res.data.rol);
      navigate('/citas');
    } catch {
      setError('Credenciales inválidas');
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h4" gutterBottom>Iniciar Sesión</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Correo"
            type="email"
            fullWidth
            margin="normal"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              )
            }}
            required
          />
          <TextField
            label="Contraseña"
            type="password"
            fullWidth
            margin="normal"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              )
            }}
            required
          />
          <Button variant="contained" fullWidth type="submit" sx={{ mt: 2 }}>Entrar</Button>
        </form>
        {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
        <Typography sx={{ mt: 2 }}>¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link></Typography>
      </Paper>
    </Container>
  );
};

export default LoginPage;