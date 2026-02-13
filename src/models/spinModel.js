const db = require('../config/db');

const Spin = {
    // Kiểm tra lịch sử quay của IP trong ngày
    findByIpToday: async (ip) => {
        const query = `
      SELECT * FROM spins 
      WHERE ip = $1 AND DATE(created_at) = CURRENT_DATE
    `;
        const { rows } = await db.query(query, [ip]);
        return rows[0];
    },

    // Ghi nhận lượt quay mới
    save: async (spinData) => {
        const { ip, userName, reward, segmentIndex } = spinData;
        const query = `
      INSERT INTO spins (ip, user_name, reward, segment_index)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
        const values = [ip, userName, reward, segmentIndex];
        const { rows } = await db.query(query, values);
        return rows[0];
    }
};

module.exports = Spin;
