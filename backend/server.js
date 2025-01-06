const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');

const bookRoutes = require('./routes/books');
const userRoutes = require('./routes/users');
const orderRoutes = require('./routes/orders');
const categoriesRoutes = require('./routes/categories');
const cartsRoutes = require('./routes/carts');
const booksController = require('./controllers/booksController');

dotenv.config();
const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:4200', // URL của frontend
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Cấu hình multer để xử lý file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // Đảm bảo thư mục uploads tồn tại
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Routes với file upload phải đặt trước các routes khác
app.post('/api/books', upload.single('image'), booksController.createBook);
app.put('/api/books/:id', upload.single('image'), booksController.updateBook);

// Các routes khác
app.use('/api/books', bookRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/carts', cartsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    message: 'Đã xảy ra lỗi từ server',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
