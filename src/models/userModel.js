const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    phoneNumber: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
        field: 'phone_number', // Tên cột trong DB
        validate: {
            is: /^[0-9]+$/i,
            len: [10, 11]
        }
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    fullName: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'full_name'
    },
    role: {
        type: DataTypes.ENUM('user', 'admin'),
        defaultValue: 'user'
    },
    spinResult: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'spin_result'
    },
    lastSpinAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'last_spin_at'
    },
    spinCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: 'spin_count'
    }
}, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
        beforeCreate: async (user) => {
            if (user.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        },
        beforeUpdate: async (user) => {
            if (user.changed('password')) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        }
    }
});

// Phương thức kiểm tra mật khẩu
User.prototype.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = User;
