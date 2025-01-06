const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// Route đăng nhập
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Lỗi server' });
    }

    if (results.length > 0) {
      const user = results[0];
      const token = jwt.sign(
        { 
          userId: user.user_id,
          role: user.role,
          email: user.email 
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        token,
        user: {
          userId: user.user_id,
          email: user.email,
          role: user.role,
          fullName: user.full_name
        }
      });
    } else {
      res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }
  });
});

// Route đăng ký
router.post('/register', authenticateToken, isAdmin, (req, res) => {
  const { username, email, password, full_name, role, is_active } = req.body;
  
  // Kiểm tra username và email đã tồn tại chưa
  const checkQuery = 'SELECT * FROM users WHERE username = ? OR email = ?';
  db.query(checkQuery, [username, email], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Lỗi server' });
    }

    if (results.length > 0) {
      return res.status(400).json({ 
        message: 'Username hoặc email đã tồn tại' 
      });
    }

    // Tạo user mới
    const insertQuery = `
      INSERT INTO users (username, email, password, full_name, role, is_active) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    db.query(
      insertQuery, 
      [username, email, password, full_name, role, is_active], 
      (err, result) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Lỗi khi tạo tài khoản' });
        }
        res.status(201).json({ 
          message: 'Tạo tài khoản thành công',
          userId: result.insertId 
        });
      }
    );
  });
});

// Route lấy thông tin user (yêu cầu xác thực)
router.get('/profile', authenticateToken, (req, res) => {
  const query = 'SELECT user_id, username, email, full_name, role FROM users WHERE user_id = ?';
  db.query(query, [req.user.userId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Lỗi server' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy user' });
    }
    res.json(results[0]);
  });
});

// Route cập nhật thông tin user (yêu cầu xác thực)
router.put('/update-profile', authenticateToken, (req, res) => {
  const { fullName, phone, address } = req.body;
  const query = 'UPDATE users SET full_name = ?, phone = ?, address = ? WHERE user_id = ?';
  
  db.query(query, [fullName, phone, address, req.user.userId], (err) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Lỗi khi cập nhật thông tin' });
    }
    res.json({ message: 'Cập nhật thành công' });
  });
});

// Route lấy danh sách users theo role
router.get('/list', authenticateToken, isAdmin, (req, res) => {
  const role = req.query.role;
  let query = `
    SELECT user_id, username, email, full_name, gender, 
           birth_date, phone, address, role, is_active, created_at 
    FROM users
  `;
  
  let queryParams = [];
  
  if (role && role !== '0') {
    query += ' WHERE role = ?';
    queryParams.push(role);
  }

  console.log('Query:', query);
  console.log('Role:', role);

  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Lỗi server' });
    }
    res.json(results);
  });
});

// Route cập nhật user (Admin)
router.put('/:id', authenticateToken, isAdmin, (req, res) => {
  const userId = req.params.id;
  const { username, email, full_name, phone, role, is_active } = req.body;
  
  const query = `
    UPDATE users 
    SET username = ?, 
        email = ?, 
        full_name = ?, 
        phone = ?,
        role = ?,
        is_active = ?
    WHERE user_id = ?
  `;
  
  db.query(
    query, 
    [username, email, full_name, phone, role, is_active, userId], 
    (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Lỗi khi cập nhật thông tin' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Không tìm thấy user' });
      }
      res.json({ message: 'Cập nhật thành công' });
    }
  );
});

// Route xóa user (Admin)
router.delete('/:id', authenticateToken, isAdmin, (req, res) => {
  const userId = req.params.id;
  
  // Kiểm tra không cho phép xóa tài khoản admin cuối cùng
  const checkAdminQuery = 'SELECT COUNT(*) as adminCount FROM users WHERE role = "admin"';
  db.query(checkAdminQuery, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Lỗi server' });
    }

    const adminCount = results[0].adminCount;
    
    // Kiểm tra user cần xóa có phải là admin không
    const checkUserQuery = 'SELECT role FROM users WHERE user_id = ?';
    db.query(checkUserQuery, [userId], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Lỗi server' });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'Không tìm thấy user' });
      }

      const userRole = results[0].role;
      
      // Nếu là admin cuối cùng thì không cho xóa
      if (userRole === 'admin' && adminCount <= 1) {
        return res.status(400).json({ 
          message: 'Không thể xóa admin cuối cùng' 
        });
      }

      // Tiến hành xóa user
      const deleteQuery = 'DELETE FROM users WHERE user_id = ?';
      db.query(deleteQuery, [userId], (err, result) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Lỗi khi xóa user' });
        }
        res.json({ message: 'Xóa user thành công' });
      });
    });
  });
});

module.exports = router;
