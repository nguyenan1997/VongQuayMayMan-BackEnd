const Spin = require('../models/spinModel');

const REWARDS = process.env.REWARDS.split(',');

exports.checkStatus = async (req, res) => {
    try {
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const spin = await Spin.findByIpToday(ip);

        res.status(200).json({
            success: true,
            data: {
                hasSpun: !!spin,
                spinsLeft: spin ? 0 : parseInt(process.env.MAX_SPINS_PER_DAY),
                ip
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.playSpin = async (req, res) => {
    try {
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const { userName } = req.body;

        if (!userName) {
            return res.status(400).json({ success: false, message: 'Thiếu tên người dùng' });
        }

        // Kiểm tra giới hạn IP
        const existingSpin = await Spin.findByIpToday(ip);
        if (existingSpin) {
            return res.status(403).json({
                success: false,
                message: 'Bạn đã thực hiện lượt quay hôm nay rồi!'
            });
        }

        // Logic quay thưởng tại Server
        const randomIndex = Math.floor(Math.random() * REWARDS.length);
        const rewardFound = REWARDS[randomIndex];

        // Lưu vào DB
        const result = await Spin.create({
            ip,
            userName,
            reward: rewardFound,
            segmentIndex: randomIndex
        });

        res.status(200).json({
            success: true,
            data: {
                index: randomIndex,
                reward: rewardFound,
                record: result
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
