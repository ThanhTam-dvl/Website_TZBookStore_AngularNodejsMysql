const db = require('../config/db');

// Lấy sách theo category_id
exports.getBooksByCategory = (categoryId, callback) => {
  const query = 'SELECT * FROM books WHERE category_id = ?';
  db.query(query, [categoryId], callback);
};
