import React, { useEffect, useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent,
    Button, IconButton, List, ListItem, ListItemText,
    TextField, Typography, Box, Paper
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import api from '../api';

const OrderDialog = ({ patient, open, onClose }) => {
    const [orders, setOrders] = useState([]);
    const [newOrderMode, setNewOrderMode] = useState(false);
    const [newOrderText, setNewOrderText] = useState('');
    const [editingOrderId, setEditingOrderId] = useState(null);
    const [editText, setEditText] = useState('');

    useEffect(() => {
        if (patient && open) {
            fetchOrders();
            setNewOrderMode(false);
            setEditingOrderId(null);
        }
    }, [patient, open]);

    const fetchOrders = async () => {
        try {
            const res = await api.get(`/patients/${patient.id}/orders`);
            setOrders(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddOrder = async () => {
        try {
            await api.post('/orders', { patient_id: patient.id, message: newOrderText });
            setNewOrderMode(false);
            setNewOrderText('');
            fetchOrders();
        } catch (err) {
            console.error(err);
        }
    };

    const handleSaveEdit = async (id) => {
        try {
            await api.put(`/orders/${id}`, { message: editText });
            setEditingOrderId(null);
            fetchOrders();
        } catch (err) {
            console.error(err);
        }
    };

    const startEdit = (order) => {
        setEditingOrderId(order.id);
        setEditText(order.message);
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
            PaperProps={{
                sx: {
                    borderRadius: 4,
                    background: '#fff',
                }
            }}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
                <Box>
                    <Typography variant="h5" fontWeight="bold">{patient?.name}</Typography>
                    <Typography variant="caption" color="text.secondary">病歷號: {patient?.mrn}</Typography>
                </Box>
                <Box>
                    {!newOrderMode && (
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => setNewOrderMode(true)}
                            sx={{ mr: 1, borderRadius: 2 }}
                        >
                            新增醫囑
                        </Button>
                    )}
                    <IconButton onClick={onClose} sx={{ bgcolor: '#f0f2f5', '&:hover': { bgcolor: '#e4e6eb' } }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent dividers sx={{ backgroundColor: '#f8f9fa', minHeight: '400px', p: 3 }}>
                {newOrderMode && (
                    <Paper sx={{ p: 3, mb: 3, borderRadius: 3, border: '2px solid #6c5ce7', boxShadow: '0 4px 20px rgba(108, 92, 231, 0.1)' }} elevation={0}>
                        <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>新增醫囑</Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            variant="outlined"
                            value={newOrderText}
                            onChange={(e) => setNewOrderText(e.target.value)}
                            placeholder="請輸入醫囑內容..."
                            autoFocus
                            sx={{ bgcolor: '#fff' }}
                        />
                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                            <Button onClick={() => setNewOrderMode(false)} color="inherit">取消</Button>
                            <Button variant="contained" onClick={handleAddOrder} disabled={!newOrderText.trim()}>儲存</Button>
                        </Box>
                    </Paper>
                )}

                <List disablePadding>
                    {orders.map((order) => (
                        <Paper key={order.id} sx={{ mb: 2, borderRadius: 3, overflow: 'hidden', transition: 'box-shadow 0.3s', '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.1)' } }} elevation={0} variant="outlined">
                            <ListItem
                                alignItems="flex-start"
                                sx={{ p: 2 }}
                                secondaryAction={
                                    editingOrderId === order.id ? null : (
                                        <IconButton edge="end" onClick={() => startEdit(order)} sx={{ mt: 1 }}>
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                    )
                                }
                            >
                                {editingOrderId === order.id ? (
                                    <Box sx={{ width: '100%', pr: 4 }}>
                                        <Typography variant="caption" color="primary" fontWeight="bold">編輯醫囑</Typography>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={2}
                                            value={editText}
                                            onChange={(e) => setEditText(e.target.value)}
                                            sx={{ mt: 1, bgcolor: '#fff' }}
                                        />
                                        <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                            <Button size="small" onClick={() => setEditingOrderId(null)}>取消</Button>
                                            <Button size="small" variant="contained" startIcon={<SaveIcon />} onClick={() => handleSaveEdit(order.id)}>更新</Button>
                                        </Box>
                                    </Box>
                                ) : (
                                    <ListItemText
                                        primary={
                                            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, color: '#2d3436' }}>{order.message}</Typography>
                                        }
                                        secondary={
                                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                                {new Date(order.created_at).toLocaleString('zh-TW')}
                                                {order.updated_at !== order.created_at && ' (已編輯)'}
                                            </Typography>
                                        }
                                    />
                                )}
                            </ListItem>
                        </Paper>
                    ))}
                    {!newOrderMode && orders.length === 0 && (
                        <Box sx={{ textAlign: 'center', py: 8, opacity: 0.6 }}>
                            <Typography variant="h6" color="text.secondary">尚無醫囑</Typography>
                            <Typography variant="body2" color="text.secondary">點擊上方按鈕新增第一筆醫囑</Typography>
                        </Box>
                    )}
                </List>
            </DialogContent>
        </Dialog>
    );
};

export default OrderDialog;
