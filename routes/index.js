/*
 * @Date: 2023-11-22 21:51:02
 * @LastEditors: mason
 * @LastEditTime: 2023-12-10 23:44:24
 * @FilePath: \statistic\routes\index.js
 */
// routes/index.js

const express = require('express');
const { knn_predict_online } = require('../app2.js');

const router = express.Router();

//计算结果
router.post('/api/predict', async (req, res, next) => {
  try {
    const { result14, _e } = req.body;
    const { prediction, nearest } = knn_predict_online(result14, _e);
    res.json(
      {
        success: true, 
        prediction,
        nearest
      }
    );
  } catch (error) {
    res.json(
      {
        success: false
      }
    );
    next(error);
  }
})

module.exports = router
