const { Application, Job, MomProfile, CompanyProfile } = require('../models');
const { success, error } = require('../utils/response');

async function applyJob(req, res) {
  try {
    const momId = req.user.id;
    const { job_id, message } = req.body;

    if (!job_id) {
      return error(res, '请选择工作');
    }

    const job = await Job.findByPk(job_id);
    if (!job || job.status !== 1) {
      return error(res, '工作不存在或已下架');
    }

    const existing = await Application.findOne({
      where: { job_id, mom_id: momId },
    });
    if (existing) {
      return error(res, '你已经申请过这个工作了');
    }

    const momProfile = await MomProfile.findOne({ where: { user_id: momId } });

    const application = await Application.create({
      job_id,
      mom_id: momId,
      message,
      resume_snapshot: momProfile ? momProfile.toJSON() : null,
    });

    await job.increment('apply_count');

    success(res, application, '申请成功');
  } catch (err) {
    console.error('applyJob error:', err);
    error(res, '申请失败', 500, 500);
  }
}

async function getMyApplications(req, res) {
  try {
    const momId = req.user.id;
    const { status, page = 1, pageSize = 10 } = req.query;

    const where = { mom_id: momId };
    if (status) where.status = status;

    const { count, rows } = await Application.findAndCountAll({
      where,
      include: [
        {
          model: Job,
          as: 'job',
          include: [
            {
              model: CompanyProfile,
              as: 'companyProfile',
              attributes: ['company_name'],
            },
          ],
        },
      ],
      order: [['created_at', 'DESC']],
      offset: (page - 1) * pageSize,
      limit: parseInt(pageSize),
    });

    success(res, {
      list: rows,
      total: count,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
    });
  } catch (err) {
    console.error('getMyApplications error:', err);
    error(res, '获取失败', 500, 500);
  }
}

async function getJobApplications(req, res) {
  try {
    const companyId = req.user.id;
    const { job_id, status, page = 1, pageSize = 10 } = req.query;

    if (!job_id) {
      return error(res, '请选择工作');
    }

    const job = await Job.findByPk(job_id);
    if (!job || job.company_id !== companyId) {
      return error(res, '无权限查看', 403, 403);
    }

    const where = { job_id };
    if (status) where.status = status;

    const { count, rows } = await Application.findAndCountAll({
      where,
      include: [
        {
          model: MomProfile,
          as: 'momProfile',
        },
      ],
      order: [['created_at', 'DESC']],
      offset: (page - 1) * pageSize,
      limit: parseInt(pageSize),
    });

    success(res, {
      list: rows,
      total: count,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
    });
  } catch (err) {
    console.error('getJobApplications error:', err);
    error(res, '获取失败', 500, 500);
  }
}

async function handleApplication(req, res) {
  try {
    const companyId = req.user.id;
    const { id } = req.params;
    const { status } = req.body;

    if (!['accepted', 'rejected'].includes(status)) {
      return error(res, '无效的操作');
    }

    const application = await Application.findByPk(id, {
      include: [{ model: Job, as: 'job' }],
    });

    if (!application) {
      return error(res, '申请不存在', 404, 404);
    }

    if (application.job.company_id !== companyId) {
      return error(res, '无权限操作', 403, 403);
    }

    await application.update({ status });

    success(res, null, '操作成功');
  } catch (err) {
    console.error('handleApplication error:', err);
    error(res, '操作失败', 500, 500);
  }
}

module.exports = {
  applyJob,
  getMyApplications,
  getJobApplications,
  handleApplication,
};
