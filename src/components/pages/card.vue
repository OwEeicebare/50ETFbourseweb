<template>
  <div class="card">
    <CHeader title="绑定银行卡" backBol="true" backUrl="/bank-card"></CHeader>
    <div class="content-body has-header main-bg">
      <div class="authentication-info font28">
        <ul>
          <li class="normal-border-color">
            <span>持卡人姓名</span>
            <span>{{bankInfo.BankAccountName}}</span>
          </li>
          <li class="normal-border-color">
            <span>身份证号</span>
            <!-- idHidden(bankInfo.IdCard) -->
            <span>{{bankInfo.IdCard}}</span>
          </li>
          <li class="normal-border-color">
            <span>开户银行</span>
            <span>{{bankInfo.BankName}}</span>
          </li>
          <li class="normal-border-color">
            <span>开户地区</span>
            <span>{{bankInfo.BankAddress}}</span>
          </li>
          <li class="normal-border-color">
            <span>开户支行</span>
            <span>{{bankInfo.BankBranch}}</span>
          </li>
          <li class="normal-border-color">
            <span>银行卡号</span>
            <span>{{bankInfo.BankCard ? numSeparate(bankInfo.BankCard) : ''}}</span>
          </li>
          <li class="normal-border-color">
            <span>银行卡预留手机号</span>
            <span>{{bankInfo.MobilePhone}}</span>
          </li>
          <li>
            <span>设为默认</span>
            <span class="set-default-card"><mt-switch v-model="cardDefault" @change="changeValue"></mt-switch></span>
          </li>
        </ul>
        <div class="separate assist-color3"></div>
        <div class="unbind">
          <div class="rise-color font28 normal-border-color" @click="unbind">解除绑定</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import api from '@/api'
import CHeader from '@/components/common/IHeader.vue'
export default {
  data () {
    return {
      cardDefault: false,
      bankInfo: {}
    }
  },
  components: {
    CHeader
  },
  computed: {
    id () {
      return this.$route.query.id;
    }
  },
  methods: {
    getBankInfo () {
      if (this.id) {
        this.$http({url: api.userBankInfo, method: 'post', params: {Id: this.id}}).then(res => {
          // console.log('银行卡信息', res.data);
          if (res.data.Status === '1') {
            this.bankInfo = res.data.Data;
            this.cardDefault = res.data.Data.sor === 0 ? false : true;
          }
        })
      } else {
        this.$router.push('/');
      }
    },
    idHidden (idCard) {//身份证号码中间隐藏
      if (idCard.length > 8) {
        return idCard.substring(0, 4) + ('*').repeat(idCard.length - 8) + idCard.substring(idCard.length - 4,idCard.length);
      }
      return idCard;
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
    },
    unbind () {
      this.$http({url: api.userBankDel, method: 'post', params: {Id: this.id}}).then(res => {
        // console.log(res.data);
        if (res.data.Status === '1') {
          this.$toast({
            message: '解绑成功',
            position: 'bottom'
          })
          this.$router.push('/bank-card');
        } else {
          this.$toast({
            message: res.data.Msg,
            position: 'bottom'
          })
        }
      })
    },
    changeValue (e) {
      // console.log('change switch' ,e);
      // if (!e) {
        this.$http({url: api.setDefaultBank, method: 'post', params: {Id: this.id}}).then(res => {
          // console.log('设置银行卡为默认', res);
          if (res.data.Status === '1') {
            let str = !e ? '设为默认成功' : '取消默认成功'
            this.$toast({
              message: str,
              position: 'bottom'
            })
          } else {
            this.$toast({
              message: res.data.Msg,
              position: 'bottom'
            })
          }
        })
      // }
    }
  },
  created () {
    // 获取银行卡数据
    this.getBankInfo();
  },
  mounted () {

  }
}
</script>
<style scoped>
  .card{
    height: 100%;
  }
  .card .content-body{
    top: 56px;
    text-align: left;
  }
  .card .authentication-info > ul{
    padding: 0 10px;
  }
  .card .authentication-info ul > li{
    height: 50px;
    line-height: 50px;
    /* border-bottom: 1px solid #d9d9d9; */
    border-bottom-width: 1px;
    border-bottom-style: solid;
    overflow: hidden;
  }
  .card .authentication-info ul > li:nth-last-child(1) {
    border: none;
  }
  .card .authentication-info ul > li > span:nth-child(1) {
    float: left;
  }
  .card .authentication-info ul > li > span:nth-child(2) {
    float: right;
  }
  .card .separate{
    height: 12px;
    width: 100%;
  }
  .card .unbind{
    padding: 0 10px;
    height: 50px;
    line-height: 50px;
  }
  .card .unbind > div{
    /* border-bottom: 1px solid #d9d9d9; */
    border-bottom-width: 1px;
    border-bottom-style: solid;
  }
  .card .set-default-card{
    margin-top: 13px;
  }
</style>
