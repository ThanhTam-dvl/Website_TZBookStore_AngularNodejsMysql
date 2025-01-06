const db = require('../config/db');
const ordersModel = require('../models/ordersModel');

// Lấy danh sách đơn hàng
const getOrders = (req, res) => {
    const query = 'SELECT * FROM orders';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

// Lấy thông tin đơn hàng theo ID
const getOrderById = (req, res) => {
    const orderQuery = 'SELECT * FROM orders WHERE order_id = ?';
    const itemsQuery = `
        SELECT oi.*, b.title, b.image_url
        FROM order_items oi
        JOIN books b ON oi.book_id = b.book_id
        WHERE oi.order_id = ?
    `;

    db.query(orderQuery, [req.params.id], (err, orderResults) => {
        if (err) return res.status(500).json({ error: err.message });
        if (orderResults.length === 0) return res.status(404).json({ message: 'Order not found' });

        db.query(itemsQuery, [req.params.id], (err, itemResults) => {
            if (err) return res.status(500).json({ error: err.message });

            const order = orderResults[0];
            order.items = itemResults;
            res.json(order);
        });
    });
};

// Tạo mới đơn hàng
const createOrder = async (req, res) => {
    try {
        const { 
            user_id, 
            customer_name, 
            email, 
            phone, 
            address, 
            payment_method, 
            order_notes, 
            items, 
            total_amount 
        } = req.body;

        // Kiểm tra user_id từ token
        if (user_id !== req.user.userId) {
            return res.status(403).json({ message: 'Không có quyền thực hiện hành động này' });
        }

        // Validate dữ liệu
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ 
                message: 'Đơn hàng phải có ít nhất một sản phẩm'
            });
        }

        // Thêm đơn hàng vào database
        ordersModel.addOrder({
            user_id, 
            customer_name, 
            email, 
            phone, 
            address, 
            payment_method, 
            order_notes, 
            total_amount
        }, (orderErr, orderId) => {
            if (orderErr) {
                console.error('Error creating order:', orderErr);
                return res.status(500).json({
                    message: 'Lỗi khi tạo đơn hàng',
                    error: orderErr.message
                });
            }

            // Thêm chi tiết đơn hàng
            ordersModel.addOrderItems(orderId, items, (itemsErr) => {
                if (itemsErr) {
                    console.error('Error adding order items:', itemsErr);
                    return res.status(500).json({
                        message: 'Lỗi khi thêm chi tiết đơn hàng',
                        error: itemsErr.message
                    });
                }

                // Trả về thông tin đơn hàng đã tạo
                res.status(201).json({
                    id: orderId,
                    message: 'Đơn hàng đã được tạo thành công',
                    user_id,
                    customer_name,
                    email,
                    phone,
                    address,
                    payment_method,
                    order_notes,
                    total_amount,
                    status: 'pending',
                    items: items
                });
            });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).json({
            message: 'Đã xảy ra lỗi khi xử lý đơn hàng',
            error: error.message
        });
    }
};

// Cập nhật trạng thái đơn hàng
const updateOrderStatus = (req, res) => {
    const { status } = req.body;
    const query = 'UPDATE orders SET status = ? WHERE order_id = ?';
    db.query(query, [status, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Order status updated' });
    });
};

// Xóa đơn hàng
const deleteOrder = (req, res) => {
    const query = 'DELETE FROM orders WHERE order_id = ?';
    db.query(query, [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Order deleted' });
    });
};

// Lấy danh sách đơn hàng của user
const getUserOrders = (req, res) => {
    console.log('Getting orders for user:', req.user.userId);
    const query = `
        SELECT o.*, 
               oi.book_id,
               b.title,
               b.image_url,
               oi.quantity,
               oi.price
        FROM orders o
        LEFT JOIN order_items oi ON o.order_id = oi.order_id
        LEFT JOIN books b ON oi.book_id = b.book_id
        WHERE o.user_id = ?
        ORDER BY o.created_at DESC
    `;

    db.query(query, [req.user.userId], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: err.message });
        }

        console.log('Raw database results:', results);

        // Nhóm các items theo order_id
        const orders = results.reduce((acc, curr) => {
            const order = acc.find(o => o.order_id === curr.order_id);
            if (order) {
                if (curr.book_id) {
                    order.items.push({
                        book_id: curr.book_id,
                        title: curr.title,
                        image_url: curr.image_url,
                        quantity: curr.quantity,
                        price: curr.price
                    });
                }
            } else {
                const newOrder = {
                    order_id: curr.order_id,
                    user_id: curr.user_id,
                    customer_name: curr.customer_name,
                    email: curr.email,
                    phone: curr.phone,
                    address: curr.address,
                    payment_method: curr.payment_method,
                    order_notes: curr.order_notes,
                    total_amount: curr.total_amount,
                    status: curr.status,
                    created_at: curr.created_at,
                    items: curr.book_id ? [{
                        book_id: curr.book_id,
                        title: curr.title,
                        image_url: curr.image_url,
                        quantity: curr.quantity,
                        price: curr.price
                    }] : []
                };
                acc.push(newOrder);
            }
            return acc;
        }, []);

        console.log('Processed orders:', orders);
        res.json(orders);
    });
};

// Hủy đơn hàng
const cancelOrder = (req, res) => {
    const orderId = req.params.id;
    const userId = req.user.userId;

    // Kiểm tra đơn hàng tồn tại và thuộc về user
    const checkQuery = 'SELECT * FROM orders WHERE order_id = ? AND user_id = ?';
    db.query(checkQuery, [orderId, userId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) {
            return res.status(404).json({ message: 'Đơn hàng không tồn tại hoặc không có quyền truy cập' });
        }

        const order = results[0];
        if (order.status !== 'pending') {
            return res.status(400).json({ 
                message: 'Chỉ có thể hủy đơn hàng ở trạng thái chờ xác nhận' 
            });
        }

        // Cập nhật trạng thái đơn hàng thành cancelled
        const updateQuery = 'UPDATE orders SET status = ? WHERE order_id = ?';
        db.query(updateQuery, ['cancelled', orderId], (updateErr) => {
            if (updateErr) return res.status(500).json({ error: updateErr.message });
            res.json({ message: 'Đơn hàng đã được hủy thành công' });
        });
    });
};

// Yêu cầu hủy đơn hàng
const requestCancelOrder = (req, res) => {
    const orderId = req.params.id;
    const userId = req.user.userId;

    // Kiểm tra đơn hàng tồn tại và thuộc về user
    const checkQuery = 'SELECT * FROM orders WHERE order_id = ? AND user_id = ?';
    db.query(checkQuery, [orderId, userId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) {
            return res.status(404).json({ message: 'Đơn hàng không tồn tại hoặc không có quyền truy cập' });
        }

        const order = results[0];
        if (order.status !== 'processing') {
            return res.status(400).json({ 
                message: 'Chỉ có thể yêu cầu hủy đơn hàng ở trạng thái đang xử lý' 
            });
        }

        // Cập nhật trạng thái đơn hàng thành cancel_requested
        const updateQuery = 'UPDATE orders SET status = ? WHERE order_id = ?';
        db.query(updateQuery, ['cancel_requested', orderId], (updateErr) => {
            if (updateErr) return res.status(500).json({ error: updateErr.message });
            res.json({ message: 'Yêu cầu hủy đơn hàng đã được gửi' });
        });
    });
};

// Xử lý yêu cầu hủy đơn hàng (chấp nhận)
const approveOrderCancellation = (req, res) => {
    const orderId = req.params.id;
    const query = 'UPDATE orders SET status = ? WHERE order_id = ?';
    
    db.query(query, ['cancelled', orderId], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Order cancellation approved' });
    });
};

// Xử lý yêu cầu hủy đơn hàng (từ chối)
const rejectOrderCancellation = (req, res) => {
    const orderId = req.params.id;
    const query = 'UPDATE orders SET status = ? WHERE order_id = ?';
    
    db.query(query, ['processing', orderId], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Order cancellation rejected' });
    });
};

// Thêm hàm mới
const getOrderStats = (req, res) => {
    const query = `
        SELECT 
            SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
            SUM(CASE WHEN status = 'processing' THEN 1 ELSE 0 END) as processing,
            SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
            SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled
        FROM orders
    `;
    
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results[0]);
    });
};

module.exports = { 
    getOrders, 
    getOrderById, 
    createOrder, 
    updateOrderStatus, 
    deleteOrder, 
    getUserOrders, 
    cancelOrder, 
    requestCancelOrder, 
    approveOrderCancellation, 
    rejectOrderCancellation, 
    getOrderStats 
};
