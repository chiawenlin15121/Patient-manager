import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemButton, ListItemText, ListItemAvatar, Avatar, Typography, Paper, Box, Pagination, Stack, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import api from '../api';

const PatientList = ({ onSelectPatient }) => {
    const [patients, setPatients] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(1);
    const rowsPerPage = 5;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [patientsRes, countRes] = await Promise.all([
                    api.get('/patients'),
                    api.get('/patients/count')
                ]);
                setPatients(patientsRes.data);
                setTotalCount(countRes.data.count);
            } catch (err) {
                console.error("Failed to fetch data, make sure server is running.", err);
            }
        };
        fetchData();
    }, []);

    const handleChangePage = (event, value) => {
        setPage(value);
    };

    // Calculate the current patients to display
    const indexOfLastPatient = page * rowsPerPage;
    const indexOfFirstPatient = indexOfLastPatient - rowsPerPage;
    const currentPatients = patients.slice(indexOfFirstPatient, indexOfLastPatient);

    return (
        <Paper elevation={3} sx={{ borderRadius: 4, overflow: 'hidden', bgcolor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)', height: '70vh', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.12)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1" fontWeight="bold" color="text.secondary">
                    Total Patients: {totalCount}
                </Typography>
                <Button variant="contained" startIcon={<AddIcon />} sx={{ borderRadius: 2 }}>
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
        </Paper>
    );
};

export default PatientList;
