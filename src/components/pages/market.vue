<template>
  <div class="market">
    <CHeader
      title="行情"
      funBol="true"
      :elseSrc="theme ? '/static/images/black/icon_search.svg': '/static/images/market/icon_search.svg'"
      directRoute="/search_contract"
    ></CHeader>
    <div class="content_wrap">
      <!-- 头部数据 -->
      <div class="top main-bg">
        <div class="type_name">{{topData.StockName}}</div>
        <div class="datas">
          <div class="left" :class="{'rise-color': topData.PriceCurrent>topData.PriceYesterdayClose&&topData.PriceOpen!=0,'drop-color':topData.PriceCurrent<topData.PriceYesterdayClose&&topData.PriceOpen!=0}" >
            <p class="left_main number-font">{{topData.PriceCurrent&&topData.PriceOpen?Number(topData.PriceCurrent).toFixed(4):topData.PriceOpen&&topData.PriceOpen!=0?'0.0000':'-.----'}}</p>
            <p class="left_ci">
              <span class="number-font">{{topData.PriceRise&&topData.PriceOpen?Number(topData.PriceRise).toFixed(4):topData.PriceOpen&&topData.PriceOpen!=0?'0.0000':'-.----'}}</span>&emsp;
              <span class="number-font">{{topData.PriceRisePercent&&topData.PriceOpen?Number(topData.PriceRisePercent).toFixed(2)+'%':topData.PriceOpen&&topData.PriceOpen!=0?'0.00%':'-.--'}}</span>
            </p>
          </div>
          <div class="middle">
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
          <div class="right">
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
      <div class="btns main-bg">
        <mt-button type="primary" class="btn_rgou" size="large" @click="to_rgou">认购</mt-button>
        <mt-button type="primary" class="btn_rgu" size="large" @click="to_rgu">认沽</mt-button>
      </div>
      <!-- 合约类型 -->
      <div id="tab_title" :class="{'isProgramaFixed':isfiexd}">
        <div  :class="{'tab_title':true, 'main-bg': true}">
          <div
            v-for="(item,i) in types"
            :key="i"
            class="font28"
            :class="{'default_active':i==search_type}"
            @click="change_type(i)"
            :data-id="item[i][0]"
          >
            {{item[i][1]}}
            <br>
            <span class="font24">({{item[i][2]}}天)</span>
          </div>
        </div>
        <div class="table_title font24 table-text-color">
          <span :class="{'assist-color3': !theme, 'table-head': theme}">涨跌幅(%)</span>
          <span :class="{'assist-color3': !theme, 'table-head': theme}">认购现价</span>
          <span :class="{'assist-color3': !theme, 'table-head': theme}">行权价</span>
          <span :class="{'assist-color3': !theme, 'table-head': theme}">认沽现价</span>
          <span :class="{'assist-color3': !theme, 'table-head': theme}">涨跌幅(%)</span>
        </div>
      </div>
      <!-- 所有合约 -->
      <div class="table_content main-bg" :class="{'isMargin':isfiexd}">
        <div  class="table_row normal-border-color"  v-for="(item,i) in end_contract" :key="i"  @load="baseline()" :class="{'baseline':line==i && !theme, 'baseline-black': line==i && theme}">
          <router-link
          tag="div"
          :to="{path:'/market-details',query: {title:item.g_name+'-'+item.g_stock,prev:'market'}}"
          :class="{'rise-color':item.g_PriceDa>0,'drop-color':item.g_PriceDa < 0,'lz_animate':zcolor.indexOf(item.g_stock)<=-1?false:true,'ld_animate':dcolor.indexOf(item.g_stock)<=-1?false:true}"
        >
            <span>{{item.g_PriceCu==0?'-.- - ':Number(item.g_PriceDa).toFixed(2)}}</span>
            <span>{{item.g_PriceCu==0?'-.- - ':Number(item.g_PriceCu).toFixed(4)}}</span>
          </router-link>
          <span :class="{'baseline':line==i && !theme, 'table-head': true, 'baseline-black': line==i && theme}">{{item.g_Id==='A'?item.deaprice+"A":item.deaprice}}</span>
          <router-link
            tag="div"
            :class="{'rise-color':item.s_PriceDa>0,'drop-color':item.s_PriceDa < 0,'rz_animate':zcolor.indexOf(item.s_stock)<=-1?false:true,'rd_animate':dcolor.indexOf(item.s_stock)<=-1?false:true}"
            :to="{path:'/market-details',query: {title:item.s_name+'-'+item.s_stock,prev:'market'}}"
          >
            <span>{{item.s_PriceCu==0?'-.- - ':Number(item.s_PriceCu).toFixed(4)}}</span>
            <span>{{item.s_PriceCu==0?'-.- - ':Number(item.s_PriceDa).toFixed(2)}}</span>
          </router-link>
        </div>
      </div>
    </div>
    <TabNav></TabNav>
  </div>
</template>

<script>
import TabNav from "@/components/common/TabNav.vue";
import CHeader from "@/components/common/IHeader.vue";
import url from "../../api/index";
export default {
  data() {
    return {
      topData: {
        // StockName: "", //名称
        // PriceCurrent: 0, //现价
        // PriceRise: 0, //涨跌额
        // PriceRisePercent: 0, //涨跌幅
        // PriceOpen: 0, //今开
        // PriceYesterdayClose: 0, //昨收
        // PriceDayHigh: 0, //最高价
        // PriceDayLow: 0 //最低价
      },
      types: [], //合约类型时间
      now_types: "", //当前合约类型
      contract_all: [], //所有合约
      end_contract:[],//成对合约集合，处理后的合约数组
      search_type: 0, //搜索合约类型
      interval: "", //计时器
      line: 0, //基线
      flag: 0, //标志：是否第一次加载,画基线
      first_load_color: true, //首次加载闪色
      zcolor: [], //涨合约数组
      dcolor: [], //跌合约数组
      elemtop:0,
      isfiexd:false,
    };
  },
  created() {
    //进入页面时加载数据
    this.get_50etf();
    this.get_type();
    //首次加载页面数据
    this.get_contract(this.now_types);
    //没一秒请求一次的定时器
    this.interval = setInterval(() => {
      this.get_50etf(); //加载顶部数据
      this.get_contract(this.now_types);
    }, 2000);
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
    window.clearInterval(this.interval);
  },
  watch: {
    contract_all(newval,oldval){//监听所有合约,闪色
      //清空需要闪烁的数组
      this.zcolor=[];
      this.dcolor=[];
      //不是首次加载
      if(newval.length && oldval.length!=0 && newval[0].stock===oldval[0].stock){
        this.first_load_color=false;
        for(var i = 0,len = newval.length;i<len;i++){
          if(newval[i].PriceCu>oldval[i].PriceCu){
            this.zcolor.push(newval[i].stock);
          }else if(newval[i].PriceCu<oldval[i].PriceCu){
            this.dcolor.push(newval[i].stock);
          }
        }
      }
    },
    end_contract(newval,oldval){
      //获取现价
      var now = this.topData.PriceCurrent;
      //如果是第一次加载
      if (this.flag == 0 && now && now != 0) {
        //存储行权价和现价的差，以及该行索引
        var cha = [];
        for (var i = 0, len =newval.length; i < len; i++) {
          var row = newval[i].deaprice;
          cha.push(Math.abs(this.accSub(now, row)));
        }
        //取最小值
        var min = Math.min.apply(null, cha);
        this.line = cha.indexOf(min);
        this.flag = 1;
      }
    }
  },
  computed: {
    //认购合约
    contract_rgou() {
      var result = [];
      for (var i = 0, len = this.contract_all.length; i < len; i++) {
        if (i % 2 != 0) {
          //偶数
          result.push(this.contract_all[i]);
        }
      }
      return result;
    },
    //认沽合约
    contract_rgu() {
      var result = [];
      for (var i = 0, len = this.contract_all.length; i < len; i++) {
        if (i % 2 == 0) {
          //奇数
          result.push(this.contract_all[i]);
        }
      }
      return result;
    },
    theme () {
      return localStorage.getItem('theme') != null ? JSON.parse(localStorage.getItem('theme')).theme : 0;
    }
  },
  methods: {
    /**获取50etf数据 */
    get_50etf() {
      this.$http.post(url.etfDetails).then(res => {
        if (res.data.Status == 1) {
          var list = res.data.Data;
          this.topData=list;
        }
      });
    },
    /**获取合约类型 */
    get_type() {
      this.$http.post(url.stockTime).then(res => {
        for (var i = 0, len = res.data.Data.length; i < len; i++) {
          this.types.push(res.data.Data);
        }
        this.now_types = this.types[0][0][0];
      });
    },
    /**获取合约
     * 合约类型（时间）
     */
    get_contract(contractType) {
      return this.$http
        .post(url.allcontract, { id: contractType, status: 0 })
        .then(res => {
          if (res.data.Status == 1) {
            this.contract_all = res.data.Data; //获取所有合约
             //合约处理
            this.end_contract=[];
            for(var i = 0,len=this.contract_all.length;i<len;i++){
              //偶数为沽,奇书为购
              if(this.contract_all[i+1]!=null && this.contract_all[i+1].deaprice==this.contract_all[i].deaprice && this.contract_all[i+1].name.indexOf("购")!=-1 && this.contract_all[i].Ia==this.contract_all[i+1].Ia){
                
                var obj={
                  s_stock:this.contract_all[i].stock,//沽代码
                  s_name:this.contract_all[i].name,//沽名称
                  s_Id:this.contract_all[i].Ia,//行权价类型
                  s_PriceCu:this.contract_all[i].PriceCu,//现价
                  s_PriceDa:this.contract_all[i].PriceDa,//涨跌幅
                  deaprice:this.contract_all[i].deaprice,//行权价
                  g_stock:this.contract_all[i+1].stock,//购代码
                  g_name:this.contract_all[i+1].name,//购名称
                  g_Id:this.contract_all[i+1].Ia,//行权价类型
                  g_PriceCu:this.contract_all[i+1].PriceCu,//现价
                  g_PriceDa:this.contract_all[i+1].PriceDa,//涨跌幅   
                }
                this.end_contract.push(obj);
                i++;
              }
            }
            this.first_load_color = true;

            
          }
        });
    },
    /**更改合约类型 */
    change_type(param) {
      //如果点击相同合约类型则不操作
      this.zcolor=[];
      this.dcolor=[];
      if (param == this.search_type) {
        return;
      }
      //更改合约类型
      this.search_type = param;
      this.now_types = this.types[param][param][0];
      this.flag = 0;
      this.get_contract(this.now_types).then(res=>{
        //获取现价
        var now = this.topData.PriceCurrent;
        //如果是第一次加载
        if (this.flag == 0 && now != 0) {
          //存储行权价和现价的差，以及该行索引
          var cha = [];
          for (var i = 0, len =this.end_contract.length; i < len; i++) {
            var row = this.end_contract[i].deaprice;
            cha.push(Math.abs(this.accSub(now, row)));
          }
          //取最小值
          var min = Math.min.apply(null, cha);
          this.line = cha.indexOf(min);
          this.flag = 1;
        }
      });
      

    },
    /**跳转认购 */
    to_rgou() {
      this.$router.history.push({
        path: "/rgg_details",
        query: { type: "gou" }
      });
    }, 
    /**跳转认沽 */
    to_rgu() {
      this.$router.history.push({
        path: "/rgg_details",
        query: { type: "gu" }
      });
    },
    //浮点数减法
    accSub(arg1, arg2) {
      if (isNaN(arg1)) {
        arg1 = 0;
      }
      if (isNaN(arg2)) {
        arg2 = 0;
      }
      arg1 = Number(arg1);
      arg2 = Number(arg2);

      var r1, r2, m, n;
      try {
        r1 = arg1.toString().split(".")[1].length;
      } catch (e) {
        r1 = 0;
      }
      try {
        r2 = arg2.toString().split(".")[1].length;
      } catch (e) {
        r2 = 0;
      }
      m = Math.pow(10, Math.max(r1, r2)); //last modify by deeka //动态控制精度长度
      n = r1 >= r2 ? r1 : r2;
      return ((arg1 * m - arg2 * m) / m).toFixed(n);
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
  filters: {
    toRetain(val, len) {
      //数字保留后四位
      return Number(val).toFixed(len);
    },
    setPercent(val) {
      return val + "%";
    }
  },
  components: {
    TabNav,
    CHeader
  }
};
</script>


<style scoped>
.lzf_animate {
  animation: lz_bg 0.6s;
  -webkit-animation: lz_bg 0.6s;
}
.rzf_animate {
  animation: rz_bg 0.6s;
  -webkit-animation: rz_bg 0.6s;
}
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
.baseline {
  background: #e9f6ff !important;
}
.baseline-black{
  background: #273D4E !important;
}
.market {
  height: 100%;
}
.content_wrap {
  margin-top: 45px;
  padding-bottom: 50px;
}
body {
  text-align: left;
}
.font-famil {
  font-family: fonts;
}
.fiexd {
  position: fixed;
  left: 0;
  right: 0;
  top: 44px;
  z-index: 100;
}
.top {
  /* background: #fff; */
  padding: 10px;
  height: 88px;
}
.top .type_name {
  text-align: left;
  margin-bottom: 10px;
}
.top .datas {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}
.middle p:first-child,
.right p:first-child {
  margin-bottom: 10px;
}
.datas .left_main {
  font-size: 26px;
  text-align: left;
}
.datas .left_ci {
  font-family: font;
}
.middle p > span:first-child,
.right p > span:first-child {
  color: gray;
}
.font_famil {
  font-family: font;
}
.line {
  height: 10px;
  background: #f2f2f2;
}
.content_middle {
  background: #fff;
  height: 140px;
}
.btns {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  /* background: #fff; */
  margin-top: 10px;
  height: 40px;
}
.btns > button:first-child {
  margin-right: 10px;
}
.mint-tab-item {
  text-decoration: none;
}
.btn_rgou {
  background-color: #ff787b;
  font-size: 14px;
}
.btn_rgu {
  background-color: #03c461;
  font-size: 14px;
}
.tab_title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* background: #fff; */
}
.tab_title > div {
  width: 25%;
  text-align: center;
  padding: 12px 0;
}
.default_active {
  color: #3aaaff;
  font-weight: 500;
  /* border-bottom: 2px solid #3aaaff !important; */
}
.default_active > span {
  position: relative;
}
.default_active > span::after {
  content: "";
  position: absolute;
  width: 120%;
  height: 2px;
  background-color: #3aaaff;
  left: -10%;
  bottom: -7px;
}
.table_title {
  font-size: 0;
}
.table_title span {
  display: inline-block;
  /* background: #f2f2f2; */
  height: 30px;
  line-height: 30px;
  width: 20%;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-size: 13px;
  /* color: #333333; */
  text-align: center;
}
.table_content {
  /* background: #fff; */
}
.table_row {
  font-size: 0;
  display: flex;
  justify-content: space-between;
  border-bottom-style: solid;
  border-bottom-width: 1px;
}
.table_row:nth-last-child(1) {
  border: none;
}
.table_row div {
  width: 40%;
}
.table_row div > span {
  display: inline-block;
  width: 50%;
}
.table_row > span {
  /* background: #f2f2f2; */
}
.table_row span {
  display: inline-block;
  width: 20%;
  font-size: 15px;
  height: 40px;
  line-height: 40px;
}
.isProgramaFixed {
  position: fixed;
  top: 45px;
  left: 0;
  right: 0;
}
.isMargin{
  margin-top: 95px;
}
</style>


