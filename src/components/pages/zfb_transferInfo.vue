<template>
  <div class="transfer-info">
    <CHeader title="支付宝转账" :backBol="true" :funBol="false" :backUrl="'recharge'" :elseSrc="theme ? '/static/images/black/icon_help.svg' : '/static/images/my/icon_help.svg'" directRoute="/questions"></CHeader>
    <div class="content-body has-header main-bg">
      <ul class="font28">
        <li style="border: none;" class="normal-border-color">充值金额<span class="main-text-color2">服务费：￥{{Number(fee).toFixed(2)}}</span></li>
        <li class="normal-border-color money">￥<input type="text" placeholder="0.00" v-model="money"  class="main-bg main-text-color1"></li>
      </ul>
      <p class="font24 assist-color3 main-text-color2 read-tips">到账金额￥{{remmitMoney}}</p>
    </div>
    <div class="" :class="{'white-color':true,'font32':true,'next-step':true,'main-color1':can_click,'bg':!can_click
    }" @click="sure">确定</div>
  </div>
</template>
<script>
import api from '@/api'
import $axios from 'axios';
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
      can_click:false,
      type:"'zfbwap'",//支付类型用于查询接口
      type1:'zfbwap',//支付类型用于支付接口
      payObj:'',//手续费等相关信息
      remark: '',
      money: '',
    }
  },
  computed: {
    fee(){//手续费
        if(this.payObj){
            var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/; 
            if (this.money || reg.test(this.money)||this.money<99999999.99) {
                 return this.money * (this.payObj.MpRate/100) > this.payObj.MpMinre ? this.money * (this.payObj.MpRate/100) : this.payObj.MpMinre;
            }
        }
        return 0;
    },
    remmitMoney () {//到账金额
      var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
      //有充值金额，格式正确
      if (this.money && reg.test(this.money)) {
        var endmoney = Number(this.money-this.fee).toFixed(2);
        //到账金额大于0
        if(endmoney>0){
            this.can_click=true;
        }else{
            this.can_click=false;  
        }
        return endmoney;
      } else {
        this.can_click=false;
        return '0.00'
      }
    },
    theme () {
      return localStorage.getItem('theme') != null ? JSON.parse(localStorage.getItem('theme')).theme : 0;
    }
  },
  methods: {
    getFee(){//获取支付类型手续费
        this.$http.post(api.getFee,this.type).then(res=>{
            if(res.data.Status==1){
                this.payObj=res.data.Data//最低手续费
            }else{
                 this.$toast({
                    position: 'bottom',
                    message:"加载失败",
                    duration: 1000
                })
                this.$router.push('/recharge');
            }
            // console.log(this.payObj)
        })
    },
    setOrder(obj){//存储订单号到本地
      let orders = window.localStorage.getItem('RECHAREORDER');
      let end = [];
      if(orders!=null){
        end = JSON.parse(orders);
      }
      end.push(obj);
      window.localStorage.setItem('RECHAREORDER',JSON.stringify(end));
    },
    sure(){
        if(this.remmitMoney<0){
            this.$toast({
                position: 'bottom',
                message:"到账金额不能为负数",
                duration: 1000
            })
            return;
        }
        if(this.money<this.payObj.MpPaid){
            this.$toast({
                position: 'bottom',
                message:"单次充值金额必须大于"+this.payObj.MpPaid,
                duration: 1000
            })
            return;
        }
        if(!this.can_click){
            return
        }
        this.$http.post(api.zfbPay,{fxfee:this.money,fxpay:this.type1,url:"http://"+location.host+"/#/zfb-transferSuccess"}).then(res=>{
            if(res.data.Status==1){
                var obj={
                    recharge:this.money,//充值金额
                    end:this.remmitMoney,//到账金额
                    fee:this.fee,//手续费
                    orderId:res.data.Data.fxddh,//商户订单号
                    type:"zfbwap"
                };
                window.localStorage.setItem("recharge",JSON.stringify(obj));
                //将订单存到本地，用于轮询
                this.setOrder({order:res.data.Data.fxddh,time:res.data.Data.nowtime});
                window.location.href=res.data.Data.payurl
            }else{
                this.$toast({
                    position: 'bottom',
                    message:res.data.Msg,
                    duration: 2000
                })
            }
        })
    }
  },
  created(){
    this.getFee();
  },
  components: {
    CHeader
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
