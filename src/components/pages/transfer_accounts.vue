<template>
  <div class="transfer">
    <CHeader title="银行汇款" backBol="true" backUrl="/recharge" funBol="true" :elseSrc="theme ? '/static/images/black/icon_help.svg' : '/static/images/my/icon_help.svg'" directRoute="/questions"></CHeader>
    <div class="content-body has-header main-bg">
      
      <!-- <p class="assist-color3 line"></p> -->
      <ul class="font28">
        <li class="normal-border-color">收款账号</li>
        <li class="normal-border-color"><i><img :src="judgeEmptyObj(account) && account.log  ? account.log : '/static/images/my/g.svg'" alt=""></i>{{judgeEmptyObj(account) ? account.baame : ''}}（{{judgeEmptyObj(account) ? account.banch : ''}}）</li>
        <li class="normal-border-color">银行卡号 {{judgeEmptyObj(account) ? numSeparate(account.bard) : ''}}<span class="copy-color" v-clipboard:copy="account.bard" v-clipboard:success="onCopy" v-clipboard:error="onError">复制</span></li>
        <li class="normal-border-color">账户名称 {{judgeEmptyObj(account) ? account.acname : ''}}<span class="copy-color" v-clipboard:copy="account.acname" v-clipboard:success="onCopy" v-clipboard:error="onError">复制</span></li>
      </ul>
      <div class="assist-color3 font28 normal-padding main-text-color2">
        <p>审核时间：工作日9:00-17:30</p>
        <p>到账时间：提交充值后30分钟内审核到账，17:30以后次日9:30前到账</p>
        <p>法定节假日（含双休日）不进行审核，到账时间顺延</p>
        <p>如有疑问，请联系客服</p>
      </div>
      <ul class="font28">
        <li class="higher-li normal-border-color">上传成功截图<input type="file" @change="uploadImg" accept="image/*">
        <img :src="screenshot ? screenshot : (theme ? '/static/images/black/icon_img_upload.svg' : '/static/images/my/icon_img_upload.svg')" alt="" class="alter-upload"></li>
      </ul>
      <ul class="font28">
        <router-link to="/transfer-info" class="has-right normal-border-color" tag="li">填写转账信息</router-link>
      </ul>
    </div>
    <div :class="{'next-step': true, 'font32': true, 'white-color': true,'line-color': !btnEnable, 'main-color1': btnEnable }" @click="completeTransfer">我已完成汇款</div>
  </div>
</template>
<script>
import api from '@/api'
import $axios from 'axios'
import CHeader from '@/components/common/IHeader.vue'
export default {
  //进入路由验证是否实名
  beforeRouteEnter:(to,from,next)=>{
    $axios.post(api.autonymState).then(res=>{
      if(res.data.Status==="1"){
        if(res.data.Data.NTure!==1){//未实名
          next('/')
        }else{
          next();
        }
      }
    })
  },
  data () {
    return {
      screenshot: '',
      account: {}, //收款账号
      btnDisable: false, //禁用按钮
      uploadScreen: ''
    }
  },
  components: {
    CHeader
  },
  computed: {
    btnEnable () {
      if (this.screenshot || this.remark || this.money ){
        return true;
      } else {
        return false;
      }
    },
    remark () {
      return this.$store.state.remittanceRemark;
    },
    money () {
      return this.$store.state.remittance;
    },
    fee () {
      return this.$store.state.fee;
    },
    theme () {
      // console.log(localStorage.getItem('theme') != null ? JSON.parse(localStorage.getItem('theme')).theme : 0);
      return localStorage.getItem('theme') != null ? JSON.parse(localStorage.getItem('theme')).theme : 0;
    }
  },
  methods: {
    uploadImg (e) {//上传截图
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
            this.screenshot = res.data.data.fullPath;
            this.uploadScreen = res.data.data.path;
            this.$store.commit('CHANGE_SCREENSHOT', this.screenshot);
            this.$store.commit('CHANGE_UPLOADSCREEN', this.uploadScreen);
          } else {
            this.$toast({
              message: res.data.msg,
              position: 'bottom'
            })
          }
        })
      }
    },
    completeTransfer () {//下一步
      if (this.btnEnable && !this.btnDisable) {
        this.btnDisable = true;
        let data = {
          RechargeMoney: Number(this.money),
          RechargeScreenshots: this.uploadScreen,
          RechargeLost: Number(this.fee),
          RechargeValue: Number(this.money - this.fee),
          UkRemark: this.remark,
          fromId: Number(this.account.bandId),
          fromName: this.account.baame + ' ' + this.account.bard
        };
        this.$http.post(api.recharge, data).then(res => {
          // console.log(res.data);
          if (res.data.Status === '1') {
            this.$router.push({path: '/transfer-success', query: {orderId: res.data.Data}});
            return;
          }
        })
      } else {
        return;
      }
    },
    onCopy: function (e) {//复制文本
      // alert('You just copied: ' + e.text)
      this.$toast({
        message: '已复制',
        position: 'bottom',
        duration: 3000
      })
    },
    onError: function (e) {
      // alert('Failed to copy texts')
    },
    numSeparate (cardnum) {//银行卡加间隔
      if (cardnum.length > 5) {
        let str = '';
        let start = 0;
        for (let i = 0; i < cardnum.length; i++) {
          if (i % 4 === 0) {
            str += cardnum.substring(start, i) + ' ';
            start = i;
          }
        }
        if (start < cardnum.length) {
          str += cardnum.substring(start, cardnum.length);
        }
        return str;
      }
      return cardnum
    },
    getReceiptAccount () {//获取收款账号
      this.$http.post(api.rechargeBank).then(res => {
        // console.log(res);
        if (res.data.Status === '1') {
          this.account = res.data.Data[0];
          sessionStorage.setItem('account', JSON.stringify(res.data.Data[0]));
          // console.log(this.account);
        }
      })
    },
    judgeEmptyObj (obj) {//判断是否为空对象 不为空true 空false
      for (var item in obj) {
        return true;
      }
      return false;
    }
  },
  created () {
    this.getReceiptAccount();
  },
  mounted () {
    this.screenshot = this.$store.state.screenshot;
    this.uploadScreen = this.$store.state.uploadScreen;
  },
  beforeRouteLeave (to, from, next) {//路由控制
    // console.log(to);
    if (to.name === 'Recharge') {
      this.$store.commit('CHANGE_SCREENSHOT', '');
      this.$store.commit('CHANGE_REMARK', { 'remark': '' });
      this.$store.commit('CHANGE_MONEY', { 'money': '' });
      this.$store.commit('CHANGE_UPLOADSCREEN', '');
      next();
    }
    next();
  }
}
</script>
<style scoped>
  .transfer{
    height: 100%;
  }
  .content-body{
    top: 56px;
    bottom: 50px;
    text-align: left;
    /* padding: 0 10px; */
  }
  .transfer-header{
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
  .transfer-header .circle{
    width: 10px;
    height: 10px;
    border-radius: 50%;
    display: inline-block;
    margin-right: 5px;
    position: relative;
  }
  .transfer-header .circle::before{
    content: '';
    width: 16px;
    height: 16px;
    position: absolute;
    left: -3px;
    top: -3px;
    border-radius: 50%;
  }
  .transfer-header .circle:nth-of-type(1):before{
    background-color: rgba(255, 120, 123, .3);
  }
  .transfer-header .circle:nth-of-type(4):before{
    background-color: rgba(217, 217, 217, .3);
  }
  .transfer-header .circle:nth-of-type(4){
    margin-left: 10px;
  }
  .transfer-header span:nth-of-type(2) {
    margin-right: 10px;
  }
  .transfer-header .line{
    width: 50px;
    height: 1px;
    display: inline-block;
    vertical-align: middle;
  }
  ul{
    padding: 0 10px;
  }
  ul > li{
    height: 50px;
    line-height: 50px;
    /* border-bottom: 1px solid #d9d9d9; */
    border-bottom-width: 1px;
    border-bottom-style: solid;
    position: relative;
  }
  .content-body > ul:nth-child(1) > li:nth-last-child(1) {
    border-bottom: none;
  }
  ul > li.has-right{
    background: url('/static/images/home/arrow_right.svg') no-repeat right center;
    background-size: auto 12px;
    /* border-bottom: 1px solid #d9d9d9; */
    border-bottom-width: 1px;
    border-bottom-style: solid;
    /* border-bottom-color: #f0f0f0; */
  }
  ul > li > span, ul > li > input{
    position: absolute;
    right: 10px;
    z-index: 100;
  }
  ul > li > i{
    display: inline-block;
    width: 30px;
    height: 30px;
    vertical-align: middle;
    margin-top: -2px;
    margin-right: 10px;
  }
  ul > li > i > img{
    width: 30px;
  }
  ul > li > input[type="file"]{
    height: 100%;
    border: none;
    opacity: 0;
  }
  ul > li.higher-li{
    height: 80px;
    line-height: 80px;
    overflow: hidden;
  }
  img.alter-upload{
    position: absolute;
    width: 60px;
    right: 10px;
    top: 10px;
    z-index: 99;
    height: 60px;
  }
  .next-step{
    position: fixed;
    bottom: 0;
    height: 50px;
    width: 100%;
    line-height: 50px;
  }
  .line{
    height: 12px;
  }
</style>
