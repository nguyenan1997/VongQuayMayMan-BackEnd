const { User } = require('../models');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'Vui lòng nhập số điện thoại và mật khẩu' });
        }

        const userExists = await User.findOne({ where: { username } });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'Số điện thoại này đã được đăng ký' });
        }

        const user = await User.create({
            username,
            password
        });

        res.status(201).json({
            success: true,
            data: {
                id: user.id,
                username: user.username,
                token: generateToken(user.id)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ where: { username } });
        if (user && (await user.comparePassword(password))) {
            res.json({
                success: true,
                data: {
                    id: user.id,
                    username: user.username,
                    token: generateToken(user.id)
                }
            });
        } else {
            res.status(401).json({ success: false, message: 'Sai tên đăng nhập hoặc mật khẩu' });
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
        user.spinResult = result;
        user.lastSpinAt = new Date();
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
            attributes: ['id', 'username', 'fullName', 'spinResult', 'lastSpinAt'],
            order: [['lastSpinAt', 'DESC']]
        });
        res.json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
