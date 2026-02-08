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
    Stack,
    Snackbar,
    Alert,
    FormHelperText
} from '@mui/material';
import patientService from '../services/patientService';

const AddPatientDialog = ({ open, onClose, onPatientAdded }) => {
    const [formData, setFormData] = useState({
        name: '',
        mrn: '',
        gender: '',
        birth_date: ''
    });

    const [error, setError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        // 當使用者修正欄位時，清除該欄位的錯誤訊息
        if (fieldErrors[name]) {
            setFieldErrors({
                ...fieldErrors,
                [name]: ''
            });
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.name.trim()) errors.name = "請輸入姓名";
        if (!formData.mrn.trim()) errors.mrn = "請輸入病歷號";
        if (!formData.gender) errors.gender = "請選擇性別";
        if (!formData.birth_date) errors.birth_date = "請選擇出生日期";

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

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
            setError(null);
            setFieldErrors({});
        } catch (err) {
            console.error("Failed to add patient", err);
            // 優先顯示後端回傳的具體錯誤訊息
            const message = err.response?.data?.error || err.message || "Failed to add patient";
            setError(message);
            setOpenSnackbar(true);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
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
                        error={!!fieldErrors.name}
                        helperText={fieldErrors.name}
                    />
                    <TextField
                        name="mrn"
                        label="Medical Record Number (MRN)"
                        fullWidth
                        value={formData.mrn}
                        onChange={handleChange}
                        required
                        error={!!fieldErrors.mrn}
                        helperText={fieldErrors.mrn}
                    />
                    <FormControl fullWidth required error={!!fieldErrors.gender}>
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
                        {fieldErrors.gender && <FormHelperText>{fieldErrors.gender}</FormHelperText>}
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
                        error={!!fieldErrors.birth_date}
                        helperText={fieldErrors.birth_date}
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    Add
                </Button>
            </DialogActions>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </Dialog>
    );
};

export default AddPatientDialog;
