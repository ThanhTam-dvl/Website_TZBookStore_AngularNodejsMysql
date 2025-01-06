const db = require('../config/db');
const categoriesModel = require('../models/categoriesModel');

// Lấy danh sách loại sách
exports.getCategories = (req, res) => {
  categoriesModel.getAllCategories((err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};
