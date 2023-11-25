/*
 * @Date: 2023-11-22 21:50:25
 * @LastEditors: mason
 * @LastEditTime: 2023-11-22 21:50:32
 * @FilePath: \statistic\seeders\index.js
 */
// seeders/20231122120000-demo-user.js

import { DataTypes } from 'sequelize';

export async function up(queryInterface) {
  await queryInterface.bulkInsert('Users', [
    {
      username: 'user1',
      email: 'user1@example.com',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      username: 'user2',
      email: 'user2@example.com',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ], {});
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete('Users', null, {});
}
