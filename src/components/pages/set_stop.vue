<template>
  <div class="set-stop">
    <CHeader title="止盈止损" backBol="true" backUrl="/mine"></CHeader>
    <div class="content-body has-header font28">
      <!-- <div class="normal-padding assist-color1 font24 rise-color normal-margin">止损止盈幅度设置后一旦修改，则当前所有开启此功能的合约幅度一同修改，请谨慎操作</div> -->
      <router-link tag="div" :to="{path: '/set-drop', query: {type: 'drop',param:zs}}"  class="strategy main-bg normal-margin">
        <span>止损策略</span>
        <span>跌幅超过<span class="fiexd_width">{{zs | toRetain(2)}}%</span></span>
      </router-link>
      <router-link tag="div" :to="{path: '/set-drop', query: {type: 'rise',param:zy}}" class="strategy main-bg normal-margin">
        <span>止盈策略</span>
        <span>涨幅超过<span class="fiexd_width">{{zy | toRetain(2)}}%</span></span>
      </router-link>
      <div class="strategy-tips font24 main-text-color2">
        <p>止损策略：当价格向不利方向发展，距离（分笔持仓）开仓价满足止损条件后，自动委托止损</p>
        <p class="normal-margin">止盈策略：当价格向有利方向发展，距离（分笔持仓）开仓价满足止盈条件后，自动委托止盈</p>
        <p>设置后在买入时选择止损止盈，当天当笔合约委托即可自动委托卖出；已持仓的合约可在分笔持仓中进行设置，同样当天有效</p>
      </div>
    </div>
  </div>
</template>
<script>
import CHeader from '@/components/common/IHeader.vue'
import Api from '@/api'
export default {
  data(){
    return{
      zy:0,
      zs:0
    }
  },
  components: {
    CHeader
  },
  created(){
    this.$http.post(Api.profitLoss).then(res=>{
      this.zy=res.data.Data.tofit;
      this.zs=res.data.Data.sloss;
    })
  },
  filters: {
    toRetain(val, len) {
      return val.toFixed(len);
    },
  }
}
</script>
<style scoped>
  .content-body{
    text-align: left;
  }
  .strategy{
    padding: 0 10px;
    height: 50px;
    line-height: 50px;
    overflow: auto;
  }
  .strategy > span:nth-child(2) {
    float: right;
  }
  .strategy > span:nth-child(2) > span{
    margin-left: 10px;
  }
  .strategy-tips{
    padding: 0 10px;
    line-height: 1.6;
  }
  .fiexd_width{
    display: inline-block;
    width: 70px;
    text-align: right
  }
</style>

