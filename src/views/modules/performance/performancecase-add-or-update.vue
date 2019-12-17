<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="用例名称" prop="caseName">
      <el-input v-model="dataForm.caseName" placeholder="用例名"></el-input>
    </el-form-item>
    <el-form-item label="所属项目" prop="project">
      <el-input v-model="dataForm.project" placeholder="所属项目"></el-input>
    </el-form-item>
    <el-form-item label="所属模块" prop="module">
      <el-input v-model="dataForm.module" placeholder="所属模块"></el-input>
    </el-form-item>
    <el-form-item label="操作人" prop="operator">
      <el-input v-model="dataForm.operator" placeholder="操作人"></el-input>
    </el-form-item>
    <el-form-item label="描述" prop="remark">
      <el-input v-model="dataForm.remark" placeholder="描述"></el-input>
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
          caseId: 0,
          caseName: '',
          project: '',
          module: '',
          status: '',
          operator: '',
          remark: '',
          priority: '',
          caseDir: '',
          addTime: '',
          addBy: '',
          updateTime: '',
          updateBy: ''
        },
        dataRule: {
          caseName: [
            { required: true, message: '用例名不能为空', trigger: 'blur' }
          ],
          project: [
            { required: true, message: '所属项目不能为空', trigger: 'blur' }
          ],
          module: [
            { required: true, message: '所属模块不能为空', trigger: 'blur' }
          ],
          status: [
            { required: true, message: '状态  0：禁用   1：正常不能为空', trigger: 'blur' }
          ],
          operator: [
            { required: true, message: '拥有者名字不能为空', trigger: 'blur' }
          ],
          remark: [
            { required: true, message: '描述不能为空', trigger: 'blur' }
          ],
          priority: [
            { required: true, message: '优先级用于过滤不能为空', trigger: 'blur' }
          ],
          caseDir: [
            { required: true, message: 'master节点保存用例信息的文件夹不能为空', trigger: 'blur' }
          ],
          addTime: [
            { required: true, message: '创建时间不能为空', trigger: 'blur' }
          ],
          addBy: [
            { required: true, message: '提交用户id不能为空', trigger: 'blur' }
          ],
          updateTime: [
            { required: true, message: '修改时间不能为空', trigger: 'blur' }
          ],
          updateBy: [
            { required: true, message: '修改用户id不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.caseId = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.caseId) {
            this.$http({
              url: this.$http.adornUrl(`/performance/performancecase/info/${this.dataForm.caseId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.caseName = data.performanceCase.caseName
                this.dataForm.project = data.performanceCase.project
                this.dataForm.module = data.performanceCase.module
                this.dataForm.status = data.performanceCase.status
                this.dataForm.operator = data.performanceCase.operator
                this.dataForm.remark = data.performanceCase.remark
                this.dataForm.priority = data.performanceCase.priority
                this.dataForm.caseDir = data.performanceCase.caseDir
                this.dataForm.addTime = data.performanceCase.addTime
                this.dataForm.addBy = data.performanceCase.addBy
                this.dataForm.updateTime = data.performanceCase.updateTime
                this.dataForm.updateBy = data.performanceCase.updateBy
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
              url: this.$http.adornUrl(`/performance/performancecase/${!this.dataForm.caseId ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'caseId': this.dataForm.caseId || undefined,
                'caseName': this.dataForm.caseName,
                'project': this.dataForm.project,
                'module': this.dataForm.module,
                'status': this.dataForm.status,
                'operator': this.dataForm.operator,
                'remark': this.dataForm.remark,
                'priority': this.dataForm.priority,
                'caseDir': this.dataForm.caseDir,
                'addTime': this.dataForm.addTime,
                'addBy': this.dataForm.addBy,
                'updateTime': this.dataForm.updateTime,
                'updateBy': this.dataForm.updateBy
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
