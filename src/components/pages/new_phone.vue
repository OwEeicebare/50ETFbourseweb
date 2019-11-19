<template>
  <div class="login">
    <CHeader title="验证当前绑定手机号" backBol="true"></CHeader>
    <div class="content-body has-header main-bg">
      <form class="font28">
        <div class="reset-title">
          <p class="font40">绑定新手机</p>
        </div>
        <div class="form-item">
          <input type="tel" placeholder="请输入手机号码" class="assist-color3 normal-padding main-text-color1" v-model="tel" @blur="vertifyTel">
        </div>
        <div class="form-item validate-answer">
          <input type="text" placeholder="请输入公式答案" class="assist-color3 normal-padding main-text-color1" v-model="answer" @blur="vertifyAnswer">
          <img :src="img_url" @click="getImage" alt="图片加载失败">
        </div>
        <div class="form-item btn">
          <div class="main-color1 white-color" @click="next">确定</div>
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
      tel: '',
      answer: '',
      img_url:'',
      telPass: false, //判断手机号是否输入以及是否输入符合规则
      answerPass: false,
      code: '', //答案
    }
  },
  created(){
    this.getImage();
  },
  components: {
    CHeader
  },
  methods: {
    getImage(){
      var timestamp = (new Date()).getTime();
      this.$http.post(Api.verificationimage ,{'xhrFields':{withCredentials: true},crossDomain: true}).then(res=>{
        this.img_url=res.data.Data.img64;
        this.code = res.data.Data.code;
      })
    },
    next () {
      if (this.code != this.answer) {
        this.$toast({
          message: '图形验证码输入错误',
          position: 'bottom'
        })
        return;
      }
      if (this.telPass && this.answerPass){
        this.$http.post(Api.changeTel, {"Uphe": this.tel,"Code": this.answer},{'xhrFields':{withCredentials: true},crossDomain: true}).then(res => {
          // console.log('图形验证是否更换手机号', res);
          if (res.data.Status == '1') {
            sessionStorage.setItem('tel', this.tel);
            this.sendMsg().then(res => {
              // if (res.data.Status === '1') {
                this.$router.push({path: '/vertify-code', query: {type: 'vertifyNewPhone'}});
              // }
            })
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
        var message = !this.telPass ? '请输入有效手机号码' :  !this.answerPass ? '请输入有效公式答案' : '';
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
    vertifyAnswer () {
      if (this.answer) {
        this.answerPass = true;
      } else {
        this.answerPass = false;
      }
    },
    sendMsg () {
      return this.$http.post(Api.verificationPhone,{"Mobile":this.tel,"type": 4}).then(res=>{
        return res;
        if(res.data.Status==0){
          this.$toast({
            message:"发送成功",
            position: 'bottom',
            duration: 1000
          })
        }else{
          this.$toast({
            message:"请求失败",
            position: 'bottom',
            duration: 1000
          })
        }
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
  .content-body{
    top: 56px;
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
