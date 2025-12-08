const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

// Definisi Route sesuai Dokumen 
router.get('/', employeeController.getAllEmployees);           // GET All
router.get('/:id', employeeController.getEmployeeById);        // GET One by ID
router.post('/', employeeController.createEmployee);           // POST New
router.put('/:id', employeeController.updateEmployee);         // PUT Update
router.delete('/:id', employeeController.deleteEmployee);      // DELETE


module.exports = router;