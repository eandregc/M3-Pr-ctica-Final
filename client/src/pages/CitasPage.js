import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Grid, Card, CardContent, Box, Divider,
  Paper, Chip, Avatar, Button, Fab, CardHeader, CardActions,
  IconButton, Tooltip, Skeleton
} from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import EventIcon from '@mui/icons-material/Event';
import AddIcon from '@mui/icons-material/Add';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import api from '../services/api';

const CitasPage = () => {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const rol = localStorage.getItem('rol');

  useEffect(() => {
    const fetchCitas = async () => {
      try {
        setLoading(true);
        const res = await api.get('/citas');
        setCitas(res.data);
        setLoading(false);
      } catch {
        localStorage.clear();
        navigate('/');
      }
    };
    fetchCitas();
  }, [navigate]);

  const formatFecha = (fechaStr) => {
    const fecha = new Date(fechaStr);
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return fecha.toLocaleDateString('es-ES', options);
  };

  const getColorByDate = (fechaStr) => {
    const fecha = new Date(fechaStr);
    const hoy = new Date();
    const diferenciaDias = Math.floor((fecha - hoy) / (1000 * 60 * 60 * 24));
    
    if (diferenciaDias < 0) return 'text.secondary'; // Cita pasada
    if (diferenciaDias === 0) return 'error.main'; // Hoy
    if (diferenciaDias <= 2) return 'warning.main'; // Próximos 2 días
    return 'success.main'; // Más de 2 días
  };

  const CitasSkeleton = () => (
    <>
      {[1, 2, 3].map((item) => (
        <Grid item xs={12} sm={6} md={4} key={item}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardHeader
              avatar={<Skeleton variant="circular" width={40} height={40} />}
              title={<Skeleton variant="text" width="80%" />}
              subheader={<Skeleton variant="text" width="40%" />}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Skeleton variant="rectangular" width="100%" height={60} />
            </CardContent>
            <CardActions>
              <Skeleton variant="rectangular" width={100} height={30} />
            </CardActions>
          </Card>
        </Grid>
      ))}
    </>
  );

  return (
    <Container maxWidth="lg">
      <Paper 
        elevation={0} 
        sx={{ 
          p: { xs: 2, md: 5 }, 
          mt: 5, 
          mb: 5,
          borderRadius: 2,
          backgroundColor: 'transparent'
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 4
        }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
              Citas Veterinarias
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {rol === 'veterinario' 
                ? 'Gestiona las citas pendientes con tus pacientes' 
                : 'Consulta tus próximas citas con el veterinario'}
            </Typography>
          </Box>
          
          {rol !== 'veterinario' && (
            <Tooltip title="Programar nueva cita">
              <Fab 
                color="secondary" 
                aria-label="add" 
                sx={{ 
                  boxShadow: 3,
                  '&:hover': { transform: 'scale(1.05)' }
                }}
              >
                <AddIcon />
              </Fab>
            </Tooltip>
          )}
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Grid container spacing={3}>
          {loading ? (
            <CitasSkeleton />
          ) : citas.length === 0 ? (
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                justifyContent: 'center',
                py: 8,
                width: '100%'
              }}
            >
              <PetsIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No hay citas programadas
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center" sx={{ maxWidth: 400 }}>
                {rol === 'veterinario' 
                  ? 'No tienes consultas pendientes en este momento.' 
                  : 'Programa tu primera cita para atender a tu mascota.'}
              </Typography>
              
              {rol !== 'veterinario' && (
                <Button 
                  variant="contained" 
                  startIcon={<AddIcon />}
                  sx={{ mt: 3 }}
                >
                  Programar Cita
                </Button>
              )}
            </Box>
          ) : (
            citas.map((cita) => (
              <Grid item xs={12} sm={6} md={4} key={cita.id}>
                <Card sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  borderRadius: 2,
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  }
                }}>
                  <CardHeader
                    avatar={
                      <Avatar sx={{ bgcolor: getColorByDate(cita.fecha) }}>
                        <PetsIcon />
                      </Avatar>
                    }
                    title={
                      <Typography variant="h6" component="div">
                        {cita.mascota_nombre || "Mascota"}
                      </Typography>
                    }
                    subheader={
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                        <EventIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          {formatFecha(cita.fecha)}
                        </Typography>
                      </Box>
                    }
                  />
                  
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <MedicalInformationIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Motivo de consulta:
                        </Typography>
                        <Typography variant="body1">
                          {cita.motivo || "Consulta general"}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <AccessTimeIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        Duración estimada: 30 minutos
                      </Typography>
                    </Box>
                  </CardContent>
                  
                  <CardActions disableSpacing sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                    <Chip
                      label="Programada"
                      color="primary"
                      size="small"
                      sx={{ borderRadius: 1 }}
                    />
                    
                    <Button 
                      size="small" 
                      color="secondary"
                    >
                      {rol === 'veterinario' ? 'Gestionar' : 'Detalles'}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Paper>
    </Container>
  );
};

export default CitasPage;