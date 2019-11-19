<template>
  <div class="history-delegate">
    <div class="delegate-header font32 main-bg normal-border-color">
      <img :src="theme ? '/static/images/header/transparent_arrow_left.svg' : '/static/images/header/arrow_left.svg'" alt="返回按钮" class="back"  @click="back">
      <h1 class="font32">当日止盈止损</h1>
      <!-- <img :src="theme ? '/static/images/black/icon_top_screen.svg' : '/static/images/deal/icon_top_screen.svg'" alt="" class="else-fun" @click="openMenu"> -->
      <!-- <div class="time-filter normal-padding main-bg normal-border-color">
        起止日期
        <div class="assist-color3 date-piker-wrap">
          <input type="text" @focus="arouseStart" v-model="startDateStr" placeholder="起始日期" class="main-text-color1">
          <span>~</span>
          <input type="text" @focus="arouseEnd" v-model="endDateStr" placeholder="截止日期" class="main-text-color1">
        </div>
      </div> -->
    </div>
    <div class="content-body has-header">
      <div class="main-bg" id="init">
        <mt-loadmore class="main-bg" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore" :auto-fill="false" >
          <!-- 委托列表 -->
          <div v-for="item in positions" :key="item.id" :class="{'list-item': true, 'normal-margin': true, 'deal-border': !theme, 'assist-color4': theme}">
            <div :class="{'title': true, 'white-color': true, 'deal-bg-color': !theme, 'normal-padding': true,'assist-color3': theme}">
              <span class="contract"><span>{{item.Sc}}</span>{{item.Sn}}</span>
              <span>{{item.Tc | time()}}&nbsp;&nbsp;{{item.kj}}</span>
            </div>
            <div class="history-delegate-situation normal-padding">
              <!-- <div class="deal-money normal-margin">
                <span class="main-text-color2">交易金额</span>{{item.Dm}}
              </div> -->
              <div class="left">
                <div class="normal-margin">
                  <span class="main-text-color2">交易金额</span>{{Number(item.Dm).toFixed(2)}}
                </div>
                <div class="normal-margin">
                  <span class="main-text-color2">委托价格</span>{{Number(item.Dp).toFixed(4)}}
                </div>
                <div class="normal-margin">
                  <span class="main-text-color2">委托数量</span>{{item.Dn}}张
                </div>
                <div class="normal-margin" v-if="item.Dpr!=0">
                  <span class="main-text-color2">成交价格</span>{{Number(item.Dpr).toFixed(4)}}
                </div>
              </div>
              <div class="right">
                <div class="normal-margin">
                  <span class="main-text-color2">止盈/止损比</span>{{item.ProfitLossRate}}
                </div>
                <div class="normal-margin">
                  <span class="main-text-color2">交易类型</span>{{item.Dts}}
                </div>
                <div class="normal-margin">
                  <span class="main-text-color2">订单状态</span>{{item.Kt}}
                </div>
                <div class="normal-margin" v-if="item.Dnu!= 0">
                  <span class="main-text-color2">成交数量</span>{{item.Dnu}}张
                </div>
              </div>
            </div>
          </div>
          <div v-if="positions.length==0" class="no-data main-text-color2">暂无止盈止损数据</div>
        </mt-loadmore>
      </div>
    </div>
    <!-- <transition name="slide-fade">
      <div class="condition-menu actived" v-if="menuOpen">
        <div class="condition-menu-container main-bg">
          <h2 class="font32 normal-margin">订单状态<span class="rise-color font28 cancel-filter" @click="cancelFilter">取消筛选</span></h2>
          <ul class="font28" @click="changeActivedState">
            <li :class="{'normal-margin': true, 'assist-color3': activedState !== 1, 'rise-color': activedState === 1, 'order-selected': activedState === 1}" data-state="1">已提</li>
            <li :class="{'normal-margin': true, 'assist-color3': activedState !== 6, 'rise-color': activedState === 6, 'order-selected': activedState === 6}" data-state="6">已报</li>
            <li :class="{'normal-margin': true, 'assist-color3': activedState !== 11, 'rise-color': activedState === 11, 'order-selected': activedState === 11}" data-state="11">部成</li>
            <li :class="{'normal-margin': true, 'assist-color3': activedState !== 3, 'rise-color': activedState === 3, 'order-selected': activedState === 3}" data-state="3">已成</li>
            <li :class="{'normal-margin': true, 'assist-color3': activedState !== 7, 'rise-color': activedState === 7, 'order-selected': activedState === 7}" data-state="7">已撤</li>
            <li :class="{'normal-margin': true, 'assist-color3': activedState !== 10, 'rise-color': activedState === 10, 'order-selected': activedState === 10}" data-state="10">部撤</li>
            <li :class="{'normal-margin': true, 'assist-color3': activedState !== 5, 'rise-color': activedState === 5, 'order-selected': activedState === 5}" data-state="5">失效</li>
          </ul>
          <div class="sure-btn white-color main-color1" @click="closeMenu">确定</div>
        </div>
      </div>
    </transition> -->
  </div>
</template>
<script>
import Api from '@/api'
export default {
  data () {
    return {
      //搜索条件
      // Ts: "",//开始时间
      // Te:"",//结束时间
      // activedState: -1,//订单状态  1为已提 6为已报 11为部成 3为已成 7为已撤 10为部撤 5失效
      // page: 1,
      // limit: 3,
      // AgentId: 0,
      // OrderKey:"",
      // Sort:"",
      // SearchKey: "",
      //数据数组
      positions: [
      ],
      // //文本框日期
      // startDateStr: '',
      // endDateStr: '',
      // //菜单标志
      // menuOpen: false,
      limit: 5,
      page: 1,
      allLoaded: false,
    }
  },
  computed: {
    theme () {
      // console.log(localStorage.getItem('theme') != null ? JSON.parse(localStorage.getItem('theme')).theme : 0);
      return localStorage.getItem('theme') != null ? JSON.parse(localStorage.getItem('theme')).theme : 0;
    }
  },
  created(){
    this.get_list().then(res => {
      this.$nextTick(function () {
        document.getElementById('init').scrollTop = 0;
      })
    });;
  },
  methods: {
    back () {
      //退出历史委托清空存储时间
      var obj={
        start:'',
        end:'',
        startDate:'',
        endDate:''
      }
      this.$store.commit("CHANGE_STOP_DATE",obj)
      this.$router.push('/query');
    },
    loadBottom() {
      this.get_list()
    },
    //根据筛选对象查询历史委托
    get_list(){
      return this.$http.post(Api.stopData,{limit:this.limit,page:this.page}).then(res=>{
        if(res.data.Status==="1"){
          var result = res.data.Data;
          for(var i = 0,len=result.length;i<len;i++){
            this.positions.push(result[i]);
          }
          this.page=this.page+1;
          if(this.positions.length<res.data.Count){
            this.isAllLoaded = false;
          }else{
            this.allLoaded = true;
          }
        }else{
          this.isAllLoaded = false;
        }
        this.$refs.loadmore.onBottomLoaded();
      })
    },
    // //打开日历
    // arouseStart () {
    //   this.$router.push({path: '/calendar', query: {origin: 'query-stop', start: this.$store.state.stopDate.startDate, end: this.$store.state.stopDate.endDate}});
    // },
    // //打开日历
    // arouseEnd () {
    //   this.$router.push({path: '/calendar', query: {origin: 'query-stop', start: this.$store.state.stopDate.startDate, end: this.$store.state.stopDate.endDate}});
    // },
    // // 打开条件菜单
    // openMenu () {
    //   this.menuOpen = true;
    // },
    // //关闭条件菜单，并查询
    // closeMenu () {
    //   //初始化数组
    //   this.positions=[];
    //   var objs = {
    //     "Ts":this.$store.state.stopDate.startDate,
    //     "Te":this.$store.state.stopDate.endDate,
    //     "Pe":this.activedState,//订单状态
    //     "AgentId": 0,
    //     "page":1,
    //     "limit":3,
    //     "OrderKey":"",
    //     "Sort":"",
    //     "SearchKey": ""
    //   };
    //   this.get_list(objs);
    //   this.menuOpen = false;
    // },
    // //订单状态条件选择
    // changeActivedState (e) {
    //   if (this.activedState === Number(e.target.dataset.state)) {
    //     this.activedState = -1;
    //   } else {
    //     this.activedState = Number(e.target.dataset.state);
    //   }
    // },
    // cancelFilter () {//取消筛选
    //   this.activedState = -1;
    //   var objs = {
    //     "Ts":this.$store.state.stopDate.startDate,
    //     "Te":this.$store.state.stopDate.endDate,
    //     "Pe":this.activedState,//订单状态
    //     "AgentId": 0,
    //     "page":1,
    //     "limit":3,
    //     "OrderKey":"",
    //     "Sort":"",
    //     "SearchKey": ""
    //   };
    //   this.get_list(objs);
    //   this.menuOpen = false;
    // }
  },
  // mounted () {
  //   // this.startDateStr = this.$store.state.stopDate.start;
  //   // this.endDateStr = this.$store.state.stopDate.end;
  // },
  
  filters:{
    time (date) {//时间处理
      // console.log(new Date(date));
      var date2 = date.replace(/\-/g, '/');
      var date1 = new Date(date2);
      return (date1.getHours() < 10 ? '0' + date1.getHours() : date1.getHours() )+":"+(date1.getMinutes() < 10 ? '0' + date1.getMinutes() : date1.getMinutes() )+":"+(date1.getSeconds() < 10 ? '0' + date1.getSeconds() : date1.getSeconds() );
    },
  }
}
</script>
<style scoped>
  .history-delegate{
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .delegate-header{
    position: fixed;
    height: 24px;
    line-height: 24px;
    width: 100vw;
    text-align: center;
    top: 0;
    padding-top: 10px;
    padding-bottom: 10px;
    z-index: 1001;
    border-bottom-style: solid;
    border-bottom-width: 1px;
  }
  .back, .else-fun{
    position: absolute;
    height: 20px;
    top: 2px;
    cursor: pointer;
    padding: 10px;
  }
  .back{
    left: 0;
  }
  .else-fun{
    right: 0;
  }
  .time-filter{
    overflow: auto;
    position: absolute;
    top: 44px;
    border-top-width: 1px;
    border-top-style: solid;
    width: 100%;
    text-align: left;
    box-sizing: border-box;
    z-index: 1001;
  }
  .date-piker-wrap{
    position: absolute;
    width: 60%;
    padding: 5px 0 5px 10px;
    border-radius: 4px;
    position: absolute;
    right: 10px;
    top: 6px;
  }
  .date-piker-wrap > input{
    border: none;
    background-color: transparent;
    max-width: 35%;
  }
  .history-delegate .content-body{
    box-sizing: border-box;
    top:44px;
  }
  .history-delegate .content-body > div{
    overflow-y: scroll;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    width: 100%;
    height: 100%;
    padding: 10px 10px 0;
    box-sizing: border-box;
    text-align: left;
    position: relative;
  }
  .history-delegate .content-body > div::-webkit-scrollbar{
    display: none;
  }
  .history-delegate .history-delegate-situation {
    overflow: auto;
  }
  .history-delegate .history-delegate-situation > div.left,.history-delegate .history-delegate-situation > div.right{
    width: 50%;
    float: left;
  }
  .history-delegate .history-delegate-situation > div.deal-money > span:nth-child(1), .history-delegate .history-delegate-situation > div > div > span:nth-child(1) {
    margin-right: 10px;
  }
  .history-delegate .list-item{
    border-radius: 4px;
    position: relative;
  }
  .history-delegate .list-item .title{
    overflow: auto;
  }
  .history-delegate .list-item .title > span:nth-child(1){
    float: left;
  }
  .history-delegate .list-item .title > span.contract > span {
    margin-right: 10px;
  }
  .history-delegate .list-item .title > span:nth-child(2){
    float: right;
  }
  .condition-menu{
    position: absolute;
    left: -10%;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, .4);
    z-index: 1002;
    /* transform: translateX(-100%);
    animation: all 2s ease-out; */
  }
  /* .condition-menu.actived{
    transform: translateX(0);
    animation: all 2s ease-in;
  } */
  .slide-fade-enter-active {
    transition: all .3s ease;
  }
  .slide-fade-leave-active {
    transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-to
  /* .slide-fade-leave-active for below version 2.1.8 */ {
    transform: translateX(10px);
    opacity: 0;
  }
  .condition-menu-container{
    width: 250px;
    height: 100%;
    float: right;
    padding: 20px 10px;
    box-sizing: border-box;
    letter-spacing: 1px;
    position: relative;
  }
  .condition-menu-container > h2{
    font-weight: 600;
    text-align: left;
    overflow: hidden;
  }
  .condition-menu-container > h2:nth-of-type(2){
    margin-top: 20px;
  }
  .order-selected {
    background-color: #fecacb;
  }
  .condition-menu-container ul > li, .condition-menu-container  div.sure-btn{
    height: 40px;
    line-height: 40px;
    border-radius: 4px;
  }
  .condition-menu-container  div.sure-btn{
    position: absolute;
    bottom: 20px;
    left: 10px;
    right: 10px;
  }
  .condition-menu-container  .cancel-filter{
    float: right;
    font-weight: normal;
  }
</style>
