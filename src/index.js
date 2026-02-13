const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// 1. BỘ THEO DÕI LỖI TOÀN CỤC (Cực kỳ quan trọng để tìm nguyên nhân sập)
process.on('uncaughtException', (err) => {
    console.error('💥 LỖI HỆ THỐNG (Uncaught Exception):', err.message);
    console.error(err.stack);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('☄️ LỖI CHƯA XỬ LÝ (Unhandled Rejection) tại:', promise, 'Lý do:', reason);
});

const userRoutes = require('./routes/userRoutes');
const { sequelize } = require('./models');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');

const app = express();
const PORT = process.env.PORT || 3001;

// 2. MIDDLEWARES
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// 3. DOCUMENTATION
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// 4. API ROUTES
app.use('/api/v1/users', userRoutes);

// Xử lý route không tồn tại
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'API Route không tồn tại' });
});

// 5. KHỞI CHẠY SERVER
const startServer = async () => {
    try {
        // Mở cổng Server trước để đảm bảo Process luôn chạy
        app.listen(PORT, () => {
            console.log('====================================');
            console.log(`🚀 SERVER ĐANG CHẠY TẠI: http://localhost:${PORT}`);
            console.log(`📝 Swagger Docs: http://localhost:${PORT}/api-docs`);
            console.log('====================================');
        });

        // Kết nối Database song song
        console.log('⏳ Đang kết nối tới Database cục bộ...');
        await sequelize.authenticate();
        console.log('✅ Kết nối Database thành công.');

        // Đồng bộ cấu trúc bảng
        await sequelize.sync({ alter: true });
        console.log('✅ Bảng dữ liệu đã được đồng bộ.');

        // Kiểm tra/Tạo Admin
        const { User } = require('./models');
        const adminExists = await User.findOne({ where: { phoneNumber: '0912345678' } });
        if (!adminExists) {
            await User.create({
                phoneNumber: '0912345678',
                password: 'admin',
                role: 'admin',
                fullName: 'System Administrator'
            });
            console.log('👤 Đã tạo tài khoản admin mặc định.');
        } else {
            console.log('ℹ️  Tài khoản Admin đã sẵn sàng.');
        }

    } catch (error) {
        console.error('❌ LỖI KHỞI ĐỘNG:', error.message);
        console.log('💡 Gợi ý: Hãy kiểm tra xem Database "lucky_spin" đã có chưa và mật khẩu trong .env đúng chưa.');
    }
};

startServer();