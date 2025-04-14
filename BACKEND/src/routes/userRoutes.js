const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Đăng ký tài khoản
router.post('/register', userController.register);

// Đăng nhập
router.post('/login', userController.login);

// Lấy tất cả người dùng
router.get('/users', userController.getAllUsers);

// Lấy thông tin người dùng theo email
router.get('/users/:email', userController.getUserByEmail);

// Xóa người dùng
router.delete('/users/:id', userController.deleteUser);

// Cập nhật thông tin người dùng
router.put('/users/:id', userController.updateUser);

module.exports = router;
