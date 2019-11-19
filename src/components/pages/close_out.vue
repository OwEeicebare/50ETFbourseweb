<template>
  <div class="close-out">
    <div class="close-header font32 main-bg">
      <img :src="theme ? '/static/images/header/transparent_arrow_left.svg' : '/static/images/header/arrow_left.svg'" alt="返回按钮" class="back"  @click="back">
      <h1 class="font32">一键平仓</h1>
      <span class="font32 all-selected" @click="allSelected" v-if="selected === '1'">{{combineAllSelectedBtn ? '取消' : '全选'}}</span>
      <span class="font32 all-selected" @click="allSelected" v-else>{{divideAllSelectedBtn ? '取消' : '全选'}}</span>
    </div>
    <div class="content-body has-header">
      <div class="main-bg">
        <!--  平仓提示  -->
        <div :class="{'close-out-tips': true, 'normal-padding': true, 'rise-color': !theme, 'assist-color1': true, 'font24': true, 'tab-active-color': theme}">将以对五价委托，实际以成交为准，请谨慎操作！</div>
        <!-- 持仓tab -->
        <mt-navbar v-model="selected">
          <mt-tab-item id="1" class="font28">合并持仓</mt-tab-item>
          <mt-tab-item id="2" class="font28">分笔持仓</mt-tab-item>
        </mt-navbar>
        <!-- 持仓列表 -->
        <div class="close-outs-container">
          <div>
            <mt-tab-container v-model="selected" :swipeable="true">
              <!-- 合并持仓 -->
              <mt-tab-container-item id="1">
                <div v-if="positionsStateCombine.length">
                  <div v-for="item in positionsStateCombine" :key="item.Sc" :class="{'list-item': true, 'normal-margin': true, 'deal-border': !theme, 'assist-color4': theme}" :data-id="item.Sc" @click="selectCombine">
                    <div :class="{'title': true, 'white-color': true, 'deal-bg-color': !theme, 'normal-padding': true, 'assist-color3': theme}">
                      <span class="contract"><span>{{item.Sc}}</span>{{item.Sn}}</span>
                      <span>到期：{{formateDate(item.Tc)}}</span>
                    </div>
                    <div class="close-out-situation normal-padding">
                      <div class="left">
                        <div class="normal-margin">
                          <span class="main-text-color2">总<span class="hidden">q</span>市<span class="hidden">q</span>值</span>{{item.PriceCu ? (item.PriceCu * item.Dnu * item.Num).toFixed(2) : 0}}
                        </div>
                        <div class="normal-margin">
                          <span class="main-text-color2">成本均价</span>{{(item.Dp).toFixed(4)}}
                        </div>
                      </div>
                      <div class="right">
                        <div class="normal-margin">
                          <span class="main-text-color2">总盈亏</span><span :class="{'rise-color':  item.DealMoney < item.PriceCu* item.Dnu * item.Num,  'drop-color': item.DealMoney > item.PriceCu* item.Dnu * item.Num}">{{(item.PriceCu* item.Dnu * item.Num-item.DealMoney).toFixed(2)}}</span>
                        </div>
                        <div class="normal-margin">
                          <span class="main-text-color2">持<span class="hidden">持</span>仓</span>{{item.Dnu}}张
                        </div>
                      </div>
                      <div class="current-price">
                        <span class="main-text-color2">现<span class="hidden">现价</span>价</span>
                        <div class="inner-price">
                            <span :class="{'rise-color': item.PriceDatye > 0, 'drop-color': item.PriceDatye < 0}">{{item.PriceCu ? item.PriceCu: '0.0000'}}</span><span :class="{'rise-color': item.PriceDatye > 0, 'drop-color': item.PriceDatye < 0}">{{item.PriceDatye ? (item.PriceDatye > 0 ? '+' : '') + item.PriceDatye : '0.0000'}}</span><span :class="{'rise-color': item.PriceDatye > 0, 'drop-color': item.PriceDatye < 0}">{{item.PriceDa ? (item.PriceDa > 0 ? '+' : '') + item.PriceDa: '0.00'}}%</span>
                          </div>
                      </div>
                    </div>
                    <img :src="item.state ? '/static/images/deal/icon_deal_allsell_click_s.svg' : '/static/images/deal/icon_deal_allsell_click_n.svg'" alt="">
                  </div>
                  </div>
                <div v-else class="no-data main-text-color2">暂无数据</div>
              </mt-tab-container-item>
              <!-- 分笔持仓 -->
              <mt-tab-container-item id="2">
                <div v-if="positionsStateDivide.length">
                  <div v-for="item in positionsStateDivide" :key="item.Id" :class="{'list-item': true, 'normal-margin': true, 'deal-border': !theme, 'assist-color4': theme}" :data-id="item.Id" @click="selectDivide">
                    <div :class="{'title': true, 'white-color': true, 'deal-bg-color': !theme, 'normal-padding': true, 'assist-color3': theme}">
                      <span class="contract"><span>{{item.Sc}}</span>{{item.Sn}}</span>
                      <span>到期：{{formateDate(item.Tc)}}</span>
                    </div>
                    <div class="close-out-situation normal-padding">
                      <div class="left">
                        <div class="normal-margin">
                          <span class="main-text-color2">总<span class="hidden">q</span>市<span class="hidden">q</span>值</span>{{item.PriceCu ? (item.PriceCu * item.Dnu * item.Num).toFixed(2) : 0}}
                        </div>
                        <div class="normal-margin">
                          <span class="main-text-color2">成本均价</span>{{(item.Dp).toFixed(4)}}
                        </div>
                      </div>
                      <div class="right">
                        <div class="normal-margin">
                          <span class="main-text-color2">总盈亏</span><span :class="{'rise-color':  item.PriceCu > item.Dp, 'drop-color':  item.PriceCu < item.Dp}">{{((item.PriceCu-item.Dp)* item.Dnu * item.Num).toFixed(2)}}</span>
                        </div>
                        <div class="normal-margin">
                          <span class="main-text-color2">持<span class="hidden">持</span>仓</span>{{item.Dnu}}张
                        </div>
                      </div>
                      <div class="current-price">
                        <span class="main-text-color2">现<span class="hidden">现价</span>价</span>
                        <div class="inner-price">
                          <span :class="{'rise-color': item.PriceDatye > 0, 'drop-color': item.PriceDatye < 0}">{{item.PriceCu ? item.PriceCu: '0.0000'}}</span><span :class="{'rise-color': item.PriceDatye > 0, 'drop-color': item.PriceDatye < 0}">{{item.PriceDatye ? (item.PriceDatye > 0 ? '+' : '') + item.PriceDatye : '0.0000'}}</span><span :class="{'rise-color': item.PriceDatye > 0, 'drop-color': item.PriceDatye < 0}">{{item.PriceDa ? (item.PriceDa > 0 ? '+' : '') + item.PriceDa: '0.00'}}%</span>
                        </div>
                      </div>
                    </div>
                    <img :src="item.state ? '/static/images/deal/icon_deal_allsell_click_s.svg' : '/static/images/deal/icon_deal_allsell_click_n.svg'" alt="">
                  </div>
                </div>
                <div v-else class="no-data main-text-color2">暂无数据</div>
              </mt-tab-container-item>
            </mt-tab-container>
          </div>
        </div>
      </div>
    </div>
    <div :class="{'commit': true, 'line-color': combine.length === 0 && divide.length === 0, 'white-color': true, 'main-color2': combine.length || divide.length, 'font32': true}" @click="commit">提交卖出委托</div>
  </div>
</template>
<script>
import api from '@/api'
export default {
  data () {
    return {
      selected: '1',
      // 止盈switch
      upStop: false,
      // 止损switch
      downStop: true,
      combine: [],
      divide: [],
      // 合并持仓的全选控制
      combineAllSelectedBtn: false,
      // 分笔持仓的全选控制
      divideAllSelectedBtn: false,
      allPositions: [],//合并持仓
      separateHold: [],// 分笔持仓
      allStr: '',//合并持仓的代码
      separateStr: '', //分笔持仓的合约代码
      combinePrice: [], //合并持仓实时数据
      separatePrice: [], //分笔持仓实时数据
      timer: null, //定时器
    }
  },
  computed: {
    // 带状态的合约列表 合并
    positionsStateCombine () {
      var arr = [];
      for (let i = 0; i < this.cHolds.length; i++) {
        arr.push(this.cHolds[i]);
        arr[i].state = false;
        for(let j = 0; j < this.combine.length; j++) {
          if (this.cHolds[i].Sc === this.combine[j]) {
            arr[i].state = true;
            break;
          }
        }
      }
      return arr;
    },
    positionsStateDivide () {
      var arr = [];
      for (let i = 0; i < this.sHolds.length; i++) {
        arr[i] = this.sHolds[i];
        arr[i].state = false;
        for(let j = 0; j < this.divide.length; j++) {
          if (this.sHolds[i].Id === Number(this.divide[j])) {
            arr[i].state = true;
            break;
          }
        }
      }
      return arr;
    },
    cHolds () {//处理后的合并持仓数据
      if (this.combinePrice.length) {
        for (let i = 0; i < this.combinePrice.length; i++) {
          for (let j = 0; j < this.allPositions.length; j++) {
            if (this.combinePrice[i].stock == this.allPositions[j].Sc) {
              this.allPositions[j].PriceCu = this.combinePrice[i].PriceCu;
              this.allPositions[j].PriceDa = this.combinePrice[i].PriceDa;
              this.allPositions[j].PriceDatye = this.combinePrice[i].PriceDatye;
              this.allPositions[j].BuyOneAmount = this.combinePrice[i].BuyOneAmount;
              // break;
            }
          }
        }
        return this.allPositions;
      }
      return this.allPositions;
    },
    sHolds () {//处理后的分笔持仓数据
      if (this.separatePrice.length) {
        for (let i = 0; i < this.separatePrice.length; i++) {
          for (let j = 0; j < this.separateHold.length; j++) {
            if (this.separatePrice[i].stock == this.separateHold[j].Sc) {
              this.separateHold[j].PriceCu = this.separatePrice[i].PriceCu;
              this.separateHold[j].PriceDa = this.separatePrice[i].PriceDa;
              this.separateHold[j].PriceDatye = this.separatePrice[i].PriceDatye;
              this.separateHold[j].BuyOneAmount = this.separatePrice[i].BuyOneAmount;
              // break;
            }
          }
        }
        return this.separateHold;
      }
      return this.separateHold;
    },
    theme () {
      // console.log(localStorage.getItem('theme') != null ? JSON.parse(localStorage.getItem('theme')).theme : 0);
      return localStorage.getItem('theme') != null ? JSON.parse(localStorage.getItem('theme')).theme : 0;
    }
  },
  methods: {
    // 选中合并持仓里的合约
    selectCombine (e) {
      var id = e.currentTarget.dataset.id ? e.currentTarget.dataset.id : e.target.dataset.id;
      if (id) {
        this.judgeInCombine(id, this.combine);
      } else {
        return;
      }
      // 判断是否选中了所有合约
      let count = 0;
      if (this.combine.length === this.cHolds.length) {
        for(let i = 0;i < this.combine.length; i++){
          for(let j = 0; j < this.cHolds.length; j++) {
            if (this.combine[i] === this.cHolds[j].Sc) {
              count++;
              break;
            }
          }
        }
        if (count === this.cHolds.length) {
          this.combineAllSelectedBtn = true;
        } else {
          this.combineAllSelectedBtn = false;
        }
      } else {
        this.combineAllSelectedBtn = false;
      }
    },
    // 选中分笔持仓里的合约
    selectDivide (e) {
      var id = e.currentTarget.dataset.id ? e.currentTarget.dataset.id : e.target.dataset.id;
      if (id) {
        this.judgeInCombine(id, this.divide);
      } else {
        return;
      }
      // 判断是否选中了所有合约
      let count = 0;
      if (this.divide.length === this.sHolds.length) {
        for(let i = 0;i < this.divide.length; i++){
          for(let j = 0; j < this.sHolds.length; j++) {
            if (this.divide[i] === this.sHolds[j].Id) {
              count++;
              break;
            }
          }
        }
        if (count === this.sHolds.length) {
          this.divideAllSelectedBtn = true;
        } else {
          this.divideAllSelectedBtn = false;
        }
      } else {
        this.divideAllSelectedBtn = false;
      }

    },
    // 判断合约id是否在持仓里
    judgeInCombine (id, positions) {
      if (positions.length) {
        for (let i = 0; i < positions.length; i++) {
          if (id === positions[i]) {
            positions.splice(i, 1);
            // console.log('splice', this.combine);
            return;
          }
        }
        // id 不在 combine数组中
        positions.push(id);
        // console.log('push', this.combine);
      } else {
        positions.push(id);
        // console.log('empty combine push', this.combine);
      }
    },
    // 提交卖出委托
    commit () {
      if (this.selected == 1 && this.combine.length) {//合并持仓
        let cStr = '';
        let cArr = [];
        for (let i in this.combine) {
          if (i != this.combine.length - 1) {
            cStr += this.combine[i] + ',';
          } else {
            cStr += this.combine[i];
          }
        }
        for (let i = 0; i < this.combine.length; i++) {
          for (let j = 0; j < this.positionsStateCombine.length; j++) {
            if (this.positionsStateCombine[j].Sc === this.combine[i]) {
              cArr.push(this.positionsStateCombine[j]);
              break;
            }
          }
        }
        sessionStorage.setItem('str', cStr);
        sessionStorage.setItem('arr', JSON.stringify(cArr));
        sessionStorage.setItem('type', 0),
        this.$router.push('/close-sell');
      } else if (this.selected == 2 && this.divide.length) {//分笔持仓
        let dStr = '';
        let dArr = [];
        let dIds = '';
        for (let i in this.divide) {
          if (i != this.divide.length - 1) {
            dStr += this.divide[i] + ',';
          } else {
            dStr += this.divide[i];
          }
        }
        for (let i = 0; i < this.divide.length; i++) {
          for (let j = 0; j < this.positionsStateDivide.length; j++) {
            if (this.positionsStateDivide[j].Id === Number(this.divide[i])) {
              dIds += this.positionsStateDivide[j].Id + ',';
              dArr.push(this.positionsStateDivide[j]);
              break;
            }
          }
        }
        sessionStorage.setItem('str', dStr);
        sessionStorage.setItem('arr', JSON.stringify(dArr));
        sessionStorage.setItem('type', 1);
        dIds = dIds.substring(0, dIds.length - 1);
        // console.log(dIds);
        sessionStorage.setItem('ids', dIds);
        this.$router.push('/close-sell');
      } else {
        this.$toast({
          message: '请选中当前持仓的合约',
          position: 'bottom',
          duration: 3000
        })
      }
    },
    // 返回
    back () {
      this.$router.push('/deal');
    },
    allSelected () {//全选和全不选
      if (this.selected === '1') {
        this.combineAllSelectedBtn = !this.combineAllSelectedBtn;
        this.combine.length = 0;
        if (this.combineAllSelectedBtn) {
          for (let i = 0; i < this.positionsStateCombine.length; i++) {
            this.positionsStateCombine[i].state = true;
            this.combine.push(this.positionsStateCombine[i].Sc);
          }
        } else {
          for (let i = 0; i < this.positionsStateCombine.length; i++) {
            this.positionsStateCombine[i].state = false;
          }
        }
      } else {
        this.divideAllSelectedBtn = !this.divideAllSelectedBtn;
        this.divide.length = 0;
        if (this.divideAllSelectedBtn) {
          for (let i = 0; i < this.positionsStateDivide.length; i++) {
            this.positionsStateDivide[i].state = true;
            this.divide.push(this.positionsStateDivide[i].Id);
          }
        } else {
          for (let i = 0; i < this.positionsStateDivide.length; i++) {
            this.positionsStateDivide[i].state = false;
          }
        }
      }
    },
    getHoldStocks () {//获取合并持仓数据
      this.$http.post(api.stockHold).then(res => {
        // console.log('合并持仓', res);
        if (res.data.Status === '1') {
          this.allStr = '';
          for (let i = 0; i < res.data.Data.length; i++) {
            if (i !== res.data.Data.length -1) {
              this.allStr += 'CON_OP_' + res.data.Data[i].Sc + ',';
            } else {
              this.allStr += 'CON_OP_' + res.data.Data[i].Sc;
            }
          }
          this.allPositions = res.data.Data;
          this.getCurrentPrice(this.allStr, 'combine');
          // console.log('合并持仓字符串', this.allStr);
        } else {
          this.$toast({
            message: res.data.Msg,
            position: 'bottom',
            duration: 3000
          })
        }
      })
    },
    getCurrentPrice (str, type) {//获取持仓合约的现价
      this.$http.post(api.stockCurrent, {id: str, status: 0}).then(res => {
        // console.log('获取持仓合约的现价', res);
        if (res.data.Status === '1') {
          if (type === 'combine') {
            this.combinePrice = res.data.Data;
          } else if (type === 'separate') {
            this.separatePrice = res.data.Data
          }
        }
      });
      this.timer = setInterval(() => {
        this.$http.post(api.stockCurrent, {id: str, status: 0}).then(res => {
          // console.log('获取持仓合约的现价', res);
          if (res.data.Status === '1') {
            if (type === 'combine') {
              this.combinePrice = res.data.Data;
            } else if (type === 'separate') {
              this.separatePrice = res.data.Data
            }
          }
        })
      }, 3000);
    },
    getSeparateHold () {//获取分笔合约数据
      this.$http.post(api.separateHold).then(res => {
        // console.log('分笔持仓', res);
        if (res.data.Status === '1') {
          this.separateStr = '';
          for (let i = 0; i < res.data.Data.length; i++) {
            if (i !== res.data.Data.length -1) {
              this.separateStr += 'CON_OP_' + res.data.Data[i].Sc + ',';
            } else {
              this.separateStr += 'CON_OP_' + res.data.Data[i].Sc;
            }
          }
          this.separateHold = res.data.Data;
          this.getCurrentPrice(this.separateStr, 'separate');
          // console.log('分笔持仓字符串', this.separateStr);
        }
      })
    },
    formateDate (date) {//时间处理
      // console.log(new Date(date));
      var date2 = date.replace(/\-/g, '/');
      var date1 = new Date(date2);
      return date1.getFullYear() + '.' + (date1.getMonth() + 1 < 10 ? '0' + (date1.getMonth() + 1) : date1.getMonth() + 1) + '.' + (date1.getDate() < 10 ? '0' + date1.getDate() : date1.getDate() );
    }
  },
  created () {
    this.getHoldStocks();//获取合并持仓数据
  },
  mounted () {

  },
  watch: {
    selected: function (val) {
      clearInterval(this.timer);
      if (val == 2) {
        this.getSeparateHold();//获取分笔合约数据
      } else if (val == 1) {
        this.getHoldStocks();
      }
      // console.log(val);
    }
  },
  destroyed () {
    clearInterval(this.timer);
  }
}
</script>
<style>
  .close-header{
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
  .back{
    left: 0;
    position: absolute;
    height: 20px;
    top: 2px;
    cursor: pointer;
    padding: 10px;
  }
  .close-header .all-selected{
    right: 0;
    position: absolute;
    height: 20px;
    top: 2px;
    cursor: pointer;
    padding: 10px;
  }
  .close-out .content-body{
    bottom: 50px;
  }
  .close-out .content-body > div{
    width: 100%;
    height: 100%;
    position: relative;
    text-align: left;
  }

  /* mintui font-size更改 */
  .close-out .mint-tab-item-label{
    font-size: 15px;
    line-height: 20px;
    display: inline-block;
  }
  .close-out .mint-navbar .mint-tab-item{
    padding: 0;
  }
  .close-out .mint-navbar .mint-tab-item.is-selected{
    color: #3aaaff;
    font-weight: bold;
    /* border-bottom: 3px solid #3aaaff; */
    border: none;
  }
  .close-out .mint-navbar .mint-tab-item.is-selected .mint-tab-item-label{
    border-bottom: 3px solid #3aaaff;
  }
  .close-out .mint-navbar{
    padding: 10px 0;
  }
  /* .close-out .mint-tab-container-item,.close-out  .mint-tab-container{
    min-height: 100%;
  } */
  /* 持仓列表 */
  .close-out .close-outs-container{
    position: absolute;
    top: 90px;
    bottom: 0;
    left: 0;
    right: 0;
  }
  .close-out .close-outs-container > div{
    overflow-y: scroll;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    width: 100%;
    height: 100%;
    padding: 0 10px;
    box-sizing: border-box;
  }
  .close-out .close-outs-container > div::-webkit-scrollbar{
    display: none;
  }
  .close-out .close-out-situation {
    overflow: auto;
  }
  .close-out .close-out-situation > div.left,.close-out .close-out-situation > div.right{
    width: 50%;
    float: left;
  }
  .close-out .close-out-situation > div.current-price{
    clear: both;
    display: flex;
    /* justify-content: space-between;
    padding-right: 10px; */
    line-height: 20px;
  }
  .close-out .close-out-situation > div.current-price > div.inner-price{
    flex: 1;
    display: flex;
    justify-content: space-between;
    padding-right: 10px;
  }
  @media (device-height:480px) and (-webkit-min-device-pixel-ratio:2){/* 兼容iphone4/4s */
    .close-out .close-out-situation > div.current-price > span:nth-last-child(1), .close-out .close-out-situation > div.current-price > span:nth-last-child(2){
      margin-left: 25px;
    }
    .close-out .close-outs-container{
      top: 92px;
    }
  }
  @media (device-height:568px) and (-webkit-min-device-pixel-ratio:2){/* 兼容iphone5 */
    .close-out .close-out-situation > div.current-price > span:nth-last-child(1), .close-out .close-out-situation > div.current-price > span:nth-last-child(2){
      margin-left: 25px;
    }
    .close-out .close-outs-container{
      top: 92px;
    }
  }
  .close-out .close-out-situation > div.current-price > span:nth-child(1), .close-out .close-out-situation > div > div > span:nth-child(1) {
    margin-right: 10px;
  }
  .close-out .list-item{
    /* border: 1px solid #3aaaff; */
    border-radius: 4px;
    position: relative;
  }
  .close-out .list-item .title{
    overflow: auto;
  }
  .close-out .list-item .title > span:nth-child(1){
    float: left;
  }
  .close-out .list-item .title > span.contract > span {
    margin-right: 10px;
  }
  .close-out .list-item .title > span:nth-child(2){
    float: right;
  }
  /* .close-out  div.current-price > span:nth-last-child(1), .close-out div.current-price > span:nth-last-child(2){
    margin-left: 14px;
  } */
  .close-out .list-item > img{
    position: absolute;
    bottom: 0;
    right: 0;
    width: 30px;
    height: 30px;
  }
  .close-out .commit{
    position: fixed;
    bottom: 0;
    height: 50px;
    line-height: 50px;
    left: 0;
    right: 0;
  }
  
</style>
