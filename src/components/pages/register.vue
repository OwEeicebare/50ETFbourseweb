<template>
  <div class="register">
    <CHeader backBol="true" backUrl="/login"></CHeader>
    <div class="content-body has-header main-bg">
      <div>
        <div class="logo">
          <img :src="this.imgUrl" alt="">
        </div>
        <form class="font28">
          <div class="form-item">
            <input type="tel" placeholder="请输入手机号码" class="assist-color3 normal-padding main-text-color1" v-model="tel" @blur="confirmTel">
          </div>
          <div class="form-item">
            <input type="text" placeholder="请输入推荐人邀请码(必填)" class="assist-color3 normal-padding main-text-color1" v-model="inviteCode" @blur="confirmInvite">
          </div>
          <div class="form-item validate-answer">
            <input type="text" placeholder="请输入公式答案" class="assist-color3 normal-padding main-text-color1" v-model="answer" @blur="confirmAnswer">
            <img :src="img_url" @click="getImage" alt="图片加载失败">
          </div>
          <div class="form-item validate-code">
            <input type="text" placeholder="请输入短信验证码" class="assist-color3 normal-padding main-text-color1" v-model="vtCode" @blur="confirmMsg">
            <span class="tab-active-color " :class="{'not-allow':isAllow}" @click="getPhoneShort">{{time_font}}</span>
          </div>
          <div class="protocal main-text-color2 font24">
            <input type="checkbox" id="protocal" v-model="agreen">
            <label for="protocal">我已阅读并同意<span class="tab-active-color" @click="toProtocal">《注册协议》</span></label>
          </div>
          <div class="form-item">
            <div class="main-color1 white-color" @click="register">注册</div>
          </div>
          <router-link to="/login" tag="div" class="tab-active-color else-btn" v-show="hidshow">我要登录</router-link>
        </form>
      </div>
    </div>
    <transition name="slide-fade">
      <div class="register-protocal assist-color3" v-if="protocalShow">
        <div class="register-header font32 main-bg">
          <img :src="theme ? '/static/images/header/transparent_arrow_left.svg' : '/static/images/header/arrow_left.svg'" alt="返回按钮" class="back"  @click="back">
          <h1 class="font32">注册协议</h1>
        </div>
        <div class="content-body has-header main-bg">
          <div>
            <h2 class="font32 normal-margin normal-margin-top">{{protocal != null ? protocal.MaNa : ''}}</h2>
            <div class="protocal-content font28 table-text-color">
              <p v-html="protocal != null ? protocal.MhCo : ''"></p>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import CHeader from '@/components/common/IHeader.vue'
import Api from '@/api'
export default {
  data () {
    return {
      docmHeight: document.documentElement.clientHeight,  //默认屏幕高度
      showHeight: document.documentElement.clientHeight,   //实时屏幕高度
      hidshow:true,  //显示或者隐藏footer
      tel: '',//手机号
      inviteCode: '',//邀请码
      answer: '',//公式答案
      vtCode: '',//短信验证码
      img_url:'',//图形验证码图片
      time:60,//发送验证码倒计时
      time_font:'发送验证码',
      time_img:2,//发送图形验证码倒计时
      agreen: false,
      telPass: false,
      invitePass: false,
      answerPass: false,
      vtPass: false,
      isAllow:false,
      code: '', //图形答案
      protocalShow: false,
      protocal: null,
      imgUrl:'',//logo
    }
  },
  components: {
    CHeader
  },
  computed: {
    theme () {
      // console.log(localStorage.getItem('theme') != null ? JSON.parse(localStorage.getItem('theme')).theme : 0);
      return localStorage.getItem('theme') != null ? JSON.parse(localStorage.getItem('theme')).theme : 0;
    }
  },
  created(){
    this.getAgain();
    this.getImage();
    this.autoAgain();
    //初始状态
    this.getRegisterInfo();
    this.confirmTel();
    this.confirmInvite();
    this.confirmAnswer();
    this.confirmMsg();
    this.getRegisterProtocal();
    window.addEventListener('beforeunload', e => {
      sessionStorage.removeItem('register');
    })
  },
  methods: {
    //首次访问，获取代理信息
    getAgain(){
      var imgData = JSON.parse(window.localStorage.getItem("againInfo"));
      if(!imgData){//如果取到空值
        this.$http.post(Api.firstInit,"\""+location.host+"\"").then(res=>{
          var result = res.data.Data;
          if(res.data.Status==1){
            this.imgUrl=result.Logo;
          }
        })
      }else{
        this.imgUrl=imgData.img;
      }
    },
    //获取公式图形验证码
    getImage(){
      var timestamp = (new Date()).getTime();
      this.$http.post(Api.verificationimage ,{'xhrFields':{withCredentials: true},crossDomain: true}).then(res=>{
        this.img_url=res.data.Data.img64;
        this.code = res.data.Data.code
      })
    },
    //获取手机短信验证码
    getPhoneShort(){
      if(this.isAllow){
        return;
      }
      if(!this.telPass){
        this.$toast({
          message: "请输入有效手机号码",
          position: 'bottom',
          duration: 1000
        })
        return;
      }
      this.$http.post(Api.registerMsg,{"Mobile":this.tel,"type":1}).then(res=>{
        if(res.data.Status==1){//如果成功则修改按钮样式
          if(this.time>0){
            this.isAllow=true;
            this.time_font="60秒";
            var timer = setInterval(() => {
              this.time--;
              this.time_font=this.time+"秒";
              if(this.time==0){
                window.clearInterval(timer);
                this.time=60;
                this.time_font='发送验证码';
                this.isAllow=false;
              }
            }, 1000);
          }
          this.$toast({
            message: "发送成功",
            position: 'bottom',
            duration: 1000
          });
        }else{
          window.clearInterval(timer);
          this.time=60;
          this.time_font='发送验证码';
          this.isAllow=false;
          this.$toast({
            message: res.data.Msg,
            position: 'bottom',
            duration: 2000
          });
        }
      });
    }, 
    register () {
      // 做验证
      if (this.code != this.answer) {
        this.$toast({
          position: 'bottom',
          message: "图形验证码错误",
          duration: 1000
        })
        return;
      }
      if (this.telPass && this.invitePass && this.answerPass && this.vtPass && this.agreen) {
        this.$http.post(Api.verificationRegister1,{"Uphe": this.tel,"InviteCode": this.inviteCode,"ReferralCode": this.vtCode,"ChartCode": this.answer},{'xhrFields':{withCredentials: true},crossDomain: true}).then(res=>{
          if(res.data.Status==1){//注册验证成功，跳转设置密码
            this.$router.push({path: '/reset-pass', query: {origin: 'register'}});
          }else{
            this.getImage();
            this.$toast({
              message: res.data.Msg,
              position: 'bottom',
              duration: 2000
            })
          }
        })
      } else {
        var message = !this.telPass ? '请输入有效手机号码' : !this.invitePass ? '请输入推荐人邀请码' : !this.answerPass ? '请输入有效公式答案' : !this.vtPass ? '短信验证码有误' : !this.agreen ? '请同意注册协议' : '';
        this.$toast({
          message: message,
          position: 'bottom',
          duration: 1000
        })
      }
    },
    confirmTel () {//验证手机号
      // 验证手机号 第二位3456789
      let reg = /^1[3,4,5,6,7,8,9][0-9]{9}$/
      if (!reg.test(this.tel)){
        this.telPass = false;
      } else {
        this.telPass = true;
        this.$store.commit('SAVE_REGISTER', {type: 'Uphe', value: this.tel});
      }
    },
    confirmInvite () {//验证邀请码
      if (this.inviteCode) {
        this.invitePass = true;
        this.$store.commit('SAVE_REGISTER', {type: 'InviteCode', value: this.inviteCode});
      } else {
        this.invitePass = false;
      }
    },
    confirmAnswer () {//验证公式答案
      if (this.answer) {
        this.answerPass = true;
      } else {
        this.answerPass = false;
      }
    },
    confirmMsg () {//验证短信验证码
      if (this.vtCode) {
        this.vtPass = true;
      } else {
        this.vtPass = false;
      }
    },
    getRegisterInfo () {//获取注册信息
      if (sessionStorage.getItem('register') != null) {
        let register = JSON.parse(sessionStorage.getItem('register'));
        this.tel = register.tel;
        this.inviteCode = register.invite;
        this.answer = register.answer;
        this.vtCode = register.code;
        this.agreen = register.agreen;
      }
    },
    back () {
      this.protocalShow = false;
    },
    getRegisterProtocal () {//获取注册协议
      var info = JSON.parse(window.localStorage.getItem("againInfo"));
      if(!info){//取不到代理信息
        this.$store.dispatch("get_againInfo").then(res=>{
          info = JSON.parse(window.localStorage.getItem("againInfo")).id;
          this.$http({url:Api.registerProtocal,params:{iAgentId:info},method:"post"}).then(res => {
            // console.log('注册协议信息', res.data);
            if (res.data.Status === '1') {
              this.protocal = res.data.Data[0];
            }
          })
        })
      }else{
        this.$http({url:Api.registerProtocal,params:{iAgentId:info.id},method:"post"}).then(res => {
          // console.log('注册协议信息', res.data);
          if (res.data.Status === '1') {
            this.protocal = res.data.Data[0];
          }
        })
      }
    },
    toProtocal () {//查看协议
      this.protocalShow = true;
    },
    autoAgain(){
      var params = this.$route.query.code;
      if(params){
        this.inviteCode=params;
      }
    }
  },
  beforeRouteLeave (to, from, next) {//路由守卫 监听离开去协议页保存信息
    if (to.name === 'RegisterProtocal') {
      let obj = {
        tel: this.tel,
        invite: this.inviteCode,
        answer: this.answer,
        code: this.vtCode,
        agreen: this.agreen
      }
      sessionStorage.setItem('register', JSON.stringify(obj));
      next();
    } else {
      // console.log(to);
      sessionStorage.removeItem('register');
      next();
    }
  },
  mounted() {
    window.onresize = ()=>{
      return(()=>{
          this.showHeight = document.body.clientHeight;
      })()
    }
  },
  watch: {
    showHeight() {
      if(this.docmHeight > this.showHeight){
          this.hidshow=false
      }else{
          this.hidshow=true
      }
    }
  }
}
</script>
<style scoped>
  .register .custom-header{
    border: none;
  }
  .register{
    height: 100%;
  }
  .register > .content-body > div{
    position: relative;
    height: 100%;
    padding-top: 54px;
    box-sizing: border-box;
  }
  .logo{
    /* margin-top: 54px; */
    margin-bottom: 15px;
  }
  .logo > img{
    height: 50px;
  }
  .register .content-body  form{
    width: 325px;
    margin: 0 auto;
  }
  .form-item{
    height: 40px;
    margin-bottom: 15px;
  }
  .form-item > input{
    border-radius: 4px;
    border: none;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
  }
  .form-item > input:-ms-input-placeholder{
    color: #999;
  }
  .form-item > input::-webkit-input-placeholder{
    color: #999;
  }
  .form-item > div{
    width: 100%;
    border: none;
    border-radius: 4px;
    height: 40px;
    line-height: 40px;
  }
  .protocal > input[type='checkbox']{
    width: 15px;
    height: 15px;
    background-color: #d9d9d9;
    -webkit-appearance: none;
    border-radius: 3px;
    border: none;
    outline: none;
    position: absolute;
    top: 1px;
    left: 0;
  }
  .protocal > input[type='checkbox']:checked{
    background: #ff787b url('/static/images/my/icon_certification_select.svg') no-repeat center;
    background-size: 90%;
  }
  .protocal{
    margin-bottom: 25px;
    text-align: left;
    vertical-align: top;
    position: relative;
    padding-left: 28px;
  }
  .validate-answer, .validate-code {
    overflow: hidden;
  }
  .validate-answer > input, .validate-code > input{
    width: 220px;
    float: left;
  }
  .validate-answer > img, .validate-code > span {
    float: right;
    width: 90px;
    border-radius: 4px;
  }
  .validate-code > span {
    line-height: 38px;
    border: 1px solid #ff787b;
    /* box-sizing: border-box; */
   }
  .else-btn{
    position: absolute;
    bottom: 40px;
    left: 50%;
    transform: translate(-50%);
  }
  .not-allow{
    color: #ccc;
    border: 1px solid #ccc !important;
  }
  .register-protocal{
    position: relative;
    width: 100%;
    height: 100%;
    z-index: 1002;
  }
  .register-header{
    position: fixed;
    height: 24px;
    /* line-height: 24px; */
    width: 100vw;
    text-align: center;
    top: 0;
    padding-top: 10px;
    padding-bottom: 10px;
  }
  .back{
    position: absolute;
    height: 20px;
    top: 2px;
    cursor: pointer;
    padding: 10px;
    left: 0;
  }
  .register-protocal .content-body{
    top: 54px;
    text-align: left;
    padding: 0 10px;
  }
  .register-protocal .content-body > div{
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
  }
  .register-protocal .content-body > div::-webkit-scrollbar{
    display: none;
  }
  .register-protocal .protocal-content{
    line-height: 1.6;
  }
  .register-protocal .protocal-content > p >>> img{
    width: 100%;
  }
  .register-protocal .protocal-content > p >>> p{
    line-height: 1.6;
  }
  .slide-fade-enter-active {
    transition: all .3s ease;
  }
  .slide-fade-leave-active {
    transition: all .3s ease;
  }
  .slide-fade-enter, .slide-fade-leave-to
  /* .slide-fade-leave-active for below version 2.1.8 */ {
    transform: translateY(100%);
    opacity: 0;
  }
</style>
