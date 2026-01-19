const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');

router.get('/about', adminController.getDevelopers);

module.exports = router;
