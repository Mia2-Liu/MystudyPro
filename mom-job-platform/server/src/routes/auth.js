const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/auth');

router.post('/wx-login', authController.wxLogin);
router.post('/set-role', authMiddleware, authController.setRole);
router.get('/user-info', authMiddleware, authController.getUserInfo);
router.put('/user-info', authMiddleware, authController.updateUserInfo);

module.exports = router;
