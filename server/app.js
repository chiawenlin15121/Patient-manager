const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const prisma = require('./db');
const errorHandler = require('./middleware/errorHandler'); // 引入錯誤處理中間件

const app = express();

// 1. 安全標頭 (Security Headers)
app.use(helmet());

// 2. 請求速率限制 (Rate Limiting)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 分鐘
    limit: 300, // 每個 IP 限制 300 次請求
    standardHeaders: true, // 回傳 RateLimit-* 標頭
    legacyHeaders: false, // 停用 X-RateLimit-* 標頭
    message: { error: 'Too many requests, please try again later.' }
});
app.use(limiter);

// 3. CORS 限制 (只允許特定來源)
const corsOptions = {
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // 只允許前端開發伺服器
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
};
app.use(cors(corsOptions));

app.use(bodyParser.json());

// 取得所有病患列表 (包含分頁與搜尋功能)
app.get('/api/patients', async (req, res, next) => {
    try {
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
        next(err);
    }
});

// 新增病患資料
app.post('/api/patients', async (req, res, next) => {
    try {
        const { name, gender, mrn, birth_date } = req.body;

        // 基礎欄位驗證
        if (!name || !gender || !mrn || !birth_date) {
            const error = new Error('All fields (name, gender, mrn, birth_date) are required');
            error.name = 'ValidationError';
            throw error;
        }

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
        // 特別處理 Prisma P2002 錯誤，這裡也可以選擇讓 Global Handler 處理，
        // 但為了保留客製化訊息 (Patient with this MRN already exists)，我們先手動拋出帶有特定訊息的 error，
        // 或者直接讓 Global Handler 統一處理 P2002。
        // 這裡示範交給 Global Handler 統一處理 P2002。
        next(err);
    }
});

// 取得病患總數
app.get('/api/patients/count', async (req, res, next) => {
    try {
        const count = await prisma.patients.count();
        res.json({ count });
    } catch (err) {
        next(err);
    }
});

// 取得特定病患的醫囑 (包含分頁與搜尋)
app.get('/api/patients/:id/orders', async (req, res, next) => {
    try {
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
        next(err);
    }
});

// 新增醫囑
app.post('/api/orders', async (req, res, next) => {
    try {
        const { patient_id, message } = req.body;
        const newOrder = await prisma.orders.create({
            data: {
                patient_id: Number(patient_id),
                message: message,
            },
        });
        res.json(newOrder);
    } catch (err) {
        next(err);
    }
});

// 更新醫囑內容
app.put('/api/orders/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { message } = req.body;
        const updatedOrder = await prisma.orders.update({
            where: { id: Number(id) },
            data: {
                message: message,
                updated_at: new Date(), // 手動更新最後修改時間
            },
        });
        res.json(updatedOrder);
    } catch (err) {
        next(err);
    }
});

// 註冊全域錯誤處理中間件 (必須放在所有路由之後)
app.use(errorHandler);

module.exports = app;
