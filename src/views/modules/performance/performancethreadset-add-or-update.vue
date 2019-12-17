<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="所属ID，一级配置为0" prop="parentId">
      <el-input v-model="dataForm.parentId" placeholder="所属ID，一级配置为0"></el-input>
    </el-form-item>
    <el-form-item label="配置名称" prop="name">
      <el-input v-model="dataForm.name" placeholder="配置名称"></el-input>
    </el-form-item>
    <el-form-item label="配置项" prop="key">
      <el-input v-model="dataForm.key" placeholder="配置项"></el-input>
    </el-form-item>
    <el-form-item label="配置内容" prop="value">
      <el-input v-model="dataForm.value" placeholder="配置内容"></el-input>
    </el-form-item>
    <el-form-item label="类型   0：脚本   1：线程组   2：配置" prop="type">
      <el-input v-model="dataForm.type" placeholder="类型   0：脚本   1：线程组   2：配置"></el-input>
    </el-form-item>
    <el-form-item label="配置说明" prop="explain">
      <el-input v-model="dataForm.explain" placeholder="配置说明"></el-input>
    </el-form-item>
    <el-form-item label="排序" prop="orderNum">
      <el-input v-model="dataForm.orderNum" placeholder="排序"></el-input>
    </el-form-item>
    <el-form-item label="所属脚本文件ID" prop="fileId">
      <el-input v-model="dataForm.fileId" placeholder="所属脚本文件ID"></el-input>
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          setId: 0,
          parentId: '',
          name: '',
          key: '',
          value: '',
          type: '',
          explain: '',
          orderNum: '',
          fileId: ''
        },
        dataRule: {
          parentId: [
            { required: true, message: '所属ID，一级配置为0不能为空', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '配置名称不能为空', trigger: 'blur' }
          ],
          key: [
            { required: true, message: '配置项不能为空', trigger: 'blur' }
          ],
          value: [
            { required: true, message: '配置内容不能为空', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '类型   0：脚本   1：线程组   2：配置不能为空', trigger: 'blur' }
          ],
          explain: [
            { required: true, message: '配置说明不能为空', trigger: 'blur' }
          ],
          orderNum: [
            { required: true, message: '排序不能为空', trigger: 'blur' }
          ],
          fileId: [
            { required: true, message: '所属脚本文件ID不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.setId = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.setId) {
            this.$http({
              url: this.$http.adornUrl(`/performance/performancethreadset/info/${this.dataForm.setId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.parentId = data.performanceThreadSet.parentId
                this.dataForm.name = data.performanceThreadSet.name
                this.dataForm.key = data.performanceThreadSet.key
                this.dataForm.value = data.performanceThreadSet.value
                this.dataForm.type = data.performanceThreadSet.type
                this.dataForm.explain = data.performanceThreadSet.explain
                this.dataForm.orderNum = data.performanceThreadSet.orderNum
                this.dataForm.fileId = data.performanceThreadSet.fileId
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/performance/performancethreadset/${!this.dataForm.setId ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'setId': this.dataForm.setId || undefined,
                'parentId': this.dataForm.parentId,
                'name': this.dataForm.name,
                'key': this.dataForm.key,
                'value': this.dataForm.value,
                'type': this.dataForm.type,
                'explain': this.dataForm.explain,
                'orderNum': this.dataForm.orderNum,
                'fileId': this.dataForm.fileId
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      }
    }
  }
</script>
