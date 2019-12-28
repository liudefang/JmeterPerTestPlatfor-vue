<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="测试报告" prop="caseId">
      <el-input v-model="dataForm.caseId" placeholder="所关联的用例"></el-input>
    </el-form-item>
    <el-form-item label="所关联的同步过的slave子节点" prop="slaveId">
      <el-input v-model="dataForm.slaveId" placeholder="所关联的同步过的slave子节点"></el-input>
    </el-form-item>
    <el-form-item label="上传的文件名带后缀" prop="originName">
      <el-input v-model="dataForm.originName" placeholder="上传的文件名带后缀"></el-input>
    </el-form-item>
    <el-form-item label="防止汉字编码错误实际保存的文件名带后缀" prop="fileName">
      <el-input v-model="dataForm.fileName" placeholder="防止汉字编码错误实际保存的文件名带后缀"></el-input>
    </el-form-item>
    <el-form-item label="文件的MD5对于参数化文件有效主要用于节点的参数化文件校验" prop="fileMd5">
      <el-input v-model="dataForm.fileMd5" placeholder="文件的MD5对于参数化文件有效主要用于节点的参数化文件校验"></el-input>
    </el-form-item>
    <el-form-item label="状态  0：初始状态  1：正在运行  2：成功执行  3：运行出现异常   -1：不被搜索出来" prop="status">
      <el-input v-model="dataForm.status" placeholder="状态  0：初始状态  1：正在运行  2：成功执行  3：运行出现异常   -1：不被搜索出来"></el-input>
    </el-form-item>
    <el-form-item label="状态  0：保存测试报告原始文件  1：不需要测试报告" prop="reportStatus">
      <el-input v-model="dataForm.reportStatus" placeholder="状态  0：保存测试报告原始文件  1：不需要测试报告"></el-input>
    </el-form-item>
    <el-form-item label="状态  0：需要前端监控  1：不需要前端监控" prop="webchartStatus">
      <el-input v-model="dataForm.webchartStatus" placeholder="状态  0：需要前端监控  1：不需要前端监控"></el-input>
    </el-form-item>
    <el-form-item label="状态  0：关闭debug  1：开始debug调试模式" prop="debugStatus">
      <el-input v-model="dataForm.debugStatus" placeholder="状态  0：关闭debug  1：开始debug调试模式"></el-input>
    </el-form-item>
    <el-form-item label="期间，执行时间，单位秒，脚本执行多久停止，0代表永远执行" prop="duration">
      <el-input v-model="dataForm.duration" placeholder="期间，执行时间，单位秒，脚本执行多久停止，0代表永远执行"></el-input>
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
          fileId: 0,
          caseId: '',
          slaveId: '',
          originName: '',
          fileName: '',
          fileMd5: '',
          status: '',
          reportStatus: '',
          webchartStatus: '',
          debugStatus: '',
          duration: '',
          addTime: '',
          addBy: '',
          updateTime: '',
          updateBy: ''
        },
        dataRule: {
          caseId: [
            { required: true, message: '所关联的用例不能为空', trigger: 'blur' }
          ],
          slaveId: [
            { required: true, message: '所关联的同步过的slave子节点不能为空', trigger: 'blur' }
          ],
          originName: [
            { required: true, message: '上传的文件名带后缀不能为空', trigger: 'blur' }
          ],
          fileName: [
            { required: true, message: '防止汉字编码错误实际保存的文件名带后缀不能为空', trigger: 'blur' }
          ],
          fileMd5: [
            { required: true, message: '文件的MD5对于参数化文件有效主要用于节点的参数化文件校验不能为空', trigger: 'blur' }
          ],
          status: [
            { required: true, message: '状态  0：初始状态  1：正在运行  2：成功执行  3：运行出现异常   -1：不被搜索出来不能为空', trigger: 'blur' }
          ],
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
              url: this.$http.adornUrl(`/performance/performancecasefile/${!this.dataForm.fileId ? 'save' : 'update'}`),
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
