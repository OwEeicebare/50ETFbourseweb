<template>
    <div class="recharge-details">
      <CHeader title="充值详情" backBol="true"></CHeader>
      <div class="content-body has-header main-bg font28">
        <div class="recharge-state">充值<span class="state">({{dInfo.strName}})</span><span class="money">{{judgeEmptyObj(dInfo) ? subMoney(dInfo.bann) : '0.00'}}元</span></div>
        <div class="line assist-color3"></div>
        <ul>
          <li class="main-text-color2">申请时间<span class="state main-text-color1">{{judgeEmptyObj(dInfo) ? dInfo.time : ''}}</span></li>
          <li class="main-text-color2">订<span class="hidden">a</span>单<span class="hidden">a</span>号<span class="state main-text-color1">{{judgeEmptyObj(dInfo) ? dInfo.Order : ''}}</span></li>
          <li class="main-text-color2">充值金额<span class="state main-text-color1">{{judgeEmptyObj(dInfo) ? subMoney(dInfo.bann) : '0.00'}}元</span></li>
          <li class="main-text-color2">服<span class="hidden">a</span>务<span class="hidden">a</span>费<span class="state main-text-color1">{{judgeEmptyObj(dInfo) ? subMoney(dInfo.Serge) : '0.00'}}元</span></li>
          <li class="main-text-color2">到账金额<span class="state main-text-color1">{{judgeEmptyObj(dInfo) ? subMoney(dInfo.Amble) : '0.00'}}元</span></li>
          <li class="main-text-color2">支付渠道<span class="state main-text-color1">{{judgeEmptyObj(dInfo) ? dInfo.channel : ''}}</span></li>
          <li class="main-text-color2">审核时间<span class="state main-text-color1">{{judgeEmptyObj(dInfo)&&dInfo.strName!="待审核" ? dInfo.autTimae : '- -'}}</span></li>
          <li class="main-text-color2">充值状态<span class="state main-text-color1">{{dInfo.strName}}</span></li>
        </ul>
      </div>
    </div>
</template>
<script>
import api from '@/api'
import CHeader from '@/components/common/IHeader.vue'
export default {
  data () {
    return {
      dInfo: {}, //充值详情
    }
  },
  components: {
    CHeader
  },
  computed: {
    id () {
      return this.$route.query.id
    }
  },
  methods: {
    getDetails () {//充值详情
      this.$http({url: api.recordDetail, method: 'post', params: {id: this.id}}).then(res => {
        // console.log('充值详情', res);
        if (res.data.Status === '1') {
          this.dInfo = res.data.Data;
        } else {
          this.$toast({
            message: res.data.Msg,
            position: 'bottom'
          })
        }
      })
    },
    subMoney (money) {//处理资产金额小数点后两位
      var mStr = money + '';
      var mArr = mStr.split(".");
      var pointStr = '';
      if (mArr.length === 1) {
        return money + '.00'
      } else{
        if (mArr[1].length === 1) {
          pointStr = mArr[1] + '0';
        } else {
          pointStr = mArr[1].substring(0, 2);
        }
      }
      return mArr[0] + '.' + pointStr;
    },
    judgeEmptyObj (obj) {
      for (let item in obj) {
        return true
      }
      return false
     }
  },
  created () {
    this.getDetails();
  }
}
</script>
<style scoped>
  .content-body{
    top: 56px;
    text-align: left;
  }
  .revocation{
    position: fixed;
    bottom: 0;
    height: 50px;
    width: 100%;
    line-height: 50px;
  }
  .recharge-state{
    padding: 20px 10px;
    overflow: auto;
  }
  .line{
    height: 12px;
  }
  ul{
    padding: 0 10px;
  }
  ul > li{
    padding: 10px 0;
  }
  ul > li > span.state, .recharge-state > span.state{
    margin-left: 10px;
  }
  .recharge-state > span.money{
    float: right;
  }
</style>
