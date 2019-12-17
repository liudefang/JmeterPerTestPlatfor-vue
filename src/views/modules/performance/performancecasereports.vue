<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.key" placeholder="参数名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('performance:performancecasereports:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('performance:performancecasereports:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="reportId"
        header-align="center"
        align="center"
        label="">
      </el-table-column>
      <el-table-column
        prop="caseId"
        header-align="center"
        align="center"
        label="所关联的用例">
      </el-table-column>
      <el-table-column
        prop="fileId"
        header-align="center"
        align="center"
        label="所关联的用例文件">
      </el-table-column>
      <el-table-column
        prop="originName"
        header-align="center"
        align="center"
        label="测试报告名称">
      </el-table-column>
      <el-table-column
        prop="reportName"
        header-align="center"
        align="center"
        label="避免跨系统编码错误，实际文件存储的报告名，名称和测试报告文件夹名称一致">
      </el-table-column>
      <el-table-column
        prop="fileSize"
        header-align="center"
        align="center"
        label="测试结果文件大小">
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        label="状态  0：初始状态  1：正在运行  2：成功执行  3：运行出现异常">
      </el-table-column>
      <el-table-column
        prop="remark"
        header-align="center"
        align="center"
        label="描述">
      </el-table-column>
      <el-table-column
        prop="addTime"
        header-align="center"
        align="center"
        label="创建时间">
      </el-table-column>
      <el-table-column
        prop="addBy"
        header-align="center"
        align="center"
        label="提交用户id">
      </el-table-column>
      <el-table-column
        prop="updateTime"
        header-align="center"
        align="center"
        label="修改时间">
      </el-table-column>
      <el-table-column
        prop="updateBy"
        header-align="center"
        align="center"
        label="修改用户id">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.reportId)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.reportId)">删除</el-button>
        </template>
      </el-table-column>
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
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './performancecasereports-add-or-update'
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
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/performance/performancecasereports/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'key': this.dataForm.key
          })
        }).then(({data}) => {
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
          return item.reportId
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/performance/performancecasereports/delete'),
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
