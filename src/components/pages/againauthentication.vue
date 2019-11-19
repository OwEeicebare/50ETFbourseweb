<template>
  <div class="authenticate">
    <CHeader title="实名认证" backBol="true" ></CHeader>
    <div class="content-body has-header main-bg">
      <div>
        <ul class="font28">
          <li class="normal-border-color">真实姓名<input type="text" placeholder="请输入" v-model="name" @input="monitorName" class="main-bg main-text-color1"></li>
          <li class="normal-border-color">有效证件<input type="text" placeholder="请输入" v-model="id" @input="monitorId" class="main-bg main-text-color1"></li>
        </ul>
        <ul class="font28" >
          <li class="higher-li normal-border-color">有效证件正面
          <input type="file" @change="uploadImgFront" accept="image/*">
          <img src="../../../static/logding.svg" v-if="zhengloding" class="zhengloding">
          <img :src="endimgz" alt="图片加载失败" class="alter-upload" ></li>
        </ul>
        <ul class="font28" >
          <li class="higher-li normal-border-color">有效证件背面
          <input type="file" @change="uploadImgVerso" accept="image/*">
          <img src="../../../static/logding.svg" v-if="beiloding" class="beiloding">
          <img :src="endimgf" alt="图片加载失败" class="alter-upload" ></li>
        </ul>
      </div>
    </div>
    <div :class="{'next-step': true, 'font32': true, 'white-color': true,'line-color': !btnEnable, 'main-color1': btnEnable }" @click="next">确认</div>
  </div>
</template>
<script>
import api from '@/api'
import CHeader from '@/components/common/IHeader.vue'
export default {
  data () {
    return {
      IDFront: '',//身份证正面img
      zimg:'',
      zhengloding:false,
      IDVerso:'',//身份证背面img
      fimg:'',
      beiloding:false,
      name: '',//姓名
      id: '',//身份证号
      uploadIDFront: '',//身份证正面up
      uploadIDVerso: '',//身份证背面up
    }
  },
  components: {
    CHeader
  },
  computed: {
    btnEnable () {
      if (this.name && this.id && this.IDFront && this.IDVerso ){//判断按钮是否可用
        return true;
      } else {
        return false;
      }
    },
    theme () {
      // console.log(localStorage.getItem('theme') != null ? JSON.parse(localStorage.getItem('theme')).theme : 0);
      return localStorage.getItem('theme') != null ? JSON.parse(localStorage.getItem('theme')).theme : 0;
    },
    endimgz(){
      var temp = this.zimg ? this.zimg : (this.theme ? '/static/images/black/icon_img_upload.svg' : '/static/images/my/icon_img_upload.svg');
      if(temp!='/static/images/black/icon_img_upload.svg'&&temp!='/static/images/my/icon_img_upload.svg'){
        this.zhengloding=false;
      }
      return temp
    },
    endimgf(){
      var temp = this.fimg ? this.fimg : (this.theme ? '/static/images/black/icon_img_upload.svg' : '/static/images/my/icon_img_upload.svg');
      if(temp!='/static/images/black/icon_img_upload.svg'&&temp!='/static/images/my/icon_img_upload.svg'){
        this.beiloding=false;
      }
      return temp
    }
  },
  created(){
      this.init();
  },
  methods: {
    init(){
      this.$http.post(api.getRealyName).then(res=>{
        if(res.data.Status==1){
          var result = res.data.Data;
          this.name=result.Name;
          this.id=result.IdCard;
          this.zimg=this.IDFront=result.IdCardFrontPic;
          this.fimg=this.IDVerso=result.IdCardBackPic;
          this.uploadIDFront=result.FrontPic;
          this.uploadIDVerso=result.BackPic;
        }
      })
    },
    monitorName () {
      this.$store.commit('SAVE_AUTONYM', { 'type': 'name', 'value': this.name });
    },
    monitorId () {
      this.$store.commit('SAVE_AUTONYM', { 'type': 'id', 'value': this.id });
    },
    //去掉字符串头尾空格   
    trim (str) {   
      return str.replace(/(^\s*)|(\s*$)/g, "");   
    }, 
    uploadImgFront (e) {//上传正面截图
      this.zhengloding=true;
      if (e.target.files.length > 0) {
        var _self = this;
        var file = e.target.files[0];
        // console.log("前",file)
        let form = new FormData();
        if(file.size/1024 > 20480){//大于20M
          this.zhengloding=false;
          this.$toast({
            message: "上传文件过大，请重新选择图片",
            duration: 1000,
            position: 'bottom'
          });
          return;
        }
        if(file.size/1024 > 1025) { //大于1M，进行压缩上传
          this.photoCompress(file, {quality: 0.2}, function(base64Codes){
              //console.log("压缩后：" + base.length / 1024 + " " + base);
              var bl = _self.convertBase64UrlToBlob(base64Codes);
              // console.log("后",bl)
              form.append("file", bl); // 文件对象
              let config = {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
              }
              _self.$http.post(api.upload, form, config).then(res => {
                if (res.data.status === '1') {
                  _self.zimg = _self.getObjectURL(bl)
                  _self.IDFront = res.data.data.fullPath;
                  _self.uploadIDFront =  res.data.data.path;
                  _self.$store.commit('SAVE_AUTONYM',{'type': 'IDFront', 'value':  _self.IDFront});
                  _self.$store.commit('SAVE_AUTONYM',{'type': 'uploadIDFront', 'value':  res.data.data.path});
                  _self.zhengloding=false;
                }
              })
          });
        }else{
          form.append('file', file);
          let config = {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
          this.$http.post(api.upload, form, config).then(res => {
            if (res.data.status === '1') {
              _self.zimg = this.getObjectURL(file)
              this.IDFront = res.data.data.fullPath;
              this.uploadIDFront =  res.data.data.path;
              this.$store.commit('SAVE_AUTONYM',{'type': 'IDFront', 'value':  this.IDFront});
              this.$store.commit('SAVE_AUTONYM',{'type': 'uploadIDFront', 'value':  res.data.data.path});
              this.zhengloding=false;
            }
          })
        }
      }
    },
    uploadImgVerso (e) {//上传反面截图
      this.beiloding=true;
      if (e.target.files.length > 0) {
        var _self = this;
        var file = e.target.files[0];
        let form = new FormData();
        if(file.size/1024 > 20480){//大于20M
          this.beiloding=false;
          this.$toast({
            message: "上传文件过大，请重新选择图片",
            duration: 1000,
            position: 'bottom'
          });
          return;
        }
        if(file.size/1024 > 1025) { //大于1M，进行压缩上传
          this.photoCompress(file, {quality: 0.2}, function(base64Codes){
            var bl = _self.convertBase64UrlToBlob(base64Codes);
            form.append('file', bl);
            let config = {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }
            _self.$http.post(api.upload, form, config).then(res => {
              if (res.data.status === '1') {
                //加载本地图片
                _self.fimg = _self.getObjectURL(bl);
                _self.IDVerso = res.data.data.fullPath;
                _self.uploadIDVerso =  res.data.data.path;
                _self.$store.commit('SAVE_AUTONYM',{'type': 'IDVerso', 'value':  _self.IDVerso});
                _self.$store.commit('SAVE_AUTONYM',{'type': 'uploadIDVerso', 'value':  res.data.data.path});
                _self.beiloding=false;
              }
            })
          })
        }else{
          form.append('file', file);
          let config = {
            headers: {'Content-Type': 'multipart/form-data'}
          }
          this.$http.post(api.upload, form, config).then(res => {
            if (res.data.status === '1') {
              this.fimg = _self.getObjectURL(file);
              this.IDVerso = res.data.data.fullPath;
              this.uploadIDVerso =  res.data.data.path;
              this.$store.commit('SAVE_AUTONYM',{'type': 'IDVerso', 'value':  this.IDVerso});
              this.$store.commit('SAVE_AUTONYM',{'type': 'uploadIDVerso', 'value':  res.data.data.path});
              this.beiloding=false;
            }
          })
        }
      }
    },
    /**
     * 压缩
     */
    photoCompress(file,w,objDiv){
      var _self = this;
      var ready=new FileReader();
      ready.readAsDataURL(file);
      ready.onload=function(){
        var re=this.result;
        _self.canvasDataURL(re,w,objDiv)
      }
    },
    canvasDataURL(path, obj, callback){
      var img = new Image();
      img.src = path;
      img.onload = function(){
          var that = this;
          // 默认按比例压缩
          var w = that.width,
              h = that.height,
              scale = w / h;
          w = obj.width || w;
          h = obj.height || (w / scale);
          var quality = 0.7;  // 默认图片质量为0.7
          //生成canvas
          var canvas = document.createElement('canvas');
          var ctx = canvas.getContext('2d');
          // 创建属性节点
          var anw = document.createAttribute("width");
          anw.nodeValue = w;
          var anh = document.createAttribute("height");
          anh.nodeValue = h;
          canvas.setAttributeNode(anw);
          canvas.setAttributeNode(anh);
          ctx.drawImage(that, 0, 0, w, h);
          // 图像质量
          if(obj.quality && obj.quality <= 1 && obj.quality > 0){
              quality = obj.quality;
          }
          // quality值越小，所绘制出的图像越模糊
          var base64 = canvas.toDataURL('image/jpeg', quality);
          // 回调函数返回base64的值
          callback(base64);
      }
    },
    convertBase64UrlToBlob(urlData){
      var arr = urlData.split(','), 
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, 
      u8arr = new Uint8Array(n);
      while(n--){
          u8arr[n] = bstr.charCodeAt(n);
      }
      var bob =new Blob([u8arr], {type:mime});
      var files = new File([bob],  "file_"+Date.parse(new Date())+'.jpg', {type:mime})
      return files;
    },
    /**
     * 转换成bold用于img 的src
     */
    getObjectURL(file) {
      var url = null;
      if (window.createObjectURL != undefined) { // basic
        url = window.createObjectURL(file);
      } else if (window.URL != undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file);
      } else if (window.webkitURL != undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
      }
      return url;
    },
    back () {
      this.$router.push('/set');
    },
    next(){
      if (this.btnEnable) {
        let data1 = {
            UName:this.name,
            Ic:this.id,
            ibackurl:this.uploadIDVerso,
            ipositrl:this.uploadIDFront,
             status:2
        }
        this.$http.post(api.saveAutonym, data1).then(res => {//上传填写的信息
            if (res.data.Status === '1') {
              this.$toast({
                message: res.data.Msg,
                position: 'bottom',
                duration: 2000
              })
              this.$router.push('/set')
            } else {
              this.$toast({
                message: res.data.Msg,
                position: 'bottom',
                duration: 2000
              })
            }
        })
      }
    }
  },
}
</script>
<style scoped>
  .authenticate{
    height: 100%;
  }
  .content-body{
    top: 56px;
    bottom: 50px;
    text-align: left;
    /* padding: 0 10px; */
  }
  .content-body > div{
    overflow-y: scroll;
    width: 100%;
    overflow-x: hidden;
    height: 100%;
  }
  .authenticate-header{
    position: fixed;
    height: 24px;
    line-height: 24px;
    width: 100vw;
    text-align: center;
    top: 0;
    padding-top: 10px;
    padding-bottom: 10px;
    z-index: 100001;
  }
  .back{
    left: 0;
    position: absolute;
    height: 20px;
    top: 2px;
    cursor: pointer;
    padding: 10px;
  }
  .authenticate-header .circle{
    width: 10px;
    height: 10px;
    border-radius: 50%;
    display: inline-block;
    margin-right: 5px;
    position: relative;
  }
  .authenticate-header .circle::before{
    content: '';
    width: 16px;
    height: 16px;
    position: absolute;
    left: -3px;
    top: -3px;
    border-radius: 50%;
  }
  .authenticate-header .circle:nth-of-type(1):before{
    background-color: rgba(255, 120, 123, .3);
  }
  .authenticate-header .circle:nth-of-type(4):before{
    background-color: rgba(217, 217, 217, .3);
  }
  .authenticate-header .circle:nth-of-type(4){
    margin-left: 10px;
  }
  .authenticate-header span:nth-of-type(2) {
    margin-right: 10px;
  }
  .authenticate-header .line{
    width: 50px;
    height: 1px;
    display: inline-block;
    vertical-align: middle;
    background-color: #ebebeb;
  }
  ul{
    padding: 0 10px;
  }
    ul > li > span, ul > li > input{
    position: absolute;
    right: 10px;
    z-index: 100;
  }
    ul > li.higher-li{
    height: 80px;
    line-height: 80px;
    overflow: hidden;
  }
   ul > li > input[type="file"]{
    height: 100%;
    border: none;
    opacity: 0;
  }

  ul > li > i > img{
    width: 30px;
  }
  ul > li{
    height: 50px;
    line-height: 50px;
     /* border-bottom: 1px solid #d9d9d9; */
    border-bottom-width: 1px;
    border-bottom-style: solid;
    background: url('/static/images/home/arrow_right.svg') no-repeat right center;
    background-size: auto 12px;
    position: relative;
  }
  ul > li > span, ul > li > input{
    position: absolute;
    right: 12px;
  }
  ul > li > input{
    height: 100%;
    border: none;
    text-align: right;
    right: 0;
  }
  ul > li > input:-moz-placeholder{
    text-align: right;
  }
  ul > li > input:-ms-input-placeholder{
    text-align: right;
  }
  ul > li > input::-webkit-input-placeholder{
    text-align: right;
  }
  img.alter-upload{
    position: absolute;
    width: 60px;
    right: 10px;
    top: 10px;
    z-index: 99;
    height: 60px;
  }
  .beiloding,.zhengloding{
    position: absolute;
    width: 40px;
    right: 20px;
    top: 20px;
    z-index: 100;
    height: 40px;
  }
  .next-step{
    position: fixed;
    bottom: 0;
    height: 50px;
    width: 100%;
    line-height: 50px;
  }
  .read-tips{
    padding: 10px 0 5px 10px;
  }
</style>
