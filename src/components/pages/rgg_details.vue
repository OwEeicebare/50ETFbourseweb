<template>
  <div id="app">
    <div class="font32 custom-header main-bg normal-border-color">
      <img :src="theme ? '/static/images/header/transparent_arrow_left.svg' : '/static/images/header/arrow_left.svg'" alt="返回按钮" class="back" @click="back" >
      <div class="tabs font32">
        <div :class="{this_tab1:type=='gou'}" @click="changetype('gou')">认购</div>
        <div :class="{this_tab2:type=='gu'}" @click="changetype('gu')">认沽</div>
      </div>
    </div>
    <div class="content_wrap">
      <div class="top main-bg">
        <div class="type_name">{{topData.StockName}}</div>
        <div class="datas">
          <div :class="{'left':true,'rise-color':topData.PriceCurrent>topData.PriceYesterdayClose&&topData.PriceOpen!=0,'drop-color':topData.PriceCurrent<topData.PriceYesterdayClose&&topData.PriceOpen!=0 }">
            <p class="left_main number-font">
              {{topData.PriceCurrent&&topData.PriceOpen?Number(topData.PriceCurrent).toFixed(4):topData.PriceOpen&&topData.PriceOpen!=0?'0.0000':'-.----'}}
              </p>
            <p class="left_ci number-font">
              <span class="number-font">{{topData.PriceRise&&topData.PriceOpen?Number(topData.PriceRise).toFixed(4):topData.PriceOpen&&topData.PriceOpen!=0?'0.0000':'-.----'}}</span>&emsp;
              <span class="number-font">{{topData.PriceRisePercent&&topData.PriceOpen?Number(topData.PriceRisePercent).toFixed(2)+'%':topData.PriceOpen&&topData.PriceOpen!=0?'0.00%':'-.--'}}</span>
            </p>
          </div>
          <div class="middle number-font">
            <p>
              <span>今&emsp;开</span>&emsp;
              <span
                :class="{'number-font': true, 'rise-color': topData.PriceOpen>topData.PriceYesterdayClose&&topData.PriceOpen!=0, 'drop-color': topData.PriceOpen<topData.PriceYesterdayClose&&topData.PriceOpen!=0}"
              >{{topData.PriceOpen?Number(topData.PriceOpen).toFixed(4):'-.----'}}</span>
            </p>
            <p>
              <span>最高价</span>&emsp;
              <span
                :class="{'number-font': true, 'rise-color': topData.PriceDayHigh>topData.PriceYesterdayClose&&topData.PriceOpen!=0, 'drop-color': topData.PriceDayHigh<topData.PriceYesterdayClose&&topData.PriceOpen!=0}"
              >{{topData.PriceDayHigh?Number(topData.PriceDayHigh).toFixed(4):topData.PriceOpen!=0?'0.0000':'-.----'}}</span>
            </p>
          </div>
          <div class="right number-font">
            <p>
              <span>昨&emsp;收</span>&emsp;
              <span class="number-font">{{topData.PriceYesterdayClose?Number(topData.PriceYesterdayClose).toFixed(4):'-.----'}}</span>
            </p>
            <p>
              <span>最低价</span>&emsp;
              <span
                :class="{'number-font': true, 'rise-color': topData.PriceDayLow>topData.PriceYesterdayClose&&topData.PriceOpen!=0, 'drop-color': topData.PriceDayLow<topData.PriceYesterdayClose&&topData.PriceOpen!=0}"
              >{{topData.PriceDayLow?Number(topData.PriceDayLow).toFixed(4):topData.PriceOpen!=0?'0.0000':'-.----'}}</span>
            </p>
          </div>
        </div>
      </div>
      <div id="tab_title" :class="{'isProgramaFixed':isfiexd, 'main-bg': true}">
        <div class="tab_title font28">
          <div v-for="(item,i) in contract_type" :key="i" :class="{'default_active':i==search_type}" @click="change_type(i)" :data-id="item[0]">{{item[1]}}<br /><span class="font24">({{item[2]}}天)</span></div>
        </div>
        <div class="table_title font24 assist-color3">
          <div>代码<br />名称</div>
          <div>现价<br />成交量</div>
          <div>涨跌额<br />涨跌幅</div>
          <div>买价<br />买量</div>
          <div>卖价<br />卖量</div>
        </div>
      </div>
      <div :class="{'isMargin':isfiexd}">
        <router-link tag='div' v-for="(item,i) in contract" :key="i" :class="{'table_row':true,'main-bg':true,'normal-border-color':true,'rise-color':item.PriceDatye>0&&item.PriceCu!=0,'drop-color':item.PriceDatye < 0&&item.PriceCu!=0,'rd_animate':d_color.indexOf(item.stock)<=-1?false:true,'rz_animate':z_color.indexOf(item.stock)<=-1?false:true}" :to="{path:'/market-details',query: {title:item.name+'-'+item.stock,prev:'rgg_details'}}">
          <div class="main-text-color2">{{item.stock}}<br />{{item.name | toSubString()}}</div>
          <div>{{item.PriceCu?Number(item.PriceCu).toFixed(4):'-.----'}}<br />{{item.PriceCu?item.TransNum:'- -' }}</div>
          <div>{{item.PriceCu?Number(item.PriceDatye).toFixed(4):'-.----'}}<br />{{item.PriceCu?Number(item.PriceDa).toFixed(2)+'%':'-.- -'}}</div>
          <div>{{item.PriceCu?Number(item.BuyOneAmount).toFixed(4):'-.----'}}<br />{{item.PriceCu?item.BuyOneNum:'- -' }}</div>
          <div>{{item.PriceCu?Number(item.SaleOneAmount).toFixed(4):'-.----'}}<br />{{item.PriceCu?item.SaleOneNum:'- -' }}</div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import url  from '../../api/index'
export default {
  data() {
    return {
      type:'',//认购认沽类型（认购认沽）
      contract_type:[],//合约类型（时间）
      now_types:0,//当前合约类型(年月日)
      search_type:0,//搜索合约类型（索引）
      contract:[],
      topData:{},
      timer:'',//计时器
      elemtop:0,
      isfiexd:false,
      z_color:[],
      d_color:[]
    };
  },
  watch:{
    contract(newval,oldval){
      this.z_color=[];
      this.d_color=[];
      //第一条数据是否一致，如果一致则证明不是首次加载，并且不是切换
      if(oldval!=null && newval!=null && oldval.length!=0 && newval[0].stock===oldval[0].stock){
        for(var i = 0,len = newval.length;i<len;i++){
          if(newval[i].PriceCu>oldval[i].PriceCu){
            this.z_color.push(newval[i].stock);
          }else if(newval[i].PriceCu<oldval[i].PriceCu){
            this.d_color.push(newval[i].stock);
          }
        }
      }
      // console.log('z_color', this.z_color)
      // console.log('d_color', this.d_color)
    }
    
  },
  computed: {
    theme () {
      // console.log(localStorage.getItem('theme') != null ? JSON.parse(localStorage.getItem('theme')).theme : 0);
      return localStorage.getItem('theme') != null ? JSON.parse(localStorage.getItem('theme')).theme : 0;
    }
  },
  destroyed(){
    window.removeEventListener("scroll", this.handleScroll);
    window.clearInterval(this.timer);
  },
  created(){
    //获取合约类型（认购认沽）
    this.type=this.$route.query.type;
    //获取50etf
    this.get_50etf();
    //获取合约类型（时间）
    this.get_type();
    this.timer = setInterval(() => {
      this.get_50etf();
      this.get_contract(this.now_types,this.type);
    }, 2000);
  },
  methods: {
    back() {
      this.$router.push('/market')
    },
     /**获取50etf数据 */
    get_50etf(){
      this.$http.post(url.etfDetails).then(res=>{
        var list = res.data.Data;
        this.topData=list;
      })
    },
    /**获取合约类型（时间） */
    get_type(){
      this.$http.post(url.stockTime).then(res=>{
        //获取合约类型
        this.contract_type=res.data.Data;
        this.now_types=this.contract_type[0][0];
        //获取该类型下的合约
        this.get_contract(this.now_types,this.type);
      })
    },
    /**获取合约 
     * 时间类型
     * 认购认沽类型
    */
    get_contract(time_t,other_t){
      other_t=other_t=="gou"?"1":"2";
      this.$http.post(url.allcontract,{id:time_t,status:other_t}).then(res=>{
        if(res.data.Status==1){
          this.contract=res.data.Data;
        }
      })
    },
    /**更该合约类型（认购认沽）
     * “gou”或者“gu”
     */
    changetype(params){
      //如果点击相同合约类型则不操作
      if(this.type==params){
        return;
      }
      this.type=params;
      this.get_contract(this.now_types,this.type);
    },
    /**更改合约类型（时间）
     * 合约类型索引
     */
    change_type(param){
      //如果点击相同合约类型则不操作
      if(param==this.search_type){
        return;
      }
      //更改合约类型样式
      this.search_type=param;
      //更改合约类型（时间）
      this.now_types = this.contract_type[param][0];
      this.get_contract(this.now_types,this.type);
    },
    handleScroll() {//监听页面是否滚动到指定元素
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      this.isfiexd = scrollTop >= this.elemtop && scrollTop > 0 ? true : false;
    }
  },
  mounted() {
    this.elemtop=document.querySelector("#tab_title").offsetTop;
    window.addEventListener("scroll", this.handleScroll);
  },
  filters:{
    //保留小数点后几位
    toRetain(val,len){
      return val.toFixed(len);
    },
    //截取字符串后几位
    toSubString(val){
      return val.substring(5,val.length);
    }
  },
};
</script>

<style scoped>
.rz_animate {
  animation: rz_bg 0.6s;
  -webkit-animation: rz_bg 0.6s;
}
.lz_animate {
  animation: lz_bg 0.6s;
  -webkit-animation: lz_bg 0.6s;
}
.rd_animate {
  animation: rd_bg 0.6s;
  -webkit-animation: rd_bg 0.6s;
}
.ld_animate {
  animation: ld_bg 0.6s;
  -webkit-animation: ld_bg 0.6s;
}
@keyframes rz_bg {
  25% {
    background: -webkit-linear-gradient(left right, #fd9294, rgba(214, 209, 209,0));
    background: -o-linear-gradient(right, #fd9294, rgba(214, 209, 209,0));
    background: -moz-linear-gradient(right, #fd9294,rgba(214, 209, 209,0));
    background: linear-gradient(to right, #fd9294,rgba(214, 209, 209,0));
  }
  50% {
    background: -webkit-linear-gradient(left right, #ff787b, rgba(214, 209, 209,0));
    background: -o-linear-gradient(right, #ff787b, rgba(214, 209, 209,0));
    background: -moz-linear-gradient(right, #ff787b,rgba(214, 209, 209,0));
    background: linear-gradient(to right, #ff787b, rgba(214, 209, 209,0));
  }
  75% {
    background: -webkit-linear-gradient(left right, #fd9294, rgba(214, 209, 209,0));
    background: -o-linear-gradient(right, #fd9294,rgba(214, 209, 209,0));
    background: -moz-linear-gradient(right, #fd9294,rgba(214, 209, 209,0));
    background: linear-gradient(to right, #fd9294, rgba(214, 209, 209,0));
  }
}
@keyframes lz_bg {
  
  25% {
    background: -webkit-linear-gradient(right left, #fd9294,rgba(214, 209, 209,0));
    background: -o-linear-gradient(left, #fd9294,rgba(214, 209, 209,0));
    background: -moz-linear-gradient(left, #fd9294, rgba(214, 209, 209,0));
    background: linear-gradient(to left, #fd9294, rgba(214, 209, 209,0));
  }
  50% {
    background: -webkit-linear-gradient(right left, #ff787b, rgba(214, 209, 209,0));
    background: -o-linear-gradient(left, #ff787b, rgba(214, 209, 209,0));
    background: -moz-linear-gradient(left, #ff787b,rgba(214, 209, 209,0));
    background: linear-gradient(to left, #ff787b, rgba(214, 209, 209,0));
  }
  75% {
    background: -webkit-linear-gradient(right left, #fd9294, rgba(214, 209, 209,0));
    background: -o-linear-gradient(left, #fd9294, rgba(214, 209, 209,0));
    background: -moz-linear-gradient(left, #fd9294, rgba(214, 209, 209,0));
    background: linear-gradient(to left, #fd9294,rgba(214, 209, 209,0));
  }
}
@keyframes rd_bg {
  
  25% {
    background: -webkit-linear-gradient(left right, #03c461, rgba(214, 209, 209,0));
    background: -o-linear-gradient(right, #03c461,rgba(214, 209, 209,0));
    background: -moz-linear-gradient(right, #03c461,rgba(214, 209, 209,0));
    background: linear-gradient(to right, #03c461, rgba(214, 209, 209,0));
  }
  50% {
    background: -webkit-linear-gradient(left right, #03c461, rgba(214, 209, 209,0));
    background: -o-linear-gradient(right, #03c461, rgba(214, 209, 209,0));
    background: -moz-linear-gradient(right, #03c461, rgba(214, 209, 209,0));
    background: linear-gradient(to right, #03c461, rgba(214, 209, 209,0));
  }
  75% {
    background: -webkit-linear-gradient(left right, #03c461, rgba(214, 209, 209,0));
    background: -o-linear-gradient(right, #03c461, rgba(214, 209, 209,0));
    background: -moz-linear-gradient(right, #03c461,rgba(214, 209, 209,0));
    background: linear-gradient(to right, #03c461, rgba(214, 209, 209,0));
  }
}
@keyframes ld_bg {
  
  25% {
    background: -webkit-linear-gradient(right left, #03c461,rgba(214, 209, 209,0));
    background: -o-linear-gradient(left, #03c461,rgba(214, 209, 209,0));
    background: -moz-linear-gradient(left, #03c461, rgba(214, 209, 209,0));
    background: linear-gradient(to left, #03c461,rgba(214, 209, 209,0));
  }
  50% {
    background: -webkit-linear-gradient(right left, #03c461, rgba(214, 209, 209,0));
    background: -o-linear-gradient(left, #03c461,rgba(214, 209, 209,0));
    background: -moz-linear-gradient(left, #03c461,rgba(214, 209, 209,0));
    background: linear-gradient(to left, #03c461, rgba(214, 209, 209,0));
  }
  75% {
    background: -webkit-linear-gradient(right left, #03c461,rgba(214, 209, 209,0));
    background: -o-linear-gradient(left, #03c461, rgba(214, 209, 209,0));
    background: -moz-linear-gradient(left, #03c461,rgba(214, 209, 209,0));
    background: linear-gradient(to left, #03c461,rgba(214, 209, 209,0));
  }
}
.custom-header {
  position: fixed;
  height: 24px;
  line-height: 24px;
  width: 100vw;
  text-align: center;
  top: 0;
  padding-top: 10px;
  padding-bottom: 10px;
  z-index: 100001;
  border-bottom-width: 1px;
  border-bottom-style: solid;
}
.back {
  position: absolute;
  height: 20px;
  top: 2px;
  cursor: pointer;
  padding: 10px;
  left: 0;
}
.tabs {
  display: flex;
  justify-content: center;
  align-items: center;
}
.tabs > div {
  color: #999;
  /* font-size: 14px; */
}
.tabs > div:first-child {
  margin-right: 20px;
}
.tabs .this_tab1 {
  color: #ff787b;
  font-weight: 600;
  position: relative;
}
.tabs .this_tab1::after{
  content: '';
  display: inline-block;
  width: 35px;
  position: absolute;
  bottom: 0;
  left: 0;
  border-bottom: 2px solid #ff787b !important;
}
.tabs .this_tab2 {
  color: rgb(3, 196, 97);
  position: relative;
  font-weight: 600;
}
.tabs .this_tab2::after{
  content: '';
  display: inline-block;
  width: 35px;
  position: absolute;
  bottom: 0;
  left: 0;
  border-bottom: 2px solid rgb(3, 196, 97) !important;
}
.content_wrap {
  font-size: 13px;
  top: 273px;
}
.content_wrap {
  margin-top: 45px;
}
.top {
  /* background: #fff; */
  padding: 10px;
  height:88px;
}
.top .type_name {
  text-align: left;
  margin-bottom: 10px;
  font-size: 15px;
}
.top .datas {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}
.top .middle p:first-child,
.top .right p:first-child {
  margin-bottom: 10px;
}
.top .datas .left_main {
  font-size: 26px;
  text-align: left;
  /* font-family: font; */
}
.top .middle p > span:first-child,
.top .right p > span:first-child {
  color: gray;
}
.line{
  height: 10px;
  background: #f2f2f2;
}
.default_active{
  color: #3aaaff;
  font-weight: 500;
  /* border-bottom: 2px solid #3aaaff !important; */
}
.default_active > span{
  position: relative;
}
.default_active > span::after{
  content: '';
  position: absolute;
  width: 120%;
  height: 2px;
  background-color: #3aaaff;
  left: -10%;
  bottom: -7px;
}
.tab_title{
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* background: #fff; */
}
.tab_title>div{
  width: 25%;
  padding: 12px 0;
}
.table_title{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 7px 10px;
  /* background-color: rgb(242, 242, 242); */
}
.table_title>div,.table_row>div{
  width: 20%;
  text-align: left;
}
.table_title>div:first-child,.table_row>div:first-child{
  width: 25%;
  text-align: left;
}
.table_row{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding:12px 10px;
  /* border-bottom: 1px solid #f7f7f7; */
  border-bottom-width: 1px;
  border-bottom-style: solid;
  line-height: 17px;
  /* background: #fff; */
}
#tab_title{
  margin-top: 10px;
}
.isProgramaFixed {
  position: fixed;
  top: 45px;
  left: 0;
  right: 0;
  margin-top: 0 !important;
  transform:translateZ(0);
  transform:translate3d(0,0,0);
}
.isMargin{
  margin-top: 115px;
}
</style>
