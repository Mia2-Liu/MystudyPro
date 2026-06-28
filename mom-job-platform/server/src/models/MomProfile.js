const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MomProfile = sequelize.define('MomProfile', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    comment: '关联用户ID',
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: '真实姓名',
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: '年龄',
  },
  skills: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: '技能标签',
  },
  experience: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '工作经历',
  },
  expect_salary_min: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: '期望薪资最低',
  },
  expect_salary_max: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: '期望薪资最高',
  },
  area: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: '工作区域',
  },
  available_time: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: '可工作时间',
  },
  intro: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '自我介绍',
  },
}, {
  tableName: 'mom_profiles',
});

module.exports = MomProfile;
