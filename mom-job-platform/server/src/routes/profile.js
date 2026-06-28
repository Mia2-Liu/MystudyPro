const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { authMiddleware, requireRole } = require('../middlewares/auth');

router.get('/mom', authMiddleware, requireRole('mom'), profileController.getMomProfile);
router.put('/mom', authMiddleware, requireRole('mom'), profileController.updateMomProfile);

router.get('/company', authMiddleware, requireRole('company'), profileController.getCompanyProfile);
router.put('/company', authMiddleware, requireRole('company'), profileController.updateCompanyProfile);

module.exports = router;
