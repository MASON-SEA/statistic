/*
 * @Date: 2023-11-23 10:34:54
 * @LastEditors: mason
 * @LastEditTime: 2023-11-25 17:29:47
 * @FilePath: \statistic\app2.js
 */

import KNN from 'ml-knn';
import ExcelJS from 'exceljs';

const k = 10;

function knn_learning() {
  // 数据预处理
  const features = [
    [5, 1, 6, 8, 5],
    [5, 1, 6, 7, 4],
    [5, 1, 6, 6, 3],
    [5, 1, 0, 8, 5],
    [5, 1, 6, 5, 3],
    [5, 1, 6, 2, 0]
  ]
  const labels = ['A', 'B', 'C', 'C', 'C', 'C'];

  // 创建K近邻模型
  const knn = new KNN(features, labels, { k });


  // 进行预测
  const newSample = [
    /* 你的新样本的14天结果, 成分1, 成分2, ... */
    6, 1, 6, 7, 3
  ];
  const prediction = knn.predict(newSample);
  // 找到最近的几条训练数据的索引
  const nearestIndices = knn.kdTree.nearest(newSample, k);

  // 打印最近的训练数据
  console.log(`Nearest ${k} training data points:`);
  nearestIndices.forEach(index => {
    console.log(`item: ${index}`);
  });

  console.log(`Predicted 28 Days Result: ${prediction}`);
}

// knn_learning();

//read excel
// 你的Excel文件路径
const excelFilePath = '训练集.xlsx';

// 创建一个工作簿对象
const workbook = new ExcelJS.Workbook();

// 读取Excel文件
workbook.xlsx.readFile(excelFilePath)
  .then(() => {
    const worksheet = workbook.getWorksheet('Sheet1');
    const sheetData = worksheet.getSheetValues();
    sheetData.forEach(item => {
      console.log(JSON.stringify(item));
    });
  })
  .catch(err => {
    console.error('Error reading Excel file:', err);
  });
