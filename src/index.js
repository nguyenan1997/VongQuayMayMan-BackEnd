const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const spinRoutes = require('./routes/spinRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(helmet()); // Bảo mật Headers
app.use(cors()); // Cho phép Frontend truy cập
app.use(morgan('dev')); // Log yêu cầu truy cập
app.use(express.json()); // Đọc body JSON

// API Routes
app.use('/api/v1/spins', spinRoutes);

// Xử lý lỗi 404
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'API Route không tồn tại' });
});

// Khởi chạy Server
app.listen(PORT, () => {
    console.log('====================================');
    console.log(`🚀 SERVER RUNNING AT: http://localhost:${PORT}`);
    console.log(`📅 NGÀY KHỞI CHẠY: ${new Date().toLocaleString()}`);
    console.log('====================================');
});
