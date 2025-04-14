const mongoose = require('mongoose');
const moment = require('moment-timezone');

const mucTieuSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true }, // Removed unique: true
    department:{ type: String},
    room:{ type: String},
    position:{ type: String},
    loaimuctieu: {type: String, required: true},
    muctiecaptren:{ type: String,},
    muctiebanthan:{ type: String, required: true}, 
    hmcv:{type: String, required: true},
    yccc: {type: String, required: true},
    ttcc: {type: String, required: true},
    datetao: { type: String, default: () => moment().tz("Asia/Ho_Chi_Minh").format('YYYY-MM-DD HH:mm:ss') },
    dateduyet:{ type: String, default: () => moment().tz("Asia/Ho_Chi_Minh").format('YYYY-MM-DD HH:mm:ss') },
    nguoiduyet: { type: String},
    ketqualamduoc: { type: String},
    ketquaptpt: { type: Number},
    chualamduoc: { type: String},
    nguyennhan: {type: String},
    nguoibaocao: {type: String},
    status: { 
      type: String, 
      required: true,
      default: 'pending', // Add default value
      enum: ['pending', 'in-progress', 'completed', 'delayed'] // Add validation
    },
    filekem: { type: String, },
});

module.exports = mongoose.model('MucTieuKeHoach', mucTieuSchema, 'muctieukehoach');
