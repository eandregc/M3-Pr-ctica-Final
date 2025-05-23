import React from 'react';
import { Box, Container, Typography, Link, Divider, Stack, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import PetsIcon from '@mui/icons-material/Pets';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 5,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.grey[100],
        borderTop: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'center', md: 'flex-start' },
            mb: 3
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 3, md: 0 } }}>
            <PetsIcon sx={{ mr: 1, color: 'primary.main', fontSize: 30 }} />
            <Typography variant="h6" color="primary" fontWeight="bold">
              Patas & Colas Veterinaria
            </Typography>
          </Box>
          
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={{ xs: 2, sm: 4 }}
            alignItems={{ xs: 'center', sm: 'flex-start' }}
          >
            <Box>
              <Typography variant="subtitle2" color="primary" gutterBottom fontWeight="bold">
                Servicios
              </Typography>
              <Link href="#" color="text.secondary" display="block" gutterBottom>Consultas</Link>
              <Link href="#" color="text.secondary" display="block" gutterBottom>Vacunación</Link>
              <Link href="#" color="text.secondary" display="block" gutterBottom>Peluquería</Link>
            </Box>
            
            <Box>
              <Typography variant="subtitle2" color="primary" gutterBottom fontWeight="bold">
                Horarios
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>Lun-Vie: 9:00 - 19:00</Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>Sábados: 9:00 - 14:00</Typography>
              <Typography variant="body2" color="text.secondary">Urgencias: 24h</Typography>
            </Box>
            
            <Box>
              <Typography variant="subtitle2" color="primary" gutterBottom fontWeight="bold">
                Contacto
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>Tel: (123) 456-7890</Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>Email: contacto@patascolas.com</Typography>
              <Typography variant="body2" color="text.secondary">Dirección: Calle Principal 123</Typography>
            </Box>
          </Stack>
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between'
          }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ mb: { xs: 2, sm: 0 } }}>
            © {new Date().getFullYear()} Patas & Colas Veterinaria. Todos los derechos reservados.
          </Typography>
          
          <Box>
            <IconButton color="primary" aria-label="facebook">
              <FacebookIcon />
            </IconButton>
            <IconButton color="primary" aria-label="twitter">
              <TwitterIcon />
            </IconButton>
            <IconButton color="primary" aria-label="instagram">
              <InstagramIcon />
            </IconButton>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
