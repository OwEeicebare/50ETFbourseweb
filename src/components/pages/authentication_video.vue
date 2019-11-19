<template>
  <div class="authentication-video">
    <CHeader title="实名认证" backBol="true" backUrl="/set"></CHeader>
    <div class="content-body has-header main-bg font28">
      <div>
        <img src="/static/images/my/file_img.svg" alt="" class="normal-margin" style="margin-top:20px;width:150px">
        <p class="main-text-color2" style="margin-top:20px;font-weight:bold;font-size:16px;"><span style="font-size:20px;line-height:35px;">认证失败</span><br />请上传身份证照片等待人工审核</p>
        <div class="upload-btn white-color page-normal main-color1" @click="next()">上传照片</div>
        <!-- <p class="main-text-color2" style="margin-top:20px">录制时请确保正脸水平对准屏幕</p> -->
        <!-- <p class="main-text-color2">避免光线不佳，避免背景有框，避免镜头晃动</p> -->
      </div>
    </div>
  </div>
</template>
<script>
import api from '@/api'
import CHeader from '@/components/common/IHeader.vue'
export default {
  data () {
    return {
      progress: 0,
    }
  },
  components: {
    CHeader
  },
  created(){
    this.updateStatu();
    this.upImg()
  },
  methods: {
    updateStatu(){
      this.$http.post(api.updateRealyStatus,{status:2,rimak:"人脸识别失败"});
    },
    upImg(){//认证失败上传图片
      var t = window.sessionStorage.getItem("ticketId");
      if(t){
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
    next(){//跳转到信息填写页面
      this.$router.push('/againauthentication');
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
  }
}
</script>
<style>
  .authentication-video .content-body{
    padding: 0 10px;
  }
  .authentication-video .page-normal{
    margin-top: 25px;
  }
  .authentication-video .content-body > div{
    overflow-y: scroll;
    overflow-x: hidden;
    width: 100%;
    height: 100%;
  }
  .authentication-video .content-body > div::-webkit-scrollbar {
    display: none;
  }
  .authentication-video .content-body > div > h2{
    font-size: 24px;
  }
  .authentication-video .content-body > div > h2.vertify-num{
    letter-spacing: 20px;
  }
  .authentication-video .content-body > div > img{
    /* width: 100%; */
  }
  .authentication-video .mt-progress{
    height: unset;
    line-height: unset;
  }
  .authentication-video .mt-progress-runway{
    background-color: #d9d9d9;
  }
  .authentication-video .mt-progress-progress{
    background-color: #ff787b;
  }
  .authentication-video .upload-btn{
    line-height: 40px;
    height: 40px;
    border-radius: 4px;
    position: relative;
  }
  .authentication-video .upload-btn > input{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    visibility: hidden;
    /* z-index: 2; */
  }
  .authentication-video .upload-btn > label{
    width: 100%;
    height: 100%;
    display: inline-block;
  }
  .authentication-video .upload-btn > input[type="file" i]{
    width: 100%;
    height: 100%;
  }
</style>
