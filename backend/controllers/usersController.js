const db = require('../config/db');

// Lấy danh sách người dùng
const getUsers = (req, res) => {
    const query = 'SELECT * FROM users';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

// Lấy thông tin người dùng theo ID
const getUserById = (req, res) => {
    const query = 'SELECT * FROM users WHERE user_id = ?';
    db.query(query, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'User not found' });
        res.json(results[0]);
    });
};

// Thêm người dùng
const createUser = (req, res) => {
    const { username, email, password, full_name, role } = req.body;
    const query = 'INSERT INTO users (username, email, password, full_name, role) VALUES (?, ?, MD5(?), ?, ?)';
    db.query(query, [username, email, password, full_name, role], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'User created', userId: results.insertId });
    });
};

// Cập nhật người dùng
const updateUser = (req, res) => {
    const { full_name, email, phone, address, role, is_active } = req.body;
    const query = 'UPDATE users SET full_name = ?, email = ?, phone = ?, address = ?, role = ?, is_active = ? WHERE user_id = ?';
    db.query(query, [full_name, email, phone, address, role, is_active, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'User updated' });
    });
};

// Xóa người dùng
const deleteUser = (req, res) => {
    const query = 'DELETE FROM users WHERE user_id = ?';
    db.query(query, [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'User deleted' });
    });
};

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser };
