import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import PetsIcon from '@mui/icons-material/Pets';
import HomeIcon from '@mui/icons-material/Home';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <PetsIcon sx={{ mr: 2, fontSize: '2rem' }} />
        <Typography 
          variant="h6" 
          component={Link} 
          to={token ? "/citas" : "/"} 
          sx={{ 
            flexGrow: 1, 
            textDecoration: 'none', 
            color: 'white',
            fontWeight: 'bold',
            letterSpacing: '0.5px'
          }}
        >
          Patas & Colas Veterinaria
        </Typography>
        
        {token && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton 
              color="inherit" 
              component={Link} 
              to="/citas" 
              sx={{ mr: 1 }}
            >
              <HomeIcon />
            </IconButton>
            <Button 
              color="inherit" 
              onClick={handleLogout} 
              variant="outlined" 
              sx={{ 
                borderColor: 'white', 
                '&:hover': { 
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderColor: 'white'  
                } 
              }}
            >
              Cerrar sesión
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;