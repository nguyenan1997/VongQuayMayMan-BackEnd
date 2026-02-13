const { Sequelize } = require('sequelize');
require('dotenv').config();

// Fix lỗi SELF_SIGNED_CERT_IN_CHAIN khi kết nối Aiven trên Windows
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const sequelize = new Sequelize(
    process.env.DATABASE_URL,
    {
        dialect: 'postgres',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
        // Thêm cấu hình này để tương thích tốt hơn với SSL trên môi trường Cloud
        ssl: true,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        define: {
            timestamps: true,
            underscored: true
        }
    }
);

const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Kết nối database thành công qua Sequelize.');
    } catch (error) {
        console.error('❌ Không thể kết nối tới database:', error);
    }
};

testConnection();

module.exports = sequelize;
