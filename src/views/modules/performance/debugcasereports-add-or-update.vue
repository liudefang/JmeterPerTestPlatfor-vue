<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="所关联的用例" prop="caseId">
      <el-input v-model="dataForm.caseId" placeholder="所关联的用例"></el-input>
    </el-form-item>
    <el-form-item label="所关联的用例文件" prop="fileId">
      <el-input v-model="dataForm.fileId" placeholder="所关联的用例文件"></el-input>
    </el-form-item>
    <el-form-item label="测试报告名称" prop="originName">
      <el-input v-model="dataForm.originName" placeholder="测试报告名称"></el-input>
    </el-form-item>
    <el-form-item label="避免跨系统编码错误，随机化了结果文件名，存储了相对路径" prop="reportName">
      <el-input v-model="dataForm.reportName" placeholder="避免跨系统编码错误，随机化了结果文件名，存储了相对路径"></el-input>
    </el-form-item>
    <el-form-item label="测试结果文件大小" prop="fileSize">
      <el-input v-model="dataForm.fileSize" placeholder="测试结果文件大小"></el-input>
    </el-form-item>
    <el-form-item label="状态  0：初始状态  1：正在运行  2：成功执行  3：运行出现异常" prop="status">
      <el-input v-model="dataForm.status" placeholder="状态  0：初始状态  1：正在运行  2：成功执行  3：运行出现异常"></el-input>
    </el-form-item>
    <el-form-item label="描述" prop="remark">
      <el-input v-model="dataForm.remark" placeholder="描述"></el-input>
    </el-form-item>
    <el-form-item label="创建时间" prop="addTime">
      <el-input v-model="dataForm.addTime" placeholder="创建时间"></el-input>
    </el-form-item>
    <el-form-item label="提交用户id" prop="addBy">
      <el-input v-model="dataForm.addBy" placeholder="提交用户id"></el-input>
    </el-form-item>
    <el-form-item label="修改时间" prop="updateTime">
      <el-input v-model="dataForm.updateTime" placeholder="修改时间"></el-input>
    </el-form-item>
    <el-form-item label="修改用户id" prop="updateBy">
      <el-input v-model="dataForm.updateBy" placeholder="修改用户id"></el-input>
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
          reportId: 0,
          caseId: '',
          fileId: '',
          originName: '',
          reportName: '',
          fileSize: '',
          status: '',
          remark: '',
          addTime: '',
          addBy: '',
          updateTime: '',
          updateBy: ''
        },
        dataRule: {
          caseId: [
            { required: true, message: '所关联的用例不能为空', trigger: 'blur' }
          ],
          fileId: [
            { required: true, message: '所关联的用例文件不能为空', trigger: 'blur' }
          ],
          originName: [
            { required: true, message: '测试报告名称不能为空', trigger: 'blur' }
          ],
          reportName: [
            { required: true, message: '避免跨系统编码错误，随机化了结果文件名，存储了相对路径不能为空', trigger: 'blur' }
          ],
          fileSize: [
            { required: true, message: '测试结果文件大小不能为空', trigger: 'blur' }
          ],
          status: [
            { required: true, message: '状态  0：初始状态  1：正在运行  2：成功执行  3：运行出现异常不能为空', trigger: 'blur' }
          ],
          remark: [
            { required: true, message: '描述不能为空', trigger: 'blur' }
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
        this.dataForm.reportId = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.reportId) {
            this.$http({
              url: this.$http.adornUrl(`/performance/debugcasereports/info/${this.dataForm.reportId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.caseId = data.debugCaseReports.caseId
                this.dataForm.fileId = data.debugCaseReports.fileId
                this.dataForm.originName = data.debugCaseReports.originName
                this.dataForm.reportName = data.debugCaseReports.reportName
                this.dataForm.fileSize = data.debugCaseReports.fileSize
                this.dataForm.status = data.debugCaseReports.status
                this.dataForm.remark = data.debugCaseReports.remark
                this.dataForm.addTime = data.debugCaseReports.addTime
                this.dataForm.addBy = data.debugCaseReports.addBy
                this.dataForm.updateTime = data.debugCaseReports.updateTime
                this.dataForm.updateBy = data.debugCaseReports.updateBy
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
              url: this.$http.adornUrl(`/performance/debugcasereports/${!this.dataForm.reportId ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'reportId': this.dataForm.reportId || undefined,
                'caseId': this.dataForm.caseId,
                'fileId': this.dataForm.fileId,
                'originName': this.dataForm.originName,
                'reportName': this.dataForm.reportName,
                'fileSize': this.dataForm.fileSize,
                'status': this.dataForm.status,
                'remark': this.dataForm.remark,
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
