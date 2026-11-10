const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Job = sequelize.define('Job', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  company_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '发布企业用户ID',
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: '工作标题',
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '工作内容描述',
  },
  work_start_time: {
    type: DataTypes.TIME,
    allowNull: false,
    comment: '工作开始时间',
  },
  work_end_time: {
    type: DataTypes.TIME,
    allowNull: false,
    comment: '工作结束时间',
  },
  work_days: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: '工作日期 [1,2,3,4,5] 表示周一到周五',
  },
  salary_type: {
    type: DataTypes.ENUM('hourly', 'daily', 'monthly', 'project'),
    defaultValue: 'hourly',
    comment: '薪资类型：hourly-时薪，daily-日薪，monthly-月薪，project-项目',
  },
  salary_min: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: '薪资最低',
  },
  salary_max: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: '薪资最高',
  },
  address: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: '工作地址',
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 6),
    allowNull: true,
    comment: '纬度',
  },
  longitude: {
    type: DataTypes.DECIMAL(10, 6),
    allowNull: true,
    comment: '经度',
  },
  work_type: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: '工作类型：家政/客服/手工/文案/设计等',
  },
  requirements: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '任职要求',
  },
  benefits: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: '福利待遇',
  },
  people_count: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    comment: '招聘人数',
  },
  status: {
    type: DataTypes.TINYINT,
    defaultValue: 1,
    comment: '状态：1-招聘中，0-已下架，2-已招满',
  },
  view_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '浏览量',
  },
  apply_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '申请人数',
  },
}, {
  tableName: 'jobs',
  indexes: [
    { fields: ['company_id'] },
    { fields: ['status'] },
    { fields: ['work_type'] },
  ],
});

module.exports = Job;
