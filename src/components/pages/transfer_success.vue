<template>
  <div class="transfer-success">
    <CHeader title="银行汇款" backBol="true"></CHeader>
    <div class="content-body has-header main-bg">
      <SimpleState imgSrc="/static/images/market/img_success.svg"  message="提交成功，等待审核"></SimpleState>
      <div class="authentication-info font28">
        <ul class="normal-margin">
          <li class="normal-border-color">
            <span>充值金额</span>
            <span>{{rechargeInfo.Mpply ? '￥' + (judgePoint(rechargeInfo.Mpply) ? (rechargeInfo.Mpply).toFixed(2) : (rechargeInfo.Mpply).toFixed(2)) : '无'}}</span>
          </li>
          <li class="normal-border-color">
            <span>服务费</span>
            <span>{{rechargeInfo.Mpply ? '￥' + (judgePoint(rechargeInfo.MLost) ? (rechargeInfo.MLost).toFixed(2) : (rechargeInfo.MLost).toFixed(2)) : '无'}}</span>
          </li>
          <li class="normal-border-color">
            <span>到账金额</span>
            <span>{{rechargeInfo.Mpply ? '￥' + (judgePoint(rechargeInfo.MGet) ? (rechargeInfo.MGet).toFixed(2) : (rechargeInfo.MGet).toFixed(2)) : '无'}}</span>
          </li>
        </ul>
        <div class="tips main-text-color2 font24">
          <p>到账时间：</p>
          <p>08:30-17:30（确认之后10分钟内到账），17:30以后（次日09:30前到账）</p>
          <!-- <p>加急，请电话联系客服123456789</p> -->
        </div>
        <div class="white-color main-color1 sure" @click="backRecharge">确定</div>
      </div>
    </div>
  </div>
</template>
<script>
import api from '@/api'
import CHeader from '@/components/common/IHeader.vue'
import SimpleState from '@/components/common/SimpleState.vue'
export default {
  data () {
    return {
      rechargeInfo: {}
    }
  },
  components: {
    CHeader,
    SimpleState
  },
  computed: {
    orderId () {
      return this.$route.query.orderId;
    }
  },
  methods: {
    backRecharge () {
      this.$router.push('/mine');
    },
    getRemitInfo () {
      if (this.orderId) {
        this.$http({url: api.rechargeInfo, method: 'post', params: {'ordId': this.orderId}}).then(res => {
          // console.log(res.data);
          if (res.data.Status === '1') {
            this.rechargeInfo = res.data.Data;
          }
        })
      } else {
        this.$router.push('/');
      }
    },
    judgePoint (num) {//判断是否有小数点
      let str = num + '';
      if (str.indexOf('.') === -1) {
        return false;
      } else {
        return true;
      }
    }
  },
  created () {
    //获取汇款信息
    this.getRemitInfo();
  },
  mounted () {

  },
  destroyed () {
    //重置银行汇款
    this.$store.commit('CHANGE_SCREENSHOT', '');
    this.$store.commit('CHANGE_FEE', { 'fee':0});//服务费
    this.$store.commit('CHANGE_REMARK', { 'remark': '' });
    this.$store.commit('CHANGE_MONEY', { 'money': '' });
    this.$store.commit('CHANGE_UPLOADSCREEN', '');
    sessionStorage.removeItem('account');
  }
}
</script>
<style scoped>
  .transfer-success{
    height: 100%;
  }
  .content-body{
    top: 56px;
  }
  .authentication-info{
    width: 325px;
    margin: 40px auto 0;
  }
  .authentication-info ul > li{
    height: 50px;
    line-height: 50px;
    /* border-bottom: 1px solid #d9d9d9; */
    border-bottom-width: 1px;
    border-bottom-style: solid;
    overflow: auto;
  }
  .authentication-info ul > li > span:nth-child(1) {
    float: left;
  }
  .authentication-info ul > li > span:nth-child(2) {
    float: right;
  }
  .sure{
    padding: 10px 0;
    border-radius: 4px;
    margin-top: 20px;
    letter-spacing: 4px;
  }
  .tips{
    text-align: left;
    line-height: 18px;
  }
</style>
