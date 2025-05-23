import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Grid, Card, CardContent, Box, Divider,
  Paper, Chip, Avatar, Button, Fab, CardHeader, CardActions,
  IconButton, Tooltip, Skeleton, Dialog, DialogTitle, DialogContent, 
  DialogActions, TextField, MenuItem, Select, FormControl, 
  InputLabel, FormHelperText, Snackbar, Alert, DialogContentText
} from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import EventIcon from '@mui/icons-material/Event';
import AddIcon from '@mui/icons-material/Add';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../services/api';

const CitasPage = () => {
  const [citas, setCitas] = useState([]);
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [citaToDelete, setCitaToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Form state
  const [formData, setFormData] = useState({
    mascota_id: '',
    fecha: new Date(),
    motivo: '',
    nombre_mascota: '',
    nombre_cliente: localStorage.getItem('username') || '',
    telefono: ''
  });
  const [formErrors, setFormErrors] = useState({});
  
  const navigate = useNavigate();
  const rol = localStorage.getItem('rol');

  useEffect(() => {
    fetchCitas();
    
    // Si el usuario es cliente, cargar sus mascotas
    if (rol === 'cliente') {
      fetchMascotas();
    }
  }, [rol, navigate]);
  
  const fetchCitas = async () => {
    try {
      setLoading(true);
      console.log('Obteniendo citas desde la API...');
      const res = await api.get('/citas');
      console.log('Citas recibidas:', res.data);
      setCitas(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar citas:', error);
      // Si hay un error de autenticación, redirigir al login
      if (error.response && error.response.status === 401) {
        localStorage.clear();
        navigate('/');
      } else if (error.response) {
        console.error('Respuesta de error:', error.response);
      }
      setLoading(false);
    }
  };
  
  const fetchMascotas = async () => {
    try {
      const res = await api.get('/mascotas/user');
      setMascotas(res.data);
    } catch (error) {
      console.error('Error al cargar mascotas:', error);
      showSnackbar('Error al cargar tus mascotas', 'error');
    }
  };
  
  // Funciones para manejar el formulario de creación de citas
  const handleOpenDialog = () => {
    // Ya no necesitamos verificar si hay mascotas
    setFormData({
      mascota_id: mascotas.length > 0 ? mascotas[0].id : '',
      fecha: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // Mañana
      motivo: '',
      nombre_mascota: '',
      nombre_cliente: localStorage.getItem('username') || '',
      telefono: ''
    });
    setFormErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar el error cuando el usuario corrige
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleDateChange = (newDate) => {
    setFormData(prev => ({
      ...prev,
      fecha: newDate
    }));
    
    // Limpiar el error cuando el usuario corrige
    if (formErrors.fecha) {
      setFormErrors(prev => ({
        ...prev,
        fecha: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Si no hay mascota_id, entonces necesitamos nombre_mascota
    if (!formData.mascota_id && (!formData.nombre_mascota || formData.nombre_mascota.trim() === '')) {
      errors.nombre_mascota = 'Debes indicar el nombre de la mascota';
    }
    
    // Siempre se necesita fecha y que sea en el futuro
    if (!formData.fecha) {
      errors.fecha = 'Debes seleccionar una fecha y hora';
    } else {
      const selectedDate = new Date(formData.fecha);
      const now = new Date();
      
      if (selectedDate <= now) {
        errors.fecha = 'La cita debe ser en el futuro';
      }
    }
    
    // El motivo es siempre obligatorio
    if (!formData.motivo || formData.motivo.trim() === '') {
      errors.motivo = 'Debes indicar el motivo de la consulta';
    }
    
    // El teléfono es obligatorio cuando no hay mascota registrada
    if (!formData.mascota_id && (!formData.telefono || formData.telefono.trim() === '')) {
      errors.telefono = 'Debes proporcionar un teléfono de contacto';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      console.log('Enviando datos de cita:', formData);
      await api.post('/citas', formData);
      
      // Recargar la lista de citas
      fetchCitas();
      
      // Cerrar el diálogo y mostrar notificación de éxito
      handleCloseDialog();
      showSnackbar('Cita programada con éxito', 'success');
    } catch (error) {
      console.error('Error al crear la cita:', error);
      
      if (error.response) {
        console.error('Respuesta de error:', error.response);
        if (error.response.data) {
          showSnackbar(error.response.data, 'error');
        } else if (error.response.status === 404) {
          showSnackbar('Error: Ruta no encontrada. Contacte al administrador.', 'error');
        } else {
          showSnackbar(`Error ${error.response.status}: ${error.response.statusText}`, 'error');
        }
      } else {
        showSnackbar('Error al programar la cita', 'error');
      }
    }
  };
  
  // Funciones para manejar la eliminación de citas
  const handleDeleteClick = (cita) => {
    setCitaToDelete(cita);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setCitaToDelete(null);
  };

  const handleDeleteCita = async () => {
    if (!citaToDelete) return;
    
    try {
      console.log(`Eliminando cita ID ${citaToDelete.id}`);
      await api.delete(`/citas/${citaToDelete.id}`);
      
      // Actualizar la lista de citas
      fetchCitas();
      
      // Cerrar el diálogo y mostrar notificación
      handleCloseDeleteDialog();
      showSnackbar('Cita cancelada con éxito', 'success');
    } catch (error) {
      console.error('Error al eliminar la cita:', error);
      if (error.response) {
        console.error('Respuesta de error:', error.response);
        showSnackbar(`Error: ${error.response.status} ${error.response.statusText}`, 'error');
      } else {
        showSnackbar('Error al cancelar la cita', 'error');
      }
    }
  };
  
  // Función para mostrar notificaciones
  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

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
                onClick={handleOpenDialog}
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
                  onClick={handleOpenDialog}
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
                    title={                        <Typography variant="h6" component="div">
                        {cita.mascota_nombre || "Mascota sin nombre"}
                      </Typography>
                    }
                    subheader={
                      <>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                          <EventIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {formatFecha(cita.fecha)}
                          </Typography>
                        </Box>
                        {cita.nombre_cliente && !cita.mascota_id && (
                          <Typography variant="caption" color="text.secondary" display="block">
                            Propietario: {cita.nombre_cliente}
                            {cita.telefono && ` - Tel: ${cita.telefono}`}
                          </Typography>
                        )}
                      </>
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
                    
                    <Box>
                      <Button 
                        size="small" 
                        color="secondary"
                      >
                        {rol === 'veterinario' ? 'Gestionar' : 'Detalles'}
                      </Button>
                      <IconButton 
                        color="error"
                        onClick={() => handleDeleteClick(cita)}
                        size="small"
                        sx={{ ml: 1 }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </CardActions>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Paper>
      
      {/* Modal para crear cita */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h5" fontWeight="bold" color="primary">
            Programar Nueva Cita
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2 }}>
            {mascotas.length > 0 && (
              <Box mb={2}>
                <Typography variant="subtitle1" gutterBottom>
                  Usar mascota registrada (opcional)
                </Typography>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="mascota-select-label">Mascota registrada</InputLabel>
                  <Select
                    labelId="mascota-select-label"
                    name="mascota_id"
                    value={formData.mascota_id}
                    label="Mascota registrada"
                    onChange={handleInputChange}
                  >
                    <MenuItem value="">-- Ninguna (mascota nueva) --</MenuItem>
                    {mascotas.map((mascota) => (
                      <MenuItem key={mascota.id} value={mascota.id}>
                        {mascota.nombre} - {mascota.especie} ({mascota.raza})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            )}
            
            {!formData.mascota_id && (
              <>
                <Typography variant="subtitle1" gutterBottom mt={2}>
                  Información de la mascota
                </Typography>
                <TextField
                  margin="normal"
                  fullWidth
                  name="nombre_mascota"
                  label="Nombre de la mascota"
                  value={formData.nombre_mascota}
                  onChange={handleInputChange}
                  error={!!formErrors.nombre_mascota}
                  helperText={formErrors.nombre_mascota}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  name="nombre_cliente"
                  label="Tu nombre completo"
                  value={formData.nombre_cliente}
                  onChange={handleInputChange}
                  error={!!formErrors.nombre_cliente}
                  helperText={formErrors.nombre_cliente || "Ingresa tu nombre para identificar la cita"}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  name="telefono"
                  label="Teléfono de contacto"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  error={!!formErrors.telefono}
                  helperText={formErrors.telefono}
                />
              </>
            )}
            
            <TextField
              margin="normal"
              fullWidth
              name="fecha"
              label="Fecha y hora de la cita"
              type="datetime-local"
              value={formData.fecha ? formData.fecha.toISOString().slice(0, 16) : ""}
              onChange={(e) => {
                const newDate = e.target.value ? new Date(e.target.value) : new Date();
                handleDateChange(newDate);
              }}
              error={!!formErrors.fecha}
              helperText={formErrors.fecha || "Seleccione fecha y hora para la cita"}
              InputLabelProps={{
                shrink: true,
              }}
            />
            
            <TextField
              margin="normal"
              fullWidth
              name="motivo"
              label="Motivo de la consulta"
              value={formData.motivo}
              onChange={handleInputChange}
              error={!!formErrors.motivo}
              helperText={formErrors.motivo}
              multiline
              rows={3}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button variant="contained" onClick={handleSubmit} color="primary">
            Programar Cita
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Diálogo para confirmar eliminación */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>
          Cancelar Cita
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que quieres cancelar esta cita{citaToDelete && ` para ${citaToDelete.mascota_nombre}`}?
            Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>No, Mantener</Button>
          <Button onClick={handleDeleteCita} color="error" variant="contained">
            Sí, Cancelar Cita
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar para notificaciones */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CitasPage;