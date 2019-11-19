<template>
  <div class="login">
    <CHeader title="验证当前绑定手机号" backBol="true"></CHeader>
    <div class="content-body has-header main-bg">
      <form class="font28">
        <div class="reset-title">
          <p class="font40 normal-margin">请输入短信验证码</p>
          <p class="font24 main-text-color2">已向手机号{{tels}}发送短信验证码</p>
        </div>
        <div class="form-item normal-margin">
          <SecurityCode v-model="authCode"></SecurityCode>
        </div>
        <div>
          <p class="font24 main-text-color2" :class="{'send_active':!is_showtime}" @click="send_smg">
            <span style="margin-right: 5px;" v-if="is_showtime">{{time}}s</span>重新发送
          </p>
        </div>
        <div class="form-item normal-margin btn">
          <div class="main-color1 white-color" @click="next">确定</div>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import CHeader from '@/components/common/IHeader.vue'
import SecurityCode from '@/components/common/SecurityCode.vue'
import Api from '@/api'
export default {
  data () {
    return {
      authCode: '',
      time: 60,//倒计时时间
      is_showtime:true,//是否显示秒数
      timer: null,//定时器
    }
  },
  computed: {
    type () {
      return this.$route.query.type;
    },
    tels () {
      var reg=/(\d{3})\d{4}(\d{4})/;
      var tel_end = this.tel.replace(reg, "$1****$2")
      return tel_end;
    },
    typeValue () {
      if(this.type==="msgLogin"){
        return 2
      }
      else if(this.type==="forgetPass"){
        return 3
      }
      else if(this.type==="changeTel"){
        return 5
      } 
      else if (this.type === 'vertifyCurrentPhone') {
        return 3;//本来为7
      } 
      else if (this.type === 'vertifyNewPhone') {
        return 4
      }
    },
    tel () {
      let login = localStorage.getItem('login');
      let tel = sessionStorage.getItem('tel');
      if (tel != null) {
        return tel;
      }
      if (login != null) {
        return (JSON.parse(login)).Mobile;
      } else {
        return '';
      }
    }
  },
  components: {
    CHeader,
    SecurityCode
  },
  created(){
    //发送短信验证码类型
    // 用户登录=2,
    // 找回密码=3,
    // 绑定手机=4,
    // 手机号修改=5,
    //更改密码 7
    this.countDown();
  },
  methods: {
    countDown(){
      this.is_showtime=true;
      this.timer=setInterval(() => {
        if(this.time>0){
          this.time--;
        }else{
          this.time=60;
          this.is_showtime=false;
          window.clearInterval(this.timer);
        }
      }, 1000);
    },
    send_smg(){
      // console.log("类型：",this.typeValue);
      if(!this.is_showtime){//显示时间时不能发送短信验证
        this.$http.post(Api.verificationPhone,{"Mobile":this.tel,"type":this.typeValue}).then(res=>{
          if(res.data.Status==1){
            this.countDown();//成功后倒计时
            this.$toast({
              message:"发送成功",
              position: 'bottom',
              duration: 1000
            })
          }else{
            this.$toast({
              message: res.data.Msg,
              position: 'bottom',
              duration: 1000
            })
          }
        });
      }
    },
    next () {
      // 验证长度
      if(this.authCode.length<6){
        this.$toast({
          message:"请填写有效短信验证码",
          position: 'bottom',
          duration: 1000
        })
        return;
      }
      if (this.type === 'changeTel') {
        // 修改手机号
        this.$http.post(Api.changeCurrentTel, {"Uphe": this.tel,"Code":this.authCode}).then(res => {
          if (res.data.Status === '1') {
            this.$router.push('/new-phone');
          } else {
            this.$toast({
              message:res.data.Msg,
              position: 'bottom',
              duration: 2000
            })
          }
        })
      } else if (this.type === 'vertifyNewPhone') {
        // 修改手机号 验证新手机号
        this.$http.post(Api.changeTelReal, {"Uphe": this.tel,"Code":this.authCode}).then(res => {
          // console.log('验证新手机号', res);
          if (res.data.Status === '1') {
            this.$router.push({path: '/modify-success', query: {title: '修改绑定手机', message: '手机号码修改成功', type: 'changeTel'}});
          }else{
            this.$toast({
              message:res.data.Msg,
              position: 'bottom',
              duration: 2000
            })
          }
        })
      } else if (this.type === 'vertifyCurrentPhone') {// 修改密码
        this.$http.post(Api.verificationForget2,{"Uphe": this.tel,"Code":this.authCode}).then(res=>{
          if(res.data.Status==1){
            this.$router.push({path: '/reset-pass', query: {origin: 'change'}});
          }else{
            this.$toast({
              message:res.data.Msg,
              position: 'bottom',
              duration: 2000
            })
          }
        })
      } else if (this.type === 'msgLogin') {
        //短信登录
        this.$http.post(Api.verificationMsgLogin2,{"Uphe": this.tel,"Code":this.authCode}).then(res=>{
          if(res.data.Status==1){
            this.$router.push('/');
            this.$store.commit('LOGIN',res.data.Data);
          }else{
            this.$toast({
              message:res.data.Msg,
              position: 'bottom',
              duration: 2000
            })
          }
        })
      } else if (this.type === 'forgetPass') {
        //忘记密码通道
        this.$http.post(Api.verificationForget2,{"Uphe": this.tel,"Code":this.authCode}).then(res=>{
          if(res.data.Status==1){
            this.$router.push({path: '/reset-pass', query: {origin: 'forgetPass'}});
          }else{
            this.$toast({
              message:res.data.Msg,
              position: 'bottom',
              duration: 2000
            })
          }
        })
        
      }
    }
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
    margin: 25px 0 10px;
  }
  .content-body > form{
    text-align: left;
    width: 325px;
    margin: 0 auto;
  }
  .form-item > input{
    border-radius: 4px;
    border: none;
    width: 100%;
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
    margin-top: 15px;
    text-align: center;
  }
  .btn > div{
    height: 40px;
    line-height: 40px;
    margin-top: 25px;
  }
  .send_active{
    color: #3aaaff;
  }
</style>
