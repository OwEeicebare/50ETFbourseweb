<template>
  <div class="transfer-success">
    <CHeader title="支付宝转账" backBol="true" :backUrl="'mine'"></CHeader>
    <div class="content-body has-header main-bg">
      <SimpleState imgSrc="/static/images/market/img_success.svg"  message="充值成功" v-if="statu&&reques"></SimpleState>
      <SimpleState imgSrc="/static/images/my/file_img.svg"  message="充值失败" v-if="!statu&&reques"></SimpleState>
      <div class="authentication-info font28">
        <ul class="normal-margin" v-if="statu&&reques">
          <li class="normal-border-color">
            <span>充值金额</span>
            <span>{{Number(recharge).toFixed(2)}}</span>
          </li>
          <li class="normal-border-color">
            <span>服务费</span>
            <span>{{Number(fee).toFixed(2)}}</span>
          </li>
          <li class="normal-border-color">
            <span>到账金额</span>
            <span>{{Number(end).toFixed(2)}}</span>
          </li>
        </ul>
        <div class="white-color main-color1 sure" @click="backRecharge" v-if="reques">确定</div>
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
      recharge:0,
      fee:0,
      end:0,
      statu:true,//充值状态
      reques:false,//请求状态
    }
  },
  components: {
    CHeader,
    SimpleState
  },
  created() {
    this.getInfo()
  },
  destroyed(){
      window.localStorage.removeItem("recharge");
  },
  methods: {
    backRecharge () {
      this.$router.push('/mine');
    },
    getInfo(){//获取充值信息
        var obj = JSON.parse(window.localStorage.getItem("recharge"));
        this.$http.post(api.zfbEnd,{fxddh:obj.orderId,fxpay:obj.type}).then(res=>{
            if(res.data.Status==1){
                this.recharge=res.data.Data.fxfee;
                this.fee=res.data.Data.fwf;
                this.end=res.data.Data.dzje;
                this.statu=true;
            }else{
                this.statu=false
            }
            this.reques=true;
        })
    } 
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
