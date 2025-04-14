const express = require('express');
const router = express.Router();
const mucTieuController = require('../controllers/mucTieuController');

// Lấy tất cả mục tiêu
router.get('/goals', mucTieuController.getAllGoals);

// Tạo mục tiêu mới
router.post('/goals', mucTieuController.createGoal);

// Cập nhật mục tiêu
router.put('/goals/:id', mucTieuController.updateGoal);

// Xóa mục tiêu
router.delete('/goals/:id', mucTieuController.deleteGoal);

module.exports = router;
