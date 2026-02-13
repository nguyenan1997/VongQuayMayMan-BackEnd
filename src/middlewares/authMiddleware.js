const jwt = require('jsonwebtoken');
const { User } = require('../models');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findByPk(decoded.id, {
                attributes: { exclude: ['password'] }
            });
            next();
        } catch (error) {
            res.status(401).json({ success: false, message: 'Không có quyền truy cập, token lỗi' });
        }
    }

    if (!token) {
        res.status(401).json({ success: false, message: 'Không có quyền truy cập, thiếu token' });
    }
};

module.exports = { protect };
