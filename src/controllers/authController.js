const { User, Prize } = require('../models');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

exports.register = async (req, res) => {
    try {
        const { phoneNumber, password, fullName } = req.body;

        if (!phoneNumber || !password || !fullName) {
            return res.status(400).json({ success: false, message: 'Vui lòng nhập đầy đủ họ tên, số điện thoại và mật khẩu' });
        }

        const userExists = await User.findOne({ where: { phoneNumber } });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'Số điện thoại này đã được đăng ký' });
        }

        const user = await User.create({
            phoneNumber,
            password,
            fullName
        });

        res.status(201).json({
            success: true,
            data: {
                id: user.id,
                phoneNumber: user.phoneNumber,
                fullName: user.fullName,
                token: generateToken(user.id)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { phoneNumber, password } = req.body;

        const user = await User.findOne({ where: { phoneNumber } });
        if (user && (await user.comparePassword(password))) {
            res.json({
                success: true,
                data: {
                    id: user.id,
                    phoneNumber: user.phoneNumber,
                    fullName: user.fullName,
                    spinResult: user.spinResult,
                    token: generateToken(user.id)
                }
            });
        } else {
            res.status(401).json({ success: false, message: 'Sai số điện thoại hoặc mật khẩu' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getMe = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });
        res.json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateSpinResult = async (req, res) => {
    const transaction = await User.sequelize.transaction();
    try {
        const { result } = req.body;
        if (!result) {
            return res.status(400).json({ success: false, message: 'Thiếu kết quả quay thưởng' });
        }

        const user = await User.findByPk(req.user.id, { transaction });

        // 1. Kiểm tra nếu người dùng đã quay rồi
        if (user.spinResult) {
            await transaction.rollback();
            return res.status(403).json({
                success: false,
                message: 'Bạn đã thực hiện lượt quay và nhận quà rồi!'
            });
        }

        // 2. Tìm giải thưởng dựa trên số vé trúng
        // App sẽ gửi lên result là con số (ví dụ: 4, 5, 6)
        const prize = await Prize.findOne({
            where: {
                ticketsPerWinner: result,
                isActive: true
            },
            transaction
        });

        if (!prize) {
            await transaction.rollback();
            return res.status(404).json({ success: false, message: 'Gói giải thưởng này không tồn tại trong cấu hình' });
        }

        // 3. Kiểm tra số lượng còn lại
        if (prize.currentWinners >= prize.maxWinners) {
            await transaction.rollback();
            return res.status(403).json({
                success: false,
                message: `Gói ${prize.ticketsPerWinner} vé đã hết suất!`
            });
        }

        // 4. Cập nhật giải thưởng (tăng số người trúng)
        prize.currentWinners += 1;
        await prize.save({ transaction });

        // 5. Cập nhật thông tin User
        user.spinResult = `${prize.ticketsPerWinner} vé`; // Tự động lưu text "X vé"
        user.lastSpinAt = new Date();
        user.spinCount = (user.spinCount || 0) + 1;
        await user.save({ transaction });

        await transaction.commit();

        res.json({
            success: true,
            message: 'Chúc mừng! Bạn đã nhận được quà.',
            data: {
                id: user.id,
                spinResult: user.spinResult,
                lastSpinAt: user.lastSpinAt
            }
        });
    } catch (error) {
        if (transaction) await transaction.rollback();
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAllResults = async (req, res) => {
    try {
        const users = await User.findAll({
            where: {
                role: {
                    [Op.ne]: 'admin' // Không lấy admin
                }
            },
            attributes: ['id', 'phoneNumber', 'fullName', 'spinResult', 'lastSpinAt', 'spinCount'],
            order: [['lastSpinAt', 'DESC']]
        });
        res.json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
