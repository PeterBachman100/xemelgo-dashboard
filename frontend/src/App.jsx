import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './components/common/NotificationWrapper';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme/theme';

import MainLayout from './components/layout/MainLayout';
import Login from './pages/Login';
import Items from './pages/Items';
import ItemDetail from './pages/ItemDetail';
import Home from "./pages/Home";
import Locations from "./pages/Locations";
import Users from "./pages/Users";
import Events from "./pages/Events";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <NotificationProvider>
          <BrowserRouter>
            <Routes>

              <Route path="/login" element={<Login />} />

              <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path='/items' element={<Items />} />
                  <Route path='/items/:id' element={<ItemDetail />} />
                  <Route path="/locations" element={<Locations />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/users" element={<Users />} />
                </Route>
              </Route>

              <Route path='*' element={<Navigate to='/' replace />} />

            </Routes>
          </BrowserRouter>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;