const { Prize } = require('../models');

// @desc    Lấy danh sách cấu hình giải thưởng
// @route   GET /api/v1/prizes
exports.getPrizes = async (req, res) => {
    try {
        const prizes = await Prize.findAll({
            order: [['ticketsPerWinner', 'ASC']]
        });
        res.json({ success: true, data: prizes });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Tạo cấu hình giải thưởng mới
// @route   POST /api/v1/prizes
exports.createPrize = async (req, res) => {
    try {
        const { ticketsPerWinner, maxWinners } = req.body;

        if (!ticketsPerWinner || !maxWinners) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng điền đủ: Số vé/người (B), Số người tối đa (A)'
            });
        }

        const prize = await Prize.create({
            ticketsPerWinner,
            maxWinners
        });

        res.status(201).json({ success: true, data: prize });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Cập nhật cấu hình giải thưởng
// @route   PUT /api/v1/prizes/:id
exports.updatePrize = async (req, res) => {
    try {
        const { ticketsPerWinner, maxWinners } = req.body;

        const prize = await Prize.findByPk(req.params.id);
        if (!prize) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy giải thưởng' });
        }

        // Chỉ cập nhật các trường được phép
        const updateData = {};
        if (ticketsPerWinner !== undefined) updateData.ticketsPerWinner = ticketsPerWinner;
        if (maxWinners !== undefined) updateData.maxWinners = maxWinners;

        await prize.update(updateData);

        res.json({ success: true, data: prize });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Xóa giải thưởng
// @route   DELETE /api/v1/prizes/:id
exports.deletePrize = async (req, res) => {
    try {
        const prize = await Prize.findByPk(req.params.id);
        if (!prize) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy giải thưởng' });
        }

        await prize.destroy();
        res.json({ success: true, message: 'Đã xóa giải thưởng' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
