<template>
  <div class="order-success">
    <CHeader title="委托" backBol="true" :backUrl="backUrl"></CHeader>
    <div class="content-body has-header main-bg">
      <SimpleState imgSrc="/static/images/market/img_success.svg"  message="委托提交成功"></SimpleState>
      <div class="back-btns tab-active-color">
        <router-link tag="div" to="/market">返回看行情</router-link>
        <router-link tag="div" to="/deal">返回看交易</router-link>
      </div>
    </div>
  </div>
</template>
<script>
import CHeader from '@/components/common/IHeader.vue'
import SimpleState from '@/components/common/SimpleState.vue'
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
    }
  },
  mounted () {

  }
}
</script>
<style scoped>
  .order-success{
    height: 100%;
  }
  .content-body{
    border-top: 1px solid #ebebeb;
  }
  .back-btns{
    width: 325px;
    margin: 50px auto 0;
    overflow: auto;
  }
  .back-btns > div{
    box-sizing: border-box;
    width: 152.5px;
    border: 1px solid #ff787b;
    height: 40px;
    line-height: 40px;
    border-radius: 4px;
  }
  .back-btns > div:nth-child(1) {
    float: left;
  }
  .back-btns > div:nth-child(2) {
    float: right;
  }
</style>
