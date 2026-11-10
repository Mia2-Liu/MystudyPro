const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { authMiddleware, requireRole } = require('../middlewares/auth');

router.post('/', authMiddleware, requireRole('mom'), applicationController.applyJob);
router.get('/my', authMiddleware, requireRole('mom'), applicationController.getMyApplications);

router.get('/job', authMiddleware, requireRole('company'), applicationController.getJobApplications);
router.patch('/:id', authMiddleware, requireRole('company'), applicationController.handleApplication);

module.exports = router;
