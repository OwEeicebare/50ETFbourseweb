<template>
  <div>
    <CHeader :title="title" backBol="true" :backUrl="prev_path"></CHeader>
    <div class="content-body has-header main-bg">
      <div class="assist-color3">
        <!-- 第一部分数据 -->
        <div class="top_wrap main-bg">
          <div class="top_row1">
            <div class="left" :class="{'rise-color':top.PriceCurrent>top.PriceYesterdayClose&&top.PriceOpen,'drop-color':top.PriceCurrent<top.PriceYesterdayClose&&top.PriceOpen}">
              <div class="xj number-font">{{top.PriceCurrent?Number(top.PriceCurrent).toFixed(4):top.PriceOpen&&top.PriceOpen!=0 ? '0.0000' : '-.----'}}</div>
              <div class="zde_zdf number-font">
                <div>{{top.PriceRise&&top.PriceOpen?Number(top.PriceRise).toFixed(4):top.PriceOpen&&top.PriceOpen!=0 ? '0.0000' : '-.----'}}</div>
                <div>{{top.PriceRisePercent&&top.PriceOpen? Number(top.PriceRisePercent).toFixed(2)+"%":top.PriceOpen&&top.PriceOpen!=0 ? '0.00%' :'--'}}</div>
              </div>
            </div>
            <div class="right number-font">
              <div><span class="data_title">成交量</span><span class="data_nub">{{top.TransNum?top.TransNum:top.PriceOpen&&top.PriceOpen!=0?'0':'--'}}</span></div>
              <div><span class="data_title">持仓量</span><span class="data_nub">{{top.StockNum?top.StockNum:top.PriceOpen&&top.PriceOpen!=0?'0':'--'}}</span></div>
            </div>
          </div>
          <div class="top_row2 number-font">
            <div>
              <div :class="{'rise-color':top.PriceOpen>top.PriceYesterdayClose&&top.PriceOpen!=0,'drop-color':top.PriceOpen <top.PriceYesterdayClose&&top.PriceOpen!=0}">
                <span class="data_title">今开</span><span class="data_nub">{{top.PriceOpen? Number(top.PriceOpen).toFixed(4):'-.----'}}</span>
              </div>
              <div>
                <span class="data_title">昨收</span><span class="data_nub">{{top.PriceYesterdayClose?Number(top.PriceYesterdayClose).toFixed(4):top.PriceOpen&&top.PriceOpen!=0 ?'0.0000':'-.----'}}</span>
              </div>
            </div>
            <div>
              <div :class="{'rise-color':top.PriceDayHigh>top.PriceYesterdayClose&&top.PriceOpen!=0,'drop-color':top.PriceDayHigh <top.PriceYesterdayClose&&top.PriceOpen!=0}">
                <span class="data_title">最高</span><span class="data_nub">{{top.PriceDayHigh?Number(top.PriceDayHigh).toFixed(4):top.PriceOpen&&top.PriceOpen!=0 ? '0.0000' :'-.----'}}</span>
              </div>
              <div :class="{'rise-color':top.PriceDayLow>top.PriceYesterdayClose&&top.PriceOpen!=0,'drop-color':top.PriceDayLow <top.PriceYesterdayClose&&top.PriceOpen!=0}">
                <span class="data_title">最低</span><span class="data_nub">{{top.PriceDayLow?Number(top.PriceDayLow).toFixed(4):top.PriceOpen&&top.PriceOpen!=0 ? '0.0000' :'-.----'}}</span>
              </div>
            </div>
            <div>
              <div><span class="data_title">涨停价</span><span class="data_nub">{{top.PriceRiseStop?Number(top.PriceRiseStop).toFixed(4):top.PriceOpen!=0?'0':'--'}}</span></div>
              <div><span class="data_title">振幅</span><span class="data_nub">{{top.amlitu?Number(top.amlitu).toFixed(2)+"%":top.PriceOpen&&top.PriceOpen!=0 ? '0.00%' : '--'}}</span></div>
            </div>
          </div>
          <div class="tip assist-color3 main-text-color2">交易时间：9:30-11:30&emsp;&emsp;13:00-14:57</div>
          <div class="top_row3 number-font">
            <div>
              <div><span class="data_title">行权价格</span><span>{{middle.deaprice?Number(middle.deaprice).toFixed(4):'--'}}</span></div>
              <div><span class="data_title">合约单位</span><span>{{middle.denum?middle.denum:'--'}}</span></div>
            </div>
            <div>
              <div><span class="data_title">行权日期</span><span>{{middle.deadatestr?middle.deadatestr:'--'}}</span></div>
              <div><span class="data_title">剩余天数</span><span>{{middle.endDte?middle.endDte:'--'}}</span></div>
            </div>
          </div>
        </div>
        <!-- k线 -->
        <div class="echart_wrap normal-margin-top main-bg">
          <div class="select_charts">
            <span class="every_select" :class="{'this_chart':echartType=='LineEcharts'}" @click="change('LineEcharts')">分时</span>
            <span class="every_select" :class="{'this_chart':echartType=='KEcharts'}" @click="change('KEcharts')">日k</span>
          </div>
          <div class="views" id="views">
            <keep-alive include="LineEcharts,KEcharts">
              <component :is="com" :contract="contract_code" :PriceYesterdayClose="top.PriceYesterdayClose" v-if="top.PriceYesterdayClose"></component>
            </keep-alive>
          </div>
        </div>
        <!-- 买卖五档 -->
        <div class="buy_sell_five normal-margin-top main-bg">
          <div class="title">
            <span>买盘5档</span>
            <span>卖盘5档</span>
          </div>
          <div class="content">
            <div class="content_left">
              <div class="left_row">
                <span>5</span><span>{{top.BuyFiveAmount?Number(top.BuyFiveAmount).toFixed(4):'-.- - '}}</span>
                <span>{{top.BuyFiveNum&&top.BuyFiveAmount?top.BuyFiveNum:'- - '}}</span>
              </div>
              <div class="left_row">
                <span>4</span><span>{{top.BuyFourAmount?Number(top.BuyFourAmount).toFixed(4):'-.- - '}}</span>
                <span>{{top.BuyFourNum&&top.BuyFourAmount?top.BuyFourNum:'- - '}}</span>
              </div>
              <div class="left_row">
                <span>3</span><span>{{top.BuyThreeAmount?Number(top.BuyThreeAmount).toFixed(4):'-.- - '}}</span>
                <span>{{top.BuyThreeNum&&top.BuyThreeAmount?top.BuyThreeNum:'- - '}}</span>
              </div>
              <div class="left_row">
                <span>2</span><span>{{top.BuyTwoAmount?Number(top.BuyTwoAmount).toFixed(4):'-.- - '}}</span>
                <span>{{top.BuyTwoNum&&top.BuyTwoAmount?top.BuyTwoNum:'- - '}}</span>
              </div>
              <div class="left_row">
                <span>1</span><span>{{top.BuyOneAmount?Number(top.BuyOneAmount).toFixed(4):'-.- - '}}</span>
                <span>{{top.BuyOneNum&&top.BuyOneAmount?top.BuyOneNum:'- - '}}</span>
              </div>
            </div>
            <div class="content_line"></div>
            <div class="content_right">
              <div class="left_row">
                <span>{{top.SaleFiveNum&&top.SaleFiveAmount?top.SaleFiveNum:'- - '}}</span>
                <span>{{top.SaleFiveAmount?Number(top.SaleFiveAmount).toFixed(4):'-.- - '}}</span><span>5</span>
              </div>
              <div class="left_row">
                <span>{{top.SaleFourNum&&top.SaleFourAmount?top.SaleFourNum:'- - '}}</span>
                <span>{{top.SaleFourAmount?Number(top.SaleFourAmount).toFixed(4):'-.- - '}}</span><span>4</span>
              </div>
              <div class="left_row">
                <span>{{top.SaleThreeNum&&top.SaleThreeAmount?top.SaleThreeNum:'- - '}}</span>
                <span>{{top.SaleThreeAmount?Number(top.SaleThreeAmount).toFixed(4):'-.- - '}}</span><span>3</span>
              </div>
              <div class="left_row">
                <span>{{top.SaleTwoNum&&top.SaleTwoAmount? top.SaleTwoNum:'- - '}}</span>
                <span>{{top.SaleTwoAmount?Number(top.SaleTwoAmount).toFixed(4):'-.- - '}}</span><span>2</span>
              </div>
              <div class="left_row">
                <span>{{top.SaleOneNum&&top.SaleOneAmount?top.SaleOneNum:'- - '}}</span>
                <span>{{top.SaleOneAmount?Number(top.SaleOneAmount).toFixed(4):'-.- - '}}</span><span>1</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="btns font32">
      <div id="buy_btn" @click="go('buy')">买入</div>
      <div id="sell_btn" @click="go('sell')">卖出</div>
    </div>
  </div>
</template>
<script>
import CHeader from '@/components/common/IHeader.vue'
import LineEcharts from '@/components/common/LineEcharts.vue'
import KEcharts from '@/components/common/KEcharts.vue'
import url  from '../../api/index'
export default {
  data () {
    return {
      //合约详情数据
      top:{},
      middle:{},
      echartType:'LineEcharts',
      contract_code:'',//合约代码
      contract_name:'',//合约名称
      com:LineEcharts,//视图组件
      interval:'',//计时器
      prev_path:'/market'//行情详情固定跳转行情也买
    }
  },
  created(){
    this.get_contract();//获取合约代码
    this.get_detail();//获取合约详情
    this.get_detail_second();//获取合约详情固定内容
    this.interval=setInterval(() => {
      this.get_detail();
    }, 1000);
  },
  computed: {
    title () {
      this.contract_name = this.$route.query.title;
      return this.contract_name;
    }
  },
  components: {
    CHeader,
    LineEcharts,
    KEcharts
  },
  methods:{
    //获取传过来的参数合约代码
    get_contract(){
      this.contract_code=(this.$route.query.title).split("-")[1];
    },
    //获取合约详情
    get_detail(){
      this.$http.post(url.contractDetail,this.contract_code).then(res=>{
        if(res.data.Status==1){
          var result = res.data.Data;
          this.top = result;
        }
      })
    },
    //获取合约详情固定数据
    get_detail_second(){
      this.$http.post(url.contractDetailSecod,this.contract_code).then(res=>{
        var result = res.data.Data;
        this.middle=result;
      })
    },
    //改变图表组件
    change(par){
      this.com=par;
      this.echartType=par;
    },
    //页面跳转
    go(types){
      this.$http.post(url.autonymState).then(res=>{
        if(res.data.Status==="1"){
          if(res.data.Data.NTure==3){//未认证
            this.$message({
              title: '实名认证',
              message: '您尚未进行实名认证，无法交易，现在就去认证吗',
              showCancelButton: true,
              closeOnClickModal:false,
              cancelButtonClass: 'main-text-color2'
            }).then(action => {
              if (action === 'confirm') {
                this.$router.push('/authenticationSelect');
              }
            })
          }else if(res.data.Data.NTure==2){//待审核
            this.$message({
              title: '实名认证',
              message: '您的认证资料正在审核中，无法交易，是否查看认证资料',
              showCancelButton: true,
              closeOnClickModal:false,
              cancelButtonClass: 'main-text-color2'
            }).then(action => {
              if (action === 'confirm') {
                this.$router.push('/againauthentication');
              }
            })
          }else{
            this.$router.push({path:'/buy_details',query:{type:types,back:'market-details',contract_name:this.contract_name,denum:this.top.denum}})
          }
        }
      });
    },
  },
  destroyed(){
    window.clearInterval(this.interval);
  },
}
</script>

<style scoped>
.content-body{
  bottom: 50px;
}
.content-body > div{
  overflow-y: scroll;
  overflow-x: hidden;
  width: 100%;
  height: 100%;
  -webkit-overflow-scrolling: touch;
}
.top_wrap{
  /* background: #ffffff; */
  padding: 10px;
  /* font-family: font; */
}
.top_row1{
  display: flex;
  justify-content: space-between;
}
.top_row1>.left{
  width: 60%;
  display: flex;
}
.xj{
  font-size: 37px;
  /* font-family: fonts; */
}
.zde_zdf{
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  margin-left: 20px;
}
.top_row1>.right{
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  width: 40%;
  text-align: left;
}
.top_row1>.right>div:first-child{
  margin-bottom: 5px;
}
.top_row2{
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}
.top_row2>div>div{
  margin-bottom: 10px;
}
.data_title{
  color:gray;
  margin-right: 10px;
}
.data_nub{
  display: inline-block;
  width: 70px;
  text-align: left;
}
.tip{
  text-align: left;
  padding: 2px 0;
  /* background: #f2f2f2; */
  /* color: gray; */
  font-size: 12px;
}
.top_row3{
  display: flex;
  justify-content: flex-start;
  margin-top: 10px;
}
.top_row3>div{
  width: 50%;
  text-align: left;
}
.top_row3>div>div{
  margin-bottom: 10px;
}
.echart_wrap{
  /* background: #fff; */
  height: 335px;
  /* margin-top: 12px; */
}
/*买卖五档*/
.buy_sell_five{
  /* margin-top: 10px; */
  padding: 10px;
  /* background: #fff; */
  font-size: 14px;
}
.buy_sell_five .title{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.buy_sell_five .content{
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* margin-top: 10px; */
}
.buy_sell_five .content .content_left,.buy_sell_five .content .content_right{
  width: 50%;
}
.buy_sell_five .content .content_left>div,.buy_sell_five .content .content_right>div{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px;
}
.buy_sell_five .content .content_left>.left_row:after{
  display: block;
  content: '';
  /* border-right: 1px solid #d9d9d9; */
  width: 1px;
  height: 10px;
  position: relative;
  left: 10px;
}
.buy_sell_five .content .content_left>div>span:first-child{
  background: #ff787b;
  color: white;
  /* padding:2px 5px; */
  width: 15px;
  height: 15px;
  line-height: 17px;
  display: inline-block;
  font-size: 12px;
  border-radius: 2px;
  margin-right: 15px;
}
.buy_sell_five .content .content_right>div>span:last-child{
  background: #3aaaff;
  color: white;
  /* padding:2px 5px; */
  width: 15px;
  height: 15px;
  line-height: 17px;
  display: inline-block;
  font-size: 12px;
  border-radius: 2px;
  margin-left: 15px;
}
.buy_sell_five .content .content_left>div>span:nth-child(2){
  color: #ff787b;
}
.buy_sell_five .content .content_right>div>span:nth-child(2){
  color: #03c461;
}
.buy_sell_five .content .content_left>div>span:not(:first-child),.buy_sell_five .content .content_right>div>span:not(:last-child){
  display: inline-block;
  width: 50px;
}
.btns{
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* font-size: 14px; */
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
}
#buy_btn,#sell_btn{
  color: #fff;
  width: 50%;
  height: 50px;
  line-height: 50px;
}
#buy_btn{
  background: #ff787b;
}
#sell_btn{
  background: #3aaaff;
}
.select_charts{
  display: flex;
  justify-content: center;
  align-items: center;
  margin:0 10px;
  padding: 5px 0;
}
.select_charts>span{
  margin-left: 15px;
  margin: 0 20px;
  padding: 3px;
  width: 40px;
}
.this_chart{
  color: #3aaaff;
  position: relative;
}
.this_chart::after{
  content: '';
  display: inline-block;
  position: absolute;
  width: 45px;
  height: 2px;
  left: 0;
  bottom: -2px;
  border-bottom: 2px solid #3aaaff;
  background: none;
}
</style>

