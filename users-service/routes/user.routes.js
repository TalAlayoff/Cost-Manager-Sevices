//user.routes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

router.post('/add', userController.addUser);
router.get('/users', userController.getUsers);
router.get('/users/:id', userController.getUserById);
router.get('/users/exists/:id', userController.checkUserExists);

module.exports = router;
