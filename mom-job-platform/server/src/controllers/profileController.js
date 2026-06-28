const { MomProfile, CompanyProfile } = require('../models');
const { success, error } = require('../utils/response');

async function getMomProfile(req, res) {
  try {
    const userId = req.user.id;
    let profile = await MomProfile.findOne({ where: { user_id: userId } });

    if (!profile) {
      profile = await MomProfile.create({ user_id: userId });
    }

    success(res, profile);
  } catch (err) {
    console.error('getMomProfile error:', err);
    error(res, '获取简历失败', 500, 500);
  }
}

async function updateMomProfile(req, res) {
  try {
    const userId = req.user.id;
    const { name, age, skills, experience, expect_salary_min, expect_salary_max, area, available_time, intro } = req.body;

    let profile = await MomProfile.findOne({ where: { user_id: userId } });

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (age !== undefined) updateData.age = age;
    if (skills !== undefined) updateData.skills = skills;
    if (experience !== undefined) updateData.experience = experience;
    if (expect_salary_min !== undefined) updateData.expect_salary_min = expect_salary_min;
    if (expect_salary_max !== undefined) updateData.expect_salary_max = expect_salary_max;
    if (area !== undefined) updateData.area = area;
    if (available_time !== undefined) updateData.available_time = available_time;
    if (intro !== undefined) updateData.intro = intro;

    if (profile) {
      await profile.update(updateData);
    } else {
      profile = await MomProfile.create({ user_id: userId, ...updateData });
    }

    success(res, profile, '保存成功');
  } catch (err) {
    console.error('updateMomProfile error:', err);
    error(res, '保存失败', 500, 500);
  }
}

async function getCompanyProfile(req, res) {
  try {
    const userId = req.user.id;
    let profile = await CompanyProfile.findOne({ where: { user_id: userId } });

    if (!profile) {
      profile = await CompanyProfile.create({ user_id: userId });
    }

    success(res, profile);
  } catch (err) {
    console.error('getCompanyProfile error:', err);
    error(res, '获取企业信息失败', 500, 500);
  }
}

async function updateCompanyProfile(req, res) {
  try {
    const userId = req.user.id;
    const { company_name, contact_name, contact_phone, address, industry, scale, intro } = req.body;

    let profile = await CompanyProfile.findOne({ where: { user_id: userId } });

    const updateData = {};
    if (company_name !== undefined) updateData.company_name = company_name;
    if (contact_name !== undefined) updateData.contact_name = contact_name;
    if (contact_phone !== undefined) updateData.contact_phone = contact_phone;
    if (address !== undefined) updateData.address = address;
    if (industry !== undefined) updateData.industry = industry;
    if (scale !== undefined) updateData.scale = scale;
    if (intro !== undefined) updateData.intro = intro;

    if (profile) {
      await profile.update(updateData);
    } else {
      profile = await CompanyProfile.create({ user_id: userId, ...updateData });
    }

    success(res, profile, '保存成功');
  } catch (err) {
    console.error('updateCompanyProfile error:', err);
    error(res, '保存失败', 500, 500);
  }
}

module.exports = {
  getMomProfile,
  updateMomProfile,
  getCompanyProfile,
  updateCompanyProfile,
};
