<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.key" placeholder="参数名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('performance:performancecase:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button type="primary" @click="uploadHandle()" :disabled="dataListSelections.length <= 0">上传文件</el-button>
        <el-button v-if="isAuth('performance:performancecase:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      @select="getSelectedRow"
      style="width: 100%;">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="caseId" header-align="center" align="center" label="用例ID"></el-table-column>
      <el-table-column prop="caseName" header-align="center" align="center" label="用例名">
        <template slot-scope="scope">
          <el-icon name="caseName"></el-icon>
          <router-link :to="{name: '测试用例详情', params: {case_id: scope.row.caseId}}">
              {{ scope.row.caseName }}
          </router-link>
<!--          <div>-->
<!--&lt;!&ndash;            {{ scope.row.caseName }}&ndash;&gt;-->
<!--            <a :href='"http://localhost:8081/renren-fast/performance/performancecase/list"'>{{ scope.row.caseName }}</a>-->
<!--          </div>-->
        </template>
      </el-table-column>
      <el-table-column prop="project" header-align="center" align="center" label="所属项目"></el-table-column>
      <el-table-column prop="module" header-align="center" align="center" label="所属模块"></el-table-column>
      <el-table-column prop="operator" header-align="center" align="center" label="操作人"></el-table-column>
      <el-table-column prop="remark" header-align="center" align="center" label="描述">
      </el-table-column>
      <el-table-column prop="addTime" header-align="center" align="center" label="创建时间"></el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.caseId)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.caseId)">删除</el-button>
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

    <div style="text-align: center;padding-top:16px;">（说明：请上传测试脚本及附件，要求jmx脚本所关联的附件或参数文件只设文件名，不设置路径；同一用例下如果上传同名文件既为覆盖同名文件）</div>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <!-- 弹窗, 上传文件 -->
    <upload v-if="uploadVisible" ref="upload" @refreshDataList="getDataList"></upload>
  </div>
</template>

<script>
  import AddOrUpdate from './performancecase-add-or-update'
  import Upload from './case-upload'
  import {getPerTestCase} from '../../../api/api'
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
        getSelectedRow: [],
        dataListSelections: [],
        addOrUpdateVisible: false,
        uploadVisible: false,
        visible: false,
        url: '',
        num: 0,
        successNum: 0,
        fileList: [],
        id: '',
        sum: 0
      }
    },
    components: {
      AddOrUpdate,
      Upload
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        // this.$http({
        //   url: this.$http.adornUrl('/performance/performancecase/list'),
        //   method: 'get',
        //   params: this.$http.adornParams({
        //     'page': this.pageIndex,
        //     'limit': this.pageSize,
        //     'key': this.dataForm.key
        //   })
        let self = this;
        let params = {page: self.pageIndex, limit: self.pageSize, key: self.dataForm.key};
        let headers = {token: self.$cookie.get('token')};
        getPerTestCase(headers, params).then((data) => {
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
       // 上传文件
      uploadHandle (id) {
        var caseId = id ? [id] : this.dataListSelections.map(item => {
            return item.caseId
        })
        this.uploadVisible = true;
        this.$nextTick(() => {
          if(caseId.length == 1){
            this.$refs.upload.init(caseId)
          } else {
            this.$message({
              message: '只能选择一条用例!',
              duration: 1500
            })
          }
        })
      },
      // 删除
      deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.caseId
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/performance/performancecase/delete'),
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
