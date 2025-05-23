import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container, TextField, Button, Typography, Box, Paper, InputAdornment,
  Grid, Card, CardMedia, Avatar
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PetsIcon from '@mui/icons-material/Pets';
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
    <Container maxWidth="lg">
      <Grid container spacing={2} sx={{ mt: 5, minHeight: '80vh' }}>
        <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Card sx={{ 
            width: '100%', 
            height: '100%', 
            maxHeight: 500,
            display: { xs: 'none', md: 'block' },
            boxShadow: 3,
            borderRadius: 2
          }}>
            <CardMedia
              component="img"
              image="https://images.unsplash.com/photo-1594009904612-60b38429ab4a?auto=format&fit=crop&q=80"
              alt="Veterinario con mascota"
              sx={{ 
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ 
            p: 5, 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 2,
            maxWidth: 500,
            mx: 'auto',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
          }}>
            <Avatar sx={{ 
              m: 1, 
              bgcolor: 'primary.main',
              width: 60,
              height: 60
            }}>
              <PetsIcon sx={{ fontSize: 35 }} />
            </Avatar>
            
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
              Bienvenido a Patas & Colas
            </Typography>
            
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <TextField
                label="Correo electrónico"
                type="email"
                fullWidth
                margin="normal"
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
                      <LockIcon color="primary" />
                    </InputAdornment>
                  )
                }}
                required
              />
              <Button 
                variant="contained" 
                fullWidth 
                type="submit" 
                size="large"
                sx={{ 
                  mt: 3, 
                  mb: 2, 
                  py: 1.2,
                  borderRadius: 2,
                  fontWeight: 'bold'
                }}
              >
                Iniciar Sesión
              </Button>
            </form>
            {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
            <Typography sx={{ mt: 3 }}>
              ¿No tienes cuenta? <Link to="/register" style={{ color: '#4CAF50', fontWeight: 'bold' }}>Regístrate aquí</Link>
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LoginPage;