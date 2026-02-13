/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *         password:
 *           type: string
 *         fullName:
 *           type: string
 *         email:
 *           type: string
 *         spinResult:
 *           type: string
 *         lastSpinAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/v1/users/register:
 *   post:
 *     summary: Đăng ký người dùng mới
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 *       400:
 *         description: Tên đăng nhập đã tồn tại
 */

/**
 * @swagger
 * /api/v1/users/login:
 *   post:
 *     summary: Đăng nhập người dùng
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 */

/**
 * @swagger
 * /api/v1/users/me:
 *   get:
 *     summary: Lấy thông tin cá nhân hiện tại
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thành công
 */

/**
 * @swagger
 * /api/v1/users/update-spin:
 *   put:
 *     summary: Cập nhật kết quả quay thưởng cho người dùng hiện tại
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               result:
 *                 type: string
 *                 example: "Voucher 100k"
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */

/**
 * @swagger
 * /api/v1/users/results:
 *   get:
 *     summary: Lấy danh sách kết quả quay của tất cả người dùng
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thành công
 */

const express = require('express');
const router = express.Router();
const { register, login, getMe, updateSpinResult, getAllResults } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/update-spin', protect, updateSpinResult);
router.get('/results', protect, getAllResults);

module.exports = router;
