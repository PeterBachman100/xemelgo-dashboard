import React, { useEffect, useState } from 'react';
import { 
  Container, Paper, Typography, MenuItem, TextField, 
  Button, Box, CircularProgress, Alert 
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const Login = () => {
  const [staffList, setStaffList] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [password, setPassword] = useState('');
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  // Fetch the list of users for the dropdown
  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await api.get('/users');
        setStaffList(res.data);
      } catch (err) {
        setError('Could not load staff list. Is the server running?');
      } finally {
        setFetching(false);
      }
    };
    getUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(selectedUser, password);
      navigate('/'); // Go to dashboard on success
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    }
  };

  if (fetching) return (
    <Box display="flex" justifyContent="center" mt={10}><CircularProgress /></Box>
  );

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 15, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom align="center" sx={{ fontWeight: 700 }}>
            Warehouse Management System
          </Typography>
          <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 3 }}>
            Please select your persona to begin
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField
              select
              fullWidth
              label="Select Staff Member"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              margin="normal"
              required
            >
              {staffList.map((staff) => (
                <MenuItem key={staff._id} value={staff.name}>
                  {staff.name} ({staff.role})
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              helperText="Hint: 'password' for all seeded users"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 3, py: 1.5 }}
              disabled={!selectedUser || !password}
            >
              Sign In
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;