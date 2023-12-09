/*
 * @Date: 2023-11-23 10:34:54
 * @LastEditors: mason
 * @LastEditTime: 2023-12-05 22:06:26
 * @FilePath: \statistic\app2.js
 */

import KNN from 'ml-knn';
import ExcelJS from 'exceljs';
const k = 23;
let knn = null;
const test_count = 10;
const is_debugger = true;
let data = [];
let element = {};
let feature = [];
let label = [];
//read excel
// 你的Excel文件路径
const excelFilePath = '训练集.xlsx';


console.log('k---------', k);

function knn_learning(features, labels) {
  // 创建K近邻模型
  knn = new KNN(features, labels, { k });

}

const knn_predict = (new_data) => {

  let newSample = [];
  const result14 = new_data[1];
  let [a, b] = result14.split(';');
  a = parseFloat(a);
  b = parseFloat(b);
  const result28 = new_data[3];

  newSample.push(a);
  newSample.push(b);
  const quantities = new_data[2];
  Object.keys(element).forEach(key => {
    let _v = quantities.hasOwnProperty(key) ? parseFloat(quantities[key]) : 0;
    newSample.push(_v);
  });

  const prediction = knn.predict(newSample);
  // 找到最近的几条训练数据的索引
  const nearestIndices = knn.kdTree.nearest(newSample, k);

  // 打印最近的训练数据
  // console.log(`Nearest ${k} training data points:`);
  // const data = [];

  // nearestIndices.forEach((item) => {
  //     const _data = find_data(item[0]);
  //     data.push(..._data);
  // });

  // console.log('data:',data)

  return { prediction, result28 };
};

const find_data = (key) => {
  const _data = [];
  outerLoop: for (let i = 0; i < feature.length; i++) {
    const f = feature[i];
    innerLoop: for (let j = 0; j < key.length - 1; j++) {
      if (f[j] != key[j]) {
        continue outerLoop
      }
    }
    _data.push(data[i]);
  }

  return _data;
};

// 创建一个工作簿对象
const workbook = new ExcelJS.Workbook();

export const study = () => {
  // 读取Excel文件
  workbook.xlsx.readFile(excelFilePath)
    .then(() => {
      const worksheet = workbook.getWorksheet('Sheet1');
      worksheet.eachRow({ includeEmpty: true }, function (row, rowNumber) {
        if (rowNumber == 1) return;

        let row_data = [];

        row.eachCell({ includeEmpty: true }, function (cell, colNumber) {
          if (colNumber == 3) {
            let _quantity = {};
            let quantity = cell.text;
            quantity = quantity.replace('\n', '');
            const quantities = quantity.split(';');
            quantities.forEach((item) => {
              let [key, value] = item.split(',');
              key = key.trim().toLowerCase();
              if (!key) return;
              _quantity[key] = value;
              element[key] = true;
            });
            row_data.push(_quantity);
            return
          }

          const text = cell.text;
          row_data.push(text);
        });
        data.push(row_data);
      });

      //处理数据

      //当真实测试时，测试数据更新
      if (!is_debugger) {
        const { features, labels } = handler_data(data);
        knn_learning(features, labels);
        return
      }

      const percent = [];

      const test = () => {
        const { base_data, test_data } = split_arr(data, test_count);

        const { features, labels } = handler_data(base_data);

        // console.log(JSON.stringify(data));
        // console.log(JSON.stringify(labels));
        // console.log(JSON.stringify(features));
        knn_learning(features, labels);

        let amount = 0;
        let count = 0;

        test_data.forEach(item => {
          let { prediction, result28 } = knn_predict(item);
          amount++;
          if (result28 == prediction) count++
          // console.log(`prediction:${prediction}; result28:${result28}`);
        });

        const rate = parseFloat(((count / amount) * 100).toFixed(2));
        // console.log(`成功率:${rate}%`);
        percent.push(rate);
      }

      for (let i = 0; i < 100; i++) {
        test();
      }

      percent.sort((a, b) => {
        if (a < b) {
          return -1;
        }
        if (a > b) {
          return 1;
        }
        // a 一定等于 b
        return 0;
      });

      const average = percent.reduce((a, b) => {
        return a + b;
      }) / percent.length;

      console.log(`最低准确率：${percent[0]}, 最高准确率：${percent[percent.length - 1]}`);
      console.log(`中位准确率：${percent[49]}, 平均准确率：${average}`);

    })
    .catch(err => {
      console.error('Error reading Excel file:', err);
    });
}


const handler_data = (data) => {

  let labels = [];
  let features = [];

  data.forEach((item) => {
    const result28 = item[3];
    const _e = item[2];
    const result14 = item[1];
    let feature = get_feature(result14, _e);
    features.push(feature);
    labels.push(result28);
  });

  feature = features;
  label = labels;
  return { features, labels }
}

const split_arr = (data, amount) => {
  const start = Math.floor(Math.random() * (data.length - amount));
  const test_data = data.slice(start, start + amount);
  const base_data = [...data.slice(0, start), ...data.slice(start + amount)];

  return { base_data, test_data };
}

const get_feature = (result14, _e) => {
  let feature = [];
  let [a, b] = result14.split(';');
  a = parseFloat(a);
  b = parseFloat(b);
  feature.push(a);
  feature.push(b);

  Object.keys(element).forEach((key) => {
    let _v = _e.hasOwnProperty(key) ? parseFloat(_e[key]) * 1 : 0;
    feature.push(_v);
  });
  return feature
};

export const knn_predict_online = (result14, _e) => {
  let newSample = get_feature(result14, _e);

  const prediction = knn.predict(newSample);
  // 找到最近的几条训练数据的索引
  const nearestIndices = knn.kdTree.nearest(newSample, k);

  const data = [];

  nearestIndices.forEach((item) => {
      const _data = find_data(item[0]);
      data.push(..._data);
  });



  return { prediction, nearest: data };
}
if(is_debugger) {
  study()
}