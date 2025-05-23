import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container, TextField, Button, Typography, Paper, MenuItem, Alert,
  Box, Grid, Avatar, InputAdornment
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PetsIcon from '@mui/icons-material/Pets';
import WorkIcon from '@mui/icons-material/Work';
import api from '../services/api';

const RegisterPage = () => {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [rol, setRol] = useState('cliente');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post('/register', { nombre, correo, contrasena, rol });
      setMensaje('Usuario registrado. Redirigiendo...');
      setTimeout(() => navigate('/'), 2000);
    } catch {
      setMensaje('Error al registrar usuario');
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <Paper elevation={3} sx={{ 
          p: 5, 
          width: '100%', 
          borderRadius: 2,
          maxWidth: 600,
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
        }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
            <Avatar sx={{ 
              m: 1, 
              bgcolor: 'secondary.main',
              width: 60,
              height: 60
            }}>
              <PetsIcon sx={{ fontSize: 35 }} />
            </Avatar>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
              Registro de Usuario
            </Typography>
            <Typography variant="body1" color="text.secondary" align="center">
              Únete a nuestra comunidad de amantes de las mascotas
            </Typography>
          </Box>

          <form onSubmit={handleRegister}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField 
                  label="Nombre completo" 
                  fullWidth 
                  value={nombre} 
                  onChange={(e) => setNombre(e.target.value)} 
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color="primary" />
                      </InputAdornment>
                    )
                  }}
                  required 
                />
              </Grid>
              <Grid item xs={12}>
                <TextField 
                  label="Correo electrónico" 
                  type="email"
                  fullWidth 
                  value={correo} 
                  onChange={(e) => setCorreo(e.target.value)} 
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="primary" />
                      </InputAdornment>
                    )
                  }}
                  required 
                />
              </Grid>
              <Grid item xs={12}>
                <TextField 
                  label="Contraseña" 
                  type="password" 
                  fullWidth 
                  value={contrasena} 
                  onChange={(e) => setContrasena(e.target.value)} 
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="primary" />
                      </InputAdornment>
                    )
                  }}
                  required 
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  label="Tipo de usuario"
                  fullWidth
                  value={rol}
                  onChange={(e) => setRol(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <WorkIcon color="primary" />
                      </InputAdornment>
                    )
                  }}
                >
                  <MenuItem value="cliente">Dueño de mascota</MenuItem>
                  <MenuItem value="veterinario">Médico veterinario</MenuItem>
                </TextField>
              </Grid>
            </Grid>
            
            <Button 
              variant="contained" 
              fullWidth 
              type="submit" 
              size="large"
              sx={{ 
                mt: 4, 
                py: 1.2,
                borderRadius: 2,
                fontWeight: 'bold'
              }}
            >
              Crear Cuenta
            </Button>
          </form>
          
          {mensaje && (
            <Alert 
              severity={mensaje.includes('Error') ? 'error' : 'success'} 
              sx={{ mt: 3, borderRadius: 2 }}
            >
              {mensaje}
            </Alert>
          )}
          
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2">
              ¿Ya tienes una cuenta? <Link to="/" style={{ color: '#4CAF50', fontWeight: 'bold' }}>Inicia sesión aquí</Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default RegisterPage;