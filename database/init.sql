-- database/init.sql

-- Buat Tabel Employees
CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    position VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    salary INTEGER NOT NULL,
    hire_date TIMESTAMP NOT NULL,
    status VARCHAR(50) DEFAULT 'active'
);

-- Masukkan Data Dummy (Sample Data)
INSERT INTO employees (name, email, position, department, salary, hire_date, status) VALUES
('Ryan Developer', 'ryan@test.com', 'Backend Engineer', 'IT', 12000000, '2023-01-15', 'active'),
('Naya Manager', 'naya@test.com', 'HR Manager', 'HR', 15000000, '2022-05-20', 'active'),
('Budi Analyst', 'budi@test.com', 'Financial Analyst', 'Finance', 13000000, '2023-03-10', 'active'),
('Siti Marketing', 'siti@test.com', 'Marketing Specialist', 'Marketing', 11000000, '2023-07-01', 'active'),
('Eko DevOps', 'eko@test.com', 'DevOps Engineer', 'IT', 14000000, '2022-11-05', 'active');