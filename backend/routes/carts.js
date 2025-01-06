const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

// Thêm middleware authenticateToken cho tất cả các routes
router.use(authenticateToken);

// Thêm sản phẩm vào giỏ hàng
router.post('/add', (req, res) => {
  console.log('Request body:', req.body);
  console.log('User from token:', req.user);

  const { book_id, user_id, quantity } = req.body;
  
  // Kiểm tra xem user_id từ token có khớp với user_id từ request
  if (parseInt(user_id) !== req.user.userId) {
    console.log('User ID mismatch:', { 
      fromRequest: user_id, 
      fromToken: req.user.userId 
    });
    return res.status(403).json({ 
      message: 'Không có quyền thực hiện hành động này',
      requestUserId: user_id,
      tokenUserId: req.user.userId
    });
  }

  // Kiểm tra nếu sản phẩm đã tồn tại trong giỏ hàng
  const checkQuery = 'SELECT * FROM cart_items WHERE book_id = ? AND user_id = ?';
  db.query(checkQuery, [book_id, user_id], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: err.message });
    }

    if (results.length > 0) {
      // Nếu sản phẩm đã tồn tại, tăng số lượng
      const updateQuery = 'UPDATE cart_items SET quantity = quantity + ? WHERE book_id = ? AND user_id = ?';
      db.query(updateQuery, [quantity, book_id, user_id], (updateErr) => {
        if (updateErr) {
          console.error('Update error:', updateErr);
          return res.status(500).json({ error: updateErr.message });
        }
        res.json({ message: 'Sản phẩm đã được cập nhật trong giỏ hàng' });
      });
    } else {
      // Nếu chưa tồn tại, thêm mới
      const insertQuery = 'INSERT INTO cart_items (book_id, user_id, quantity) VALUES (?, ?, ?)';
      db.query(insertQuery, [book_id, user_id, quantity], (insertErr) => {
        if (insertErr) {
          console.error('Insert error:', insertErr);
          return res.status(500).json({ error: insertErr.message });
        }
        res.json({ message: 'Sản phẩm đã được thêm vào giỏ hàng' });
      });
    }
  });
});

// Lấy danh sách sản phẩm trong giỏ hàng
router.get('/:user_id', (req, res) => {
  const user_id = req.params.user_id;
  
  // Kiểm tra xem user_id từ token có khớp với user_id từ params
  if (parseInt(user_id) !== req.user.userId) {
    return res.status(403).json({ message: 'Không có quyền truy cập giỏ hàng này' });
  }

  const query = `
    SELECT ci.cart_item_id, ci.quantity, b.book_id, b.title, b.price, b.image_url
    FROM cart_items ci
    INNER JOIN books b ON ci.book_id = b.book_id
    WHERE ci.user_id = ?`;

  db.query(query, [user_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Cập nhật số lượng sản phẩm trong giỏ hàng
router.put('/update', (req, res) => {
  const { cart_item_id, quantity } = req.body;

  if (quantity < 1) {
    return res.status(400).json({ message: 'Số lượng phải lớn hơn hoặc bằng 1' });
  }

  const query = 'UPDATE cart_items SET quantity = ? WHERE cart_item_id = ?';
  db.query(query, [quantity, cart_item_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Số lượng sản phẩm đã được cập nhật' });
  });
});

// Xóa sản phẩm khỏi giỏ hàng
router.delete('/remove/:cart_item_id', (req, res) => {
  const cart_item_id = req.params.cart_item_id;

  const query = 'DELETE FROM cart_items WHERE cart_item_id = ?';
  db.query(query, [cart_item_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Sản phẩm đã được xóa khỏi giỏ hàng' });
  });
});

// Đếm số lượng sản phẩm trong giỏ hàng
router.get('/count/:user_id', (req, res) => {
    const user_id = req.params.user_id;

    const query = `
        SELECT SUM(quantity) AS total_items 
        FROM cart_items 
        WHERE user_id = ?`;

    db.query(query, [user_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ total_items: results[0].total_items || 0 });
    });
});

module.exports = router;
