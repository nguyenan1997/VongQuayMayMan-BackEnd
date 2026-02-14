const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Prize = sequelize.define('Prize', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    ticketsPerWinner: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'tickets_per_winner',
        comment: 'Số vé/người (Dùng làm định danh)'
    },
    maxWinners: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'max_winners',
        comment: 'A: Số người tối đa'
    },
    currentWinners: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: 'current_winners',
        comment: 'Số người thực tế đã trúng'
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'is_active'
    }
}, {
    tableName: 'prizes',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        {
            unique: true,
            fields: ['tickets_per_winner']
        }
    ]
});

module.exports = Prize;
