const express = require('express');
const { getBooks, getBookById, createBook, updateBook, deleteBook, getBooksByCategory, getLowStockBooks } = require('../controllers/booksController');

const router = express.Router();

router.get('/', getBooks);
// API để lấy 6 sản phẩm có số lượng ít nhất
router.get('/low-stock', getLowStockBooks);
router.get('/:id', getBookById);
router.post('/', createBook);
router.put('/:id', updateBook);
router.delete('/:id', deleteBook);

// API để lấy sách theo category_id
router.get('/category/:categoryId', getBooksByCategory);   


  

module.exports = router;
