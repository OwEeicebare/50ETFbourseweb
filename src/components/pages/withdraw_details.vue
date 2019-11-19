<template>
    <div class="withdraw-details">
      <CHeader title="提现详情" backBol="true"></CHeader>
      <div class="content-body has-header main-bg font28">
        <div class="withdraw-state">提现<span class="state">({{dInfo.strName}})</span><span class="money">{{judgeEmptyObj(dInfo) ? subMoney(dInfo.bann) : '0.00'}}元</span></div>
        <div class="line assist-color3"></div>
        <ul>
          <li class="main-text-color2">申请时间<span class="state main-text-color1">{{judgeEmptyObj(dInfo) ? dInfo.time : ''}}</span></li>
          <li class="main-text-color2">订<span class="hidden">a</span>单<span class="hidden">a</span>号<span class="state main-text-color1">{{judgeEmptyObj(dInfo) ? dInfo.Order : ''}}</span></li>
          <li class="main-text-color2">申请金额<span class="state main-text-color1">{{judgeEmptyObj(dInfo) ? subMoney(dInfo.bann) : '0.00'}}元</span></li>
          <li class="main-text-color2">服<span class="hidden">a</span>务<span class="hidden">a</span>费<span class="state main-text-color1">{{judgeEmptyObj(dInfo) ? subMoney(dInfo.Serge) : '0.00'}}元</span></li>
          <li class="main-text-color2">到账金额<span class="state main-text-color1">{{judgeEmptyObj(dInfo) ? subMoney(dInfo.Amble) : '0.00'}}元</span></li>
          <li class="main-text-color2">收款账号<span class="state main-text-color1">{{splitAccount(dInfo.account, 0)}}</span></li>
          <li class="main-text-color2"><span class="hidden">收款账号</span><span class="state main-text-color1">{{splitAccount(dInfo.account, 1)}}</span></li>
          <li class="main-text-color2">持<span class="hidden">a</span>卡<span class="hidden">a</span>人<span class="state main-text-color1">{{dInfo.Name}}</span></li>
          <li class="main-text-color2">审核时间<span class="state main-text-color1">{{ judgeEmptyObj(dInfo)&&dInfo.str != 1 ? dInfo.autTimae : '- -'}}</span></li>
          <li class="main-text-color2">处理状态<span class="state main-text-color1">{{dInfo.strName}}</span></li>
        </ul>
      </div>
      <div :class="{'revocation': true, 'font32': true, 'white-color': true,'line-color': dInfo.str != 1, 'main-color1': dInfo.str == 1 }" @click="repeal" v-if="dInfo.str == 1">撤销提现申请</div>
    </div>
</template>
<script>
import api from '@/api'
import CHeader from '@/components/common/IHeader.vue'
export default {
  data () {
    return {
      dInfo: {}
    }
  },
  components: {
    CHeader
  },
  computed: {
    btnEnable () {
      var state = this.state;
      if (state === 2){
        return true;
      } else {
        return false;
      }
    },
    id () {
      return this.$route.query.id
    }
  },
  methods: {
    getDetails () {//提现详情
      this.$http({url: api.withDetail, method: 'post', params: {id: this.id}}).then(res => {
        // console.log('提现详情', res);
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
     },
    repeal () {//撤销提现
      if (this.dInfo.str == 1) {
        this.$http({url: api.repealWith, params: {id: this.id}, method: 'post'}).then(res => {
          if (res.data.Status === '1') {
            this.getDetails();
          }
          this.$toast({
            message: res.data.Msg,
            position: 'bottom'
          })
        })
      } else {
        return;
      }
    },
    splitAccount (account, type) {
      if (account) {
        let accountArr = account.split(' ');
        if (type == 0) {//银行卡名
          return accountArr[0];
        } else {//银行卡号
          return this.numSeparate(accountArr[1]);
        }
      }
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
    }
  },
  created () {
    this.getDetails();
  }
}
</script>
<style scoped>
  .content-body{
    top: 54px;
    bottom: 50px;
    text-align: left;
  }
  .revocation{
    position: fixed;
    bottom: 0;
    height: 50px;
    width: 100%;
    line-height: 50px;
  }
  .withdraw-state{
    padding: 20px 10px;
    overflow: auto;
  }
  .line{
    height: 10px;
  }
  ul{
    padding: 0 10px;
  }
  ul > li{
    padding: 10px 0;
  }
  ul > li > span.state, .withdraw-state > span.state{
    margin-left: 10px;
  }
  .withdraw-state > span.money{
    float: right;
  }
</style>
