const perTestCaseList = () => import('./views/modules/performance/performancecase.vue');
const perTestCaseInfo = () => import('./views/modules/performance/performancecasefile.vue');

let routes = [
  {
    path: '#',
    name: '',
    projectHidden: true,
    children: [
      { path: '/performance/performancecase/list', component: perTestCaseList, iconCls:'el-icon-message', name: '性能测试用例'},
      { path: '/performance/performancecase/case=:case_id', component: perTestCaseInfo, name: '测试用例详情' }

    ]
  }
]
