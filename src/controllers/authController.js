const { User } = require('../models');
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
    try {
        const { result } = req.body;
        if (!result) {
            return res.status(400).json({ success: false, message: 'Thiếu kết quả quay thưởng' });
        }

        const user = await User.findByPk(req.user.id);

        // Kiểm tra nếu người dùng đã có kết quả rồi thì không cho quay nữa
        if (user.spinResult) {
            return res.status(403).json({
                success: false,
                message: 'Bạn đã thực hiện lượt quay và nhận quà rồi!'
            });
        }

        user.spinResult = result;
        user.lastSpinAt = new Date();
        user.spinCount = (user.spinCount || 0) + 1;
        await user.save();

        res.json({
            success: true,
            message: 'Cập nhật kết quả thành công',
            data: {
                id: user.id,
                spinResult: user.spinResult,
                lastSpinAt: user.lastSpinAt
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAllResults = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'phoneNumber', 'fullName', 'spinResult', 'lastSpinAt', 'spinCount'],
            order: [['lastSpinAt', 'DESC']]
        });
        res.json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
