const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CompanyProfile = sequelize.define('CompanyProfile', {
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
  company_name: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: '企业名称',
  },
  contact_name: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: '联系人姓名',
  },
  contact_phone: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: '联系电话',
  },
  address: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: '企业地址',
  },
  industry: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: '所属行业',
  },
  scale: {
    type: DataTypes.STRING(30),
    allowNull: true,
    comment: '企业规模',
  },
  intro: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '企业介绍',
  },
  verified: {
    type: DataTypes.TINYINT,
    defaultValue: 0,
    comment: '认证状态：0-未认证，1-已认证',
  },
  business_license: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: '营业执照图片URL',
  },
  verify_status: {
    type: DataTypes.TINYINT,
    defaultValue: 0,
    comment: '审核状态：0-未提交，1-审核中，2-已通过，3-已拒绝',
  },
  verify_remark: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: '审核备注',
  },
  verify_submitted_at: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: '提交审核时间',
  },
}, {
  tableName: 'company_profiles',
});

module.exports = CompanyProfile;
