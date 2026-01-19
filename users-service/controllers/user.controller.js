//user.controller.js

const User = require('../models/user.model');
const Cost = require('../models/cost.model');

// Add new user
exports.addUser = async (req, res) => {
  try {
    const { id, first_name, last_name, birthday } = req.body;
    if (!id || !first_name || !last_name || !birthday)
      return res.status(400).json({ id: 'MISSING_FIELDS', message: 'Missing required fields: id, first_name, last_name, birthday' });

    const existingUser = await User.findOne({ id });
    if (existingUser) return res.status(400).json({ id: 'USER_EXISTS', message: 'User with this id already exists' });

    const newUser = await User.create({ id, first_name, last_name, birthday: new Date(birthday) });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ id: 'USER_ADD_ERROR', message: 'Failed to add user: ' + error.message });
  }
};

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ id: 'USER_FETCH_ERROR', message: 'Failed to fetch users: ' + error.message });
  }
};

// Get user details with total costs
exports.getUserById = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) return res.status(400).json({ id: 'INVALID_USER_ID', message: 'User ID must be a number' });

    const user = await User.findOne({ id: userId });
    if (!user) return res.status(404).json({ id: 'USER_NOT_FOUND', message: 'User not found' });

    const costs = await Cost.find({ userid: userId });
    const total = costs.reduce((sum, cost) => sum + cost.sum, 0);

    res.status(200).json({ first_name: user.first_name, last_name: user.last_name, id: user.id, total });
  } catch (error) {
    res.status(500).json({ id: 'USER_DETAIL_ERROR', message: 'Failed to fetch user details: ' + error.message });
  }
};

// Check if user exists
exports.checkUserExists = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const user = await User.findOne({ id: userId });
    res.status(200).json({ exists: !!user });
  } catch (error) {
    res.status(500).json({ id: 'USER_CHECK_ERROR', message: 'Failed to check user: ' + error.message });
  }
};
