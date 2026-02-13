const express = require('express');
const router = express.Router();
const spinController = require('../controllers/spinController');

// Route kiểm tra trạng thái lượt quay của IP
router.get('/status', spinController.checkStatus);

// Route thực hiện quay thưởng
router.post('/play', spinController.playSpin);

module.exports = router;
