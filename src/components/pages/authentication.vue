<template>
  <div class="authenticate">
    <div class="authenticate-header font32 main-bg">
      <img
        :src="theme ? '/static/images/header/transparent_arrow_left.svg' : '/static/images/header/arrow_left.svg'"
        alt="返回按钮"
        class="back"
        @click="back"
      >
      <span class="main-color1 circle"></span>
      <span>签订协议</span>
      <span class="line"></span>
      <span class="line-color circle"></span>
      <span class="main-text-color2">实名认证</span>
    </div>
    <div class="content-body has-header main-bg">
      <div>
        <ul class="font28">
          <li class="normal-border-color">
            真实姓名
            <input
              type="text"
              placeholder="请输入"
              v-model="name"
              @input="monitorName"
              class="main-bg main-text-color1"
            >
          </li>
          <li class="normal-border-color">
            身份证号
            <input
              type="text"
              placeholder="请输入"
              v-model="id"
              @input="monitorId"
              class="main-bg main-text-color1"
            >
          </li>
        </ul>
        <!-- <ul class="font28" >
          <li class="higher-li normal-border-color">上传身份证正面<input type="file" @change="uploadImgFront" accept="image/*">
          <img :src="IDFront ? IDFront : (theme ? '/static/images/black/icon_img_upload.svg' : '/static/images/my/icon_img_upload.svg')" alt="" class="alter-upload"></li>
        </ul>
        <ul class="font28" >
          <li class="higher-li normal-border-color">上传身份证背面<input type="file" @change="uploadImgVerso" accept="image/*">
          <img :src="IDVerso ? IDVerso : (theme ? '/static/images/black/icon_img_upload.svg' : '/static/images/my/icon_img_upload.svg')" alt="" class="alter-upload"></li>
        </ul>-->
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
    <!-- <div :class="{'next-step': true, 'font32': true, 'white-color': true,'line-color': !btnEnable, 'main-color1': btnEnable }" @click="next">提交审核</div> -->
    <div
      :class="{'next-step': true, 'font32': true, 'white-color': true,'line-color': !btnEnable, 'main-color1': btnEnable }"
      @click="next"
    >下一步</div>
  </div>
</template>
<script>
import api from '@/api'
export default {
  data () {
    return {
      IDFront: '',//身份证正面
      IDVerso:'',//身份证背面
      name: '',//姓名
      id: '',//身份证号
      nameQualified: false,//姓名是否合格
      idQualified: false, //身份证是否合格
      uploadIDFront: '',
      uploadIDVerso: '',/*  */
      Wi: [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1 ], //加权因子
      ValideCode: [ 1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2 ],           // 身份证验证位值.10代表X
    }
  },
  computed: {
    btnEnable () {
      // && this.IDFront && this.IDVerso 
      if (this.nameQualified && this.idQualified ){//判断按钮是否可用
        for (let i = 0; i < this.auProtocal.length; i++) {
          if (!this.auProtocal[i].state) {
            return false;
          }
        }
        return true;
      } else {
        return false;
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
    theme () {
      // console.log(localStorage.getItem('theme') != null ? JSON.parse(localStorage.getItem('theme')).theme : 0);
      return localStorage.getItem('theme') != null ? JSON.parse(localStorage.getItem('theme')).theme : 0;
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
    }
  },
  methods: {
    uploadImgFront (e) {//上传截图
      // console.log(e.target.files[0]);

      if (e.target.files.length > 0) {
        var file = e.target.files[0];
        let formData = new FormData();
        formData.append('file', file);
        let config = {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
        this.$http.post(api.upload, formData, config).then(res => {
          if (res.data.status === '1') {
            this.IDFront = res.data.data.fullPath;
            this.uploadIDFront =  res.data.data.path;
            this.$store.commit('SAVE_AUTONYM',{'type': 'IDFront', 'value':  this.IDFront});
            this.$store.commit('SAVE_AUTONYM',{'type': 'uploadIDFront', 'value':  res.data.data.path});
          }
        })
      }
    },
    uploadImgVerso (e) {//上传截图
      if (e.target.files.length > 0) {
        var file = e.target.files[0];
        let formData = new FormData();
        formData.append('file', file);
        let config = {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
        this.$http.post(api.upload, formData, config).then(res => {
          if (res.data.status === '1') {
            this.IDVerso = res.data.data.fullPath;
            this.uploadIDVerso =  res.data.data.path;
            this.$store.commit('SAVE_AUTONYM',{'type': 'IDVerso', 'value':  this.IDVerso});
            this.$store.commit('SAVE_AUTONYM',{'type': 'uploadIDVerso', 'value':  res.data.data.path});
          }
        })
      }
    },
    back () {
      this.$router.go(-1);
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
    next(){
      if (!this.nameQualified) {
        if (this.name) {
          this.$toast({
              message: "真实姓名填写有误",
              duration: 1000,
              position: 'bottom'
          });
        } else {
          this.$toast({
              message: "请填写真实姓名",
              duration: 1000,
              position: 'bottom'
          });
        }
      }
      if (!this.idQualified && this.id) {
        if (!this.nameQualified) {
          setTimeout(() => {
            this.$toast({
              message: "身份证输入不合法",
              duration: 1000,
              position: 'bottom'
            });
          }, 1500);
        } else {
          this.$toast({
            message: "身份证输入不合法",
            duration: 1000,
            position: 'bottom'
          });
        }
        return;
      }
      if (this.btnEnable) {
        let data1 = {
            UName:this.name,
            Ic:this.id,
            ibackurl:this.uploadIDFront,
            ipositrl:this.uploadIDVerso,
            status:3
        }
        this.$http.post(api.saveAutonym, data1).then(res => {//上传填写的信息
            if (res.data.Status === '1') {
              // this.$http.post(api.autonymState).then(res=>{测试状态
              //   var result = res.data.Data;
              //   console.log(result)
              // })
              this.$http.post(api.getViedio).then(res=>{//上传成功进行人脸识别
                if(res.data.Status==1){
                  window.sessionStorage.setItem("ticketId",res.data.Data.TicketId);//跳转人脸识别成功保存id
                  window.location.href=res.data.Data.Url+"&failRedirect=http://"+location.host+"/%23/authentication-video&successRedirect=http://"+location.host+"/%23/authenticate-success";//识别后跳转页面
                  // window.sessionStorage.setItem("FACEURL",res.data.Data.Url);
                  // this.$router.push('/face');
                }else{
                  this.$toast({
                    message: res.data.Msg,
                    position: 'bottom',
                    duration: 2000
                  })
                }
              })
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
          message: "数据提交失败",
          duration: 1000,
          position: 'bottom'
        });
      }
    }
  },
  created () {
    // 加载协议数据并保存一份至vuex
    //if (!this.protocals.length) {
      // var info = JSON.parse(window.localStorage.getItem("againInfo"));
      // if(!info){//取不到代理信息
      //   this.$store.dispatch("get_againInfo").then(res=>{
      //     this.againId=JSON.parse(window.localStorage.getItem("againInfo"));
      //   });
      // }else{
      //   this.againId=info.id;
      // }
     // this.$store.dispatch('get_protocal').then(res => {
        //console.log('初始化协议', this.auProtocal);
      //})
    //}
    console.log(this.againId)//为了执行计算机属性
  },
  mounted () {
    this.IDFront = this.$store.state.autonym.IDFront;
    this.IDVerso = this.$store.state.autonym.IDVerso;
    this.uploadIDFront = this.$store.state.autonym.uploadIDFront;
    this.uploadIDVerso = this.$store.state.autonym.uploadIDVerso;
    this.name = this.$store.state.autonym.name ? this.$store.state.autonym.name : '';
    this.nameQualified = this.$store.state.autonym.name && this.NameValidate(this.$store.state.autonym.name) ? true : false;
    this.id = this.$store.state.autonym.id ? this.$store.state.autonym.id : '';
    this.idQualified = this.$store.state.autonym.id && this.IdCardValidate(this.$store.state.autonym.id) ? true : false;
  },
  beforeRouteLeave (to, from, next) {//路由控制
    // console.log(to);
    if (to.name === 'Protocal' && this.name) {
      if (!this.nameQualified) {
        this.$toast({
            message: "真实姓名填写有误",
            duration: 1000,
            position: 'bottom'
        });
      }
      if (!this.idQualified && this.id) {
        if (!this.nameQualified) {
          setTimeout(() => {
            this.$toast({
              message: "身份证输入不合法",
              duration: 1000,
              position: 'bottom'
            });
          }, 1500);
        } else {
          this.$toast({
            message: "身份证输入不合法",
            duration: 1000,
            position: 'bottom'
          });
        }
      }
      next();
    }
    next();
  }
}
</script>
<style scoped>
.authenticate {
  height: 100%;
}
.content-body {
  top: 56px;
  bottom: 50px;
  text-align: left;
  /* padding: 0 10px; */
}
.content-body > div {
  overflow-y: scroll;
  width: 100%;
  overflow-x: hidden;
  height: 100%;
}
.authenticate-header {
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
.back {
  left: 0;
  position: absolute;
  height: 20px;
  top: 2px;
  cursor: pointer;
  padding: 10px;
}
.authenticate-header .circle {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 5px;
  position: relative;
}
.authenticate-header .circle::before {
  content: "";
  width: 16px;
  height: 16px;
  position: absolute;
  left: -3px;
  top: -3px;
  border-radius: 50%;
}
.authenticate-header .circle:nth-of-type(1):before {
  background-color: rgba(255, 120, 123, 0.3);
}
.authenticate-header .circle:nth-of-type(4):before {
  background-color: rgba(217, 217, 217, 0.3);
}
.authenticate-header .circle:nth-of-type(4) {
  margin-left: 10px;
}
.authenticate-header span:nth-of-type(2) {
  margin-right: 10px;
}
.authenticate-header .line {
  width: 50px;
  height: 1px;
  display: inline-block;
  vertical-align: middle;
  background-color: #ebebeb;
}
ul {
  padding: 0 10px;
}
ul > li > span,
ul > li > input {
  position: absolute;
  right: 10px;
  z-index: 100;
}
ul > li.higher-li {
  height: 80px;
  line-height: 80px;
  overflow: hidden;
}
ul > li > input[type="file"] {
  height: 100%;
  border: none;
  opacity: 0;
}

ul > li > i > img {
  width: 30px;
}
ul > li {
  height: 50px;
  line-height: 50px;
  /* border-bottom: 1px solid #d9d9d9; */
  border-bottom-width: 1px;
  border-bottom-style: solid;
  background: url("/static/images/home/arrow_right.svg") no-repeat right center;
  background-size: auto 12px;
  position: relative;
}
ul > li > span,
ul > li > input {
  position: absolute;
  right: 12px;
}
ul > li > input {
  height: 100%;
  border: none;
  text-align: right;
  right: 0;
}
ul > li > input:-moz-placeholder {
  text-align: right;
}
ul > li > input:-ms-input-placeholder {
  text-align: right;
}
ul > li > input::-webkit-input-placeholder {
  text-align: right;
}
img.alter-upload {
  position: absolute;
  width: 60px;
  right: 10px;
  top: 10px;
  z-index: 99;
  height: 60px;
}
.next-step {
  position: fixed;
  bottom: 0;
  height: 50px;
  width: 100%;
  line-height: 50px;
}
.read-tips {
  padding: 10px 0 5px 10px;
}
</style>
