const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Application = sequelize.define('Application', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  job_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '工作ID',
  },
  mom_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '申请者用户ID',
  },
  status: {
    type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
    defaultValue: 'pending',
    comment: '状态：pending-待处理，accepted-已接受，rejected-已拒绝',
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '申请留言',
  },
  resume_snapshot: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: '申请时简历快照',
  },
}, {
  tableName: 'applications',
  indexes: [
    { fields: ['job_id'] },
    { fields: ['mom_id'] },
    { fields: ['status'] },
  ],
});

module.exports = Application;
