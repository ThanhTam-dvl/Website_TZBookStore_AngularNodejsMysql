const db = require('../config/db');
const booksModel = require('../models/booksModel');

// Lấy danh sách sách
const getBooks = (req, res) => {
    const query = 'SELECT * FROM books';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
};

// Lấy thông tin sách theo ID
const getBookById = (req, res) => {
    const query = 'SELECT * FROM books WHERE book_id = ?';
    db.query(query, [req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json(results[0]);
    });
};

// Thêm sách mới
const createBook = (req, res) => {
    try {
        console.log("Create request body:", req.body);
        console.log("Create request file:", req.file);

        const { 
            title, 
            category_id, 
            author, 
            publisher, 
            description, 
            price, 
            stock_quantity, 
            published_date,
            image_url 
        } = req.body;

        // Validate required fields
        if (!title || !category_id || !author || !price || !stock_quantity) {
            return res.status(400).json({ 
                error: 'Missing required fields',
                required: ['title', 'category_id', 'author', 'price', 'stock_quantity']
            });
        }

        let finalImageUrl = null;
        if (req.file) {
            finalImageUrl = `/uploads/${req.file.filename}`;
        } else if (image_url) {
            finalImageUrl = image_url;
        }

        const query = `
            INSERT INTO books (
                title, 
                category_id, 
                author, 
                publisher, 
                description, 
                price, 
                stock_quantity, 
                published_date,
                image_url
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            title,
            category_id,
            author,
            publisher || null,
            description || null,
            price,
            stock_quantity,
            published_date || null,
            finalImageUrl
        ];

        console.log("SQL Query:", query);
        console.log("Insert values:", values);

        db.query(query, values, (err, results) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ 
                    error: 'Database error',
                    details: err.message,
                    sqlMessage: err.sqlMessage
                });
            }
            res.status(201).json({ 
                message: 'Book created successfully',
                bookId: results.insertId,
                results: results
            });
        });
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ 
            error: 'Server error',
            details: error.message
        });
    }
};

// Cập nhật sách
const updateBook = (req, res) => {
    console.log("Update request body:", req.body); // Thêm log để debug

    const bookId = req.params.id;
    const { 
        title, 
        category_id, 
        author, 
        publisher, 
        description, 
        price, 
        stock_quantity, 
        published_date,
        image_url 
    } = req.body;

    let updateFields = [
        title,
        category_id,
        author,
        publisher || null,
        description || null,
        price,
        stock_quantity,
        published_date || null
    ];

    let query = `
        UPDATE books 
        SET title = ?, 
            category_id = ?, 
            author = ?, 
            publisher = ?, 
            description = ?, 
            price = ?, 
            stock_quantity = ?, 
            published_date = ?
    `;

    // Nếu có file upload
    if (req.file) {
        query += ', image_url = ?';
        updateFields.push(`/uploads/${req.file.filename}`);
    } 
    // Nếu có image URL mới
    else if (image_url) {
        query += ', image_url = ?';
        updateFields.push(image_url);
    }

    query += ' WHERE book_id = ?';
    updateFields.push(bookId);

    console.log("SQL Query:", query); // Thêm log để debug
    console.log("Update values:", updateFields); // Thêm log để debug

    db.query(query, updateFields, (err, results) => {
        if (err) {
            console.error("Database error:", err); // Thêm log để debug
            return res.status(500).json({ error: err.message });
        }
        res.json({ 
            message: 'Book updated successfully',
            results: results // Thêm kết quả để debug
        });
    });
};

// Xóa sách
const deleteBook = (req, res) => {
    const query = 'DELETE FROM books WHERE book_id = ?';
    db.query(query, [req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Book deleted' });
    });
};

// Lấy danh sách sách theo loại
const getBooksByCategory = (req, res) => {
    const categoryId = req.params.categoryId;
    booksModel.getBooksByCategory(categoryId, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
};

// Lấy 6 sản phẩm sách có số lượng ít nhất
const getLowStockBooks = (req, res) => {
    const query = `
      SELECT book_id, title, description, price, stock_quantity, image_url
      FROM books
      ORDER BY stock_quantity ASC
      LIMIT 6
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("Query error:", err); // Log lỗi truy vấn
            return res.status(500).json({ error: err.message });
        }
        console.log("Query results:", results); // Log kết quả trả về
        if (results.length === 0) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.json(results);
    });
};


module.exports = { getBooks, getBookById, createBook, updateBook, deleteBook, getBooksByCategory, getLowStockBooks };


