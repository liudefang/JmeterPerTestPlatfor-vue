import axios from 'axios';

export const test_url = 'http://localhost:8081/renren-fast';

// 测试用例
export const getPerTestCase = (headers, params) => {
  return axios.get(`${test_url}/performance/performancecase/list`, {params: params, headers:headers}).then(data => data.data);
}
