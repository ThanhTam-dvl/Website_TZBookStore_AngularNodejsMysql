const db = require('../config/db');

// Thêm đơn hàng
const addOrder = (order, callback) => {
    const { user_id, customer_name, email, phone, address, payment_method, order_notes, total_amount } = order;

    const sql = `
        INSERT INTO orders (
            user_id, customer_name, email, phone, address, 
            payment_method, order_notes, total_amount, status, 
            created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())
    `;

    db.query(sql, [
        user_id, customer_name, email, phone, address, 
        payment_method, order_notes, total_amount
    ], (err, result) => {
        if (err) {
            console.error('Lỗi khi thêm đơn hàng:', err);
            return callback(err, null);
        }
        callback(null, result.insertId);
    });
};

// Thêm sản phẩm vào đơn hàng
const addOrderItems = (orderId, items, callback) => {
    if (!items || items.length === 0) {
        return callback(new Error('Không có sản phẩm trong đơn hàng'), null);
    }

    // Chuẩn bị values cho bulk insert
    const values = items.map(item => [
        orderId,
        item.book_id,
        item.quantity,
        item.price,
        (item.price * item.quantity)
    ]);

    const sql = `
        INSERT INTO order_items 
        (order_id, book_id, quantity, price, subtotal)
        VALUES ?
    `;

    db.query(sql, [values], (err, result) => {
        if (err) {
            console.error('Lỗi khi thêm chi tiết đơn hàng:', err);
            // Nếu lỗi, xóa đơn hàng đã tạo
            db.query('DELETE FROM orders WHERE order_id = ?', [orderId]);
            return callback(err, null);
        }
        callback(null, result);
    });
};

module.exports = {
    addOrder,
    addOrderItems,
};
