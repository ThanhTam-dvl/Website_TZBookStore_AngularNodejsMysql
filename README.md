# 📚 TZBookStore - Hệ thống Quản lý Nhà sách

![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

Website quản lý nhà sách và bán sách trực tuyến, xây dựng bằng **Angular**, **Node.js** và **MySQL**.

![Giao diện TZBookStore](https://via.placeholder.com/800x400?text=Trang+Chủ+TZBookStore)
*(Lưu ý: Chưa cập nhật ảnh giao diện thực tế)*

Live demo: https://tzbookstore.id.vn

---

## ✨ Tính năng chính

### 👤 Cho khách hàng
- Đăng ký và đăng nhập tài khoản
- Duyệt danh mục sách
- Tìm kiếm theo tên sách hoặc tác giả
- Xem chi tiết sản phẩm
- Thêm, sửa, xóa giỏ hàng
- Đặt hàng, thanh toán đơn hàng
- Theo dõi lịch sử đơn hàng
- Hủy đơn hàng

### 🛠 Cho quản trị viên
- Quản lý danh mục sách
- Thêm/sửa/xóa sách (CRUD)
- Duyệt và xử lý đơn hàng
- Quản lý tài khoản người dùng
- Phân quyền truy cập (Admin/User)

---

## ⚙️ Công nghệ sử dụng

- **Frontend**: Angular 17+, TypeScript, Bootstrap 5
- **Backend**: Node.js, Express.js
- **Cơ sở dữ liệu**: MySQL 5.7+
- **Xác thực**: JWT (JSON Web Token)
- **ORM**: Sequelize hoặc Native MySQL
- **Package Manager**: npm
- **Build Tools**: Angular CLI, Webpack

---

## 🗂️ Cấu trúc cơ sở dữ liệu

![Sơ đồ ERD](https://via.placeholder.com/600x400?text=ERD+TZBookStore)
*(Lưu ý: Chưa cập nhật ảnh sơ đồ CSDL thực tế)*

Các bảng chính:
- `books`: Thông tin sách
- `book_categories`: Danh mục sách
- `users`: Người dùng
- `orders`: Đơn hàng
- `order_items`: Chi tiết đơn hàng

---

## 🚀 Hướng dẫn cài đặt

### 🧰 Yêu cầu hệ thống

- Node.js >= 18.x
- npm >= 8.x
- MySQL >= 5.7
- Angular CLI >= 17.x

### ⚙️ Cài đặt từng bước

#### 1. Clone repository

```bash
git clone https://github.com/ThanhTam-dvl/Website_TZBookStore_AngularNodejs.git
cd Website_TZBookStore_AngularNodejs
```

#### 2. Cài đặt Angular CLI (nếu chưa có)

```bash
npm install -g @angular/cli
```

#### 3. Cài dependencies cho Backend

```bash
cd backend
npm install
```

#### 4. Cài dependencies cho Frontend

```bash
cd ../frontend
npm install
```

#### 5. Cấu hình database

Tạo file `.env` trong thư mục `backend`:

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=bookstoredb
DB_USER=root
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret_key
PORT=3000
```

#### 6. Tạo cơ sở dữ liệu

```bash
mysql -u root -p -e "CREATE DATABASE bookstoredb;"
```

Hoặc import từ file SQL:

```bash
mysql -u root -p bookstoredb < database/bookstoredb.sql
```

#### 7. Khởi chạy Backend server

```bash
cd backend
npm start
```

Backend chạy tại: `http://localhost:3000`

#### 8. Khởi chạy Frontend

```bash
cd frontend
ng serve
```

Frontend chạy tại: `http://localhost:4200`

---

## 👤 Tài khoản demo

### Người dùng:
- **Email**: customer1@bookstore.com.vn
- **Mật khẩu**: 123456

### Quản trị viên:
- **Email**: adminthanhtam@bookstore.com.vn
- **Mật khẩu**: 123456

---

## 📁 Cấu trúc thư mục chính

```
WEBSITE-TZBOOKSTOR-ANGULARNODEJS/
├── backend/
│   ├── config/
│   │   └── db.js                    # Cấu hình database
│   ├── controllers/
│   │   ├── booksController.js       # Logic xử lý sách
│   │   ├── categoriesController.js  # Logic danh mục
│   │   ├── ordersController.js      # Logic đơn hàng
│   │   └── usersController.js       # Logic người dùng
│   ├── middleware/
│   │   └── auth.js                  # Middleware xác thực
│   ├── models/
│   │   ├── booksModel.js            # Model sách
│   │   ├── categoriesModel.js       # Model danh mục
│   │   └── ordersModel.js           # Model đơn hàng
│   ├── routes/
│   │   ├── books.js                 # Routes API sách
│   │   ├── carts.js                 # Routes API giỏ hàng
│   │   ├── categories.js            # Routes API danh mục
│   │   ├── orders.js                # Routes API đơn hàng
│   │   └── users.js                 # Routes API người dùng
│   ├── uploads/                     # Thư mục lưu ảnh
│   ├── .env                         # Cấu hình môi trường
│   ├── package.json                 # Dependencies backend
│   └── server.js                    # File chính backend
├── database/
│   └── bookstoredb.sql              # File database SQL
└── frontend/
    └── src/
        └── app/
            ├── admin/               # Module quản trị
            │   ├── components/
            │   │   ├── dashboard/
            │   │   ├── manage-accounts/
            │   │   ├── manage-orders/
            │   │   └── manage-products/
            │   └── admin-layout/
            ├── components/          # Shared components
            │   ├── header/
            │   └── footer/
            ├── core/
            │   ├── guards/          # Route guards
            │   ├── interceptors/    # HTTP interceptors
            │   └── interfaces/      # TypeScript interfaces
            ├── pages/               # Các trang chính
            │   ├── home/
            │   ├── login/
            │   ├── register/
            │   ├── product/
            │   ├── product-detail/
            │   ├── shoppingcart/
            │   ├── order/
            │   └── order-history/
            ├── services/            # Angular services
            │   ├── auth.service.ts
            │   ├── cart.service.ts
            │   ├── category.service.ts
            │   ├── order.service.ts
            │   └── product.service.ts
            └── shared/              # Shared modules
                ├── pipes/
                └── shared.module.ts
```

---

## 🌐 API Endpoints chính

### Frontend Routes
- `/` – Trang chủ
- `/products/:category` – Danh mục sách
- `/product/:id` – Chi tiết sách
- `/cart` – Giỏ hàng
- `/checkout` – Thanh toán
- `/orders/history` – Lịch sử đơn hàng
- `/admin` – Dashboard quản trị

### Backend API
- `GET /api/books` – Lấy danh sách sách
- `POST /api/books` – Thêm sách mới
- `PUT /api/books/:id` – Cập nhật sách
- `DELETE /api/books/:id` – Xóa sách
- `GET /api/categories` – Lấy danh mục
- `POST /api/orders` – Tạo đơn hàng
- `GET /api/orders/user/:userId` – Lịch sử đơn hàng
- `POST /api/auth/login` – Đăng nhập
- `POST /api/auth/register` – Đăng ký

---

## 🛠️ Scripts hữu ích

### Frontend (Angular)
```bash
ng serve                    # Chạy dev server
ng build                    # Build production
ng test                     # Chạy unit tests
ng e2e                      # Chạy end-to-end tests
ng generate component name  # Tạo component mới
```

### Backend (Node.js)
```bash
npm start                   # Chạy server
npm run dev                 # Chạy với nodemon
npm test                    # Chạy tests
```

---

## ✅ Kiểm thử

### Frontend Testing
```bash
cd frontend
ng test
```

### Backend Testing
```bash
cd backend
npm test
```

---

## 🤝 Đóng góp

1. Fork repo
2. Tạo branch mới:
   ```bash
   git checkout -b feature/tinh-nang-moi
   ```
3. Commit & push
4. Tạo pull request

---

## 🐞 Báo lỗi

Nếu phát hiện lỗi, vui lòng tạo **Issue** với:
- Mô tả lỗi
- Các bước tái hiện
- Ảnh chụp (nếu có)
- Version Angular/Node.js đang sử dụng

---

## 📄 Giấy phép

Dự án được phát hành theo **MIT License**.

Bản quyền © 2024 Nguyễn Thành Tâm.

---

## 📧 Liên hệ

- **Tác giả**: Nguyễn Thành Tâm
- **Email**: nguyenthanhtam10062004@gmail.com

---

## 🖼️ Demo ảnh

*(Chưa cập nhật)*

- Trang chủ Angular
- Danh mục sản phẩm với Angular routing
- Giỏ hàng với reactive forms
- Dashboard admin Angular
- API testing với Postman
