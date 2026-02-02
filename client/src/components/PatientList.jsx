import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemButton, ListItemText, ListItemAvatar, Avatar, Typography, Paper } from '@mui/material';
import api from '../api';

const PatientList = ({ onSelectPatient }) => {
    const [patients, setPatients] = useState([]);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const res = await api.get('/patients');
                setPatients(res.data);
            } catch (err) {
                console.error("Failed to fetch patients, make sure server is running.", err);
            }
        };
        fetchPatients();
    }, []);

    return (
        <Paper elevation={3} sx={{ borderRadius: 4, overflow: 'hidden', bgcolor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)' }}>
            <List sx={{ width: '100%', p: 0 }}>
                {patients.map((patient, index) => (
                    <ListItem key={patient.id} disablePadding divider={index !== patients.length - 1}>
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
        </Paper>
    );
};

export default PatientList;
