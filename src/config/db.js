const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        define: {
            timestamps: true, // Tự động thêm createdAt và updatedAt
            underscored: true // Sử dụng snake_case (created_at) thay vì camelCase
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
