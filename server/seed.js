const prisma = require('./db');

const seedData = async () => {
    try {
        // Check if patients exist
        const count = await prisma.patients.count();

        if (count === 0) {
            console.log('Seeding patients...');
            const patients = [
                { name: '張志明', gender: 'Male', mrn: 'P001', birth_date: new Date('1980-01-01') },
                { name: '陳小美', gender: 'Female', mrn: 'P002', birth_date: new Date('1992-05-20') },
                { name: '林大山', gender: 'Male', mrn: 'P003', birth_date: new Date('1975-11-15') },
                { name: '黃雅婷', gender: 'Female', mrn: 'P004', birth_date: new Date('1988-03-30') },
                { name: '李建國', gender: 'Male', mrn: 'P005', birth_date: new Date('1960-08-08') },
            ];

            for (const p of patients) {
                await prisma.patients.create({
                    data: p
                });
            }
            console.log('Seeding completed.');
        } else {
            console.log('Patients already exist. Skipping seed.');
        }

    } catch (err) {
        console.error('Error seeding data:', err);
    } finally {
        await prisma.$disconnect();
    }
};

seedData();
