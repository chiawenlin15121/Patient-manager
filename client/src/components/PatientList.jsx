
import { List, ListItem, ListItemButton, ListItemText, ListItemAvatar, Avatar, Typography, Paper, Box, Pagination, Stack, Button, CircularProgress, Alert, LinearProgress, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import React, { useState, useEffect } from 'react';
import usePatients from '../hooks/usePatients';
import AddPatientDialog from './AddPatientDialog';

const PatientList = ({ onSelectPatient }) => {
    const { patients, totalCount, page, setPage, limit, loading, error, refetch, searchQuery, setSearchQuery } = usePatients();
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(searchQuery);

    // 同步 URL 搜尋參數，並更新本地搜尋狀態
    useEffect(() => {
        setSearchTerm(searchQuery);
    }, [searchQuery]);

    // 處理搜尋關鍵字的防抖動 (Debounce)
    useEffect(() => {
        const handler = setTimeout(() => {
            setSearchQuery(searchTerm);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm, setSearchQuery]);

    const handleChangePage = (event, value) => {
        setPage(value);
    };

    if (loading && patients.length === 0 && !searchTerm) { // 初次載入且無搜尋動作時顯示完整 Loading
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
        <Paper elevation={3} sx={{ borderRadius: 4, overflow: 'hidden', bgcolor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)', height: '75vh', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.12)', display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" fontWeight="bold" color="primary">
                        病患列表
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        sx={{ borderRadius: 2 }}
                        onClick={() => setIsAddDialogOpen(true)}
                    >
                        新增病患
                    </Button>
                </Box>
                <TextField
                    variant="outlined"
                    size="small"
                    placeholder="搜尋病患名稱..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    fullWidth
                    sx={{ bgcolor: 'rgba(255,255,255,0.5)', borderRadius: 1 }}
                />
                <Typography variant="caption" color="text.secondary" align="right" sx={{ display: 'block' }}>
                    Total: {totalCount}
                </Typography>
            </Box>

            <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                {loading && <Box sx={{ width: '100%' }}><LinearProgress /></Box>}
                <List sx={{ width: '100%', p: 0 }}>
                    {patients.length > 0 ? (
                        patients.map((patient, index) => (
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
                        ))
                    ) : (
                        !loading && (
                            <Box sx={{ p: 4, textAlign: 'center' }}>
                                <Typography color="text.secondary">查無病患資料</Typography>
                            </Box>
                        )
                    )}
                </List>
            </Box>

            <Box sx={{ p: 2, borderTop: '1px solid rgba(0, 0, 0, 0.12)', display: 'flex', justifyContent: 'center' }}>
                <Stack spacing={2}>
                    <Pagination
                        count={Math.ceil(totalCount / limit)}
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
