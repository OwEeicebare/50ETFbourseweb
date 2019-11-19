<template>
  <div class="settlement_details">
    <CHeader title="资金流水详情" backBol="true" backUrl="/journal-account"></CHeader>
    <div class="content-body has-header font28 main-bg">
      <div>
        <!-- 当资金流水类型为买入卖出时 -->
        <div class="type1" v-if="type === 1 || type === 2">
          <div class="main-text-color2 text-center money-title">发生金额</div>
          <div class="money text-center">{{detail.Dm}}元</div>
          <ul>
            <li>
              <span class="main-text-color2">发生前余额</span>
              <span>{{(detail.Bb).toFixed(2)}}元</span>
            </li>
            <li>
              <span class="main-text-color2">发生后余额</span>
              <span>{{(detail.Bm).toFixed(2)}}元</span>
            </li>
            <li>
              <span class="main-text-color2">交易类型</span>
              <span :class="{'rise-color': detail.TypeName === '买入开仓', 'copy-color': detail.TypeName === '卖出平仓', 'bold-type': true}">{{detail.TypeName}}</span>
            </li>
          </ul>
          <div class="line assist-color3"></div>
          <ul>
            <li>
              <span class="main-text-color2">发生时间</span>
              <span>{{detail.Td}}</span>
            </li>
            <li>
              <span class="main-text-color2">合约名称</span>
              <span>{{detail.Sn}}</span>
            </li>
            <li>
              <span class="main-text-color2">合约代码</span>
              <span>{{detail.Sc}}</span>
            </li>
            <li>
              <span class="main-text-color2">合约单位</span>
              <span>{{detail.Snu}}</span>
            </li>
          </ul>
          <div class="line assist-color3"></div>
          <ul>
            <li>
              <span class="main-text-color2">成交价格</span>
              <span>{{detail.Dp}}</span>
            </li>
            <li>
              <span class="main-text-color2">成交数量</span>
              <span>{{detail.Dn}}张</span>
            </li>
            <li>
              <span class="main-text-color2">成交金额</span>
              <span>{{(Number(detail.Dn) * Number(detail.Dp) * Number(detail.Snu)).toFixed(2)}}元</span>
            </li>
            <li>
              <span class="main-text-color2">交易金额</span>
              <span>{{(detail.DMoney).toFixed(2)}}元</span>
            </li>
          </ul>
          <div class="line assist-color3"></div>
          <ul>
            <li>
              <span class="main-text-color2">委托编号</span>
              <span>{{detail.An}}</span>
            </li>
            <li>
              <span class="main-text-color2">成交编号</span>
              <span>{{detail.Den}}</span>
            </li>
          </ul>
        </div>
        <!-- 当资金流水类型为递延费 -->
        <div class="type2" v-if="type === 5">
          <div class="main-text-color2 text-center money-title">递延费</div>
          <div class="money text-center">{{(detail.DelayFee).toFixed(2)}}元</div>
          <ul>
            <li>
              <span class="main-text-color2">发生金额</span>
              <span>{{(detail.Dm).toFixed(2)}}元</span>
            </li>
            <li>
              <span class="main-text-color2">发生前余额</span>
              <span>{{(detail.Bb).toFixed(2)}}元</span>
            </li>
            <li>
              <span class="main-text-color2">发生后余额</span>
              <span>{{(detail.Bm).toFixed(2)}}元</span>
            </li>
          </ul>
          <div class="line assist-color3"></div>
          <ul>
            <li>
              <span class="main-text-color2">发生时间</span>
              <span>{{detail.DelayTime}}</span>
            </li>
            <li>
              <span class="main-text-color2">交易类型</span>
              <span class="rise-color">追加延期</span>
            </li>
            <li class="overnight-code-info">
              <span class="main-text-color2">合约信息</span>
              <div>
                <ul>
                  <li v-for="(item,i) in detail.lsItems" :key="i">
                    {{item.StockName}}×{{item.StockNum}}张
                  </li>
                </ul>
              </div>
            </li>
            <li>
              <span class="main-text-color2">持仓总量</span>
              <span>{{detail.TotalNum}}张</span>
            </li>
            <li>
              <span class="main-text-color2">递<span class="hidden">q</span>延<span class="hidden">q</span>费</span>
              <span>{{(detail.DelayFee).toFixed(2)}}元</span>
            </li>
          </ul>
        </div>
        <!-- 当资金流水类型为充值提现 -->
        <div class="type0" v-if="type === 3 || type === 4">
          <div class="main-text-color2 text-center money-title" v-if="type==3">{{detail.TypeName}}到账金额</div>
          <div class="money text-center" v-if="type==3">{{detail.DMoney}}元</div>
          <div class="main-text-color2 text-center money-title" v-if="type==4">{{detail.TypeName}}金额</div>
          <div class="money text-center" v-if="type==4">{{detail.Dm}}元</div>
          <ul>
            <!-- <li>
              <span class="main-text-color2">服<span class="hidden">q</span>务<span class="hidden">q</span>费</span>
              <span>{{detail.Mf}}元</span>
            </li> -->
            <li>
              <span class="main-text-color2">发生前余额</span>
              <span>{{detail.Bb}}元</span>
            </li>
            <li>
              <span class="main-text-color2">发生后余额</span>
              <span>{{detail.Bm}}元</span>
            </li>
          </ul>
          <div class="line assist-color3"></div>
          <ul>
            <li>
              <span class="main-text-color2">发生时间</span>
              <span>{{detail.Td}}</span>
            </li>
            <li>
              <span class="main-text-color2">交易类型</span>
              <span class="rise-color">{{detail.TypeName}}</span>
            </li>
            <li class="overnight-code-info" v-if="type==3">
              <span class="main-text-color2">充值金额</span>
              <span>{{detail.Dm}}元</span>
            </li>
            <li class="overnight-code-info" v-if="type==4">
              <span class="main-text-color2">提现金额</span>
              <span>{{(detail.Dm).toString().substring(1)}}元</span>
            </li>
            <!-- <li class="overnight-code-info" v-if="type==4">
              <span class="main-text-color2">提现金额</span>
              <span>{{detail.Dm}}元</span>
            </li> -->
            <li>
              <span class="main-text-color2">服<span class="hidden">q</span>务<span class="hidden">q</span>费</span>
              <span>{{detail.Mf}}元</span>
            </li>
            <li>
              <span class="main-text-color2">到账金额</span>
              <span>{{detail.DMoney}}元</span>
            </li>
            <li>
              <span class="main-text-color2">订单编号</span>
              <span>{{detail.Dn}}</span>
            </li>
          </ul>
        </div>
        <!-- 当资金流水类型为合约到期 -->
        <div class="type4" v-if="type === 6">
          <div class="main-text-color2 text-center money-title">合约到期</div>
          <div class="money text-center">0.00元</div>
          <ul>
            <li>
              <span class="main-text-color2">发生金额</span>
              <span>0.00元</span>
            </li>
            <li>
              <span class="main-text-color2">发生前余额</span>
              <span>100.00元</span>
            </li>
            <li>
              <span class="main-text-color2">发生后余额</span>
              <span>100.00元</span>
            </li>
          </ul>
          <div class="line assist-color3"></div>
          <ul>
            <li>
              <span class="main-text-color2">发生时间</span>
              <span>{{detail.DelayTime}}</span>
            </li>
            <li>
              <span class="main-text-color2">交易类型</span>
              <span class="rise-color">{{detail.DealType}}</span>
            </li>
            <li>
              <span class="main-text-color2">合约名称</span>
              <span>{{detail.lsOverdueItems[0].StockName}}</span>
            </li>
            <li>
              <span class="main-text-color2">合约代码</span>
              <span>{{detail.lsOverdueItems[0].StockCode}}</span>
            </li>
            <li>
              <span class="main-text-color2">合约单位</span>
              <span>{{detail.lsOverdueItems[0].Company}}</span>
            </li>
             <li>
              <span class="main-text-color2">到期价格</span>
              <span>0.0000</span>
            </li>
            <li>
              <span class="main-text-color2">持仓数量</span>
              <span>{{detail.lsOverdueItems[0].StockNum}}张</span>
            </li>
            <li class="overnight-code-info">
              <span class="main-text-color2">交易金额</span>
              <span>0.00元</span>
            </li>
          </ul>
        </div>
      </div>
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
      detail: {},
      type: 0, //类型 1买入开仓 2卖出平仓 3充值 4提现 5追加延期
    }
  },
  computed: {
    id () {
      return Number(this.$route.query.id);
    }
  },
  methods: {
    getDetails () {
      this.$http.post(api.flowDetails, this.id).then(res => {
        // console.log('资金流水', res);
        if (res.data.Status === '1') {
          this.type = res.data.Data.TypeId;
          if (this.type === 1 || this.type === 2) {
            this.detail = res.data.Data.Mdc;
          } else if (this.type === 3) {
            this.detail = res.data.Data.Mda;
          } else if (this.type === 4) {
            this.detail = res.data.Data.Mdb;
          } else if (this.type === 5 || this.type==6) {
            this.detail = res.data.Data.Mdd;
          }
        } else {
          this.$toast({
            message: res.data.Msg,
            position: 'bottom'
          })
        }
      })
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
        text-align: left;
    }
    .content-body > div{
      overflow-y: scroll;
      overflow-x: hidden;
      -webkit-overflow-scrolling: touch;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
    }
    .content-body > div > div.type1 > div, .content-body > div > div.type2 > div,.content-body > div > div.type0 > div,.content-body > div > div.type4 > div{
        margin: 15px 0;
        padding: 0 10px;
    }
    ul > li {
      margin-bottom: 15px;
      padding: 0 10px;
      overflow: hidden;
    }
    ul > li > span:nth-child(1) {
      float: left;
    }
    ul > li > span:nth-child(2) {
      float: right;
    }
    .content-body > div > span:nth-child(1) {
        margin-right: 10px;
    }
    .line{
      height: 10px;
    }
    .text-center{
      text-align: center;
    }
    .content-body > div  > div.type1 > div.money, .content-body > div > div.type2 > div.money,.content-body > div  > div.type0 > div.money,.content-body > div  > div.type4 > div.money{
      font-size: 30px;
      /* font-weight: 600; */
      margin: 0 0 15px;
    }
    .content-body  > div > div.type1 > div.money-title, .content-body > div > div.type2 > div.money-title, .content-body > div > div.type0 > div.money-title, .content-body > div > div.type4 > div.money-title{
      margin: 15px 0 0;
    }
    .overnight-code-info > div{
      float: right;
    }
    .overnight-code-info > div > ul > li{
      padding: 0;
    }
</style>





