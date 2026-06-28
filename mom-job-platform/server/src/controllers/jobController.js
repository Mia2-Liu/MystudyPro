const { Op } = require('sequelize');
const { Job, User, CompanyProfile } = require('../models');
const { success, error } = require('../utils/response');
const { validateWorkTime } = require('../utils/timeValidator');

async function getJobList(req, res) {
  try {
    const { page = 1, pageSize = 10, keyword, work_type, salary_min, area, sort = 'latest' } = req.query;

    const where = { status: 1 };

    if (keyword) {
      where[Op.or] = [
        { title: { [Op.like]: `%${keyword}%` } },
        { content: { [Op.like]: `%${keyword}%` } },
      ];
    }
    if (work_type) where.work_type = work_type;
    if (salary_min) where.salary_min = { [Op.gte]: salary_min };
    if (area) where.address = { [Op.like]: `%${area}%` };

    let order = [['created_at', 'DESC']];
    if (sort === 'salary') {
      order = [['salary_min', 'DESC']];
    } else if (sort === 'hot') {
      order = [['view_count', 'DESC']];
    }

    const { count, rows } = await Job.findAndCountAll({
      where,
      include: [
        {
          model: CompanyProfile,
          as: 'companyProfile',
          attributes: ['company_name', 'industry', 'scale'],
        },
      ],
      order,
      offset: (page - 1) * pageSize,
      limit: parseInt(pageSize),
    });

    success(res, {
      list: rows,
      total: count,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      totalPages: Math.ceil(count / pageSize),
    });
  } catch (err) {
    console.error('getJobList error:', err);
    error(res, '获取工作列表失败', 500, 500);
  }
}

async function getJobDetail(req, res) {
  try {
    const { id } = req.params;

    const job = await Job.findByPk(id, {
      include: [
        {
          model: CompanyProfile,
          as: 'companyProfile',
          attributes: ['company_name', 'contact_name', 'contact_phone', 'address', 'industry', 'scale', 'intro', 'verified'],
        },
      ],
    });

    if (!job) {
      return error(res, '工作不存在', 404, 404);
    }

    await job.increment('view_count');

    success(res, job);
  } catch (err) {
    console.error('getJobDetail error:', err);
    error(res, '获取工作详情失败', 500, 500);
  }
}

async function createJob(req, res) {
  try {
    const companyId = req.user.id;
    const {
      title, content, work_start_time, work_end_time, work_days,
      salary_type, salary_min, salary_max, address, latitude, longitude,
      work_type, requirements, benefits, people_count,
    } = req.body;

    if (!title || !work_start_time || !work_end_time) {
      return error(res, '请填写必要信息');
    }

    const timeValidation = validateWorkTime(work_start_time, work_end_time);
    if (!timeValidation.valid) {
      return error(res, timeValidation.message);
    }

    const job = await Job.create({
      company_id: companyId,
      title,
      content,
      work_start_time,
      work_end_time,
      work_days,
      salary_type,
      salary_min,
      salary_max,
      address,
      latitude,
      longitude,
      work_type,
      requirements,
      benefits,
      people_count: people_count || 1,
    });

    success(res, job, '发布成功');
  } catch (err) {
    console.error('createJob error:', err);
    error(res, '发布失败', 500, 500);
  }
}

async function updateJob(req, res) {
  try {
    const companyId = req.user.id;
    const { id } = req.params;
    const updateData = req.body;

    const job = await Job.findByPk(id);
    if (!job) {
      return error(res, '工作不存在', 404, 404);
    }

    if (job.company_id !== companyId) {
      return error(res, '无权限操作', 403, 403);
    }

    if (updateData.work_start_time || updateData.work_end_time) {
      const startTime = updateData.work_start_time || job.work_start_time;
      const endTime = updateData.work_end_time || job.work_end_time;
      const timeValidation = validateWorkTime(startTime, endTime);
      if (!timeValidation.valid) {
        return error(res, timeValidation.message);
      }
    }

    await job.update(updateData);

    success(res, job, '更新成功');
  } catch (err) {
    console.error('updateJob error:', err);
    error(res, '更新失败', 500, 500);
  }
}

async function getCompanyJobs(req, res) {
  try {
    const companyId = req.user.id;
    const { status, page = 1, pageSize = 10 } = req.query;

    const where = { company_id: companyId };
    if (status !== undefined) where.status = status;

    const { count, rows } = await Job.findAndCountAll({
      where,
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
    console.error('getCompanyJobs error:', err);
    error(res, '获取失败', 500, 500);
  }
}

async function toggleJobStatus(req, res) {
  try {
    const companyId = req.user.id;
    const { id } = req.params;
    const { status } = req.body;

    const job = await Job.findByPk(id);
    if (!job) {
      return error(res, '工作不存在', 404, 404);
    }

    if (job.company_id !== companyId) {
      return error(res, '无权限操作', 403, 403);
    }

    await job.update({ status });

    success(res, null, '操作成功');
  } catch (err) {
    console.error('toggleJobStatus error:', err);
    error(res, '操作失败', 500, 500);
  }
}

module.exports = {
  getJobList,
  getJobDetail,
  createJob,
  updateJob,
  getCompanyJobs,
  toggleJobStatus,
};
