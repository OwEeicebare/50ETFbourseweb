<template>
    <div class="settlement_details">
        <CHeader title="平仓结算详情" backBol="true" backUrl="/settlement"></CHeader>
        <div class="content-body has-header font28 main-bg">
            <div><span class="main-text-color2">合约名称</span>{{detail.Sc}}<span>{{detail.Sn}}</span><span class="type font24 main-color2 white-color">平仓</span></div>
            <ul>
                <li>
                    <div class="left"><span class="main-text-color2">买入时间</span>{{detail.Td ? formatDate(detail.Td) : '----.--.--'}}</div>
                    <div class="right"><span class="main-text-color2">卖出时间</span>{{detail.Sd ? formatDate(detail.Sd) : '----.--.--'}}</div>
                </li>
                <li>
                    <div class="left"><span class="main-text-color2">买入价格</span>{{detail.Bp}}</div>
                    <div class="right"><span class="main-text-color2">卖出均价</span>{{detail.Sp}}</div>
                </li>
                <li>
                    <div class="left"><span class="main-text-color2">买入数量</span>{{detail.Bn}}张</div>
                    <div class="right"><span class="main-text-color2">卖出数量</span>{{detail.Sa}}张</div>
                </li>
                <li>
                    <div class="left"><span class="main-text-color2">合约单位</span>{{detail.Dn}}</div>
                    <div class="right"><span class="main-text-color2">持仓类型</span>{{detail.Dt}}</div>
                </li>
                <li>
                    <div class="left"><span class="main-text-color2">成交金额</span>{{detail.Bc}}</div>
                    <div class="right"><span class="main-text-color2">成交金额</span>{{detail.Scm}}</div>
                </li>
                <!-- <li>
                    <div class="left"><span class="main-text-color2">交易金额</span>{{detail.Bm}}</div>
                    <div class="right"><span class="main-text-color2">交易金额</span>{{detail.Sm}}</div>
                </li> -->
                <li>
                    <div  :class="{'left':true,'rise-color':detail.Pm>0,'drop-color':detail.Pm<0}"><span class="main-text-color2">盈亏金额</span>{{detail.Pm}}</div>
                    <div  :class="{'right':true,'rise-color':detail.Pm>0,'drop-color':detail.Pm<0}"><span class="main-text-color2">盈亏比例</span>{{detail.Pr}}</div>
                </li>
            </ul>
            <div class="line assist-color3"></div>
            <div v-if="detail.Snu!=0" ><span class="main-text-color2">合约名称</span>{{detail.Sc}}<span>{{detail.Sn}}</span><span class="type font24 main-color2 white-color">持仓</span></div>
            <div v-if="detail.Snu!=0" class="rise-color current-price"><span class="number-font large-warn">2.7029</span><span>+0.0015</span><span>+0.51%</span></div>
            <ul v-if="detail.Snu!=0">
              <li>
                  <div class="left"><span class="main-text-color2">买入价格</span>{{detail.Bp}}</div>
                  <div class="right"><span class="main-text-color2">持仓数量</span>{{detail.Snu}}</div>
              </li>
              <li>
                  <div class="left"><span class="main-text-color2">盈亏金额</span>{{detail.Pm}}</div>
                  <div class="right"><span class="main-text-color2">盈亏比例</span>{{detail.Pr}}</div>
              </li>
            </ul>
        </div>
    </div>
</template>
<script>
import api from '@/api'
import CHeader from '@/components/common/IHeader.vue'
export default {
    components: {
        CHeader
    },
    data () {
        return {
            detail: {
                
            }
        }
    },
    created() {
        this.getOen();
    },
      computed: {
    type () {
      return this.$route.query.type;
    },
   
  },
  methods:{
    getOen(){
      this.$http.post(api.settlementDetail,{"Id":this.$route.query.id,"TypeId":this.$route.query.type}).then(res=>{
        if(res.data.Status==="1"){
             var result = res.data.Data;
             this.detail = result;
             
        }
      })
    },
    formatDate (time) {
      var date2 = time.replace(/\-/g, '/');
      var date1 = new Date(date2);
      var year = date1.getFullYear();
      var month = date1.getMonth() + 1 < 10 ? "0" + (date1.getMonth() + 1) : date1.getMonth() + 1;
      var day = date1.getDate() < 10 ? "0" + date1.getDate() : date1.getDate();
      return year + "." + month + "." + day;
    }
  }
}
</script>
<style scoped>
    .content-body{
        top: 54px;
        text-align: left;
    }
    .content-body > div{
        margin: 15px 0;
        padding: 0 10px;
    }
    ul > li {
        display: flex;
        margin-bottom: 15px;
        padding: 0 10px;
    }
    ul > li > div{
        flex: 1;
    }
    ul > li > div > span:nth-child(1),.content-body > div > span:nth-child(1) {
        margin-right: 10px;
    }
    .content-body > div > span:nth-child(2){
        margin: 0 10px;
    }
    .content-body > div > span.type{
        display: inline-block;
        width: 32px;
        height: 16px;
        text-align: center;
        line-height: 17px;
        border-radius: 2px;
    }
    .line{
      height: 10px;
    }
    .large-warn{
      font-size: 24px;
    }
</style>
