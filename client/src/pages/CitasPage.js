import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Grid, Card, CardContent, Box
} from '@mui/material';
import api from '../services/api';

const CitasPage = () => {
  const [citas, setCitas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCitas = async () => {
      try {
        const res = await api.get('/citas');
        setCitas(res.data);
      } catch {
        localStorage.clear();
        navigate('/');
      }
    };
    fetchCitas();
  }, [navigate]);

  return (
    <Container maxWidth="md">
      <Box mt={5}>
        <Typography variant="h4" gutterBottom>Citas Programadas</Typography>
        <Grid container spacing={2}>
          {citas.length === 0 ? (
            <Typography>No hay citas pendientes.</Typography>
          ) : (
            citas.map((cita) => (
              <Grid item xs={12} sm={6} key={cita.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{new Date(cita.fecha).toLocaleString()}</Typography>
                    <Typography variant="body1">Motivo: {cita.motivo}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Box>
    </Container>
  );
};

export default CitasPage;