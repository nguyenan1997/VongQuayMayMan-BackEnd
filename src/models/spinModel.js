const { DataTypes, Op } = require('sequelize');
const sequelize = require('../config/db');

const Spin = sequelize.define('Spin', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ip: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  userName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'user_name'
  },
  reward: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  segmentIndex: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'segment_index'
  }
}, {
  tableName: 'spins',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false // Không cần updatedAt cho bảng log này
});

// Thêm phương thức tĩnh để kiểm tra lượt quay trong ngày
Spin.findByIpToday = async function (ip) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return await this.findOne({
    where: {
      ip: ip,
      created_at: {
        [Op.gte]: today
      }
    }
  });
};

module.exports = Spin;
