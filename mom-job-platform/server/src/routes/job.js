const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { authMiddleware, requireRole } = require('../middlewares/auth');

router.get('/', jobController.getJobList);
router.get('/:id', jobController.getJobDetail);

router.post('/', authMiddleware, requireRole('company'), jobController.createJob);
router.put('/:id', authMiddleware, requireRole('company'), jobController.updateJob);
router.get('/company/list', authMiddleware, requireRole('company'), jobController.getCompanyJobs);
router.patch('/:id/status', authMiddleware, requireRole('company'), jobController.toggleJobStatus);

module.exports = router;
