/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - phoneNumber
 *         - password
 *       properties:
 *         id:
 *           type: integer
 *           description: ID tự tăng
 *         phoneNumber:
 *           type: string
 *           description: Số điện thoại người dùng (10-11 số)
 *           example: "0912345678"
 *         password:
 *           type: string
 *           description: Mật khẩu người dùng
 *           example: "123456"
 *         fullName:
 *           type: string
 *           description: Họ và tên
 *         email:
 *           type: string
 *           format: email
 *         role:
 *           type: string
 *           enum: [user, admin]
 *         spinResult:
 *           type: string
 *           description: Kết quả quay thưởng gần nhất
 *         lastSpinAt:
 *           type: string
 *           format: date-time
 *         spinCount:
 *           type: integer
 *           description: Tổng số lần đã quay
 */

/**
 * @swagger
 * /api/v1/users/register:
 *   post:
 *     summary: Đăng ký tài khoản mới bằng số điện thoại
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phoneNumber
 *               - password
 *             properties:
 *               phoneNumber:
 *                 type: string
 *                 example: "0912345678"
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 *       400:
 *         description: Số điện thoại đã tồn tại hoặc không đúng định dạng
 */

/**
 * @swagger
 * /api/v1/users/login:
 *   post:
 *     summary: Đăng nhập bằng số điện thoại
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phoneNumber
 *               - password
 *             properties:
 *               phoneNumber:
 *                 type: string
 *                 example: "0912345678"
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *       401:
 *         description: Sai số điện thoại hoặc mật khẩu
 */

/**
 * @swagger
 * /api/v1/users/me:
 *   get:
 *     summary: Xem thông tin tài khoản của tôi
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */

/**
 * @swagger
 * /api/v1/users/update-spin:
 *   put:
 *     summary: Cập nhật kết quả quay thưởng
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - result
 *             properties:
 *               result:
 *                 type: string
 *                 example: "Voucher 50k"
 *     responses:
 *       200:
 *         description: Lưu kết quả thành công
 *       403:
 *         description: Bạn đã nhận quà rồi, không thể quay thêm
 */

/**
 * @swagger
 * /api/v1/users/results:
 *   get:
 *     summary: Bảng bảng xếp hạng kết quả quay của tất cả người dùng
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
