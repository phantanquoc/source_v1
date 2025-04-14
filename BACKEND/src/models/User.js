const mongoose = require('mongoose');
const moment = require('moment-timezone');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    department:{ type: String},
    room:{ type: String},
    position:{ type: String},
    phone:{ type: String},
    time: { type: String, default: () => moment().tz("Asia/Ho_Chi_Minh").format('YYYY-MM-DD HH:mm:ss') } // Thời gian VN
},);

module.exports = mongoose.model('User', userSchema, 'abfUser');
