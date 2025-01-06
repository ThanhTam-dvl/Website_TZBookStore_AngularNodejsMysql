const db = require('../config/db');

// Lấy danh sách tất cả các loại sách
exports.getAllCategories = (callback) => {
  const query = 'SELECT * FROM book_categories';
  db.query(query, callback);
};
