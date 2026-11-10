require('dotenv').config();
const { sequelize, Job, User, CompanyProfile, MomProfile } = require('../models');

async function seedData() {
  try {
    await sequelize.sync({ force: true });
    console.log('数据表已重建');

    const momUser = await User.create({
      openid: 'demo_mom_openid',
      nickname: '幸福妈妈',
      avatar: '',
      role: 'mom',
      phone: '13800138000',
    });

    await MomProfile.create({
      user_id: momUser.id,
      name: '李女士',
      age: 32,
      skills: ['文案写作', '客服', '手工制作'],
      experience: '5年行政工作经验，擅长文案撰写和客户沟通',
      expect_salary_min: 20,
      expect_salary_max: 35,
      area: '朝阳区',
      available_time: ['周一', '周二', '周三', '周四', '周五'],
      intro: '宝妈一枚，孩子上幼儿园了，想找一份早8晚4的工作补贴家用。做事认真负责，学习能力强。',
    });

    const companyUser = await User.create({
      openid: 'demo_company_openid',
      nickname: 'XX公司',
      avatar: '',
      role: 'company',
      phone: '13900139000',
    });

    await CompanyProfile.create({
      user_id: companyUser.id,
      company_name: '阳光文化传媒有限公司',
      contact_name: '王经理',
      contact_phone: '13900139000',
      address: '朝阳区建国路88号',
      industry: '文化传媒',
      scale: '20-99人',
      intro: '阳光文化传媒是一家专注于内容创作的公司，我们欢迎有才华的您加入！',
      verified: 1,
    });

    const jobs = [
      {
        company_id: companyUser.id,
        title: '文案编辑（兼职）',
        content: '负责公司公众号文章的撰写和编辑，工作内容轻松，时间灵活。',
        work_start_time: '09:00',
        work_end_time: '15:00',
        work_days: [1, 2, 3, 4, 5],
        salary_type: 'hourly',
        salary_min: 25,
        salary_max: 40,
        address: '朝阳区建国路88号SOHO现代城',
        work_type: '文案编辑',
        requirements: '有一定文字功底，会使用办公软件',
        benefits: ['弹性工作', '免费下午茶', '节日福利'],
        people_count: 2,
      },
      {
        company_id: companyUser.id,
        title: '手工产品包装',
        content: '手工产品的包装和质检工作，简单易上手，适合宝妈。',
        work_start_time: '08:30',
        work_end_time: '15:30',
        work_days: [1, 2, 3, 4, 5],
        salary_type: 'hourly',
        salary_min: 20,
        salary_max: 25,
        address: '海淀区中关村大街1号',
        work_type: '手工制作',
        requirements: '手脚麻利，认真细心',
        benefits: ['包午餐', '日结工资', '环境舒适'],
        people_count: 5,
      },
      {
        company_id: companyUser.id,
        title: '线上客服',
        content: '负责在线回复客户咨询，解答产品问题，可以在家办公。',
        work_start_time: '09:00',
        work_end_time: '16:00',
        work_days: [1, 2, 3, 4, 5],
        salary_type: 'monthly',
        salary_min: 3500,
        salary_max: 5000,
        address: '远程办公',
        work_type: '客服',
        requirements: '会打字，有耐心，沟通能力强',
        benefits: ['居家办公', '时间灵活', '提成奖励'],
        people_count: 3,
      },
      {
        company_id: companyUser.id,
        title: '数据录入员',
        content: '负责数据录入和整理工作，内容简单，按件计酬。',
        work_start_time: '08:00',
        work_end_time: '16:00',
        work_days: [1, 2, 3, 4, 5],
        salary_type: 'daily',
        salary_min: 150,
        salary_max: 200,
        address: '西城区金融街15号',
        work_type: '数据录入',
        requirements: '熟练使用电脑，细心认真',
        benefits: ['日结', '免费午餐', '周末休息'],
        people_count: 4,
      },
      {
        company_id: companyUser.id,
        title: '平面设计兼职',
        content: '负责公司宣传物料的设计工作，可远程办公。',
        work_start_time: '09:00',
        work_end_time: '15:00',
        work_days: [2, 3, 4],
        salary_type: 'project',
        salary_min: 500,
        salary_max: 2000,
        address: '远程办公',
        work_type: '设计',
        requirements: '会使用PS/AI，有一定设计经验',
        benefits: ['远程办公', '按项目结算', '时间自由'],
        people_count: 1,
      },
    ];

    await Job.bulkCreate(jobs);
    console.log('种子数据已插入');

    process.exit(0);
  } catch (err) {
    console.error('初始化数据失败:', err);
    process.exit(1);
  }
}

seedData();
