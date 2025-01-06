const jwt = require('jsonwebtoken');

// Middleware xác thực JWT
const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    console.log('Auth Header:', authHeader);

    if (!authHeader) {
      console.log('No authorization header');
      return res.status(401).json({ message: 'Không có header xác thực' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      console.log('No token found in header');
      return res.status(401).json({ message: 'Không tìm thấy token' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error('Token verification error:', err);
        return res.status(403).json({ 
          message: 'Token không hợp lệ',
          error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
      }
      
      console.log('Decoded token:', decoded);
      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ 
      message: 'Lỗi xác thực',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Middleware kiểm tra quyền admin
const isAdmin = (req, res, next) => {
  console.log('Checking admin role for user:', req.user);
  if (!req.user) {
    return res.status(403).json({ message: 'Không có thông tin người dùng' });
  }
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Không có quyền admin' });
  }
  
  next();
};

// Middleware kiểm tra quyền customer
const isCustomer = (req, res, next) => {
  if (req.user && req.user.role === 'customer') {
    next();
  } else {
    res.status(403).json({ message: 'Không có quyền truy cập' });
  }
};

module.exports = {
  authenticateToken,
  isAdmin,
  isCustomer
}; 