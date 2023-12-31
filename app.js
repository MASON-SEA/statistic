/*
 * @Date: 2023-11-22 21:51:36
 * @LastEditors: mason
 * @LastEditTime: 2023-12-10 23:51:22
 * @FilePath: \statistic\app.js
 */
// app.js


const express = require('express');
const routes = require('./routes/index.js');
const { study } = require('./app2.js');
const winston = require('winston');
const path = require('path');


const app = express();

// 配置winston日志
const logger = winston.createLogger({
  level: 'error',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message, stack }) => {
      return `${timestamp} [${level}]: ${message}${stack ? `\n${stack}` : ''}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log' })
  ]
});

// 同步数据库模型
// async function syncDatabase() {
//   try {
//     await sequelize.sync();
//     console.log('Database synced');

//     // 运行 seeders 添加初始数据
//     await sequelize.getQueryInterface().bulkInsert(
//       'Users',
//       [
//         {
//           username: 'user1',
//           email: 'user1@example.com',
//           createdAt: new Date(),
//           updatedAt: new Date()
//         },
//         {
//           username: 'user2',
//           email: 'user2@example.com',
//           createdAt: new Date(),
//           updatedAt: new Date()
//         }
//       ]
//     );
//     console.log('Seeders executed successfully');
//   } catch (error) {
//     // 抛出错误，让统一的错误处理中间件来处理
//     throw error;
//   }
// }

// 在全局错误处理中间件中处理同步数据库错误
// app.use(async (err, req, res, next) => {
//   logger.error({ message: 'Error syncing database:', stack: err.stack });
//   console.error('Error syncing database:', err);
//   // 继续传递错误给下一个错误处理中间件（如果有的话）
//   next(err);
// });

// 调用同步数据库函数
// syncDatabase();

// 配置Express中间件
app.use(express.json());

// app.use(function(req, res, next) {  
//   res.setHeader('Content-Type', 'application/javascript'); // 或者其他适合的MIME类型  
//   next();  
// });  

// 设置express.static以提供HTML文件
app.use(express.static(path.join(__dirname, 'public')))
// app.use('/', express.static('public'))

// 配置路由
app.use(routes);

// 统一的错误处理中间件
app.use((err, req, res, next) => {
  logger.error({ message: 'Something went wrong!', stack: err.stack });
  res.status(500).sendFile(dirname(__dirname) + '/public/error.html');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

study();