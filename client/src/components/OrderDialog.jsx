import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent,
    Button, IconButton, List, ListItem, ListItemText,
    TextField, Typography, Box, Paper, Pagination, Stack, CircularProgress, InputAdornment
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import orderService from '../services/orderService';
import useOrders from '../hooks/useOrders';

const OrderDialog = ({ patient, open, onClose }) => {
    const { orders, totalCount, page, setPage, limit, loading, refetch, searchQuery, setSearchQuery } = useOrders(patient?.id);
    const [newOrderMode, setNewOrderMode] = useState(false);
    const [newOrderText, setNewOrderText] = useState('');
    const [editingOrderId, setEditingOrderId] = useState(null);
    const [editText, setEditText] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    // 處理搜尋關鍵字的防抖動 (Debounce)
    useEffect(() => {
        const handler = setTimeout(() => {
            setSearchQuery(searchTerm);
            if (searchTerm !== searchQuery) {
                setPage(1); // 搜尋時重置回第一頁
            }
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm, setSearchQuery, searchQuery, setPage]);

    // 開啟對話框時重置搜尋狀態
    useEffect(() => {
        if (open) {
            setSearchTerm('');
            setSearchQuery('');
        }
    }, [open, setSearchQuery]);


    const handleAddOrder = async () => {
        try {
            await orderService.createOrder({ patient_id: patient.id, message: newOrderText });
            setNewOrderMode(false);
            setNewOrderText('');
            refetch();
        } catch (err) {
            console.error(err);
        }
    };

    const handleSaveEdit = async (id) => {
        try {
            await orderService.updateOrder(id, { message: editText });
            setEditingOrderId(null);
            refetch();
        } catch (err) {
            console.error(err);
        }
    };

    const startEdit = (order) => {
        setEditingOrderId(order.id);
        setEditText(order.message);
    };

    const handleChangePage = (event, value) => {
        setPage(value);
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
            <DialogContent dividers sx={{ backgroundColor: '#f8f9fa', minHeight: '400px', p: 3, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ mb: 2 }}>
                    <TextField
                        size="small"
                        fullWidth
                        placeholder="搜尋醫囑內容..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ bgcolor: '#fff' }}
                    />
                </Box>

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

                {loading && !orders.length ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Box sx={{ flexGrow: 1 }}>
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
                                    <Typography variant="h6" color="text.secondary">
                                        {searchTerm ? '查無符合搜尋的醫囑' : '尚無醫囑'}
                                    </Typography>
                                    {!searchTerm && <Typography variant="body2" color="text.secondary">點擊上方按鈕新增第一筆醫囑</Typography>}
                                </Box>
                            )}
                        </List>
                    </Box>
                )}

                {/* 分頁控制區 */}
                {totalCount > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, pt: 2, borderTop: '1px solid #eee' }}>
                        <Pagination
                            count={Math.ceil(totalCount / limit)}
                            page={page}
                            onChange={handleChangePage}
                            color="primary"
                            size="small"
                        />
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default OrderDialog;
