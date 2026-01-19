// Developer info hardcoded (per project spec)
const developers = [
  { first_name: 'Tal', last_name: 'Alayoff' },
  { first_name: 'Roie', last_name: 'Bohris' }
];

// Get developer info
exports.getDevelopers = async (req, res) => {
  try {
    res.status(200).json(developers);
  } catch (error) {
    res.status(500).json({ id: 'ADMIN_FETCH_ERROR', message: 'Failed to fetch developer info: ' + error.message });
  }
};
