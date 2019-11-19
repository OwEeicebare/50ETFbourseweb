<template>
  <div class="recharge">
    <CHeader title="充值" backUrl="/mine" backBol="true" funBol="true" :elseSrc="theme ? '/static/images/black/icon_history.svg' : '/static/images/my/icon_history.svg'" directRoute="/recharge-records"></CHeader>
    <div class="content-body has-header main-bg">
      <div>
        <ul>
          <!-- <router-link tag="li" to="/cashierdesk" class="recharge-list cashier-desk normal-border-color">
            <p class="font28 normal-margin">收银台</p>
            <div class="main-text-color2 font24">扫码支付，秒冲到账，手续费千二</div>
            <img src="/static/images/home/arrow_right.svg" alt="">
          </router-link> -->
          <router-link tag="li" to="/transfer-accounts" class="recharge-list transfer-accounts normal-border-color">
            <p class="font28 normal-margin">银行转账</p>
            <div class="main-text-color2 font24">银行转账，免手续费</div>
            <img src="/static/images/home/arrow_right.svg" alt="" />
          </router-link>
          <router-link tag="li" to="/zfb-transferInfo" class="recharge-list cashier-desk normal-border-color" >
            <p class="font28 normal-margin">易支付</p>
            <div class="main-text-color2 font24">支持支付宝方式，秒到账</div>
            <img src="/static/images/home/arrow_right.svg" alt="" />
          </router-link>
        </ul>
      </div>
    </div>
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

    }
  },
  computed: {
    theme () {
      // console.log(localStorage.getItem('theme') != null ? JSON.parse(localStorage.getItem('theme')).theme : 0);
      return localStorage.getItem('theme') != null ? JSON.parse(localStorage.getItem('theme')).theme : 0;
    }
  },
  components: {
    CHeader
  },
  created(){
    // this.test()
  },
  methods:{
    // test(){
    //   this.$http.post(api.getPayType).then(res=>{
    //     console.log(res)
    //   })
    // }
  },
  mounted() {

  }
}
</script>
<style scoped>
  .recharge{
    height: 100%;
  }
  .recharge .content-body{
    text-align: left;
    top: 56px;
    padding: 0 10px;
  }
  .content-body > div{
    width: 100%;
    overflow-y: scroll;
    height: 100%;
  }
  .content-body > div::-webkit-scrollbar{
    display: none;
  }
  .content-body > div > ul > li{
    height: 68px;
    box-sizing: border-box;
    padding-left: 50px;
    background-repeat: no-repeat;
    background-position: left 10px;
    background-size: 40px auto;
  }
  .content-body .recharge-list{
    /* border-bottom: 1px solid #d9d9d9; */
    border-bottom-width: 1px;
    border-bottom-style: solid;
    position: relative;
  }
  .content-body .recharge-list > p{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    padding-top: 10px;
  }
  .content-body .recharge-list > div{
    max-width: 90%;
  }
  .content-body .recharge-list > img{
    width: 5px;
    height: 10px;
    position: absolute;
    right: 0;
    top: 50%;
    margin-top: -2.5px;
  }
  .cashier-desk{
    background-image: url('/static/images/my/icon_topup_thirdparty.svg');
  }
  .transfer-accounts{
    background-image: url('/static/images/my/icon_topup_unionpay.svg');
  }
</style>
