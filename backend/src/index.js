const express = require('express');
const cors = require('cors');
const employeeRoutes = require('./routes/employeeRoutes');
const statsRoutes = require('./routes/statsRoutes');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/employees', employeeRoutes);
app.use('/api/stats', statsRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});