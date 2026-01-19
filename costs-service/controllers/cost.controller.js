const Cost = require('../models/cost.model');
const Report = require('../models/report.model');
const axios = require('axios');
const logger = require('pino')({ level: 'info', transport: { target: 'pino-pretty' } });

const USER_SERVICE_URL = process.env.USER_SERVICE_URL;

// Add new cost
exports.addCost = async (req, res) => {
  try {
    const { userid, description, category, sum } = req.body;

    // Validation
    if (!userid || !description || !category || sum === undefined) {
      return res.status(400).json({
        id: 'MISSING_FIELDS',
        message: 'Missing required fields: userid, description, category, sum'
      });
    }

    const validCategories = ['food', 'health', 'housing', 'sports', 'education'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ id: 'INVALID_CATEGORY', message: 'Invalid category' });
    }

    // --- User existence check ---
    if (USER_SERVICE_URL) {
      try {
        const response = await axios.get(`${USER_SERVICE_URL}/api/users/exists/${userid}`);
        if (!response.data.exists) {
          return res.status(404).json({ id: 'USER_NOT_FOUND', message: `User with id ${userid} does not exist` });
        }
      } catch (err) {
        logger.error('Error connecting to User Service:', err.message);
        return res.status(500).json({ id: 'USER_SERVICE_ERROR', message: 'Cannot verify user existence' });
      }
    }

    const newCost = await Cost.create({
      userid,
      description,
      category,
      sum: parseFloat(sum),
      date: new Date()
    });

    res.status(201).json(newCost);
  } catch (error) {
    logger.error('Error adding cost:', error);
    res.status(500).json({ id: 'COST_ADD_ERROR', message: error.message });
  }
};

// Generate report (same as before)
exports.getReport = async (req, res) => {
  try {
    const { id, year, month } = req.query;
    const userid = parseInt(id);
    const yearNum = parseInt(year);
    const monthNum = parseInt(month);

    if (!userid || !yearNum || !monthNum) {
      return res.status(400).json({ id: 'MISSING_PARAMETERS', message: 'Missing parameters' });
    }
    if (monthNum < 1 || monthNum > 12) {
      return res.status(400).json({ id: 'INVALID_MONTH', message: 'Month must be 1-12' });
    }

    const now = new Date();
    const requestedDate = new Date(yearNum, monthNum - 1);
    const currentMonth = new Date(now.getFullYear(), now.getMonth());
    const isPastMonth = requestedDate < currentMonth;

    if (isPastMonth) {
      const cachedReport = await Report.findOne({ userid, year: yearNum, month: monthNum });
      if (cachedReport) {
        return res.status(200).json(cachedReport);
      }
    }

    const startDate = new Date(yearNum, monthNum - 1, 1);
    const endDate = new Date(yearNum, monthNum, 0, 23, 59, 59);

    const costs = await Cost.find({ userid, date: { $gte: startDate, $lte: endDate } });

    const categories = ['food', 'health', 'housing', 'sports', 'education'];
    const groupedCosts = categories.map(cat => ({
      [cat]: costs.filter(c => c.category === cat).map(c => ({
        sum: c.sum,
        description: c.description,
        day: c.date.getDate()
      }))
    }));

    const report = { userid, year: yearNum, month: monthNum, costs: groupedCosts };

    if (isPastMonth) {
      await Report.findOneAndUpdate({ userid, year: yearNum, month: monthNum }, report, { upsert: true, new: true });
    }

    res.status(200).json(report);
  } catch (error) {
    logger.error('Error generating report:', error);
    res.status(500).json({ id: 'REPORT_ERROR', message: error.message });
  }
};
