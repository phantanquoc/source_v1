const mongoose = require('mongoose');
const moment = require('moment-timezone');

// Định nghĩa schema cho công đoạn (giống với TaoQuyTrinh)
const congDoanSchema = new mongoose.Schema({
    ten: { type: String, default: '' },
    noidung: { type: String, default: '' },
    bieumau: { type: String, default: '' },
    thutu: { type: Number } // Thêm trường thứ tự để sắp xếp các công đoạn
});

// Schema cho lịch sử quy trình
const quyTrinhHistorySchema = new mongoose.Schema({
    original_id: { type: String, required: true }, // ID của quy trình gốc
    version: { type: Number, required: true }, // Số phiên bản (1, 2, 3, ...)
    history_date: { type: String, default: () => moment().tz("Asia/Ho_Chi_Minh").format('YYYY-MM-DD HH:mm:ss') },
    
    // Các trường dữ liệu của quy trình (sao chép từ TaoQuyTrinh)
    id: { type: String, required: true },
    tenquytrinh: { type: String, required: true },
    loaiquytrinh: { type: String, required: true },
    username: { type: String, required: true },
    datetao: { type: String },
    nguoichinhsua: { type: String },
    datechinhsua: { type: String },
    nguoiduyet: { type: String },
    dateduyet: { type: String },
    congdoan: { type: String },
    noidung: { type: String },
    filekem: { type: String },
    status: { type: String, default: 'pending', enum: ['pending', 'completed'] },
    chinhsualanth: { type: Number },
    congdoans: [congDoanSchema]
});

module.exports = mongoose.model('QuyTrinhHistory', quyTrinhHistorySchema, 'quytrinh_history');
