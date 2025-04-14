// const mongoose = require('mongoose');
// const moment = require('moment-timezone');

// // Schema đơn hàng
// const donHangSchema = new mongoose.Schema({
//     stt: { type: Number, required: true },
//     date: { type: Date, default: () => moment().tz("Asia/Ho_Chi_Minh").toDate() }, // Dùng Date thay vì String
//     username: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true }, // Tham chiếu user
//     msnv: { type: mongoose.Schema.Types.ObjectId, ref: "nhanviens", required: true }, // Tham chiếu nhân viên
//     makh: { type: String, required: true },
//     khachhang: { type: String, required: true },
//     massp: { type: String, required: true },
//     motasp: { type: String },
//     yeucausp: { type: String },
//     donggoi: { type: String },
//     sldathang: { type: Number, default: 0, required: true },
//     sltai: { type: Number, default: 0 },
//     htvanchuyen: { type: String },
//     htthanhtoan: { type: String },
//     quocgia: { type: String },
//     cangden: { type: String },
//     giaDoiThu: { type: Number, default: 0 },
//     giacu: { type: Number, default: 0 },
//     ghiChu: { type: String }
// });

// // Schema tạo quy trình
// const taoQuyTrinh= new mongoose.Schema({
//     tenquytrinh: { type: String, required: true },
//     maquytrinh: { type: String, required: true },
//     ngayTao: { type: Date, default: () => moment().tz("Asia/Ho_Chi_Minh").toDate() },
//     username: { type: String, required: true, unique: true },
//     congdoan: { type: String },
//     noidung: { type: String },
//     bieumau: { type: String },
//     status: { type: String}, 
//     nguoiduyet: { type: String},
// });
// // Schema khách hàng
// const khachHangSchema = new mongoose.Schema({
//     maKH: { type: String, required: true, unique: true },
//     tenKH: { type: String, required: true },
//     diaChi: { type: String },
//     soDT: { type: String },
//     email: { type: String },
//     quocGia: { type: String },
//     ngayTao: { type: Date, default: () => moment().tz("Asia/Ho_Chi_Minh").toDate() }
// });

// // Schema sản phẩm
// const sanPhamSchema = new mongoose.Schema({
//     maSP: { type: String, required: true, unique: true },
//     tenSP: { type: String, required: true },
//     moTa: { type: String },
//     donVi: { type: String },
//     giaBan: { type: Number, default: 0 },
//     ngayTao: { type: Date, default: () => moment().tz("Asia/Ho_Chi_Minh").toDate() }
// });

// // Export nhiều model
// module.exports = {
//     DonHang: mongoose.model('DonHang', donHangSchema, 'donHang'),
//     KhachHang: mongoose.model('KhachHang', khachHangSchema, 'khachHang'),
//     SanPham: mongoose.model('SanPham', sanPhamSchema, 'sanPham'),
//     TaoQuyTrinh: mongoose.model('TaoQuyTrinh', taoQuyTrinh, 'taoquytrinh')
// };
