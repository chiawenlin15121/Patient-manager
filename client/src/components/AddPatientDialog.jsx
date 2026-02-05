import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Stack
} from '@mui/material';
import patientService from '../services/patientService';

const AddPatientDialog = ({ open, onClose, onPatientAdded }) => {
    const [formData, setFormData] = useState({
        name: '',
        mrn: '',
        gender: '',
        birth_date: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async () => {
        try {
            await patientService.createPatient(formData);
            onPatientAdded();
            onClose();
            // 重置表單
            setFormData({
                name: '',
                mrn: '',
                gender: '',
                birth_date: ''
            });
        } catch (err) {
            console.error("Failed to add patient", err);
            alert("Failed to add patient. Please check if MRN is unique.");
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Add New Patient</DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ mt: 1 }}>
                    <TextField
                        name="name"
                        label="Name"
                        fullWidth
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        name="mrn"
                        label="Medical Record Number (MRN)"
                        fullWidth
                        value={formData.mrn}
                        onChange={handleChange}
                        required
                    />
                    <FormControl fullWidth required>
                        <InputLabel>Gender</InputLabel>
                        <Select
                            name="gender"
                            value={formData.gender}
                            label="Gender"
                            onChange={handleChange}
                        >
                            <MenuItem value="Male">Male</MenuItem>
                            <MenuItem value="Female">Female</MenuItem>
                            <MenuItem value="Other">Other</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        name="birth_date"
                        label="Birth Date"
                        type="date"
                        fullWidth
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={formData.birth_date}
                        onChange={handleChange}
                        required
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddPatientDialog;
