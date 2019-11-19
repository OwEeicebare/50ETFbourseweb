<template>
  <div class="login">
    <CHeader title="添加银行卡" backBol="true"></CHeader>
    <div class="content-body has-header main-bg">
      <form class="font28">
        <div class="reset-title">
          <p>当前手机号为{{mobile}}</p>
        </div>
        <div class="form-item validate-answer">
          <input type="text" placeholder="请输入公式答案" class="assist-color3 normal-padding main-text-color1" v-model="imageCode">
          <img :src="img_url" @click="getImage" alt="图片加载失败">
        </div>
        <div class="form-item vertify-code">
          <p class="normal-margin">请输入手机验证码</p>
          <SecurityCode v-model="authCode"></SecurityCode>
        </div>
        <div class="form-item normal-margin">
          <div class="main-color1 white-color" @click="changeSuccess">确定</div>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import Api from '@/api'
import CHeader from '@/components/common/IHeader.vue'
import SecurityCode from '@/components/common/SecurityCode.vue'
export default {
  data () {
    return {
      authCode: '',
      img_url:'',
      imageCode: '', //图形验证码
      code: '',
    }
  },
  components: {
    CHeader,
    SecurityCode
  },
  computed: {
    type () {
      if (this.$route.query.type) {
        // console.log(this.$route.query.type);
        return this.$route.query.type;
      } else {
        return;
      }
    },
    mobile () {
      var login = this.$store.state.addBankInfo;
      if (login != null) {
        return login.Uphe;
      } else {
        return JSON.parse(sessionStorage.getItem('addInfo')).Uphe;
      }
    }
  },
  methods: {
    changeSuccess () {
      if (this.imageCode != this.code) {
        this.$toast({
          message: '图形验证码输入错误',
          position: 'bottom'
        })
        return;
      }
      var addBankInfo = this.$store.state.addBankInfo != null ? this.$store.state.addBankInfo : JSON.parse(sessionStorage.getItem('addInfo'));
      if (this.imageCode && this.authCode) {
        this.$http.post(Api.addBank, {
            "BankName": addBankInfo.BankName,
            "BankAddress": addBankInfo.BankAddress,
            "Province": addBankInfo.Province,
            "City": addBankInfo.City,
            "Area": addBankInfo.Area,
            "BankBranch": addBankInfo.BankBranch,
            "BankCard": addBankInfo.BankCard,
            "BankAccountName": addBankInfo.BankAccountName,
            "IdCard": addBankInfo.IdCard,
            "MobilePhone": addBankInfo.MobilePhone,
            "UserName": addBankInfo.UserName,
            "bandid": addBankInfo.bandid,
            "Code": this.imageCode,
            "SMSCode": this.authCode,
            "Uphe": addBankInfo.Uphe
        }).then(res => {
          // console.log('添加银行卡', res);
          if (res.data.Status === '1') {
            this.$router.push({path: '/modify-success', query: {title: '添加银行卡', message: '添加成功', type: this.type}});
          } else {
            this.$toast({
              message: res.data.Msg,
              position: 'bottom',
              duration: 3000
            })
          }
        })
      }
    },
    //获取公式图形验证码
    getImage(){
      var timestamp = (new Date()).getTime();
      this.$http.post(Api.verificationimage ,{'xhrFields':{withCredentials: true},crossDomain: true}).then(res=>{
        this.img_url=res.data.Data.img64;
        this.code = res.data.Data.code;
      })
    }
  },
  created () {
    this.getImage();
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
    top: 54px;
  }
  .reset-title{
    margin: 50px 0 10px;
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
    padding: 10px 0;
    margin-top: 20px;
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
  .vertify-code{
    margin-top: 20px;
  }
</style>
