const express = require('express');
const router = express.Router();
const quyTrinhController = require('../controllers/quyTrinhController');

// Lấy tất cả quy trình
router.get('/quytrinh', quyTrinhController.getAllQuyTrinh);

// Lấy quy trình theo ID
router.get('/quytrinh/:id', quyTrinhController.getQuyTrinhById);

// Tạo quy trình mới
router.post('/quytrinh', quyTrinhController.createQuyTrinh);

// Cập nhật quy trình
router.put('/quytrinh/:id', quyTrinhController.updateQuyTrinh);

// Xóa quy trình
router.delete('/quytrinh/:id', quyTrinhController.deleteQuyTrinh);

// Lấy lịch sử quy trình
router.get('/quytrinh/:id/history', quyTrinhController.getQuyTrinhHistory);

// Duyệt quy trình
router.put('/quytrinh/:id/approve', quyTrinhController.approveQuyTrinh);

// Xóa tất cả các bản lịch sử (chỉ dùng cho admin)
router.delete('/quytrinh/history/all', quyTrinhController.deleteAllHistoryVersions);

module.exports = router;
