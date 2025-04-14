const express = require('express');
const router = express.Router();
const donHangController = require('../controllers/donHangController');

// Lấy tất cả đơn hàng
router.get('/donhang', donHangController.getAllDonHang);

// Lấy tất cả khách hàng
router.get('/khachhang', donHangController.getAllKhachHang);

// Lấy tất cả sản phẩm
router.get('/sanpham', donHangController.getAllSanPham);

module.exports = router;
