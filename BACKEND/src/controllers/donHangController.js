const { DonHang, KhachHang, SanPham } = require('../models/DonHang');

// Lấy tất cả đơn hàng
exports.getAllDonHang = async (req, res) => {
  try {
    const donHangs = await DonHang.find();
    res.status(200).json(donHangs);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Lấy tất cả khách hàng
exports.getAllKhachHang = async (req, res) => {
  try {
    const khachHangs = await KhachHang.find();
    res.status(200).json(khachHangs);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Lấy tất cả sản phẩm
exports.getAllSanPham = async (req, res) => {
  try {
    const sanPhams = await SanPham.find();
    res.status(200).json(sanPhams);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};
