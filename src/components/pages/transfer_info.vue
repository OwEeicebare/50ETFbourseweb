<template>
  <div class="transfer-info">
    <CHeader title="银行汇款" :backBol="true" :funBol="true" :backUrl="'recharge'" :elseSrc="theme ? '/static/images/black/icon_help.svg' : '/static/images/my/icon_help.svg'" directRoute="/questions"></CHeader>
    <div class="content-body has-header main-bg">
      <ul class="font28">
        <li class="normal-border-color">汇款备注<input type="text" placeholder="若您使用他人银行卡汇款请备注姓名账号" v-model="remark" class="main-bg main-text-color1"></li>
        <li style="border: none;" class="normal-border-color">汇款金额<span class="main-text-color2">服务费：￥{{Number(fee).toFixed(2)}}</span></li>
        <li class="normal-border-color money">￥<input type="text" placeholder="0.00" v-model="money" @input="changeFee" class="main-bg main-text-color1"></li>
      </ul>
      <p class="font24 assist-color3 main-text-color2 read-tips">银行汇款免服务费，到账金额￥{{remmitMoney ?Number(remmitMoney-fee).toFixed(2) : '0.00'}}</p>
    </div>
    <div class="" :class="{'white-color':true,'font32':true,'next-step':true,'main-color1':can_click,'bg':!can_click
    }" @click="sure">确定</div>
  </div>
</template>
<script>
import CHeader from '@/components/common/IHeader.vue'
export default {
  data () {
    return {
      can_click:false,
      remark: '',
      money: '',
      fee: 0
    }
  },
  computed: {
    remmitMoney () {
      var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
      if (this.money && reg.test(this.money)) {
        return Number(this.money).toFixed(2);
      } else {
        return ''
      }
    },
    theme () {
      // console.log(localStorage.getItem('theme') != null ? JSON.parse(localStorage.getItem('theme')).theme : 0);
      return localStorage.getItem('theme') != null ? JSON.parse(localStorage.getItem('theme')).theme : 0;
    }
  },
  methods: {
    // backUp () {
    //   if(!this.can_click){
    //     return
    //   }
    //   this.$router.push('/transfer-accounts');
    // },
    changeFee () {
      var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
      if (!reg.test(this.money)||this.money<=0||this.money>99999999.99) {//输入不合法或者小于等于零
        this.can_click=false;
        return;
      }
      //计算服务费
      var account = sessionStorage.getItem('account');
      if (account != null) {
        this.fee = this.money * (JSON.parse(account).sharge / 100) > JSON.parse(account).mharge ? this.money * (JSON.parse(account).sharge / 100) : JSON.parse(account).mharge;
        if(this.remmitMoney-this.fee<0){
          this.can_click=false;
          return;
        }
      }
      this.can_click=true;
    },
    sure(){
      if(!this.can_click){
        return
      }
      this.$store.commit('CHANGE_FEE', { 'fee': this.fee });//服务费
      this.$store.commit('CHANGE_REMARK', { 'remark': this.remark });//备注
      this.$store.commit('CHANGE_MONEY', { 'money': this.money });//充值金额
      this.$router.push('/transfer-accounts');
    }
  },
  components: {
    CHeader
  },
  mounted () {
    this.remark = this.$store.state.remittanceRemark;
    this.money = this.$store.state.remittance;
    this.fee = this.$store.state.fee;
    this.changeFee();
    // console.log(this.$store.state.remittance, this.$store.state.fee, this.$store.state.remittanceRemark)
  },
  destroyed () {
   
  }
}
</script>
<style scoped>
  .bg{
    background: #d9d9d9;
  }
  .transfer-info{
    height: 100%;
  }
  .content-body{
    top: 56px;
    bottom: 50px;
    text-align: left;
    /* padding: 0 10px; */
  }
  .transfer-info-header{
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
  .transfer-info-header .circle{
    width: 10px;
    height: 10px;
    border-radius: 50%;
    display: inline-block;
    margin-right: 5px;
    position: relative;
  }
  .transfer-info-header .circle::before{
    content: '';
    width: 16px;
    height: 16px;
    position: absolute;
    left: -3px;
    top: -3px;
    border-radius: 50%;
  }
  .transfer-info-header .circle:nth-of-type(1):before{
    background-color: rgba(255, 120, 123, .3);
  }
  .transfer-info-header .circle:nth-of-type(4):before{
    background-color: rgba(217, 217, 217, .3);
  }
  .transfer-info-header .circle:nth-of-type(4){
    margin-left: 10px;
  }
  .transfer-info-header span:nth-of-type(2) {
    margin-right: 10px;
  }
  .transfer-info-header .line{
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
  ul > li:nth-last-child(1) {
    border-bottom: none;
  }
  ul > li:nth-last-child(1) > input{
    text-align: left;
    left: 30px;
    font-size: 24px;
  }
  ul > li:nth-last-child(1) > input::-webkit-input-placeholder{
    text-align: left;
  }
   ul > li > input, ul > li > span{
    position: absolute;
    right: 0;
  }
  ul > li > input{
    height: 100%;
    border: none;
    text-align: right;
    min-width: 70%;
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
  ul > li.money > input::-webkit-input-placeholder{
    font-size: 24px;
  }

  .next-step{
    position: fixed;
    bottom: 0;
    height: 50px;
    width: 100%;
    line-height: 50px;
  }
  .read-tips{
    padding: 10px 0 10px 10px;
  }
</style>
