import React, { useState } from 'react';
import { List, ListItem, ListItemButton, ListItemText, ListItemAvatar, Avatar, Typography, Paper, Box, Pagination, Stack, Button, CircularProgress, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import usePatients from '../hooks/usePatients';
import AddPatientDialog from './AddPatientDialog';

const PatientList = ({ onSelectPatient }) => {
    const { patients, totalCount, loading, error, refetch } = usePatients();
    const [page, setPage] = useState(1);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const rowsPerPage = 5;

    const handleChangePage = (event, value) => {
        setPage(value);
    };

    // Calculate the current patients to display
    const indexOfLastPatient = page * rowsPerPage;
    const indexOfFirstPatient = indexOfLastPatient - rowsPerPage;
    const currentPatients = patients.slice(indexOfFirstPatient, indexOfLastPatient);

    if (loading && patients.length === 0) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Paper elevation={3} sx={{ p: 3, borderRadius: 4, bgcolor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)' }}>
                <Alert severity="error">
                    無法獲取資料，請確認後端伺服器是否運行。(Error: {error.message})
                </Alert>
            </Paper>
        );
    }

    return (
        <Paper elevation={3} sx={{ borderRadius: 4, overflow: 'hidden', bgcolor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)', height: '70vh', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.12)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1" fontWeight="bold" color="text.secondary">
                    Total Patients: {totalCount}
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    sx={{ borderRadius: 2 }}
                    onClick={() => setIsAddDialogOpen(true)}
                >
                    Add Patient
                </Button>
            </Box>

            <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                <List sx={{ width: '100%', p: 0 }}>
                    {currentPatients.map((patient, index) => (
                        <ListItem key={patient.id} disablePadding divider>
                            <ListItemButton onClick={() => onSelectPatient(patient)} sx={{ py: 2 }}>
                                <ListItemAvatar>
                                    <Avatar
                                        sx={{
                                            bgcolor: patient.gender === 'Male' ? '#6c5ce7' : '#ff7675',
                                            width: 50,
                                            height: 50,
                                            mr: 2
                                        }}
                                    >
                                        {patient.name[0]}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <Typography variant="h6" component="span" fontWeight="bold" color="text.primary">
                                            {patient.name}
                                        </Typography>
                                    }
                                    secondary={
                                        <React.Fragment>
                                            <Typography
                                                component="span"
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{ display: 'block', mt: 0.5 }}
                                            >
                                                病歷號: {patient.mrn}
                                            </Typography>
                                            <Typography
                                                component="span"
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                {patient.gender === 'Male' ? '男' : '女'} • {new Date(patient.birth_date).toLocaleDateString()}
                                            </Typography>
                                        </React.Fragment>
                                    }
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>

            <Box sx={{ p: 2, borderTop: '1px solid rgba(0, 0, 0, 0.12)', display: 'flex', justifyContent: 'center' }}>
                <Stack spacing={2}>
                    <Pagination
                        count={Math.ceil(patients.length / rowsPerPage)}
                        page={page}
                        onChange={handleChangePage}
                        color="primary"
                    />
                </Stack>
            </Box>

            <AddPatientDialog
                open={isAddDialogOpen}
                onClose={() => setIsAddDialogOpen(false)}
                onPatientAdded={refetch}
            />
        </Paper>
    );
};

export default PatientList;
