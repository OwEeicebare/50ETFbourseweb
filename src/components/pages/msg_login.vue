<template>
  <div class="login">
    <CHeader backBol="true" backUrl="/login"></CHeader>
    <div class="content-body has-header main-bg">
      <div>
        <div class="logo">
          <img :src="this.imgUrl" alt="">
        </div>
        <form class="font28">
          <div class="form-item">
            <input type="tel" placeholder="请输入手机号码" class="assist-color3 normal-padding main-text-color1" v-model='tel' @blur="vertifyTel">
          </div>
          <div class="form-item validate-answer">
            <input type="text" placeholder="请输入公式答案" class="assist-color3 normal-padding main-text-color1" v-model='answer' @blur="vertifyAnswer">
            <img :src="img_url" alt="图片加载失败" @click="getImage" />
          </div>
          <div class="tab-active-color else-help">
            <router-link to="/login" tag="span">账号密码登录</router-link>
          </div>
          <div class="form-item">
            <div class="main-color1 white-color" @click="sendMsg">发送短信验证码</div>
          </div>
          <router-link to="/register" tag="div" class="tab-active-color else-btn" v-show="hidshow">我要注册</router-link>
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
      docmHeight: document.documentElement.clientHeight,  //默认屏幕高度
      showHeight: document.documentElement.clientHeight,   //实时屏幕高度
      hidshow:true,  //显示或者隐藏footer
      tel: '',
      answer: '',
      img_url:'',
      telPass: false,
      answerPass: false,
      code: '',
       imgUrl:'',//logo
    }
  },
  components: {
    CHeader
  },
  created(){
    this.getAgain();
    this.getImage();
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
        this.code = res.data.Data.code;
      })
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
    vertifyAnswer () {
      if (this.answer) {
        this.answerPass = true;
      } else {
        this.answerPass = false;
      }
    },
    sendMsg () {
      if(!this.telPass){
        this.$toast({
          message: "请输入有效手机号码",
          position: 'bottom',
          duration: 1000
        })
        return;
      }
      if(!this.answerPass){
        this.$toast({
          message: "请输入有效公式答案",
          position: 'bottom',
          duration: 1000
        })
        return;
      }
      if (this.code != this.answer) {
        this.$toast({
          message: '图形验证码错误',
          position: 'bottom',
          duration: 1000
        })
        return;
      }
      //后端验证手机号码和图形验证码
      this.$http.post(Api.verificationMsgLogin,{"Uphe": this.tel, "Code": this.answer},{'xhrFields':{withCredentials: true},crossDomain: true}).then(res=>{
        if(res.data.Status==1){//验证通过：发送短信验证码，发送成功后才跳转页面
          this.$http.post(Api.verificationPhone,{"Mobile":this.tel,"type":2}).then(res=>{
              if(res.data.Status==1){//短信发送成功
                //跳转页面
                sessionStorage.setItem('tel', this.tel);
                //发送短信验证码
                this.$router.push({path: '/vertify-code', query: {type: 'msgLogin'}});
              }else{
                this.getImage();
              }
              this.$toast({
                message: res.data.Msg,
                position: 'bottom',
                duration: 1000
              })
          });
        }else{
          this.$toast({
            message: res.data.Msg,
            position: 'bottom',
            duration: 1000
          })
          this.getImage();
        }
      })
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
  .login .custom-header{
    border: none;
  }
  .login{
    height: 100%;
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
    text-align: center;
  }
  .else-help{
    margin-bottom: 25px;
    text-align: left;
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
     position: absolute;
     left: 50%;
    transform: translate(-50%);
     bottom: 40px;
   }
</style>
