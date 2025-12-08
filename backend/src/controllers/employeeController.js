const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 1. GET ALL EMPLOYEES
const getAllEmployees = async (req, res) => {
    const { department, status } = req.query;
    try {
        // kondisi filter
        let whereCondition = {};
        
        if (department) {
            whereCondition.department = department; // Filter by department
        }
        if (status) {
            whereCondition.status = status; // Filter by status
        }

        const employees = await prisma.employee.findMany({
            where: whereCondition, // Masukkan kondisi filter ke sini
            orderBy: { id: 'asc' }
        });
        
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ error: "Gagal mengambil data karyawan" });
    }
};

// 2. GET EMPLOYEE BY ID 
const getEmployeeById = async (req, res) => {
    const { id } = req.params;
    try {
        const employee = await prisma.employee.findUnique({
            where: { id: Number(id) }
        });
        
        if (!employee) {
            return res.status(404).json({ error: "Karyawan tidak ditemukan" });
        }
        
        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({ error: "Terjadi kesalahan server" });
    }
};

// 3. CREATE EMPLOYEE
const createEmployee = async (req, res) => {
    const { name, email, position, department, salary, hire_date } = req.body;

    // Validasi Input 
    if (!name || !email || !position || !department || !salary || !hire_date) {
        return res.status(400).json({ error: "Semua field harus diisi!" });
    }

    try {
        const newEmployee = await prisma.employee.create({
            data: {
                name,
                email,
                position,
                department,
                salary: Number(salary),
                hire_date: new Date(hire_date),
            }
        });
        res.status(201).json(newEmployee);
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(400).json({ error: "Email sudah terdaftar!" });
        }
        res.status(500).json({ error: error.message });
    }
};

// 4. UPDATE EMPLOYEE 
const updateEmployee = async (req, res) => {
    const { id } = req.params;
    const { name, email, position, department, salary, status } = req.body;
    
    if (!name && !email && !position && !department && !salary && !status) {
        return res.status(400).json({ error: "Tidak ada data yang dikirim untuk update" });
    }
    try {
        const updatedEmployee = await prisma.employee.update({
            where: { id: Number(id) },
            data: {
                name,
                email,
                position,
                department,
                salary: salary ? Number(salary) : undefined,
                status 
            }
        });
        res.status(200).json(updatedEmployee);
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: "Karyawan tidak ditemukan" });
        }
        res.status(500).json({ error: "Gagal mengupdate data" });
    }
};

// 5. DELETE EMPLOYEE 
const deleteEmployee = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.employee.delete({
            where: { id: Number(id) }
        });
        res.status(200).json({ message: "Karyawan berhasil dihapus" });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: "Karyawan tidak ditemukan" });
        }
        res.status(500).json({ error: "Gagal menghapus data" });
    }
};

// 6. GET STATISTICS
const getStats = async (req, res) => {
    try {
        // A. Hitung Total Semua Karyawan
        const totalEmployees = await prisma.employee.count();

        // B. Hitung Grouping per Departemen (Count & Avg Salary)
        const departmentStats = await prisma.employee.groupBy({
            by: ['department'],
            _count: {
                id: true, // Hitung jumlah ID per departemen
            },
            _avg: {
                salary: true, // Hitung rata-rata gaji per departemen
            },
        });

        const formattedStats = {
            total_employees: totalEmployees,
            department_breakdown: departmentStats.map(dept => ({
                department: dept.department,
                count: dept._count.id,
                average_salary: Math.round(dept._avg.salary || 0) 
            }))
        };

        res.status(200).json(formattedStats);
    } catch (error) {
        res.status(500).json({ error: "Gagal mengambil data statistik" });
    }
};

module.exports = {
    getAllEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getStats
};