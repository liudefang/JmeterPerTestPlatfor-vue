<template>
  <el-dialog
    title="上传文件"
    :close-on-click-modal="false"
    @close="closeHandle"
    :visible.sync="visible">
    <el-upload
      drag
      :action="url"
      :before-upload="beforeUploadHandle"
      :on-success="successHandle"
      multiple
      :file-list="fileList"
      :auto-upload="true"
      style="text-align: center;">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">只支持 "jpg, jpeg, png, gif, bmp, txt, sql, log, xlsx, xls, pdf, docx, doc,
        pptx, csv, jar, war, zip, rar, tag.gz, chm, ink, jmx, ftl, htm, html, jsp" 的文件扩展名.</div>
    </el-upload>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="submitUpload">确定上传</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import axios from 'axios';
  export default {
    data () {
      return {
        visible: true,
        url: '',
        num: 0,
        successNum: 0,
        fileList: [],
        ids: ''
      }
    },
    methods: {
      // 上传文件

      init (caseId) {
        console.log('-------测试用例id111-------', caseId)
        this.caseId = caseId
        //this.url = this.$http.adornUrl(`/performance/performancecase/upload?token=${this.$cookie.get('token')}`)
        this.visible = true
        var img = ['jpg','jpeg', 'png','gif', 'bmp']; //图片
        var txt = ['txt','sql','log'];  //文字
        var out = ['cfg','dat','hlp','tmp'];  //文字
        var ott = ['xlsx','xls','pdf','docx','doc','pptx','csv'];    //表格，幻灯片，WORD，PDF
        var sin = ['mpg', 'mpeg', 'avi', 'rm', 'rmvb','mov', 'wmv','asf', 'dat', 'mp4']; //视频
        var ein = ['cd','ogg','mp3','asf','wma','wav','mp3pro','rm','real','ape','module','midi','vqf']; //音频
        var spe = ['jar','war','zip','rar','tag.gz'];//压缩包
        var exe = ['exe','bat','com','msi']; //可执行文件
        var zat = ['chm','ink','jmx'];    //特殊文件
        var viw = ['ftl','htm','html','jsp']; //页面
        var rol = ['js','css'];
        //var url = `/performance/performancecase/upload?token=${this.$cookie.get('token')}`;
        //this.url = this.$http.adornUrl(`/performance/performancecase/upload`),

      },


      // 上传之前
      beforeUploadHandle (file) {

        console.log('-------文件----', file)
        console.log('-------文件类型111----', file.type)
        // file.type !== 'image/jpg' && file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/gif'
        if (file.type !== 'image/jpg' && file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/gif' &&
            file.type !== 'image/bmp' && file.type !== 'text/plain' && file.type !== '' && file.type !== 'application/pdf' &&
            file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && file.type !== 'application/zip' &&
            file.type !== 'application/wps-writer' && file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' &&
            file.type !== 'application/vnd.openxmlformats-officedocument.presentationml.presentation' && file.type !== 'application/x-gzip' &&
            file.type !== 'application/java-archive' && file.type !== 'text/html' && file.type !== 'text/htm') {
          this.$message.error('只支持 "jpg, jpeg, png, gif, bmp, txt, sql, log, xlsx, xls, pdf, docx, doc, pptx, csv, jar, war, zip, rar, tag.gz, chm, ink, jmx, ftl, htm, html, jsp" 的文件扩展名.')
          return false
        }
        if (file.size == 0){
            this.$message.error('上传的文件不能为空!')
            return false

        }
        this.num++
        this.fileName = file.name;
        this.files = file;
        return false    // 返回fasle不会自动上传
      },

      submitUpload: function () {
        console.log('-------文件类型33----', this.files)
        console.log('-------文件名称33----', this.fileName)
        console.log('-------测试用例id33-------', this.caseId)
        if (this.fileName == "") {
          this.message.warning('请选择要上传的文件!')
          return false
        }
        let fileFormData = new FormData();
        fileFormData.append('file', this.files, this.fileName); //filename是键，file是值，就是要传的文件，test.zip是要传的文件名
        fileFormData.append('caseId', this.caseId);
        let headers = {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }

        axios.post(`http://localhost:8081/renren-fast/performance/performancecase/upload?token=${this.$cookie.get('token')}`,
          fileFormData,headers
          ).then(({data}) => {
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
      },

      // 上传成功
      successHandle (response, file, fileList) {
        console.log('-------文件类型22----', file)
        console.log('-------文件类型222----', fileList)
        this.fileList = fileList
        this.successNum++
        if (response && response.code === 0) {
          if (this.num === this.successNum) {
            this.$confirm('操作成功, 是否继续操作?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).catch(() => {
              this.visible = false
            })
          }
        } else {
          this.$message.error(response.msg)
        }
      },
      // 弹窗关闭时
      closeHandle () {
        this.fileList = []
        this.$emit('refreshDataList')
      }

    }
  }


</script>
