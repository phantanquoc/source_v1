const mongoose = require('mongoose');
const moment = require('moment-timezone');

// Định nghĩa schema cho công đoạn
const congDoanSchema = new mongoose.Schema({
    ten: { type: String, default: '' },
    noidung: { type: String, default: '' },
    bieumau: { type: String, default: '' },
    thutu: { type: Number } // Thêm trường thứ tự để sắp xếp các công đoạn
});

const taoQuyTrinhSchema = new mongoose.Schema({
    id: { type: String, required: true },
    tenquytrinh: { type: String, required: true },
    loaiquytrinh: { type: String, required: true },
    username: { type: String, required: true },
    datetao: { type: String, default: () => moment().tz("Asia/Ho_Chi_Minh").format('YYYY-MM-DD HH:mm:ss') },
    nguoichinhsua: { type: String },
    datechinhsua: { type: String, default: () => moment().tz("Asia/Ho_Chi_Minh").format('YYYY-MM-DD HH:mm:ss') },
    nguoiduyet: { type: String },
    dateduyet: { type: String, default: () => moment().tz("Asia/Ho_Chi_Minh").format('YYYY-MM-DD HH:mm:ss') },
    congdoan: { type: String },
    noidung: { type: String },
    filekem: { type: String },
    status: { type: String, default: 'pending', enum: ['pending', 'completed'] },
    chinhsualanth: { type: Number, default: 0 },
    congdoans: [congDoanSchema]
});

module.exports = mongoose.model('TaoQuyTrinh', taoQuyTrinhSchema, 'taoquytrinh');
