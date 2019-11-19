<template>
  <div class="transfer-success">
    <CHeader title="提现申请成功" backBol="true"></CHeader>
    <div class="content-body has-header main-bg">
      <SimpleState imgSrc="/static/images/market/img_success.svg"  message="提现申请成功，等待审核"></SimpleState>
      <div class="authentication-info font28">
        <ul class="normal-margin">
          <li class="normal-border-color">
            <span>收款账号</span>
            <span style="line-height: 25px; text-align: right;">{{splitAccount(withdrawInfo.AtInfo, 0)}}<br>{{splitAccount(withdrawInfo.AtInfo, 1)}}</span>
          </li>
          <li class="normal-border-color">
            <span>申请金额</span>
            <span>￥{{judgeHasPoint(withdrawInfo.Mpply) ? withdrawInfo.Mpply : withdrawInfo.Mpply ? (withdrawInfo.Mpply).toFixed(2) : withdrawInfo.Mpply}}</span>
          </li>
          <li class="normal-border-color">
            <span>服务费</span>
            <span>￥{{judgeHasPoint(withdrawInfo.MLost) ? withdrawInfo.MLost : withdrawInfo.MLost ? (withdrawInfo.MLost).toFixed(2) : withdrawInfo.MLost}}</span>
          </li>
          <li class="normal-border-color">
            <span>到账金额</span>
            <span>￥{{judgeHasPoint(withdrawInfo.MGet) ? withdrawInfo.MGet : withdrawInfo.MGet ? (withdrawInfo.MGet).toFixed(2) : withdrawInfo.MGet}}</span>
          </li>
        </ul>
        <div class="tips main-text-color2 font24">
          <p>工作日09:00-18:00提现的为T+1到账；非工作时间提现的为T+2到账。</p>
          <p>法定节假日的提现申请将在工作日处理</p>
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
      withdrawInfo: {}
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
    getInfo () {
      if (this.orderId) {
        this.$http({url: api.withdrawInfo, method: 'post', params: {ordId: this.orderId}}).then(res => {
          // console.log(res.data);
          if (res.data.Status === '1') {
            this.withdrawInfo = res.data.Data;
            this.judgeHasPoint(1);
          }
        })
      } else {
        this.$router.push('/');
      }
    },
    judgeHasPoint (num) {//判断是否有小数点
      let str = num + '';
      if (str.indexOf('.') === -1){
        return false;
      } else {
        return true;
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
    //获取提现申请信息
    this.getInfo();
  },
  mounted () {

  },
  destroyed () {
    this.$store.commit('SAVE_WITHDRAW_MONEY', '');
  }
}
</script>
<style scoped>
  .transfer-success{
    height: 100%;
  }
  .content-body{
    top: 54px;
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
