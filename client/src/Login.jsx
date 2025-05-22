import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      
      // Guardar token en localStorage
      localStorage.setItem('token', response.data.token);
      
      // Redirigir a ruta protegida
      window.location = '/profile';
      
    } catch (error) {
      console.error('Error de login:', error.response.data);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        placeholder="Username"
        onChange={(e) => setFormData({...formData, username: e.target.value})}
      />
      <input 
        type="password" 
        placeholder="Password"
        onChange={(e) => setFormData({...formData, password: e.target.value})}
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;