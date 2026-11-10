const { verifyToken } = require('../utils/jwt');
const { error } = require('../utils/response');
const { User } = require('../models');

async function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return error(res, '请先登录', 401, 401);
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return error(res, '登录已过期，请重新登录', 401, 401);
  }

  try {
    const user = await User.findByPk(decoded.userId);
    if (!user || user.status !== 1) {
      return error(res, '用户不存在或已被禁用', 401, 401);
    }
    req.user = user;
    next();
  } catch (err) {
    return error(res, '认证失败', 500, 500);
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return error(res, '没有权限执行此操作', 403, 403);
    }
    next();
  };
}

module.exports = {
  authMiddleware,
  requireRole,
};
