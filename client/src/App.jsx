import React, { useState } from 'react';
import { ThemeProvider, CssBaseline, Container, Typography, Box } from '@mui/material';
import theme from './theme';
import PatientList from './components/PatientList';
import OrderDialog from './components/OrderDialog';

function App() {
  const [selectedPatient, setSelectedPatient] = useState(null);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
          py: 5
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" component="h1" fontWeight="800" sx={{ color: '#fff', textShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
              Patient Manager
            </Typography>
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)', mt: 1 }}>
              智慧醫療管理系統
            </Typography>
          </Box>

          <PatientList onSelectPatient={setSelectedPatient} />

          <OrderDialog
            patient={selectedPatient}
            open={!!selectedPatient}
            onClose={() => setSelectedPatient(null)}
          />
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
