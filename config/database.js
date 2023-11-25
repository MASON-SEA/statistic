/*
 * @Date: 2023-11-22 22:05:17
 * @LastEditors: mason
 * @LastEditTime: 2023-11-22 22:05:20
 * @FilePath: \statistic\config\database.js
 */
// config/database.js

import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite', // 指定 SQLite 数据库文件路径
});

export default sequelize;
