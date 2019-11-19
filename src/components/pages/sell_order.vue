<template>
  <div class="sell-order">
    <CHeader title="委托" backBol="true" :backUrl="backUrl"></CHeader>
    <div class="content-body has-header main-bg font28">
      <div>
        <SimpleState imgSrc="/static/images/market/img_success.svg"  message="委托提交成功"></SimpleState>
          <div class="main-color1 white-color quick-back normal-margin" @click="hand">快捷反手</div>
          <div class="main-text-color2 font24">快捷反手：卖出平仓后快速反手买入开仓</div>
        <div class="back-btns tab-active-color">
          <router-link tag="div" to="/market">返回看行情</router-link>
          <router-link tag="div" to="/deal">返回看交易</router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import CHeader from '@/components/common/IHeader.vue'
import SimpleState from '@/components/common/SimpleState.vue'
import Api from '@/api'
export default {
  data () {
    return {
    }
  },
  components: {
    CHeader,
    SimpleState
  },
  computed: {
    backUrl () {
      if (this.$route.query.type === 'closeOut') {
        // 来源一键平仓
        return '/close-out'
      }
      // else if (this.$route.query.type === 'forgetPass') {
      //   // 重置密码 入口为忘记密码
      //   return '/login';
      // }
      return '/market'
    },
    sell_code(){
      return this.$route.query.contract;
    }
  },
  methods:{
    hand(){
      this.$http.post(Api.oneCross,this.sell_code).then(res=>{
        if(res.data.Status==="1"){
          this.$router.push({path: '/buy', query: {code: res.data.Data[0],type:"quick"}})
        }
      })
    }
  },
  mounted () {

  }
}
</script>
<style scoped>
  .sell-order{
    height: 100%;
  }
  .content-body{
    border-top: 1px solid #ebebeb;
    box-sizing: border-box;
  }
  .content-body > div{
    position: relative;
    width: 325px;
    margin: 0 auto;
    height: 100%;
  }
  .back-btns, .quick-back{
    width: 100%;
    /* overflow: auto; */
    border-radius: 4px;
  }
  .back-btns{
    position: absolute;
    bottom: 40px;
  }
  .quick-back{
    height: 40px;
    line-height: 40px;
    margin: 50px auto 10px;
  }
  .back-btns > div{
    width: 152.5px;
    border: 1px solid #ff787b;
    border-radius: 4px;
    height: 40px;
    line-height: 40px;
    box-sizing: border-box;
  }
  .back-btns > div:nth-child(1) {
    float: left;
  }
  .back-btns > div:nth-child(2) {
    float: right;
  }
</style>
