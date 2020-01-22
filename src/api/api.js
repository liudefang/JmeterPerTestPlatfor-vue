import axios from 'axios';

export const test_url = 'http://localhost:8081/renren-fast';

// 测试用例
export const getPerTestCase = (headers, params) => {
  return axios.get(`${test_url}/performance/performancecase/list`, {params: params, headers:headers}).then(data => data.data);
}
// 测试用例详情
export const getPerTestCaseInfo = (headers, params) => {
  return axios.get(`${test_url}/performance/performancecasefile/list`, {params: params, headers:headers}).then(data => data.data);
}


// 分布式节点列表
export const getPerTestSlave = (headers, params) => {
  return axios.get(`${test_url}/performance/performanceslave/list`, {params: params, headers:headers}).then(data => data.data);
}

// 获取分布式节点信息
export const getSlaveInfo = (headers, params) => {
  return axios.get(`${test_url}/performance/performanceslave/info`, {params: params, headers:headers}).then(data => data.data);
}
// 新增分布式节点
export const addTestSlave = (headers, params) => {
  return axios.post(`${test_url}/performance/performanceslave/save`, params, {headers}).then(data => data.data);
};

// 编辑分布式节点
export const updateTestSlave = (headers, params) => {
  return axios.post(`${test_url}/performance/performanceslave/update`, params, {headers}).then(data => data.data);
}

// 启用分布式节点
export const slaveUpdateStatus = (headers, params) => {
  return axios.post(`${test_url}/performance/performanceslave/batchUpdateStatus`, params, {headers}).then(data => data.data);
}

// 手工启用分布式节点
export const slaveUpdateStatusForce = (headers, params) => {
  return axios.post(`${test_url}/performance/performanceslave/batchUpdateStatusForce`, params, {headers}).then(data => data.data);
}

// 重启分布式节点
export const slaveStatusRestart = (headers, params) => {
  return axios.post(`${test_url}/performance/performanceslave/batchRestart`, params, {headers}).then(data => data.data);
}

// 校准分布式节点
export const slaveReload = (headers, params) => {
  return axios.post(`${test_url}/performance/performanceslave/batchReload`, params, {headers}).then(data => data.data);
}

// 获取线程组的信息
export  const getThreadSetInfo = (headers, params) => {
  return axios.get(`${test_url}/performance/performancecasefile/info/`+ params, {headers:headers}).then(data => data.data);
}

// 获取测试报告列表的信息
export  const getTestRepList = (headers, params) => {
  return axios.get(`${test_url}/performance/performancecasereports/list/`, {params: params, headers:headers}).then(data => data.data);
}

// 获取测试报告列表的信息
export  const getSlaveEnable = (headers, params) => {
  return axios.get(`${test_url}/performance/performanceslave/list/enableTotal/`, {params: params, headers:headers}).then(data => data.data);
}
