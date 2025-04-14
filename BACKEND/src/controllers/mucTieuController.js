const MucTieuKeHoach = require('../models/MucTieuKeHoach');
const moment = require('moment-timezone');

// Lấy tất cả mục tiêu
exports.getAllGoals = async (req, res) => {
  try {
    const goals = await MucTieuKeHoach.find();
    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Tạo mục tiêu mới
exports.createGoal = async (req, res) => {
  try {
    const newGoal = new MucTieuKeHoach({
      ...req.body,
      datetao: moment().tz("Asia/Ho_Chi_Minh").format('YYYY-MM-DD HH:mm:ss'),
      dateduyet: moment().tz("Asia/Ho_Chi_Minh").format('YYYY-MM-DD HH:mm:ss')
    });

    const savedGoal = await newGoal.save();
    res.status(201).json(savedGoal);
  } catch (error) {
    console.error('Error creating goal:', error);
    res.status(500).json({
      message: 'Error creating goal',
      error: error.message
    });
  }
};

// Cập nhật mục tiêu
exports.updateGoal = async (req, res) => {
  try {
    const updatedGoal = await MucTieuKeHoach.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedGoal);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Xóa mục tiêu
exports.deleteGoal = async (req, res) => {
  try {
    await MucTieuKeHoach.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Goal deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
