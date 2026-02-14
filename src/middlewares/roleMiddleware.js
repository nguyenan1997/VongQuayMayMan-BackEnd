const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Quyền truy cập bị từ chối. Chỉ dành cho: ${roles.join(', ')}`
            });
        }
        next();
    };
};

module.exports = { authorize };
