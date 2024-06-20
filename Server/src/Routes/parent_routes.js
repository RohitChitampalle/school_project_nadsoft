const express = require('express');

const parent_router = express.Router();

const {
    handleGetParent,
    handleAddNewParent,
    handleEditParent,
    handleDeleteParent,
} = require('../Controller/student_conyroller');

parent_router.get('/list', handleGetParent).post('/add',handleAddNewParent).put('/update/:id',handleEditParent).delete('/delete/:id',handleDeleteParent)


module.exports = parent_router