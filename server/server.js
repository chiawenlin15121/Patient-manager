const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const prisma = require('./db');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Get all patients with pagination
app.get('/api/patients', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5; // Default limit 5 as per frontend rowsPerPage
    const skip = (page - 1) * limit;

    try {
        const [patients, total] = await Promise.all([
            prisma.patients.findMany({
                skip: skip,
                take: limit,
                orderBy: { id: 'asc' },
            }),
            prisma.patients.count()
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

// Create a new patient
app.post('/api/patients', async (req, res) => {
    const { name, gender, mrn, birth_date } = req.body;

    // Basic validation
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
        res.status(201).json(newPatient); // 201 Created
    } catch (err) {
        console.error(err);
        // Prisma unique constraint violation code
        if (err.code === 'P2002') {
            return res.status(409).json({ error: 'Patient with this MRN already exists' });
        }
        res.status(500).json({ error: 'Server error' });
    }
});

// Get patient count
app.get('/api/patients/count', async (req, res) => {
    try {
        const count = await prisma.patients.count();
        res.json({ count });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get orders for a patient with pagination
app.get('/api/patients/:id/orders', async (req, res) => {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    try {
        const [orders, total] = await Promise.all([
            prisma.orders.findMany({
                where: { patient_id: Number(id) },
                skip: skip,
                take: limit,
                orderBy: { created_at: 'desc' },
            }),
            prisma.orders.count({
                where: { patient_id: Number(id) },
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

// Create a new order
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

// Update an order
app.put('/api/orders/:id', async (req, res) => {
    const { id } = req.params;
    const { message } = req.body;
    try {
        const updatedOrder = await prisma.orders.update({
            where: { id: Number(id) },
            data: {
                message: message,
                updated_at: new Date(), // Manual update for timestamp
            },
        });
        res.json(updatedOrder);
    } catch (err) {
        console.error(err);
        if (err.code === 'P2025') { // Record to update not found
            return res.status(404).json({ error: 'Order not found' });
        }
        res.status(500).json({ error: 'Server error' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
