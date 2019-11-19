<template>
  <div class="login">
    <CHeader title="重置密码" backBol="true" :backUrl="backUrl"></CHeader>
    <div class="content-body has-header main-bg">
      <form class="font28">
        <div class="reset-title">
          <p class="font40">验证绑定手机号码</p>
        </div>
        <div class="form-item">
          <input type="tel" placeholder="请输入手机号码" class="assist-color3 normal-padding main-text-color1" v-model="tel" @blur="vertifyTel">
        </div>
        <div class="form-item validate-answer">
          <input type="text" placeholder="请输入公式答案" class="assist-color3 normal-padding main-text-color1" v-model="answer" @blur="vertifyAnswer">
          <img :src="img_url" alt="图片加载失败" @click="getImage()" />
        </div>
        <div class="form-item">
          <div class="main-color1 white-color" @click="next">发送短信验证码</div>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import CHeader from '@/components/common/IHeader.vue'
import Api from '@/api'
export default {
  data () {
    return {
      tel:'',//电话
      answer:'',//验证码
      telPass:false,//电话 密码
      answerPass:false,//验证码 密码
      img_url:'',//验证码图片
    }
  },
  components: {
    CHeader
  },
  computed: {
    backUrl () {
      if (this.type === 'set') {
        return '/set'
      } else if (this.type === 'forgetPass') {
        return '/login';
      } else {
        return '/';
      }
    },
    type () {
      return this.$route.query.type;
    }
  },
  created(){
    this.getImage();
  },
  methods: {
    //获取公式图形验证码
    getImage(){
      var timestamp = (new Date()).getTime();
      this.$http.post(Api.verificationimage ,{'xhrFields':{withCredentials: true},crossDomain: true}).then(res=>{
        this.img_url=res.data.Data.img64;
        this.code = res.data.Data.code;
      })
    },
    next () {
      if(!this.telPass){
        this.$toast({
          message: '请输入有效手机号码',
          position: 'bottom',
          duration: 1000
        })
        return;
      }
      if(!this.answerPass){
        this.$toast({
          message: '请输入有效公式答案',
          position: 'bottom',
          duration: 1000
        })
        return;
      }
      if (this.code != this.answer) {
        this.$toast({
          message: '图形验证码答案错误',
          position: 'bottom'
        })
        return;
      }
      if (this.type === 'set') {//修改密码
        this.$http.post(Api.verificationLocalPhone,{"Uphe":this.tel,"Code": this.answer}).then(res=>{//验证是否登录账号
          if(res.data.Status==1){//验证成功并发短信
            this.sendMsg(3).then(res => {//更改密码本该为7，但是不知道为什么要改成3
              if (res.data.Status === '1') {
                this.$router.push({path: '/vertify-code', query: {type: 'vertifyCurrentPhone'}});
                 sessionStorage.setItem('tel', this.tel);
              }else{
                this.getImage();
              }
              this.$toast({
                message: res.data.Msg,
                position: 'bottom',
                duration: 2000
              })
            })
          }else{
            this.getImage();
            this.$toast({
              message: res.data.Msg,
              position: 'bottom'
            })
          }
        })
      } else if (this.type === 'forgetPass') {//忘记密码
        this.$http.post(Api.verificationForget1,{ "Uphe": this.tel,"Code":this.answer}).then(res=>{
          if(res.data.Status==1){//验证成功发送短信验证码
            //跳转页面
            this.sendMsg(3).then(res => {
              if (res.data.Status === '1') {
                this.$router.push({path: '/vertify-code', query: {type: 'forgetPass'}});
                sessionStorage.setItem('tel', this.tel);
              }else{
                this.getImage();
              }
              this.$toast({
                message: res.data.Msg,
                position: 'bottom',
                duration: 2000
              })
            })
          }else{
            this.getImage();
            this.$toast({
              message: res.data.Msg,
              position: 'bottom',
              duration: 2000
            })
          }
        });
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
      // console.log(this.telPass);
      
    },
    vertifyAnswer () {
      if (this.answer) {
        this.answerPass = true;
      } else {
        this.answerPass = false;
      }
    },
    sendMsg (type) {
      return this.$http.post(Api.verificationPhone,{"Mobile":this.tel,"type": type}).then(res=>{
        return res;
      });
    },
  },
  mounted () {

  }
}
</script>
<style scoped>
  .login{
    height: 100%;
  }
  .reset-title{
    margin: 25px 0 15px;
  }
  .content-body > form{
    text-align: left;
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
    box-sizing: border-box;
    height: 100%;
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
    margin-top: 25px;
    text-align: center;
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
</style>
