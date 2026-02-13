const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const { sequelize } = require('./models');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');

const app = express();
const PORT = process.env.PORT || 3001;

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Sync Database (Sử dụng alter: true để cập nhật bảng mới)
sequelize.sync({ alter: true }).then(() => {
    console.log('🔄 Database đã được đồng bộ (Chỉ bảng User).');
});

// Middlewares
app.use(helmet()); // Bảo mật Headers
app.use(cors()); // Cho phép Frontend truy cập
app.use(morgan('dev')); // Log yêu cầu truy cập
app.use(express.json()); // Đọc body JSON

// API Routes
app.use('/api/v1/users', userRoutes);

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
