<template>
  <div class="authenticate">
    <CHeader title="实名认证" backBol="true" backUrl="/authenticationSelect"></CHeader>
    <div class="content-body has-header main-bg">
      <div>
        <ul class="font28">
          <li class="normal-border-color">真实姓名<input type="text" placeholder="请输入" v-model="name" @input="monitorName" class="main-bg main-text-color1"></li>
          <li class="normal-border-color">有效证件<input type="text" placeholder="请输入" v-model="id"  @input="monitorId" class="main-bg main-text-color1"></li>
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

        <p class="font24 assist-color3 main-text-color2 read-tips">请认真阅读并确认以下协议</p>
        <ul class="font28">
          <router-link
            tag="li"
            v-for="item in auProtocal"
            :key="item.Id"
            :to="{ path: '/protocal', query: {id: item.Id}}"
            class="normal-border-color"
          >
            {{item.MaNa}}
            <span class="main-text-color2">{{item.state ? '已签' : '未签'}}</span>
          </router-link>
        </ul>
      </div>
    </div>
    <div :class="{'next-step': true, 'font32': true, 'white-color': true,'line-color':false, 'main-color1': true }" @click="next">确认</div>
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
      nameQualified: true,//姓名是否合格
      idQualified: true, //身份证是否合格
      uploadIDFront: '',//身份证正面up
      uploadIDVerso: '',//身份证背面up
      Wi: [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1 ], //加权因子
      ValideCode: [ 1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2 ],           // 身份证验证位值.10代表X
    }
  },
  components: {
    CHeader
  },
  computed: {
    // btnEnable () {
    //   if (this.nameQualified && this.idQualified && this.IDFront && this.IDVerso ){//判断按钮是否可用
    //   for (let i = 0; i < this.auProtocal.length; i++) {
    //       if (!this.auProtocal[i].state) {
    //         return false;
    //       }
    //     }
    //     return true;
    //   } else {
    //     return false;
    //   }
    // },
    btnEnable () {
      if (this.name && this.id && this.IDFront && this.IDVerso ){//判断按钮是否可用
        for (let i = 0; i < this.auProtocal.length; i++) {
          if (!this.auProtocal[i].state) {
            return false;
          }
        }
        return true;
      }
    },
    protocals () {//带状态的协议数组
      return this.$store.state.protocal;
    },
    auProtocal () {//所有待签定的协议
      var authenProtocals = [];
      for (let j = 0; j < this.$store.state.auProtocal.length; j++) {
        authenProtocals.push(this.$store.state.auProtocal[j]);
        for (let i = 0; i < this.protocals.length; i++) {
          if (this.protocals[i].id === authenProtocals[j].Id) {
            authenProtocals[j].state = this.protocals[i].state;
            break;
          }
        }
      }
      return authenProtocals;
    },
    againId(){
      if (!this.protocals.length) {
        var info = JSON.parse(window.localStorage.getItem("againInfo"));
        if(!info){//取不到代理信息
          this.$store.dispatch("get_againInfo").then(res=>{
            info = JSON.parse(window.localStorage.getItem("againInfo")).id;
            this.$store.dispatch('get_protocal',info).then(res => {
              // console.log('初始化协议', this.auProtocal);
            })
          })
        }else{
          this.$store.dispatch('get_protocal',info.id).then(res => {
            // console.log('初始化协议', this.auProtocal);
          })
        }
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
      console.log(this.againId)//为了执行计算机属性
  },
  methods: {
    init(){
        this.zimg = this.IDFront = this.$store.state.autonym.IDFront;
        this.fimg =this.IDVerso = this.$store.state.autonym.IDVerso;
        this.uploadIDFront = this.$store.state.autonym.uploadIDFront;
        this.uploadIDVerso = this.$store.state.autonym.uploadIDVerso;
        this.name = this.$store.state.autonym.name ? this.$store.state.autonym.name : '';
        this.id = this.$store.state.autonym.id ? this.$store.state.autonym.id : '';
    },
    monitorName () {
      var regName =/^[\u4e00-\u9fa5]{2,4}$/;
      if (!regName.test(this.name)) {
        // alert('真实姓名填写有误');
        // this.$store.commit('SAVE_AUTONYM', { 'type': 'name', 'value': '' });
        this.nameQualified = false;
      } else {
        this.nameQualified = true;
      }
      this.$store.commit('SAVE_AUTONYM', { 'type': 'name', 'value': this.name });
    },
    monitorId () {
      // console.log('验证身份证号');
      var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      if (!reg.test(this.id) || !this.IdCardValidate(this.id)) {
        // alert("身份证输入不合法");
        // this.$store.commit('SAVE_AUTONYM', { 'type': 'id', 'value': '' });
        this.idQualified = false;
      } else {
        this.idQualified = true;
      }
      this.$store.commit('SAVE_AUTONYM', { 'type': 'id', 'value': this.id });
    },
    //姓名验证合法性
    NameValidate(name){
      var regName =/^[\u4e00-\u9fa5]{2,4}$/;
      if (!regName.test(this.name)) {
        // alert('真实姓名填写有误');
        return false;
      }
      return true;
    },
    //身份证验证合法性
    IdCardValidate (idCard) {
      idCard = this.trim(idCard.replace(/ /g, ""));
      if (idCard.length == 15) {   
        return this.isValidityBrithBy15IdCard(idCard);       //进行15位身份证的验证    
      } else if (idCard.length == 18) {   
        var a_idCard = idCard.split("");                // 得到身份证数组   
        if(this.isValidityBrithBy18IdCard(idCard)&&this.isTrueValidateCodeBy18IdCard(a_idCard)){   //进行18位身份证的基本验证和第18位的验证
            return true;   
        } else {   
          return false;   
        }   
      } else {   
          return false;   
      }   
    },
    /**
     * 验证15位数身份证号码中的生日是否是有效生日
     *  @param idCard15 15位书身份证字符串
     *  @return  
     */
    isValidityBrithBy15IdCard (idCard15) {
      var year =  idCard15.substring(6,8);   
      var month = idCard15.substring(8,10);   
      var day = idCard15.substring(10,12);   
      var temp_date = new Date(year,parseFloat(month)-1,parseFloat(day));   
      // 对于老身份证中的你年龄则不需考虑千年虫问题而使用getYear()方法   
      if(temp_date.getYear()!=parseFloat(year) || temp_date.getMonth()!=parseFloat(month)-1 || temp_date.getDate()!=parseFloat(day)){   
        return false;   
      } else {   
        return true;   
      }   
    },
    /**  
      * 验证18位数身份证号码中的生日是否是有效生日  
      * @param idCard 18位书身份证字符串  
      * @return  
    */  
    isValidityBrithBy18IdCard(idCard18){   
      var year =  idCard18.substring(6,10);   
      var month = idCard18.substring(10,12);   
      var day = idCard18.substring(12,14);   
      var temp_date = new Date(year,parseFloat(month)-1,parseFloat(day));   
      // 这里用getFullYear()获取年份，避免千年虫问题   
      if(temp_date.getFullYear()!=parseFloat(year)||temp_date.getMonth()!=parseFloat(month)-1 ||temp_date.getDate()!=parseFloat(day)){   
        return false;   
      } else {   
        return true;   
      }   
    },  
    /**  
     * 判断身份证号码为18位时最后的验证位是否正确  
     * @param a_idCard 身份证号码数组  
     * @return  
    */  
    isTrueValidateCodeBy18IdCard(a_idCard) {   
      var sum = 0;                             // 声明加权求和变量   
      if (a_idCard[17].toLowerCase() == 'x') {   
          a_idCard[17] = 10;                    // 将最后位为x的验证码替换为10方便后续操作   
      }   
      for ( var i = 0; i < 17; i++) {   
          sum += this.Wi[i] * a_idCard[i];            // 加权求和   
      }   
      var valCodePosition = sum % 11;                // 得到验证码所位置   
      if (a_idCard[17] == this.ValideCode[valCodePosition]) {   
        return true;   
      } else {   
        return false;   
      }   
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
      // if (!this.nameQualified) {
      //   this.$toast({
      //       message: "真实姓名填写有误",
      //       duration: 1000,
      //       position: 'bottom'
      //   });
      //   return;
      // }
      // if (!this.idQualified) {
      //   this.$toast({
      //     message: "身份证输入不合法",
      //     duration: 1000,
      //     position: 'bottom'
      //   });
      //   return;
      // }
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
      } else {
         this.$toast({
          message: "请完善所有信息并同意相关协议",
          duration: 1000,
          position: 'bottom'
        });
        return;
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
