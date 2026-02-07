const request = require('supertest');
const app = require('../app');
const prisma = require('../db');

// Mock prisma client
jest.mock('../db', () => ({
    patients: {
        findMany: jest.fn(),
        count: jest.fn(),
        create: jest.fn(),
    },
    orders: {
        findMany: jest.fn(),
        count: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    }
}));

describe('API Endpoints', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/patients', () => {
        it('should return a list of patients with pagination', async () => {
            const mockPatients = [
                { id: 1, name: 'John Doe', gender: 'Male', mrn: '123', birth_date: new Date() }
            ];
            prisma.patients.findMany.mockResolvedValue(mockPatients);
            prisma.patients.count.mockResolvedValue(1);

            const res = await request(app).get('/api/patients?page=1&limit=5');

            expect(res.statusCode).toEqual(200);
            expect(res.body.data).toHaveLength(1);
            expect(res.body.total).toEqual(1);
            expect(prisma.patients.findMany).toHaveBeenCalledTimes(1);
        });

        it('should handle search query', async () => {
            prisma.patients.findMany.mockResolvedValue([]);
            prisma.patients.count.mockResolvedValue(0);

            await request(app).get('/api/patients?search=John');

            expect(prisma.patients.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({
                        name: expect.objectContaining({
                            contains: 'John'
                        })
                    })
                })
            );
        });
    });

    describe('POST /api/patients', () => {
        it('should create a new patient', async () => {
            const newPatient = {
                name: 'Jane Doe',
                gender: 'Female',
                mrn: '456',
                birth_date: '2000-01-01'
            };
            prisma.patients.create.mockResolvedValue({ id: 2, ...newPatient, birth_date: new Date(newPatient.birth_date) });

            const res = await request(app).post('/api/patients').send(newPatient);

            expect(res.statusCode).toEqual(201);
            expect(res.body.name).toEqual('Jane Doe');
            expect(prisma.patients.create).toHaveBeenCalledTimes(1);
        });

        it('should return 400 if fields are missing', async () => {
            const res = await request(app).post('/api/patients').send({ name: 'Jane' });
            expect(res.statusCode).toEqual(400);
        });

        it('should return 409 if MRN exists', async () => {
            const newPatient = {
                name: 'Jane Doe',
                gender: 'Female',
                mrn: '456',
                birth_date: '2000-01-01'
            };
            const error = new Error('Unique constraint failed');
            error.code = 'P2002';
            prisma.patients.create.mockRejectedValue(error);

            const res = await request(app).post('/api/patients').send(newPatient);
            expect(res.statusCode).toEqual(409);
        });
    });

    describe('GET /api/patients/:id/orders', () => {
        it('should return orders for a patient', async () => {
            const mockOrders = [{ id: 1, message: 'Take meds', patient_id: 1 }];
            prisma.orders.findMany.mockResolvedValue(mockOrders);
            prisma.orders.count.mockResolvedValue(1);

            const res = await request(app).get('/api/patients/1/orders');

            expect(res.statusCode).toEqual(200);
            expect(res.body.data).toHaveLength(1);
        });
    });

    describe('POST /api/orders', () => {
        it('should create a new order', async () => {
            const newOrder = { patient_id: 1, message: 'New Order' };
            prisma.orders.create.mockResolvedValue({ id: 2, ...newOrder });

            const res = await request(app).post('/api/orders').send(newOrder);

            expect(res.statusCode).toEqual(200);
            expect(res.body.message).toEqual('New Order');
        });
    });
});
