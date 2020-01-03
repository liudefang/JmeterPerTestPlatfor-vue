<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="测试报告" prop="reportStatus">
      <el-radio-group v-model="dataForm.reportStatus">
        <el-radio :label="0">需要测试报告</el-radio>
        <el-radio :label="1">不需要测试报告</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="前端监控" prop="webchartStatus">
      <el-radio-group v-model="dataForm.webchartStatus">
        <el-radio :label="0">需要前端监控</el-radio>
        <el-radio :label="1">不需要前端监控</el-radio>
      </el-radio-group>
    </el-form-item>
      <el-form-item label="调式报告" prop="debugStatus">
        <el-radio-group v-model="dataForm.debugStatus">
          <el-radio :label="0">开启调试</el-radio>
          <el-radio :label="1">关闭调试</el-radio>
        </el-radio-group>
      </el-form-item>
    <el-form-item label="执行时长" prop="duration">
      <el-input v-model="dataForm.duration" placeholder="期间，执行时间，单位秒，脚本执行多久停止，0代表永远执行">
      </el-input>
      <code style="margin-top:4px;display: block;">说明：针对永远循环的线程组，避免遗忘需设置时长(秒)<br />默认持续执行时间4小时，设置为0则表示永远循环执行！</code>
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
          reportStatus: '',
          webchartStatus: '',
          debugStatus: '',
          duration: ''
        },
        dataRule: {
          reportStatus: [
            { required: true, message: '状态  0：保存测试报告原始文件  1：不需要测试报告不能为空', trigger: 'blur' }
          ],
          webchartStatus: [
            { required: true, message: '状态  0：需要前端监控  1：不需要前端监控不能为空', trigger: 'blur' }
          ],
          debugStatus: [
            { required: true, message: '状态  0：关闭debug  1：开始debug调试模式不能为空', trigger: 'blur' }
          ],
          duration: [
            { required: true, message: '期间，执行时间，单位秒，脚本执行多久停止，0代表永远执行不能为空', trigger: 'blur' }
          ],
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.fileId = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.fileId) {
            this.$http({
              url: this.$http.adornUrl(`/performance/performancecasefile/info/${this.dataForm.fileId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.caseId = data.performanceCaseFile.caseId
                this.dataForm.slaveId = data.performanceCaseFile.slaveId
                this.dataForm.originName = data.performanceCaseFile.originName
                this.dataForm.fileName = data.performanceCaseFile.fileName
                this.dataForm.fileMd5 = data.performanceCaseFile.fileMd5
                this.dataForm.status = data.performanceCaseFile.status
                this.dataForm.reportStatus = data.performanceCaseFile.reportStatus
                this.dataForm.webchartStatus = data.performanceCaseFile.webchartStatus
                this.dataForm.debugStatus = data.performanceCaseFile.debugStatus
                this.dataForm.duration = data.performanceCaseFile.duration
                this.dataForm.addTime = data.performanceCaseFile.addTime
                this.dataForm.addBy = data.performanceCaseFile.addBy
                this.dataForm.updateTime = data.performanceCaseFile.updateTime
                this.dataForm.updateBy = data.performanceCaseFile.updateBy
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
              url: this.$http.adornUrl(`/performance/performancecasefile/${!this.dataForm.fileId ? 'save' : 'fileUpdate'}`),
              method: 'post',
              data: this.$http.adornData({
                'fileId': this.dataForm.fileId || undefined,
                'caseId': this.dataForm.caseId,
                'slaveId': this.dataForm.slaveId,
                'originName': this.dataForm.originName,
                'fileName': this.dataForm.fileName,
                'fileMd5': this.dataForm.fileMd5,
                'status': this.dataForm.status,
                'reportStatus': this.dataForm.reportStatus,
                'webchartStatus': this.dataForm.webchartStatus,
                'debugStatus': this.dataForm.debugStatus,
                'duration': this.dataForm.duration,
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
