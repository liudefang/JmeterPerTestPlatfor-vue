<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.key" placeholder="参数名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('performance:performanceslave:save')" type="primary" @click="addSlaveHandle()">新增</el-button>
        <el-button v-if="isAuth('performance:performanceslave:update')" type="primary" @click="updateSlaveHandle()" :disabled="dataListSelections.length <= 0">修改</el-button>
        <el-button v-if="isAuth('performance:performanceslave:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="slaveId" header-align="center" align="center" label="节点ID"></el-table-column>
      <el-table-column prop="slaveName" header-align="center" align="center" label="节点名称"></el-table-column>
      <el-table-column prop="ip" header-align="center" align="center" label="IP地址"></el-table-column>
      <el-table-column prop="jmeterPort" header-align="center" align="center" label="Jmeter链接端口"></el-table-column>
      <el-table-column prop="userName" header-align="center" align="center" label="节点机用户名"></el-table-column>
      <el-table-column prop="passwd" header-align="center" align="center" label="节点机密码"></el-table-column>
      <el-table-column prop="sshPort" header-align="center" align="center" label="ssh链接端口"></el-table-column>
      <el-table-column prop="homeDir" header-align="center" align="center" label="节点的Jmeter路径"></el-table-column>
      <el-table-column prop="status" header-align="center" align="center" label="状态">
        <template slot-scope="scope">
          <div>
              <span v-if="isStatus(scope.row.status)" v-html="isStatus(scope.row.status)">
                </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="weight" header-align="center" align="center" label="slave节点机的权重(%)"></el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-slave v-if="addSlaveVisible" ref="addSlave" @refreshDataList="getDataList"></add-slave>
    <update-slave v-if="updateSlaveVisible" ref="updateSlave" @refreshDataList="getDataList"></update-slave>
  </div>
</template>

<script>
  import AddSlave from './performanceslave-add'
  import UpdateSlave from './performanceslave-update'
  import {getPerTestSlave} from '../../../api/api'
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
        addSlaveVisible: false,
        updateSlaveVisible: false
      }
    },
    components: {
      AddSlave,
      UpdateSlave
    },
    activated () {
      this.getDataList()
    },
    methods: {
      isStatus(status){
        if (status === 0) {
          return '<span class="label-info">警用</span>';
        } else if (status === 1) {
          return '<span class="label-success">启用</span>';
        } else if (status === 2) {
          return '<span class="label-info">变更中</span>';
        } else if (status === 3) {
          return '<span class="label-danger">出现异常</span>';
        }
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        let self = this;
        let params = {page: self.pageIndex, limit: self.pageSize, key: self.dataForm.key};
        let headers = {token: self.$cookie.get('token')};
        getPerTestSlave(headers, params).then((data) => {
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
      addSlaveHandle (id) {
        this.addSlaveVisible = true
        this.$nextTick(() => {
          this.$refs.addSlave.init(id)
        })
      },
      updateSlaveHandle(id) {
        var slaveId = id ? [id] : this.dataListSelections.map(item => {
          return item.slaveId
        })
        this.updateSlaveVisible = true;
        if(slaveId.length == 1){
          this.$nextTick(() => {
            this.$refs.updateSlave.init(slaveId)
          })
        }else {
          this.$message({
            message: '只能选择一个节点!',
            duration: 1500
          })
        }
      },
      // 删除
      deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.slaveId
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/performance/performanceslave/delete'),
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
    }
  }
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
