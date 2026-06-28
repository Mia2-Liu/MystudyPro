const axios = require('axios');
const { User } = require('../models');
const { success, error } = require('../utils/response');
const { generateToken } = require('../utils/jwt');

async function wxLogin(req, res) {
  try {
    const { code, nickname, avatar } = req.body;

    if (!code) {
      return error(res, '缺少code参数');
    }

    const appid = process.env.WX_APPID;
    const secret = process.env.WX_SECRET;

    let openid;
    let unionid = null;

    if (appid && secret && appid !== 'your_wechat_appid') {
      const wxRes = await axios.get('https://api.weixin.qq.com/sns/jscode2session', {
        params: {
          appid,
          secret,
          js_code: code,
          grant_type: 'authorization_code',
        },
      });

      if (wxRes.data.errcode) {
        return error(res, `微信登录失败: ${wxRes.data.errmsg}`);
      }

      openid = wxRes.data.openid;
      unionid = wxRes.data.unionid || null;
    } else {
      openid = `dev_${code}`;
    }

    let user = await User.findOne({ where: { openid } });

    if (!user) {
      user = await User.create({
        openid,
        unionid,
        nickname: nickname || '微信用户',
        avatar: avatar || '',
      });
    } else {
      if (nickname || avatar) {
        await user.update({
          nickname: nickname || user.nickname,
          avatar: avatar || user.avatar,
        });
      }
    }

    const token = generateToken(user.id, user.role);

    success(res, {
      token,
      user: {
        id: user.id,
        nickname: user.nickname,
        avatar: user.avatar,
        role: user.role,
        phone: user.phone,
      },
    }, '登录成功');
  } catch (err) {
    console.error('wxLogin error:', err);
    error(res, '登录失败', 500, 500);
  }
}

async function setRole(req, res) {
  try {
    const { role } = req.body;

    if (!role || !['mom', 'company'].includes(role)) {
      return error(res, '无效的角色');
    }

    const user = req.user;

    if (user.role) {
      return error(res, '角色已设置，不可更改');
    }

    await user.update({ role });

    const token = generateToken(user.id, role);

    success(res, {
      token,
      user: {
        id: user.id,
        nickname: user.nickname,
        avatar: user.avatar,
        role: role,
        phone: user.phone,
      },
    }, '角色设置成功');
  } catch (err) {
    console.error('setRole error:', err);
    error(res, '设置角色失败', 500, 500);
  }
}

async function getUserInfo(req, res) {
  try {
    const user = req.user;

    success(res, {
      id: user.id,
      nickname: user.nickname,
      avatar: user.avatar,
      role: user.role,
      phone: user.phone,
    });
  } catch (err) {
    error(res, '获取用户信息失败', 500, 500);
  }
}

async function updateUserInfo(req, res) {
  try {
    const { nickname, avatar, phone } = req.body;
    const user = req.user;

    const updateData = {};
    if (nickname !== undefined) updateData.nickname = nickname;
    if (avatar !== undefined) updateData.avatar = avatar;
    if (phone !== undefined) updateData.phone = phone;

    await user.update(updateData);

    success(res, {
      id: user.id,
      nickname: user.nickname,
      avatar: user.avatar,
      role: user.role,
      phone: user.phone,
    }, '更新成功');
  } catch (err) {
    error(res, '更新失败', 500, 500);
  }
}

module.exports = {
  wxLogin,
  setRole,
  getUserInfo,
  updateUserInfo,
};
