require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/database');
const config = require('./src/config');

// Kết nối đến database
connectDB();

// Khởi động server
const PORT = config.PORT;
app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
});
