<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="子节点名称" prop="slaveName">
      <el-input v-model="dataForm.slaveName" placeholder="子节点名称"></el-input>
    </el-form-item>
    <el-form-item label="ip地址" prop="ip">
      <el-input v-model="dataForm.ip" placeholder="ip地址"></el-input>
    </el-form-item>
    <el-form-item label="Jmeter链接端口号" prop="jmeterPort">
      <el-input v-model="dataForm.jmeterPort" placeholder="Jmeter链接端口号"></el-input>
    </el-form-item>
    <el-form-item label="节点机用户名" prop="userName">
      <el-input v-model="dataForm.userName" placeholder="节点机用户名"></el-input>
    </el-form-item>
    <el-form-item label="节点机密码" prop="passwd">
      <el-input v-model="dataForm.passwd" placeholder="节点机密码"></el-input>
    </el-form-item>
    <el-form-item label="ssh链接端口号" prop="sshPort">
      <el-input v-model="dataForm.sshPort" placeholder="ssh链接端口号"></el-input>
    </el-form-item>
    <el-form-item label="子节点的Jmeter路径" prop="homeDir">
      <el-input v-model="dataForm.homeDir" placeholder="子节点的Jmeter路径"></el-input>
    </el-form-item>
    <el-form-item label="状态  0：禁用   1：正常" prop="status">
      <el-input v-model="dataForm.status" placeholder="状态  0：禁用   1：正常"></el-input>
    </el-form-item>
    <el-form-item label="slave节点机的权重，取值在1-99999，slave的权重可以大于或者小于master" prop="weight">
      <el-input v-model="dataForm.weight" placeholder="slave节点机的权重，取值在1-99999，slave的权重可以大于或者小于master"></el-input>
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
          slaveId: 0,
          slaveName: '',
          ip: '',
          jmeterPort: '',
          userName: '',
          passwd: '',
          sshPort: '',
          homeDir: '',
          status: '',
          weight: '',
          addTime: '',
          addBy: '',
          updateTime: '',
          updateBy: ''
        },
        dataRule: {
          slaveName: [
            { required: true, message: '子节点名称不能为空', trigger: 'blur' }
          ],
          ip: [
            { required: true, message: 'ip地址不能为空', trigger: 'blur' }
          ],
          jmeterPort: [
            { required: true, message: 'Jmeter链接端口号不能为空', trigger: 'blur' }
          ],
          userName: [
            { required: true, message: '节点机用户名不能为空', trigger: 'blur' }
          ],
          passwd: [
            { required: true, message: '节点机密码不能为空', trigger: 'blur' }
          ],
          sshPort: [
            { required: true, message: 'ssh链接端口号不能为空', trigger: 'blur' }
          ],
          homeDir: [
            { required: true, message: '子节点的Jmeter路径不能为空', trigger: 'blur' }
          ],
          status: [
            { required: true, message: '状态  0：禁用   1：正常不能为空', trigger: 'blur' }
          ],
          weight: [
            { required: true, message: 'slave节点机的权重，取值在1-99999，slave的权重可以大于或者小于master不能为空', trigger: 'blur' }
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
        this.dataForm.slaveId = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.slaveId) {
            this.$http({
              url: this.$http.adornUrl(`/performance/performanceslave/info/${this.dataForm.slaveId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.slaveName = data.performanceSlave.slaveName
                this.dataForm.ip = data.performanceSlave.ip
                this.dataForm.jmeterPort = data.performanceSlave.jmeterPort
                this.dataForm.userName = data.performanceSlave.userName
                this.dataForm.passwd = data.performanceSlave.passwd
                this.dataForm.sshPort = data.performanceSlave.sshPort
                this.dataForm.homeDir = data.performanceSlave.homeDir
                this.dataForm.status = data.performanceSlave.status
                this.dataForm.weight = data.performanceSlave.weight
                this.dataForm.addTime = data.performanceSlave.addTime
                this.dataForm.addBy = data.performanceSlave.addBy
                this.dataForm.updateTime = data.performanceSlave.updateTime
                this.dataForm.updateBy = data.performanceSlave.updateBy
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
              url: this.$http.adornUrl(`/performance/performanceslave/${!this.dataForm.slaveId ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'slaveId': this.dataForm.slaveId || undefined,
                'slaveName': this.dataForm.slaveName,
                'ip': this.dataForm.ip,
                'jmeterPort': this.dataForm.jmeterPort,
                'userName': this.dataForm.userName,
                'passwd': this.dataForm.passwd,
                'sshPort': this.dataForm.sshPort,
                'homeDir': this.dataForm.homeDir,
                'status': this.dataForm.status,
                'weight': this.dataForm.weight,
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
