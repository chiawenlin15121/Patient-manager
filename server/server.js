const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const prisma = require('./db');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// 取得所有病患列表 (包含分頁與搜尋功能)
app.get('/api/patients', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5; // 預設每頁顯示 5 筆 (與前端設定一致)
    const search = req.query.search || '';
    const skip = (page - 1) * limit;

    const where = search ? {
        name: {
            contains: search,
            // 設定為 'insensitive' 以支援不分大小寫的搜尋 (適用於 PostgreSQL)
            mode: 'insensitive',
        }
    } : {};

    try {
        const [patients, total] = await Promise.all([
            prisma.patients.findMany({
                where,
                skip: skip,
                take: limit,
                orderBy: { id: 'asc' },
            }),
            prisma.patients.count({ where })
        ]);

        res.json({
            data: patients,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// 新增病患資料
app.post('/api/patients', async (req, res) => {
    const { name, gender, mrn, birth_date } = req.body;

    // 基礎欄位驗證
    if (!name || !gender || !mrn || !birth_date) {
        return res.status(400).json({ error: 'All fields (name, gender, mrn, birth_date) are required' });
    }

    try {
        const newPatient = await prisma.patients.create({
            data: {
                name,
                gender,
                mrn,
                birth_date: new Date(birth_date),
            },
        });
        res.status(201).json(newPatient); // 建立成功 (回傳 201 狀態碼)
    } catch (err) {
        console.error(err);
        // 處理 Prisma 的唯一約束衝突 (如病歷號重複)
        if (err.code === 'P2002') {
            return res.status(409).json({ error: 'Patient with this MRN already exists' });
        }
        res.status(500).json({ error: 'Server error' });
    }
});

// 取得病患總數
app.get('/api/patients/count', async (req, res) => {
    try {
        const count = await prisma.patients.count();
        res.json({ count });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// 取得特定病患的醫囑 (包含分頁與搜尋)
app.get('/api/patients/:id/orders', async (req, res) => {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;

    const where = {
        patient_id: Number(id),
        ...(search ? {
            message: {
                contains: search,
                mode: 'insensitive',
            }
        } : {})
    };

    try {
        const [orders, total] = await Promise.all([
            prisma.orders.findMany({
                where,
                skip: skip,
                take: limit,
                orderBy: { created_at: 'desc' },
            }),
            prisma.orders.count({
                where,
            })
        ]);

        res.json({
            data: orders,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// 新增醫囑
app.post('/api/orders', async (req, res) => {
    const { patient_id, message } = req.body;
    try {
        const newOrder = await prisma.orders.create({
            data: {
                patient_id: Number(patient_id),
                message: message,
            },
        });
        res.json(newOrder);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// 更新醫囑內容
app.put('/api/orders/:id', async (req, res) => {
    const { id } = req.params;
    const { message } = req.body;
    try {
        const updatedOrder = await prisma.orders.update({
            where: { id: Number(id) },
            data: {
                message: message,
                updated_at: new Date(), // 手動更新最後修改時間
            },
        });
        res.json(updatedOrder);
    } catch (err) {
        console.error(err);
        if (err.code === 'P2025') { // 找不到欲更新的紀錄
            return res.status(404).json({ error: 'Order not found' });
        }
        res.status(500).json({ error: 'Server error' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
