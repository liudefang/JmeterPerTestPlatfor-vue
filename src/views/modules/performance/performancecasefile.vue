<template>

  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.key" placeholder="参数名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('performance:performancecasefile:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('performance:performancecasefile:delete')" type="danger" icon="el-icon-delete" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="fileId" header-align="center" align="center" label="文件ID"></el-table-column>
      <el-table-column prop="caseName" header-align="center" align="center" label="所关联的用例"></el-table-column>
      <el-table-column prop="originName" header-align="center" align="center" label="文件名称">
        <template slot-scope="scope">
          <div>
            {{ scope.row.originName }}
            <a v-if="isJmx(scope.row.originName)" :href="scope.row.url">77</a>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="status" header-align="center" align="center" label="状态">
        <template slot-scope="scope">
          <div>
              <span v-if="isStatus(scope.row.originName,scope.row.status)" v-html="isStatus(scope.row.originName,scope.row.status)">

              </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="reportStatus" header-align="center" align="center" label="测试报告">
        <template slot-scope="scope">
          <div>
            <span v-if="isRpSt(scope.row.originName,scope.row.reportStatus)" v-html="isRpSt(scope.row.originName,scope.row.reportStatus)">
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="webchartStatus" header-align="center" align="center" label="Chart监控">
        <template slot-scope="scope">
          <div>
            <span v-if="isChSt(scope.row.originName,scope.row.webchartStatus)" v-html="isChSt(scope.row.originName,scope.row.webchartStatus)">

            </span>
          </div>
        </template>

      </el-table-column>
      <el-table-column prop="debugStatus" header-align="center" align="center" label="调试状态">
        <template slot-scope="scope">
          <div>
            <span v-if="isDgSt(scope.row.originName,scope.row.debugStatus)" v-html="isDgSt(scope.row.originName,scope.row.debugStatus)">

            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="addTime" header-align="center" align="center" label="创建时间">
      </el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <div>
            <el-button @click="clickBtn(scope.row.originName,scope.row.status,scope.row.fileId)" v-html="isBtn(scope.row.originName,scope.row.status,scope.row.fileId)">
            </el-button>
          </div>
<!--          <el-button type="primary" circle size="small" @click="addOrUpdateHandle(scope.row.fileId)">启动</el-button>-->
<!--          <el-button type="info" icon="el-icon-download" circle size="small" @click="addOrUpdateHandle(scope.row.fileId)">下载</el-button>-->
<!--          <el-button type="primary" icon="el-icon-edit" size="small" @click="addOrUpdateHandle(scope.row.fileId)">修改</el-button>-->
<!--      <el-button type="danger" icon="el-icon-delete" size="small" @click="deleteHandle(scope.row.fileId)">删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 30, 50]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './performancecasefile-update';
  import {getPerTestCaseInfo} from '../../../api/api'
  // import * as t from '@/utils/test.js';
  export default {
    data () {
      return {
        dataForm: {
          key: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false
      }
    },
    components: {
      AddOrUpdate
    },
    activated () {
      this.getDataList()
      //this.getDataInfo()
    },
    methods: {
      isJmx(val){
        console.log('======val',val)
        if(val.indexOf('.jmx') != -1){
          return true
        }
        // val.indexOf('.jmx') != -1 ? true : false
      },
      isStatus(name, status){
        if (status === 0) {
          return '<span class="label-success">创建成功</span>';
        } else if (status === 1) {
          return '<span class="label-success">正在运行</span>';
        } else if (status === 2) {
          if(name.indexOf('.jmx') != -1) {
            return '<span class="label-success">同步成功</span>';
          }
          return '<span class="label-success">执行成功</span>';
        } else if (status === 3) {
          return '<span class="label-danger">出现异常</span>';
        }
      },
      isChSt(name, status){
        if(name.indexOf('.jmx') != -1){
          console.log('======status',status)
          if (status === 0){
            return '<span class="label-success">启用</span>';
          } else if (status === 1) {
            return '<span class="label-danger">禁 止</span>';
          }
        }

      },
      isDgSt(name, status){
        if(name.indexOf('.jmx') != -1){
          console.log('======status',status)
          if (status === 0){
            return '<span class="label-success">启用</span>';
          } else if (status === 1) {
            return '<span class="label-danger">禁 止</span>';
          }
        }
      },
      isRpSt(name, status){
        if(name.indexOf('.jmx') != -1){
          console.log('======status',status)
          if (status === 0){
            return '<span class="label-success">启用</span>';
          } else if (status === 1) {
            return '<span class="label-danger">禁 止</span>';
          }
        }

      },
      isBtn(name, status,id){
        console.log("----------id信息--------", id)
        var btn = '';
        if(name.indexOf('.jmx') == -1){
          btn = '<span class="label-success">同步文件</span>'
        }else{
          if  (status == 1) {
            btn ='<span class="label-danger">停止</span>'
          } else {
            btn ='<span class="label-success">启动</span>'
          }
        }
        return btn;
      },
      clickBtn(name, status,id){
        if(name.indexOf('.jmx') == -1){
          this.synchronizeFile(id)
        }else{
          if  (status == 1) {
            this.stopOnce(id)
          } else {
            this.runOnce(id)
          }
        }
      },
      runOnce(fileIds){
        console.log('==========)',fileIds)
        if (!fileIds) {
              return;
            }
            var postURL = "test/stressFile/runOnce";
            // if(slaveIds){
            //   postURL = "test/stressFile/runOnce/"+slaveIds;
            // }
            $.get(baseURL + "test/stressSlave/list/enableTotal", function (r) {
              if (fileIds || r.total < 2){
                $.ajax({
                  type: "POST",
                  url: baseURL + postURL,
                  contentType: "application/json",
                  data: JSON.stringify(numberToArray(fileIds)),
                  success: function (r) {
                    if (r.code == 0) {
                      vm.reload();
                      alert(r.msg, function () {
                      });
                    }
                  }
                });
              } else {
                //vm.getSlave(fileIds);
              }
            });

      },
      // // 获取数据列表
      // getDataList () {
      //   this.dataListLoading = true
      //   var self = this;
      //   let params = {page: self.pageIndex, limit: self.pageSize, key: self.dataForm.key};
      //   let headers = {
      //     token: self.$cookie.get('token')
      //   };
      //   // this.$http({
      //   //   url: this.$http.adornUrl('/performance/performancecasefile/list'),
      //   //   method: 'get',
      //   //   params: this.$http.adornParams({
      //   //     'page': this.pageIndex,
      //   //     'limit': this.pageSize,
      //   //     'key': this.dataForm.key
      //   //   })
      //   // })
      //   getPerTestCaseFile(headers, params).then((data) => {
      //     if (data && data.code === 0) {
      //       this.dataList = data.page.list
      //       this.totalPage = data.page.totalCount
      //     } else {
      //       this.dataList = []
      //       this.totalPage = 0
      //     }
      //     this.dataListLoading = false
      //   })
      // },

      // 获取测试用例详情
      getDataList() {
        var self = this;
        let params = {
          caseId: this.$route.params.case_id,
          page: self.pageIndex,
          limit: self.pageSize,
          key: self.dataForm.key
        };
        let headers = {
          "Content-Type": "application/json",
          token: self.$cookie.get('token')
        };
        getPerTestCaseInfo(headers, params).then((data) => {
          console.log("--------获取的用例详情------", data)
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.totalPage = data.page.totalCount
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 删除
      deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.fileId
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/performance/performancecasefile/delete'),
            method: 'post',
            data: this.$http.adornData(ids, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      }


    },


    mounted () {
      this.getDataList()
    }
  }

  // function runOnce(fileIds, slaveIds) {
  //   if (!fileIds) {
  //     return;
  //   }
  //   var postURL = "test/stressFile/runOnce";
  //   if(slaveIds){
  //     postURL = "test/stressFile/runOnce/"+slaveIds;
  //   }
  //   $.get(baseURL + "test/stressSlave/list/enableTotal", function (r) {
  //     if (slaveIds || r.total < 2){
  //       $.ajax({
  //         type: "POST",
  //         url: baseURL + postURL,
  //         contentType: "application/json",
  //         data: JSON.stringify(numberToArray(fileIds)),
  //         success: function (r) {
  //           if (r.code == 0) {
  //             vm.reload();
  //             alert(r.msg, function () {
  //             });
  //           }
  //         }
  //       });
  //     } else {
  //       vm.getSlave(fileIds);
  //     }
  //   });
  //
  // }
</script>
<style>
  .label-success {
    background-color: #5cb85c;
  }
  .label-danger {
    background-color: #d9534f;
  }
  .label-info {
    background-color: #5bc0de;
  }
  .label-warning{
    background-color:#f0ad4e;
  }
</style>
