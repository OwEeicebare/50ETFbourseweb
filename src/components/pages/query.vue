<template>
  <div class="query">
    <CHeader title="查询" backBol="true" backUrl="/deal"></CHeader>
    <div class="content-body has-header main-bg font28">
      <div>
        <ul>
          <li class="normal-border-color">
            <router-link class="left normal-border-color" to="/delegate" tag="div" :style="{backgroundImage: 'url(' + (theme ? '/static/images/black/icon_query_day_entrust.svg' : '/static/images/deal/icon_query_day_entrust.svg') + ')'}">当日委托</router-link>
            <router-link class="right" to="/transaction" tag="div" :style="{backgroundImage: 'url(' + (theme ? '/static/images/black/icon_query_day_deal.svg' : '/static/images/deal/icon_query_day_deal.svg') + ')'}">当日成交</router-link>
          </li>
          <li class="normal-border-color">
            <router-link class="left normal-border-color" to="/history-delegate" tag="div" :style="{backgroundImage: 'url(' + (theme ? '/static/images/black/icon_query_history_entrust.svg' : '/static/images/deal/icon_query_history_entrust.svg') + ')'}">历史委托</router-link>
            <router-link class="right" to="/history-transaction" tag="div" :style="{backgroundImage: 'url(' + (theme ? '/static/images/black/icon_query_history_deal.svg' : '/static/images/deal/icon_query_history_deal.svg') + ')'}">历史成交</router-link>
          </li>
          <li class="normal-border-color">
            <router-link class="left normal-border-color" to="/journal-account" tag="div" :style="{backgroundImage: 'url(' + (theme ? '/static/images/black/icon_qurey_moneyrecord.svg' : '/static/images/deal/icon_qurey_moneyrecord.svg') + ')'}">资金流水</router-link>
            <router-link class="right" to="/query-stop" tag="div" :style="{backgroundImage: 'url(' + (theme ? '/static/images/black/icon_qurey_stopmoney.svg' : '/static/images/deal/icon_qurey_stopmoney.svg') + ')'}">止盈止损</router-link>
          </li>
          <li class="normal-border-color">
            <router-link class="left normal-border-color" to="/overdue" tag="div" :style="{backgroundImage: 'url(' + (theme ? '/static/images/black/icon_qurey_expired_contract.svg' : '/static/images/deal/icon_qurey_expired_contract.svg') + ')'}">过期合约</router-link>
            <!-- <router-link class="right" to="/settlement" tag="div" :style="{backgroundImage: 'url(' + (theme ? '/static/images/black/icon_qurey_settlement.svg' : '/static/images/deal/icon_qurey_settlement.svg') + ')'}">平仓结算</router-link> -->
            <div></div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import CHeader from '@/components/common/IHeader.vue'
export default {
  components: {
    CHeader
  },
  computed: {
    theme () {
      // console.log(localStorage.getItem('theme') != null ? JSON.parse(localStorage.getItem('theme')).theme : 0);
      return localStorage.getItem('theme') != null ? JSON.parse(localStorage.getItem('theme')).theme : 0;
    }
  }
}
</script>
<style scoped>
  ul > li{
    height: 75px;
    line-height: 75px;
    /* border-top: 1px solid #ebebeb; */
    border-top-width: 1px;
    border-top-style: solid;
    display: flex;
    text-align: left;
  }
  ul > li:nth-last-child(1) {
    /* border-bottom: 1px solid #ebebeb; */
    border-bottom-width: 1px;
    border-bottom-style: solid;
  }
  ul > li > div{
    flex: 1;
    padding: 0 25px;
    background-repeat: no-repeat;
    background-size: 50px;
    background-position: 86.6% 12.5px;
  }
  ul > li > div.left{
    /* border-right: 1px solid #ebebeb; */
    border-right-style: solid;
    border-right-width: 1px;
  }
</style>
