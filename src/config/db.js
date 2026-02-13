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
        dialectOptions: process.env.DB_SSL === 'true' ? {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        } : {},
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
        console.log('✅ Kết nối database LOCAL thành công.');
    } catch (error) {
        console.error('❌ Không thể kết nối tới database LOCAL:', error.message);
        console.log('💡 Gợi ý: Hãy kiểm tra kỹ Host, Port, User, Password và đảm bảo Database đã được tạo trong pgAdmin.');
    }
};

testConnection();

module.exports = sequelize;
