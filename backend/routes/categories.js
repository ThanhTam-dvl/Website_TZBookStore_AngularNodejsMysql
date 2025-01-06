const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all categories
router.get('/', (req, res) => {
  const query = 'SELECT * FROM book_categories';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Create new category
router.post('/', (req, res) => {
    const { category_name, description } = req.body;
    
    if (!category_name) {
        return res.status(400).json({ error: 'Category name is required' });
    }

    const query = 'INSERT INTO book_categories (category_name, description) VALUES (?, ?)';
    db.query(query, [category_name, description || null], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ 
                error: 'Database error',
                details: err.message 
            });
        }
        res.status(201).json({
            message: 'Category created successfully',
            categoryId: results.insertId
        });
    });
});

// Delete category
router.delete('/:id', (req, res) => {
  const query = 'DELETE FROM book_categories WHERE category_id = ?';
  db.query(query, [req.params.id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Category deleted successfully' });
  });
});

module.exports = router;