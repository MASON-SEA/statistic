/*
 * @Date: 2023-11-22 21:49:45
 * @LastEditors: mason
 * @LastEditTime: 2023-11-22 21:49:52
 * @FilePath: \statistic\models\user.js
 */
// models/user.js

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

// 添加示例方法

// 创建用户
User.createOne = async function (userData) {
  return await this.create(userData);
};

// 获取所有用户
User.getAll = async function () {
  return await this.findAll();
};

// 根据ID获取用户
User.getById = async function (userId) {
  return await this.findByPk(userId);
};

// 更新用户信息
User.updateInfo = async function (userId, updatedData) {
  const user = await this.findByPk(userId);
  if (user) {
    return await user.update(updatedData);
  }
  return null;
};

// 删除用户
User.deleteUser = async function (userId) {
  const user = await this.findByPk(userId);
  if (user) {
    await user.destroy();
    return true;
  }
  return false;
};

export default User;
