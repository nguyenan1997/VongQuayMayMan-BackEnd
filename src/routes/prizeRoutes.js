const express = require('express');
const router = express.Router();
const {
    getPrizes,
    createPrize,
    updatePrize,
    deletePrize
} = require('../controllers/prizeController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

router.use(protect);

/**
 * @swagger
 * components:
 *   schemas:
 *     Prize:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         ticketsPerWinner:
 *           type: integer
 *         maxWinners:
 *           type: integer
 *         currentWinners:
 *           type: integer
 *     CreatePrizeInput:
 *       type: object
 *       required:
 *         - ticketsPerWinner
 *         - maxWinners
 *       properties:
 *         ticketsPerWinner:
 *           type: integer
 *           example: 4
 *         maxWinners:
 *           type: integer
 *           example: 8
 */

/**
 * @swagger
 * /api/v1/prizes:
 *   get:
 *     summary: Lấy danh sách cấu hình giải thưởng
 *     tags: [Prizes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thành công
 *   post:
 *     summary: Tạo cấu hình giải thưởng mới (Admin)
 *     tags: [Prizes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePrizeInput'
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
router.route('/')
    .get(getPrizes)
    .post(authorize('admin'), createPrize);

/**
 * @swagger
 * /api/v1/prizes/{id}:
 *   put:
 *     summary: Cập nhật cấu hình (Admin)
 *     tags: [Prizes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePrizeInput'
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *   delete:
 *     summary: Xóa cấu hình (Admin)
 *     tags: [Prizes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Xóa thành công
 */
router.route('/:id')
    .put(authorize('admin'), updatePrize)
    .delete(authorize('admin'), deletePrize);

module.exports = router;
