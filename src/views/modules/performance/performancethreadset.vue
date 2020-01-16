<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.key" placeholder="参数名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('performance:performancethreadset:update')" type="primary" @click="addOrUpdateHandle()">修改</el-button>
        <el-button v-if="isAuth('performance:performancethreadset:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
      </el-form-item>
    </el-form>
    <div>
    <el-table
      :data="dataList"
      style="width: 100%;"
      row-key="setId"
      border
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      @selection-change="selectionChangeHandle">
      <el-table-column prop="name" header-align="center" align="center" label="配置名称"></el-table-column>
      <el-table-column prop="setId" header-align="center" align="center" sortable label="配置项ID"></el-table-column>
      <el-table-column prop="parentName" header-align="center" align="center" label="上级配置"></el-table-column>
      <el-table-column prop="key" header-align="center" align="center" label="配置项"></el-table-column>
      <el-table-column prop="value" header-align="center" align="center" label="配置内容"></el-table-column>
      <el-table-column prop="type" header-align="center" align="center" label="类型">
        <template slot-scope="scope">
          <div>
            <span v-if="isType(scope.row.type)" v-html="isType(scope.row.type)">
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="explain" header-align="center" align="center" label="配置说明"></el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="deleteHandle(scope.row.setId)">同步配置</el-button>
        </template>
      </el-table-column>
    </el-table>
    </div>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './performancethreadset-add-or-update'
  export default {
    data () {
      return {
        dataForm: {
          key: ''
        },
        dataList: [],
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,

      }
    },
    components: {
      AddOrUpdate
    },
    activated () {
      this.getDataList()
    },
    methods: {
      isType(type) {
        if (type == 0){
          return '<span class="label-success">脚本</span>';
        }
        if (type == 1) {
          return '<span class="label-success">线程组</span>';
        }
        if (type == 2) {
          return '<span class="label-success">配置项</span>';
        }
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/performance/performancethreadset/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'key': this.dataForm.key
          })
        }).then(({data}) => {
          console.log('=======datalist',data)
          if (data && data.length > 0) {
            this.data = data
            this.dataList = this.format(this.data)

            console.log('=======this.dataList',this.dataList)
          } else {
            this.dataList = []
          }
          this.dataListLoading = false
        })
      },

    format(json){
    var ret = [], o = {};

    function add(arr, data){
      var obj = {
        "setId": data.setId,
        "name": data.name,
        "parentId": data.parentId,
        "parentName": data.parentName,
        "key": data.key,
        "value": data.value,
        "type": data.type,
        "explain": data.explain,
        "children": []
      };
      o[data.setId] = obj;
      arr.push(obj);
    }

    json.forEach(x => {
      if(o[x.parentId]){
        add(o[x.parentId].children, x);
      }else{
        add(ret, x);
      }
    });

    return ret;
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
        var setId = id ? [id] : this.dataListSelections.map(item => {
          return item.setId
        })
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          if(setId.length == 1){
            this.$refs.addOrUpdate.init(setId)
          } else {
            this.$message({
              message: '只能选择一条线程组!',
              duration: 1500
            })
          }
        })
      },
      // 删除
      deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.setId
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/performance/performancethreadset/delete'),
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
