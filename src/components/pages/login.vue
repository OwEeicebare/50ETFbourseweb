<template>
  <div class="login">
    <CHeader backBol="true" backUrl="/"></CHeader>
    <div class="content-body has-header main-bg">
      <div>
        <div class="logo">
          <img :src="this.imgUrl" alt="">
        </div>
        <form class="font28">
          <div class="form-item">
            <input type="tel" placeholder="请输入手机号码" class="assist-color3 normal-padding main-text-color1" v-model="tel" @blur="vertifyTel">
          </div>
          <div class="form-item">
            <input type="password" placeholder="请输入登录密码" class="assist-color3 normal-padding main-text-color1" v-model="password" @blur="vertifyPassword">
          </div>
          <div class="form-item validate-answer">
            <input type="text" placeholder="请输入公式答案" class="assist-color3 normal-padding main-text-color1" v-model="answer" @blur="vertifyAnswer">
            <img :src="img_url" @click="getImage" alt="图片加载失败">
          </div>
          <div class="tab-active-color else-help">
            <router-link to="/msg-login" tag="span">短信验证登录</router-link>
          </div>
          <div class="form-item">
            <div class="main-color1 white-color" @click="login">登录</div>
          </div>
          <div class="else-btn tab-active-color" v-show="hidshow">
            <router-link to="/register" tag="div">我要注册</router-link>
            <router-link :to="{path: '/current-phone', query: {type: 'forgetPass'}}" tag="div">忘记密码</router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import CHeader from '@/components/common/IHeader.vue'
import Api from '@/api'
export default {
  data () {
    return {
      imgUrl:'',
      docmHeight: document.documentElement.clientHeight,  //默认屏幕高度
      showHeight: document.documentElement.clientHeight,   //实时屏幕高度
      hidshow:true,  //显示或者隐藏footer
      tel: '',
      password: '',
      answer: '',
      img_url:'',
      telPass: false, //判断手机号是否输入以及是否输入符合规则
      passWordPass: false,
      answerPass: false,
      a:''
    }
  },
  created(){
    this.getAgain();
    this.getImage();
  },
  components: {
    CHeader
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
      // this.$http.post(Api.verificationimage).then(res=>{
      //   this.img_url=res.data;
      // })
      this.$http.post(Api.verificationimage).then(res=>{
          this.img_url=res.data.Data.img64; 
          this.a=res.data.Data.code;
      })
    },
    login () {
      // 登录
      if(this.a != this.answer){
        this.$toast({
          position: 'bottom',
          message: "图形验证码错误",
          duration: 1000
        })
        return;
      }
      if (this.telPass && this.passWordPass && this.answerPass) {
        this.$http.post(Api.login, {"Uphe": this.tel, "Apass": this.password, "Code": this.answer}).then(res => {
          if (res.data.Status == '1') {
            this.$store.commit('LOGIN',res.data.Data);
            this.$router.push('/');
            return;
          }else{
             this.getImage();
          }
          this.$toast({
            position: 'bottom',
            message: res.data.Msg,
            duration: 1000
          })
        })
       
      }else{
        var message = !this.telPass ? '请输入有效手机号码' : !this.passWordPass ? '请输入正确的登录密码' : !this.answerPass ? '请输入有效公式答案' : '';
        this.$toast({
          message: message,
          position: 'bottom',
          duration: 1000
        })
      }
    },
    vertifyTel () {
      // 验证手机号 第二位3456789
      let reg = /^1[3,4,5,6,7,8,9][0-9]{9}$/
      if (!reg.test(this.tel)){
        this.telPass = false;
      } else {
        this.telPass = true;
      }
    },
    vertifyPassword () {
      if (this.password) {
        this.passWordPass = true;
      } else {
        this.passWordPass = false;
      }
    },
    vertifyAnswer () {
      if (this.answer) {
        this.answerPass = true;
      } else {
        this.answerPass = false;
      }
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
  },
}
</script>
<style scoped>
  .login .custom-header{
    border-bottom: none;
  }
  .login{
    height: 100%;
  }
  .content-body{
    /* top: 54px; */
  }
  .content-body > div{
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
  .content-body form{
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
  /* .form-item > input:-ms-input-placeholder{
    color: #999;
    font-size: 15px;
  }
  .form-item > input::-webkit-input-placeholder{
    color: #999;
    font-size: 15px;
  } */
  .form-item > div{
    width: 100%;
    border: none;
    border-radius: 4px;
    height: 40px;
    line-height: 40px;
    text-align: center;
  }
  .else-help{
    margin-bottom: 25px;
    overflow: auto;
  }
  .else-help > span:nth-child(1) {
    float: left;
  }
  .else-help > span:nth-child(2) {
    float: right;
  }
  .validate-answer {
    overflow: hidden;
  }
  .validate-answer > input{
    width: 220px;
    float: left;
  }
  .validate-answer > img{
    float: right;
    width: 90px;
    border-radius: 4px;
  }
  .else-btn{
    overflow: auto;
    left: 0;
    right: 0;
    position: absolute;
    bottom: 40px;
    padding: 0 25px;
  }
  .else-btn > div:nth-child(1) {
    float: left;
  }
  .else-btn > div:nth-child(2) {
    float: right;
  }
</style>
