const express = require('express');
const upload = require('../Middleware/handleFormData')

const student_router = express.Router();

const {
  handleGetStudent,
  handleAddNewStudent,
  handleEditStudent,
  handleDeleteStudent
} = require('../Controller/student_conyroller');

student_router.get('/list', handleGetStudent).post('/add',handleAddNewStudent).put('/update/:id',upload.any(),handleEditStudent).delete('/delete/:id',handleDeleteStudent)


module.exports = student_router