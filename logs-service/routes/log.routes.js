//log.routs.js

const express = require('express');
const router = express.Router();
const logController = require('../controllers/log.controller');

router.get('/logs', logController.getLogs);
router.post('/add', logController.addLog);

module.exports = router;
