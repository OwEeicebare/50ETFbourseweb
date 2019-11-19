<template>
  <div class="authencation-success">
    <CHeader title="实名认证" backBol="true" backUrl="/set"></CHeader>
    <div class="content-body has-header main-bg">
      <SimpleState imgSrc="/static/images/market/img_success.svg"  message="认证提交成功，审核通过"></SimpleState>
      <div class="authentication-info font28">
        <ul>
          <li class="normal-border-color">
            <span>真实姓名</span>
            <span>{{info.name}}</span>
          </li>
          <li class="normal-border-color">
            <span>身份证号</span>
            <span>{{info.Idcrd}}</span>
          </li>
        </ul>
        <div class="white-color main-color1 sure" @click="toSet">确定</div>
      </div>
    </div>
  </div>
</template>
<script>
import api from '@/api'
import CHeader from '@/components/common/IHeader.vue'
import SimpleState from '@/components/common/SimpleState.vue'
export default {
  data () {
    return {
      info: {}, //实名信息
    }
  },
  components: {
    CHeader,
    SimpleState
  },
  methods: {
    query(){//查询h5是认证成功
      var t = window.sessionStorage.getItem("ticketId");
      if(t){
        //更改认证状态
        this.$http.post(api.getViedioStatus,{TicketId:t}).then(res=>{
          if(res.data.Status==1){
            if(res.data.Data==1){//认证成功
              this.$http.post(api.updateRealyStatus,{status:1,rimak:"由人脸识别"}).then(res=>{
                sessionStorage.removeItem("ticketId")
              })
            }
          }
        })
        //获取认证信息并上传图片
        this.$http({url:api.getRealyInfo,params:{ticketId:t},method:'post'}).then(res=>{
          var dataurl = res.data.Data.Data.IdCardFrontPic;//图片url
          this.getImgToBase64(dataurl,(dataURL)=>{
            var files = this.dataURLtoFile(dataURL,'a.jpg');//base64 to file
            //上传照片
            let formData = new FormData();
            formData.append('file', files);
            let config = {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }
            this.$http.post(api.upload, formData, config);
          });
        })
      }
    },
    //将图片转换为Base64
    getImgToBase64(url,callback){
      var canvas = document.createElement('canvas'),
      ctx = canvas.getContext('2d'),
      img = new Image;
      img.crossOrigin = 'Anonymous';
      img.onload = function(){
        canvas.height = img.height;
        canvas.width = img.width;
        ctx.drawImage(img,0,0);
        var dataURL = canvas.toDataURL('image/png');
        callback(dataURL);
        canvas = null;
      };
      img.src = url;
    },
    //将base64转换为文件对象
    dataURLtoFile(dataurl, filename) {
      var arr = dataurl.split(',');
      var mime = arr[0].match(/:(.*?);/)[1];
      var bstr = atob(arr[1]);
      var n = bstr.length; 
      var u8arr = new Uint8Array(n);
      while(n--){
          u8arr[n] = bstr.charCodeAt(n);
      }
      //转换成file对象
      return new File([u8arr], filename, {type:mime});
      //转换成成blob对象
    },
    toSet () {
      this.$router.push('/set');
    },
    getAutonym () {//获取实名信息
      this.$http.post(api.authenInfo).then(res => {
        // console.log('实名后信息', res.data);
        if (res.data.Status === '1') {
          this.info = res.data.Data;
        } else {
          this.$toast({
            message: res.data.Msg,
            position: 'bottom',
            duration: 3000
          })
        }
      })
    }
  },

  created () {
    this.query();
     this.getAutonym();
  },
  mounted () {

  }
}
</script>
<style scoped>
  .authencation-success{
    height: 100%;
  }
  .content-body{
    top: 56px;
  }
  .authentication-info{
    width: 325px;
    margin: 40px auto 0;
  }
  .authentication-info ul > li{
    height: 50px;
    line-height: 50px;
    /* border-bottom: 1px solid #d9d9d9; */
    border-bottom-width: 1px;
    border-bottom-style: solid;
    overflow: auto;
  }
  .authentication-info ul > li > span:nth-child(1) {
    float: left;
  }
  .authentication-info ul > li > span:nth-child(2) {
    float: right;
  }
  .sure{
    padding: 10px 0;
    border-radius: 4px;
    margin-top: 20px;
    letter-spacing: 4px;
  }
</style>
