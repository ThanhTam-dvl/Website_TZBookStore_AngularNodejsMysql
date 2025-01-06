const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { 
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
} = require('../controllers/ordersController');

// Áp dụng middleware xác thực cho tất cả các routes
router.use(authenticateToken);

// Đặt route /my-orders trước các routes có params
router.get('/my-orders', getUserOrders);
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.post('/', createOrder);
router.put('/:id', updateOrderStatus);
router.put('/:id/cancel', authenticateToken, cancelOrder);
router.put('/:id/request-cancel', authenticateToken, requestCancelOrder);
router.put('/:id/approve-cancellation', authenticateToken, approveOrderCancellation);
router.put('/:id/reject-cancellation', authenticateToken, rejectOrderCancellation);
router.delete('/:id', deleteOrder);
router.get('/stats', authenticateToken, getOrderStats);

module.exports = router;
