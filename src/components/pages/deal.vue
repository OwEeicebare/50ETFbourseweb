<template>
  <div class="deal">
    <CHeader title="交易"></CHeader>
    <div class="content-body has-header main-bg">
      <div class="assist-color3">
        <!-- 交易类型 -->
        <div class="deal-types normal-padding main-bg normal-margin">
          <div @click="buy">
            <img :src="theme ? '/static/images/black/icon_deal_buy.svg': '/static/images/deal/icon_deal_buy.svg'" alt="">
            <p>买入</p>
          </div>
          <div @click="sell" >
            <img :src="theme ? '/static/images/black/icon_deal_sell.svg' : '/static/images/deal/icon_deal_sell.svg'" alt="">
            <p>卖出</p>
          </div>
          <router-link tag="div" to="/close-out">
            <img :src="theme ? '/static/images/black/icon_deal_allsell.svg' : '/static/images/deal/icon_deal_allsell.svg'" alt="">
            <p>一键平仓</p>
          </router-link>
          <router-link tag="div" to="/revoke">
            <img :src="theme ? '/static/images/black/icon_deal_recall.svg' : '/static/images/deal/icon_deal_recall.svg'" alt="">
            <p>撤单</p>
          </router-link>
          <router-link tag="div" to="/query">
            <img :src="theme ? '/static/images/black/icon_deal_query.svg' : '/static/images/deal/icon_deal_query.svg'" alt="">
            <p>查询</p>
          </router-link>
        </div>
        <div class="deal-content">
          <div class="main-bg">
            <!-- 持仓tab -->
            <mt-navbar v-model="selected">
              <mt-tab-item id="1" class="font28">合并持仓</mt-tab-item>
              <mt-tab-item id="2" class="font28">分笔持仓</mt-tab-item>
            </mt-navbar>
            <!-- 持仓列表 -->
            <div class="deals-container">
              <div>
                <mt-tab-container v-model="selected" :swipeable="true">
                  <!-- 合并持仓 -->
                  <mt-tab-container-item id="1">
                    <div v-if="cHolds.length">
                      <div v-for="item in cHolds" :key="item.Sc" :class="{'list-item': true, 'normal-margin': true, 'deal-border': !theme, 'assist-color4': theme}">
                        <div :class="{'title': true, 'white-color': true, 'deal-bg-color': !theme, 'normal-padding': true, 'assist-color3': theme}">
                          <span class="contract"><span>{{item.Sc}}</span>{{item.Sn}}</span>
                          <span>到期：{{formateDate(item.Tc)}}</span>
                        </div>
                        <div class="deal-situation normal-padding">
                          <div class="left">
                            <div class="normal-margin">
                              <span class="main-text-color2">总<span class="hidden">q</span>市<span class="hidden">q</span>值</span>
                              {{item.PriceCu ? (item.PriceCu * item.Dnu * item.Num).toFixed(2) : 0.00}}
                            </div>
                            <div class="normal-margin">
                              <span class="main-text-color2">成本均价</span>
                              <span>{{item.Dp?item.Dp.toFixed(4):'--'}}</span>
                            </div>
                            <div class="normal-margin">
                              <span class="main-text-color2">最新价格</span>
                              <span> {{item.PriceCu ? item.PriceCu.toFixed(4):item.PriceCu==0?'0.0000':'--'}}</span>
                            </div>
                          </div>
                          <div class="right">
                            <div class="normal-margin">
                              <!-- <span class="main-text-color2">总盈亏</span><span :class="{'rise-color': item.PriceCu > item.Dp, 'drop-color': item.PriceCu < item.Dp}">{{((item.PriceCu-item.Dp)* item.Dnu * item.Num).toFixed(2)}}</span> -->
                              <span class="main-text-color2">盈亏金额</span>
                              <span :class="{'rise-color':Number( item.DealMoney) < Number(item.PriceCu* item.Dnu * item.Num), 'drop-color': Number(item.DealMoney) > Number(item.PriceCu*item.Dnu*item.Num) }">
                                {{item.PriceCu?((item.PriceCu* item.Dnu * item.Num)-item.DealMoney).toFixed(2)==0?'0.00':((item.PriceCu* item.Dnu * item.Num)-item.DealMoney).toFixed(2):'--'}}
                                </span>
                            </div>
                            <div class="normal-margin">
                              <span class="main-text-color2">盈亏比例</span>
                              <span :class="{'rise-color':Number( item.DealMoney) < Number(item.PriceCu* item.Dnu * item.Num), 'drop-color': Number(item.DealMoney) > Number(item.PriceCu*item.Dnu*item.Num) }"> 
                                {{item.PriceCu?((item.PriceCu* item.Dnu * item.Num)-item.DealMoney).toFixed(2)==0?'0.00':((((item.PriceCu* item.Dnu * item.Num)-item.DealMoney)/item.DealMoney*100).toFixed(2))+"%":'--'}}</span>
                            </div>
                            <div class="normal-margin">
                              <span class="main-text-color2">持仓数量</span>
                              <span>{{item.Dnu?item.Dnu:'--'}}张</span>
                            </div>
                          </div>
                          <!-- <div class="current-price">
                            <span class="main-text-color2">现<span class="hidden">现价</span>价</span>
                            <div class="inner-price">
                              <span :class="{'rise-color': item.PriceDatye > 0, 'drop-color': item.PriceDatye < 0}">
                              {{item.PriceCu ? item.PriceCu.toFixed(4):item.PriceCu==0?'0.0000':'--'}}
                              </span>
                              <span :class="{'rise-color': item.PriceDatye > 0, 'drop-color': item.PriceDatye < 0}">
                              {{item.PriceDatye ? (item.PriceDatye > 0 ? '+' : '') + item.PriceDatye : item.PriceDatye==0?'0.0000':'--'}}
                              </span>
                              <span :class="{'rise-color': item.PriceDatye > 0, 'drop-color': item.PriceDatye < 0}">
                              {{item.PriceDa ? (item.PriceDa > 0 ? '+' : '') + item.PriceDa:item.PriceDa==0?'0.00':'--'}}%
                              </span>
                            </div>
                          </div> -->
                        </div>
                        <div class="deal-operate">
                          <router-link tag="div" :to="{path: '/buy', query: {code: item.Sc}}" class="deal-buy deal-bg-color white-color">买入</router-link>
                          <div class="spearate"></div>
                          <router-link tag="div" :to="{path: '/sell', query: {code: item.Sc}}" class="deal-sell deal-bg-color white-color">卖出</router-link>
                        </div>
                      </div>
                    </div>
                    <div v-else class="no-data main-text-color2">暂无数据</div>
                  </mt-tab-container-item>
                  <!-- 分笔持仓 -->
                  <mt-tab-container-item id="2">
                    <div v-if="sHolds.length">
                      <div v-for="item in sHolds" :key="item.Id" :class="{'list-item': true, 'normal-margin': true, 'deal-border': !theme, 'divide-item': true, 'assist-color4': theme}">
                        <div :class="{'title': true, 'white-color': true, 'deal-bg-color': !theme, 'normal-padding': true, 'assist-color3': theme}">
                          <span class="contract"><span>{{item.Sc}}</span><span>{{item.Sn}}</span><!-- --></span>
                          <span>到期:{{item.Tc ? formateDate(item.Tc) : ''}}</span>
                        </div>
                        <div class="deal-situation normal-padding">
                          <div class="left">
                            <div class="normal-margin">
                              <span class="main-text-color2">总<span class="hidden">q</span>市<span class="hidden">q</span>值</span>{{item.PriceCu ? (item.PriceCu * item.Dnu * item.Num).toFixed(2) : '0.00'}}
                            </div>
                            <div class="normal-margin">
                              <span class="main-text-color2">成本均价</span>
                              <span>{{item.Dp?item.Dp.toFixed(4):'--'}}</span>
                            </div>
                             <div class="normal-margin">
                              <span class="main-text-color2">最新价格</span>
                              <span>
                              {{item.PriceCu ? item.PriceCu.toFixed(4):item.PriceCu==0?'0.0000':'--'}}
                              </span>
                            </div>
                          </div>
                          <div class="right">
                            <div class="normal-margin">
                              <span class="main-text-color2">盈亏金额</span>
                              <span :class="{'rise-color': item.PriceCu > item.Dp, 'drop-color': item.PriceCu < item.Dp}">
                                {{item.PriceCu?((item.PriceCu-item.Dp)* item.Dnu * item.Num).toFixed(2):'--'}}
                              </span>
                            </div>
                            <div class="normal-margin">
                              <span class="main-text-color2">盈亏比例</span>
                              <span :class="{'rise-color': item.PriceCu > item.Dp, 'drop-color': item.PriceCu < item.Dp}">
                                 {{item.PriceCu?((item.PriceCu-item.Dp)* item.Dnu * item.Num/(item.Dp* item.Dnu * item.Num)*100).toFixed(2)+"%":'--'}}
                              </span>
                            </div>
                            <div class="normal-margin">
                              <span class="main-text-color2">持仓数量</span>
                              <span>{{item.Dnu?item.Dnu:'--'}}张</span>
                            </div>
                            <i class="stop-label main-color1 white-color font20" v-if="item.ToBln||item.TsBln">止</i>
                          </div>
                          <!-- <div class="current-price">
                            <span class="main-text-color2">现<span class="hidden">现价</span>价</span>
                            <div class="inner-price">
                              <span :class="{'rise-color': item.PriceDatye > 0, 'drop-color': item.PriceDatye < 0}">
                              {{item.PriceCu ? item.PriceCu.toFixed(4):item.PriceCu==0?'0.0000':'--'}}
                              </span>
                              <span :class="{'rise-color': item.PriceDatye > 0, 'drop-color': item.PriceDatye < 0}">
                              {{item.PriceDatye ? (item.PriceDatye > 0 ? '+' : '') + item.PriceDatye :item.PriceDatye==0?'0.0000':'--'}}
                              </span>
                              <span :class="{'rise-color': item.PriceDatye > 0, 'drop-color': item.PriceDatye < 0}">
                              {{item.PriceDa ? (item.PriceDa > 0 ? '+' : '') + item.PriceDa:item.PriceDa==0?'0.00':'--'}}%
                              </span>
                            </div>
                          </div> -->
                        </div>
                        <div class="deal-operate">
                          <div :class="{'deal-buy': true, 'deal-bg-color': activeSetId != item.Id, 'white-color': true, 'main-color2': activeSetId == item.Id }" :data-id="item.Id" @click="controlSet">止盈止损设置</div>
                          <div class="spearate"></div>
                          <div @click="openPop" :data-item="JSON.stringify(item)" class="deal-sell deal-bg-color white-color">卖出</div>
                        </div>
                        <div :class="{'set-stop': true, 'animate': activeSetId == item.Id,'font28': true }">
                          <div>{{tofit==0?'设置涨幅':'涨幅'+tofit+'%止盈'}}<span class="main-text-color2 font24">(当日有效)</span><span><mt-switch v-model="item.ToBln" @change="tip(item,0)"></mt-switch></span></div>
                          <div>{{sloss==0?'设置跌幅':'跌幅'+sloss+'%止损'}}<span class="main-text-color2 font24">(当日有效)</span><span><mt-switch v-model="item.TsBln"  @change="tip(item,1)"></mt-switch></span></div>
                        </div>
                      </div>
                    </div>
                    <div v-else class="no-data main-text-color2">暂无数据</div>
                  </mt-tab-container-item>
                </mt-tab-container>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <TabNav></TabNav>
    <div class="pup_cover" v-if="show_bg"></div>
    <div id="loding" v-if="show_loding"><img  src="../../../static/logding.svg" alt=""></div>
  </div>
</template>
<script>
import api from '@/api'
import CHeader from '@/components/common/IHeader.vue'
import TabNav from '@/components/common/TabNav.vue'
export default {
  data () {
    return {
      selected: '1',
      // 当前点击止盈止损设置
      activeSetId: '',
      // 止盈switch
      upStop: false,
      // 止损switch
      downStop: false,
      allPositions: [],//合并持仓
      separateHold: [],// 分笔持仓
      allStr: '',//合并持仓的代码
      separateStr: '', //分笔持仓的合约代码
      combinePrice: [], //合并持仓实时数据
      separatePrice: [], //分笔持仓实时数据
      timer: null, //定时器
      show_pop: false,
      popData: {},
      fee: 0,
      sloss: 0, //止损
      tofit: 0, //止盈
      show_loding:false,//显示加载特效
      show_bg:false,//显示蒙版
    }
  },
  computed: {
    cHolds () {//处理后的合并持仓数据
      if (this.combinePrice.length) {
        for (let i = 0; i < this.combinePrice.length; i++) {
          for (let j = 0; j < this.allPositions.length; j++) {
            if (this.combinePrice[i].stock == this.allPositions[j].Sc) {
              // this.allPositions[j].PriceCu = this.combinePrice[i].PriceCu;
              this.allPositions[j].PriceDa = this.combinePrice[i].PriceDa;
              this.allPositions[j].PriceDatye = this.combinePrice[i].PriceDatye;
              this.allPositions[j].PriceCu = this.combinePrice[i].PriceCu;
              // break;
            }
          }
        }
        // console.log(this.allPositions)
        return this.allPositions;
      }
      return this.allPositions;
    },
    sHolds () {//处理后的分笔持仓数据
      if (this.separatePrice.length) {
        for (let i = 0; i < this.separatePrice.length; i++) {
          for (let j = 0; j < this.separateHold.length; j++) {
            if (this.separatePrice[i].stock == this.separateHold[j].Sc) {
              // this.separateHold[j].PriceCu = this.separatePrice[i].PriceCu;
              this.separateHold[j].PriceDa = this.separatePrice[i].PriceDa;
              this.separateHold[j].PriceDatye = this.separatePrice[i].PriceDatye;
              this.separateHold[j].PriceCu = this.separatePrice[i].PriceCu;
              this.separateHold[j].To = this.separateHold[j].To==1?true:false;
              this.separateHold[j].Ts = this.separateHold[j].Ts==1?true:false;
              // break;
            }
          }
        }
        return this.separateHold;
      }
      return this.separateHold;
    },
    userId () {
      let login = localStorage.getItem('login');
      if (login != null) {
        return (JSON.parse(login)).Id;
      } else {
        return 0;
      }
    },
    theme () {
      // console.log(localStorage.getItem('theme') != null ? JSON.parse(localStorage.getItem('theme')).theme : 0);
      return localStorage.getItem('theme') != null ? JSON.parse(localStorage.getItem('theme')).theme : 0;
    }
  },
  components: {
    TabNav,
    CHeader
  },
  methods: {
    buy(){//买入
      this.get_realy('/buy');
    },
    sell(){//卖出
      this.get_realy('/sell');
    },
    get_realy(params){
      this.$http.post(api.autonymState).then(res=>{
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
          }else{//已认证
            this.$router.push(params)
          }
        }
      })
    },
    controlSet (e) {
      var id = e.target.dataset.id;
      if (id == this.activeSetId) {
        this.activeSetId = 0;
      } else {
        this.activeSetId = id;
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
          // this.$toast({
          //   message: res.data.Msg,
          //   position: 'bottom',
          //   duration: 3000
          // })
        }
      })
    },
    getCurrentPrice (str, type) {//获取持仓合约的现价
      if (str) {
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
                this.separatePrice = res.data.Data;
              }
            }
          })
        }, 1000);
      }
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
    },
    openPop (e) {//分笔卖出
      // let item = JSON.parse(e.target.dataset.item);
      // // console.log(item);
      // this.popData = item;
      // this.show_pop = true;
      var obj = JSON.parse(e.target.dataset.item)
      sessionStorage.setItem("deal",e.target.dataset.item)
      this.$router.push({path:'/sell',query:{"code":obj.Sc}})
    },
    // getSellFee () {
    //   this.$http.post(api.fee, {usId: Number(this.userId),stockcode: ''}).then(res => {
    //     console.log('fee', res);
    //     if (res.data.Status === '1') {
    //       this.fee = res.data.Data.saate;
    //     }
    //   })
    // },
    getLoss () {//获取止盈止损数据
      this.$http({url: api.profitLoss, params: {usId: Number(this.userId)},method: 'post'}).then(res => {
        if (res.data.Status === '1') {
          this.sloss = res.data.Data.sloss;
          this.tofit = res.data.Data.tofit;
        }
      })
    },
    zys(obj,type){//设置合约止盈止损
      this.show_loding=true;
      this.show_bg=true;
      var par={
        HoldID: obj.Id,
        Target: 0,
        Stop: 0
      }
      par.Target=obj.ToBln==false?0:1;
      par.Stop=obj.TsBln==false?0:1;
      this.$http.post(api.setTargetOrStop,par).then(res=>{
        if(res.data.Status==1){
          this.$toast({
            message: "设置成功",
            position: 'bottom',
            duration: 1000
          });
        }else{
          this.$toast({
            message: res.data.Msg,
            position: 'bottom',
            duration: 2000
          });
        }
        this.show_loding=false;
        this.show_bg=false;
      });
    },
    tip(val1,val2){//设置止盈止损询问是否弹窗
      if(val2==0&&this.tofit==0){//如果是止盈开关并且没有设置止盈值则询问设置值
        this.$message({
          title: "设置止盈止损",
          message: "您还未设置止盈和止损策略",
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: "马上设置",
          confirmButtonHighlight: true,
          cancelButtonText: "返回交易"
        }).then(action => {
          if (action == "confirm") {
            this.$router.push('/set-drop?type=rise&param=0');
          }
        });
        return;
      }else if(val2==1&&this.sloss==0){//如果是止损开关并且没有设置止盈值则询问设置值
        this.$message({
          title: "设置止盈止损",
          message: "您还未设置止盈和止损策略",
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: "马上设置",
          confirmButtonHighlight: true,
          cancelButtonText: "返回交易"
        }).then(action => {
          if (action == "confirm") {
            this.$router.push('/set-drop?type=drop&param=0');
          }
        });
        return;
      }
      var time = localStorage.getItem("tipTime");//获取是否设置过期时间
      var now = new Date();
      var year=now.getFullYear();
      var month =now.getMonth();
      var day=now.getDate();
      if(!time){//如果没设置则弹框
        this.$message({
          title: '温馨提醒',
          message: '止盈止损功能仅针对该订单中持仓且未进行委托的合约生效，已委托未成交的合约按实际委托为准！',
          cancelButtonText:'确认',
          confirmButtonText:'今日不再提示',
          showCancelButton:true,
          closeOnClickModal:false,
        }).then(action => {
          //设置操作
          this.zys(val1,val2);
          if (action === 'confirm') {//如果设置今日不再提示
           localStorage.setItem("tipTime",year+"-"+month+"-"+day);
          }
        })
      }else{
        if(time==year+"-"+month+"-"+day){//如果不再时间范围内
          this.zys(val1,val2);
        }else{
          this.$message({
            title: '温馨提醒',
            message: '止盈止损功能仅针对该订单中持仓且未进行委托的合约生效，已委托未成交的合约按实际委托为准！',
            cancelButtonText:'确认',
            confirmButtonText:'今日不再提示',
            showCancelButton:true,
            closeOnClickModal:false,
          }).then(action => {
            //设置操作
            this.zys(val1,val2);
            if (action === 'confirm') {//如果设置今日不再提示
             localStorage.setItem("tipTime",year+"-"+month+"-"+day);
            }
          })
        }
      }
    }
  },
  created () {
    this.getHoldStocks();//获取合并持仓数据
    // this.getSellFee();//获取服务费
    this.getLoss();//获取止盈止损数据

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
    },
    upStop: function (val) {
      let id = this.activeSetId;
      if (val) {//止盈

      } else {//关闭止盈

      }
    },
    downStop: function (val) {
      if (val) {//止损

      } else {//关闭止损

      }
    }
  },
  destroyed () {
    clearInterval(this.timer);
  }
}
</script>
<style>
  /* 遮盖层 */
  .pup_cover{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(0, 0,0, 0.3);
    z-index: 200000;
  }
  #loding{
    width: 38px;
    height: 38px;
    position: fixed;
    z-index: 200000;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    display: inline-block;
    margin: auto;
  }
  .deal i{
    font-style: normal;
  }
  .deal .stop-label{
    display: inline-block;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    line-height: 20px;
    text-align: center;
    /* vertical-align: text-bottom; */
    position: absolute;
    right: 0;
    top: 0;
  }
  .deal .content-body{
    bottom: 50px;
    text-align: left;
  }
  .deal .content-body > div{
    width: 100%;
    height: 100%;
    position: relative;
  }
  .deal .deal-types{
    /* border-top: 1px solid #d9d9d9; */
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    text-align: center;
    padding: 12px;
  }
  .deal .deal-types > div > img{
    width: 50px;
    height: 50px;
    /* margin-bottom: 10px; */
    /* padding: 0 10px 10px 10px; */
  }
  .deal .deal-content{
    position: absolute;
    top: 109px;
    bottom: 0;
    left: 0;
    right: 0;
  }
  .deal .deal-content > div{
    width: 100%;
    height: 100%;
    position: relative;
  }

  /* mintui font-size更改 */
  .deal .mint-tab-item-label{
    font-size: 15px;
    line-height: 20px;
    display: inline-block;
  }
  .deal .mint-navbar .mint-tab-item{
    padding: 0;
  }
  .deal .mint-navbar .mint-tab-item.is-selected{
    color: #3aaaff;
    font-weight: bold;
    /* border-bottom: 3px solid #3aaaff; */
    border: none;
  }
  .deal .mint-navbar .mint-tab-item.is-selected .mint-tab-item-label{
    border-bottom: 3px solid #3aaaff;
  }
  .deal .mint-navbar{
    padding: 10px 0;
  }
  /* .deal .mint-tab-container-item,.deal  .mint-tab-container{
    min-height: 100%;
  } */
  /* 持仓列表 */
  .deal .deals-container{
    position: absolute;
    top: 40px;
    bottom: 0;
    left: 0;
    right: 0;
  }
  .deal .deals-container > div{
    overflow-y: scroll;
    overflow-x: hidden;
    width: 100%;
    height: 100%;
    -webkit-overflow-scrolling: touch;
    /* padding: 0 10px; */
    box-sizing: border-box;
  }
  .deal .mint-tab-container-item{
    padding: 0 10px;
    box-sizing: border-box;
  }
  .deal .deals-container > div::-webkit-scrollbar{
    display: none;
  }
  .deal .deal-situation {
    overflow: auto;
  }
  .deal .deal-situation > div.left,.deal .deal-situation > div.right{
    width: 50%;
    float: left;
    position: relative;
  }
  .deal .deal-situation > div.current-price > span:nth-child(1), .deal .deal-situation > div > div > span:nth-child(1) {
    margin-right: 10px;
  }
  .deal .list-item{
    /* border: 1px solid #3aaaff; */
    border-radius: 4px;
  }
  .deal .divide-item .title{
    font-size: 14px;
  }
  .deal .list-item .title{
    overflow: auto;
    font-size: 14px;
  }
  .deal .list-item .title > span:nth-child(1){
    float: left;
  }
  .deal .list-item .title > span.contract > span {
    margin-right: 8px;
  }
  .deal .list-item .title > span:nth-child(2){
    float: right;
  }
  /* .deal .deal-situation > div.current-price > span:nth-last-child(1), .deal .deal-situation > div.current-price > span:nth-last-child(2){
    margin-left: 14px;
  } */
  .deal .deal-situation > div.current-price > div.inner-price{
    flex: 1;
    display: flex;
    justify-content: space-between;
    padding-right: 10px;
  }
  .deal .deal-operate{
    display: flex;
    padding: 0 10px 10px 10px;
  }
  .deal .deal-operate > div.deal-buy, .deal .deal-operate > div.deal-sell{
    flex-grow: 1;
    text-align: center;
    padding: 10px 0;
    border-radius: 4px;
    position: relative;
  }
  .deal .deal-operate > div.main-color2::after{
    content: '';
    border-width: 5px;
    border-color: #3aaaff transparent transparent transparent;
    border-style: solid;
    position: absolute;
    left: 50%;
    margin-left: -11px;
    bottom: -10px;
    background: transparent;
  }
  .deal .current-price{
    clear: both;
    display: flex;
    /* justify-content: space-between;
    padding-right: 10px; */
    line-height: 20px;
  }
  .deal .deal-operate > div.spearate{
    width: 10px;
  }
  .deal .set-stop{
    padding: 0 20px;
    height: 0;
    animation: all .8s linear;
    overflow: hidden;
  }
  .deal div.animate{
    height: auto;
    animation: all .8s linear;
  }
  .deal .set-stop > div{
    height: 50px;
    line-height: 50px;
    overflow: hidden;
  }
  .deal .set-stop > div > span:nth-last-child(1){
    float: right;
    margin-top: 14px;
  }
  /* 遮盖层 */
.deal .pup_cover{
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0,0, 0.5);
  z-index: 200000;
}
.deal .pup{
  position: fixed;
  z-index: 200001;
  background: #fff;
  left: 0;
  right: 0;
  top:50%;
  transform: translateY(-50%);
  width: 250px;
  margin:auto;


  border-radius: 5px;
}
.deal .pup .pup_title{
  height: 40px;
  line-height: 40px;
  font-size: 16px;
  font-weight: bold;
}
.deal .pup .pup_content>div{
  text-align: left;
  padding: 0 10px;
  height: 30px;
  line-height: 30px;
  box-sizing: border-box;
}
.deal .pup_tips{
  font-size: 12px;
  text-align: left;
  background:#FFEBEB;
  color: #FF7A7D;
  margin:  10px;
  padding: 0
}
.deal .pup .pup_content>div>span:first-child{
  margin-right: 10px;
  color: #999;
}
.deal .pup_btns{
  height: 50px;
  line-height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #e4e4e4;
}
.deal .pup_btns>span{
  flex-grow: 1
}
.deal .pup_btns>span:first-child{
  border-right: 1px solid #e4e4e4;
  color: #999;
}
.deal .pup_btns>span:last-child{
  color: #3aaaff;
}
.deal .sell_btn{
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 50px;
  color: #fff;
  background: #3aafff;
  line-height:50px;
  font-size: 14px;
}
</style>
