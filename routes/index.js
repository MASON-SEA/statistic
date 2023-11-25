/*
 * @Date: 2023-11-22 21:51:02
 * @LastEditors: mason
 * @LastEditTime: 2023-11-22 22:05:57
 * @FilePath: \statistic\routes\index.js
 */
// routes/index.js

import express from 'express';
import User from '../models/user.js';

const router = express.Router();

// 创建用户
router.post('/api/create-user', async (req, res, next) => {
  try {
    const { username, email } = req.body;
    const user = await User.createOne({ username, email });
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
});

// 获取所有用户
router.get('/api/get-all-users', async (req, res, next) => {
  try {
    const users = await User.getAll();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

// 根据ID获取用户
router.get('/api/get-user/:id', async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.getById(userId);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// 更新用户信息
router.put('/api/update-user/:id', async (req, res, next) => {
  try {
    const userId = req.params.id;
    const updatedData = req.body;
    const updatedUser = await User.updateInfo(userId, updatedData);
    res.json({ success: true, user: updatedUser });
  } catch (error) {
    next(error);
  }
});

// 删除用户
router.delete('/api/delete-user/:id', async (req, res, next) => {
  try {
    const userId = req.params.id;
    const success = await User.deleteUser(userId);
    res.json({ success });
  } catch (error) {
    next(error);
  }
});

export default router;
