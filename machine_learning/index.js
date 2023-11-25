import { SimpleLinearRegression } from 'ml-regression';
import readlineSync from 'readline-sync';
import fs from 'fs/promises';

const model = new SimpleLinearRegression();

// 函数：训练模型
function trainModel(data) {
  model.train(data.map(entry => [entry['14天结果'], entry['成分'], entry['28天结果']]));
}

// 函数：预测28天结果
function predict28DaysResult(14DaysResult, component) {
  const prediction = model.predict([14DaysResult, component]);
  console.log(`预测的28天结果为: ${prediction}`);
}

// 函数：保存模型状态到文件
async function saveModelStateToFile(filePath) {
  const modelState = model.toJSON();
  await fs.writeFile(filePath, JSON.stringify(modelState));
  console.log('模型状态已保存到文件:', filePath);
}

// 函数：加载模型状态从文件
async function loadModelStateFromFile(filePath) {
  try {
    const modelState = JSON.parse(await fs.readFile(filePath, 'utf-8'));
    model.fromJSON(modelState);
    console.log('模型状态已从文件加载:', filePath);
  } catch (error) {
    console.error('加载模型状态时发生错误:', error.message);
  }
}

// 函数：在线学习和模型更新
async function onlineLearning(newData) {
  // 加载之前保存的模型状态
  await loadModelStateFromFile('modelState.json');
  
  // 训练模型
  trainModel(newData);

  // 保存更新后的模型状态到文件
  await saveModelStateToFile('updatedModelState.json');

  // 模拟新数据进入
  console.log('模型处理新数据：');
  for (const entry of newData) {
    const prediction = model.predict([entry['14天结果'], entry['成分']]);
    console.log(`14天结果: ${entry['14天结果']}, 成分: ${entry['成分']}, 模型预测28天结果: ${prediction}`);
  }
}

// 示例数据（初始训练数据）
const trainingData = [
  { '14天结果': 12, '成分': 5, '28天结果': 25 },
  { '14天结果': 20, '成分': 8, '28天结果': 38 },
  // 添加更多的训练数据...
];

// 初始训练模型
trainModel(trainingData);

// 保存初始模型状态到文件
saveModelStateToFile('initialModelState.json');

// 模拟新数据（纠错训练数据）
const newData = [
  { '14天结果': 15, '成分': 6, '28天结果': 30 },
  { '14天结果': 18, '成分': 7, '28天结果': 32 }
];

// 在线学习和模型更新
onlineLearning(newData);

// 用户输入新的数据
const userInput14DaysResult = parseFloat(readlineSync.question('请输入14天结果: '));
const userInputComponent = parseFloat(readlineSync.question('请输入成分: '));

// 预测28天结果
predict28DaysResult(userInput14DaysResult, userInputComponent);
