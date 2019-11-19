<template>
  <div class="withdraw">
    <CHeader
      title="提现"
      backBol="true"
      backUrl="/mine"
      funBol="true"
      :elseSrc="theme ? '/static/images/black/icon_top_more.svg' : '/static/images/my/icon_top_more.svg'"
      :listData="listData"
    ></CHeader>
    <div class="content-body has-header">
      <div class="main-bg normal-margin font28">
        <router-link
          tag="div"
          v-if="judgeEmptyObj(defaultCard)"
          :to="{path: '/bank-card',  query: {type: 'withdraw'}}"
          :class="{'has-card':true, 'has-default-card': defaultCard.sort === 1}"
          :style="{'backgroundImage': 'url(' + (defaultCard.Log ? defaultCard.Log : '/static/images/my/g.svg') + '), url(/static/images/home/arrow_right.svg)'}"
        >
          <p>{{defaultCard.BkName}}</p>
          <p>{{defaultCard.BkCard}}</p>
        </router-link>
        <router-link
          v-else
          tag="div"
          :to="{path: '/bank-card', query: {type: 'withdraw'}}"
          class="no-card"
        >
          <p>请绑定银行卡</p>
          <p class="main-text-color2 font24">以便提现到你的银行卡上</p>
        </router-link>
      </div>
      <ul class="font28 main-bg">
        <li style="border: none;">
          汇款金额
          <span class="right main-text-color2">服务费：￥{{fee.toFixed(2)}}</span>
        </li>
        <li class="normal-border-color">
          ￥
          <input
            type="text"
            placeholder="0.00"
            v-model="money"
            @input="limitMoney"
            ref="money"
            class="main-bg main-text-color1"
          />
        </li>
        <li style="height: 40px; line-height: 40px;" class="font24">
          可提现余额：
          <span>{{Balance ? subMoney(Balance) : '0.00'}}元</span>
          <span class="right copy-color" @click="withdrawAll">全部提现</span>
        </li>
      </ul>
      <p class="font24 assist-color3 main-text-color2 read-tips" style="line-height:25px">
        {{tipInfo}}
        <br />
        到账金额￥{{arriveMoney.toFixed(2)}}
      </p>
    </div>
    <div
      :class="{'next-step': true, 'font32': true, 'white-color': true, 'main-color1': btnAble, 'line-color': !btnAble}"
      @click="backUp"
    >下一步</div>
  </div>
</template>
<script>
import api from "@/api";
import $axios from 'axios';
import CHeader from "@/components/common/IHeader.vue";
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
  data() {
    return {
      tipInfo: "",
      money: "",
      listData: [
        {
          id: 1,
          children: [
            {
              id: 1,
              title: "常见问题",
              to: "/questions",
              type: "withdraw"
            },
            {
              id: 2,
              title: "提现记录",
              to: "/withdraw-records",
              type: "withdraw"
            }
          ]
        }
      ],
      fee: 0,
      feeRate: 0, //手续费率
      feeLow: 0, //最低手续费
      upMoney: 0, //最大提现额度
      lowMoney: 0, //最小提现额度
      Balance: 0,
      fromId: 0, // 服务费id
      btnDisable: false //禁用按钮(频繁点击)
    };
  },
  computed: {
    btnAble() {
      var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
      if (
        this.judgeEmptyObj(this.defaultCard) &&
        reg.test(this.money) &&
        this.lowMoney - this.money <= 0 &&
        this.money <= this.Balance
      ) {
        return true;
      } else {
        return false;
      }
    },
    defaultCard() {
      // console.log('withdraw', this.$store.state.defaultCard);

      return this.$store.state.defaultCard;
    },
    arriveMoney() {
      var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
      if (reg.test(this.money)) {
        return this.money - this.fee;
      } else {
        return 0;
      }
    },
    theme() {
      // console.log(localStorage.getItem('theme') != null ? JSON.parse(localStorage.getItem('theme')).theme : 0);
      return localStorage.getItem("theme") != null
        ? JSON.parse(localStorage.getItem("theme")).theme
        : 0;
    }
  },
  methods: {
    init() {
      var user = JSON.parse(localStorage.getItem("login"));
      this.$http.post(api.mineInfo).then(res => {
        if (res.data.Status == 1) {
          var result = res.data.Data;
          this.Balance = result.Balance;
        }
      });
    },
    backUp() {
      // console.log(this.Balance, this.money, this.money > this.Balance);
      if (this.money > this.upMoney) {
        // console.log('输入大于可提现余额');
        this.$toast({
          message: "输入金额超出最大提现额度",
          position: "bottom"
        });
        return;
      } else if (this.money < this.lowMoney) {
        this.$toast({
          message: "输入金额小于最小提现额度",
          position: "bottom"
        });
        return;
      }
      if (this.money > this.Balance) {
        this.$toast({
          message: "输入金额超出可提现余额",
          position: "bottom"
        });
        return;
      }
      if (this.btnAble && !this.btnDisable) {
        this.btnDisable = true;
        this.$http
          .post(api.withdraw, {
            MApply: Number(this.money),
            MLost: this.fee,
            MGet: this.money - this.fee,
            Rark: "",
            UsebandId: this.defaultCard.Id,
            fromId: Number(this.fromId)
          })
          .then(res => {
            // console.log('申请提现', res.data);
            this.money = "";
            if (res.data.Status === "1") {
              this.$router.push({
                path: "/withdraw-success",
                query: { orderId: res.data.Data }
              });
              return;
            } else {
              this.$toast({
                message: res.data.Msg,
                position: "bottom"
              });
            }
          });
      } else {
        return;
      }
    },
    withdrawAll() {
      //全部提现
      // if (this.Balance < this.upMoney && this.Balance > this.lowMoney) {
      //   this.money = this.Balance;
      // } else if (this.Balance > this.upMoney){
      //   this.$toast({
      //     message: '超出最大提现额度',
      //     position: 'bottom'
      //   })
      //   this.money = this.upMoney;
      // } else if (this.Balance < this.lowMoney) {
      //   this.$toast({
      //     message: '小于最小提现额度',
      //     position: 'bottom'
      //   })
      //   this.money = this.lowMoney;
      // }
      if (this.Balance == 0) {
        this.money = "";
      } else {
        this.money = this.Balance;
      }
      this.fee = this.money
        ? this.money * this.feeRate > this.feeLow
          ? this.money * this.feeRate
          : this.feeLow
        : this.feeLow;
    },
    judgeEmptyObj(obj) {
      //判断对象是否为空
      for (let item in obj) {
        return true;
      }
      return false;
    },
    limitMoney() {
      //限制输入金额不能大于可提现余额
      var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
      if (!reg.test(this.money)) {
        return;
      }
      this.fee = this.money
        ? this.money * this.feeRate > this.feeLow
          ? this.money * this.feeRate
          : this.feeLow
        : this.feeLow;
    },
    getFee() {
      //获取服务费信息
      this.$http.post(api.withFee).then(res => {
        // console.log('获取服务费信息', res);
        if (res.data.Status === "1") {
          this.feeRate = res.data.Data.MpRate; //手续费率
          this.feeLow = res.data.Data.MpPoundage; //最低手续费
          this.upMoney = res.data.Data.MpMaxQu; //最大提现额度
          this.lowMoney = res.data.Data.MpMinQu; //最小提现额度
          this.tipInfo = res.data.Data.Remark; //提示信息
          this.fee = this.money
            ? this.money * this.feeRate > this.feeLow
              ? this.money * this.feeRate
              : this.feeLow
            : this.feeLow;
          this.fromId = res.data.Data.bankId;
        }
      });
    },
    subMoney(money) {
      //处理资产金额小数点后两位
      var mStr = money + "";
      var mArr = mStr.split(".");
      var pointStr = "";
      if (mArr.length === 1) {
        return money + ".00";
      } else {
        if (mArr[1].length === 1) {
          pointStr = mArr[1] + "0";
        } else {
          pointStr = mArr[1].substring(0, 2);
        }
      }
      return mArr[0] + "." + pointStr;
    }
  },
  components: {
    CHeader
  },
  created() {
    if (!this.defaultCard) {
      this.$store.dispatch("get_card_list");
    }
    this.getFee();
    this.init();
  },
  mounted() {
    this.money = this.$store.state.widthdraw;
  },
  destroyed() {
    // this.$store.commit('CHANGE_REMARK', { 'remark': this.remark });
    this.$store.commit("SAVE_WITHDRAW_MONEY", this.money);
  }
};
</script>
<style scoped>
.withdraw {
  height: 100%;
}
.content-body {
  top: 56px;
  bottom: 50px;
  text-align: left;
  /* padding: 0 10px; */
}
.content-body > div:nth-child(1) {
  padding: 15px 10px;
}
.withdraw-header {
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
.back {
  left: 0;
  position: absolute;
  height: 20px;
  top: 2px;
  cursor: pointer;
  padding: 10px;
}
.withdraw-header .circle {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 5px;
  position: relative;
}
.withdraw-header .circle::before {
  content: "";
  width: 16px;
  height: 16px;
  position: absolute;
  left: -3px;
  top: -3px;
  border-radius: 50%;
}
.withdraw-header .circle:nth-of-type(1):before {
  background-color: rgba(255, 120, 123, 0.3);
}
.withdraw-header .circle:nth-of-type(4):before {
  background-color: rgba(217, 217, 217, 0.3);
}
.withdraw-header .circle:nth-of-type(4) {
  margin-left: 10px;
}
.withdraw-header span:nth-of-type(2) {
  margin-right: 10px;
}
.withdraw-header .line {
  width: 50px;
  height: 1px;
  display: inline-block;
  vertical-align: middle;
}
ul {
  padding: 0 10px;
}
ul > li {
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
ul > li:nth-child(2) > input {
  text-align: left;
  left: 30px;
  font-size: 24px;
  height: 48px;
}
ul > li:nth-child(2) > input::-webkit-input-placeholder {
  text-align: left;
}
ul > li > input,
ul > li > span.right {
  position: absolute;
  right: 0;
}
ul > li > input {
  height: 100%;
  border: none;
  text-align: right;
  min-width: 60%;
}
ul > li > input:-moz-placeholder {
  text-align: right;
  font-size: 24px;
}
ul > li > input:-ms-input-placeholder {
  text-align: right;
  font-size: 24px;
}
ul > li > input::-webkit-input-placeholder {
  text-align: right;
  font-size: 24px;
}
.next-step {
  position: fixed;
  bottom: 0;
  height: 50px;
  width: 100%;
  line-height: 50px;
}
.read-tips {
  padding: 10px 0 10px 10px;
}
.has-card {
  background-repeat: no-repeat;
  background-size: 30px, 6px auto;
  padding-left: 40px;
  background-position: left top, right center;
}
.has-card > p:nth-child(1),
.no-card > p:nth-child(1) {
  margin-bottom: 5px;
  display: inline-block;
  position: relative;
}
.has-default-card > p:nth-child(1)::after {
  content: "默认";
  color: #fff;
  font-size: 12px;
  position: absolute;
  background-color: #3aaaff;
  text-align: center;
  width: 24px;
  padding: 0 3px;
  border-radius: 2px;
  top: 2px;
  right: -35px;
}
.no-card {
  background: url("/static/images/home/arrow_right.svg") no-repeat right center;
  background-size: 6px auto;
}
</style>
