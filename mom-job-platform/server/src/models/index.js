const sequelize = require('../config/database');
const User = require('./User');
const MomProfile = require('./MomProfile');
const CompanyProfile = require('./CompanyProfile');
const Job = require('./Job');
const Application = require('./Application');

User.hasOne(MomProfile, { foreignKey: 'user_id', as: 'momProfile' });
MomProfile.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasOne(CompanyProfile, { foreignKey: 'user_id', as: 'companyProfile' });
CompanyProfile.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(Job, { foreignKey: 'company_id', as: 'jobs' });
Job.belongsTo(User, { foreignKey: 'company_id', as: 'company' });
Job.belongsTo(CompanyProfile, { foreignKey: 'company_id', targetKey: 'user_id', as: 'companyProfile' });

User.hasMany(Application, { foreignKey: 'mom_id', as: 'applications' });
Application.belongsTo(User, { foreignKey: 'mom_id', as: 'mom' });
Application.belongsTo(MomProfile, { foreignKey: 'mom_id', targetKey: 'user_id', as: 'momProfile' });

Job.hasMany(Application, { foreignKey: 'job_id', as: 'applications' });
Application.belongsTo(Job, { foreignKey: 'job_id', as: 'job' });

module.exports = {
  sequelize,
  User,
  MomProfile,
  CompanyProfile,
  Job,
  Application,
};
