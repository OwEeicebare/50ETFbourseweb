<template>
  <div class="journal-account">
    <div class="delegate-header font32 main-bg">
      <img :src="theme ? '/static/images/header/transparent_arrow_left.svg' : '/static/images/header/arrow_left.svg'" alt="返回按钮" class="back"  @click="back">
      <h1 class="font32">资金流水</h1>
      <img :src="theme ? '/static/images/black/icon_top_screen.svg' : '/static/images/deal/icon_top_screen.svg'" alt="" class="else-fun" @click="openMenu">
      <div class="time-filter normal-padding main-bg normal-border-color">
        起止日期
        <div class="assist-color3 date-piker-wrap">
          <input type="text" @focus="arouseStart" v-model="startDateStr" placeholder="起始日期" class="main-text-color1">
          <!-- <mt-datetime-picker v-model="startDate" type="date" year-format="{value} 年" month-format="{value} 月" date-format="{value} 日" :startDate="defaultDate" :endDate="defaultEndDate" ref="start" @confirm="handleStartConfirm">
          </mt-datetime-picker> -->
          <span>~</span>
          <input type="text" @focus="arouseEnd" v-model="endDateStr" placeholder="截止日期" class="main-text-color1">
          <!-- <mt-datetime-picker v-model="endDate" type="date" year-format="{value} 年" month-format="{value} 月" date-format="{value} 日" :startDate="defaultEDate" :endDate="defaultEndDate" ref="end" @confirm="handleEndConfirm">
          </mt-datetime-picker> -->
        </div>
      </div>
    </div>
    <div class="content-body has-header font28">
      <div class="main-bg">
        <!-- 委托列表 -->
         <mt-loadmore :bottom-method="loadBottom" ref="loadmore" :bottom-all-loaded="isAllLoaded" :auto-fill="false">
            <div v-if="recordsList.length" class="load-body">
              <div v-for="(item,index) in recordsList" :key="index">
                <!-- <div class="total-account assist-color3 main-text-color2 font24 normal-padding">{{item.Ym}} 支出：{{item.PullMoney}}元 收入：{{item.GetMoneys}}元</div> -->
                <ul>
                  <router-link tag="li" :to="{path: 'journal-details', query: {id: zitem.Id}}" v-for="zitem in item.MoneyFlowList" :key="zitem.Id" class="list-item normal-border-color">
                    <p>{{zitem.Lt}}</p>
                    <p class="font24 main-text-color2">{{zitem.Time}}</p>
                    <span :class="{'rise-color': zitem.Bn > 0, 'deal-money': true}">{{subMoney(zitem.Bn)}}元</span>
                    <span class="font24 main-text-color2 happen-money">余额：{{subMoney(zitem.BnMoeny)}}元</span>
                  </router-link>
                </ul>
              </div>
            </div>
            <div v-else class="main-text-color2 no-data">暂无资金流水</div>
          </mt-loadmore>
      </div>
    </div>
    <transition name="slide-fade">
      <div class="condition-menu actived" v-if="menuOpen">
        <div class="condition-menu-container main-bg">
          <h2 class="font32 normal-margin">交易类型<span class="rise-color font28 cancel-filter" @click="cancelFilter">取消筛选</span></h2>
          <ul class="font28" @click="changeActivedState">
            <li :class="{'normal-margin': true, 'assist-color3': activedState !== item.Id, 'rise-color': activedState === item.Id, 'order-selected': activedState === item.Id}" :data-state="item.Id" v-for="item in types" :key="item.Id">{{item.Name}}</li>
          </ul>
          <div class="sure-btn white-color main-color1" @click="closeMenu">确定</div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import api from '@/api'
export default {
  data () {
    return {
      // startDate: '',
      // endDate: '',
      startDateStr: '',
      endDateStr: '',
      menuOpen: false,
      activedState: 0,//0 为全部状态 1为已提 2为已报 3为部成 4为已成 5为已撤 6为部撤
      page: 1, //页码
      limit: 15, //限制
      recordsList: [], //
      isAllLoaded: false,
      types: [],
    }
  },
  computed: {
    // defaultDate () {
    //   return new Date('2019-01-30');
    // },
    // defaultEndDate () {
    //   return new Date();
    // },
    // defaultEDate () {
    //   if (this.startDate) {
    //     return this.startDate
    //   } else {
    //     return this.defaultDate;
    //   }
    // }
    theme () {
      // console.log(localStorage.getItem('theme') != null ? JSON.parse(localStorage.getItem('theme')).theme : 0);
      return localStorage.getItem('theme') != null ? JSON.parse(localStorage.getItem('theme')).theme : 0;
    }
  },
  methods: {
    back () {
      this.$router.push('/query');
    },
    arouseStart () {
      // this.$refs.start.open();
      this.$router.push({path: '/calendar', query: {origin: 'journal-account', start: this.$store.state.accountDate.startDate, end: this.$store.state.accountDate.endDate}});
    },
    arouseEnd () {
      // this.$refs.end.open();
      this.$router.push({path: '/calendar', query: {origin: 'journal-account', start: this.$store.state.accountDate.startDate, end: this.$store.state.accountDate.endDate}});
    },
    // handleStartConfirm () {
    //   if (this.startDate) {
    //     this.startDateStr = this.formatDate(this.startDate);
    //   } else {
    //     this.startDateStr = this.formatDate(this.defaultDate);
    //   }
    // },
    // handleEndConfirm () {
    //   if (this.endDate) {
    //     this.endDateStr = this.formatDate(this.endDate);
    //   } else {
    //     this.endDateStr = this.formatDate(this.defaultEndDate);
    //   }
    // },
    formatDate (time) {
      var date = new Date();
      date.setTime(time);
      var year = date.getFullYear();
      var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
      var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      return year + "." + month + "." + day;
    },
    subMoney (money) {//处理资产金额小数点后两位
      var mStr = money + '';
      var mArr = mStr.split(".");
      var pointStr = '';
      if (mArr.length === 1) {
        return money + '.00'
      } else{
        if (mArr[1].length === 1) {
          pointStr = mArr[1] + '0';
        } else {
          pointStr = mArr[1].substring(0, 2);
        }
      }
      return mArr[0] + '.' + pointStr;
    },
    // 打开条件菜单
    openMenu () {
      this.menuOpen = true;
    },
    closeMenu () {//关闭菜单
      this.menuOpen = false;
      this.page = 1;
      this.recordsList = [];
      this.getRecordList(this.page);
    },
    changeActivedState (e) {//流水类型
      if (this.activedState === Number(e.target.dataset.state)) {
        this.activedState = 0;
      } else {
        this.activedState = Number(e.target.dataset.state);
      }
    },
    getRecordList (page) {//获取充值记录
      let date = this.$store.state.accountDate;
      let start = date.startDate ? ((new Date(date.startDate)).getFullYear() + '-' + ((new Date(date.startDate)).getMonth() + 1) + '-' + new Date(date.startDate).getDate()) : '';
      let end = date.endDate ? ((new Date(date.endDate)).getFullYear() + '-' + ((new Date(date.endDate)).getMonth() + 1) + '-' + new Date(date.endDate).getDate()) : '';
      return this.$http.post(api.flow, {
        "Ts": start,
        "Te": end,
        "Lt": this.activedState,
        "page": page,
        "limit": this.limit
      }).then(res => {
        let state = true;
        // console.log('充值记录', res);
        if (res.data.Status === '1') {
          for (let i = 0; i < res.data.Data.length; i++) {
            for (let j = 0; j < this.recordsList.length; j++) {
              if (res.data.Data[i].Ym == this.recordsList[j].Ym) {
                state = false;
                for (let z = 0; z < res.data.Data[i].MoneyFlowList.length; z++) {
                  this.recordsList[j].MoneyFlowList.push(res.data.Data[i].MoneyFlowList[z]);
                }
              }
            }
            if (state) {
              this.recordsList.push(res.data.Data[i]);
            }
          }
          // this.recordsList = res.data.Data;
          this.page = this.page + 1;
          // console.log(this.recordsCollectMonth);
        } else {
          this.$toast({
            message: res.data.Msg,
            position: 'bottom',
            duration: 3000
          })
        }
        return res;
      })
    },
    getTypeData () {
      // 
      this.$http.post(api.flowType).then(res => {
        // console.log('流水类型', res);
        if (res.data.Status === '1') {
          this.types = res.data.Data;
        }
      })
    },
    loadBottom () {
      this.getRecordList(this.page).then(res => {
        if (res.data.Status === '1') {
          if (this.recordsList.length < res.data.Count) {
            this.isAllLoaded = false;
          } else {
            this.isAllLoaded = true;
          }
          this.$refs.loadmore.onBottomLoaded();
        } else {
          this.isAllLoaded = true;
          this.$refs.loadmore.onBottomLoaded();
        }
      });
    },
    cancelFilter () {//取消筛选
      this.activedState = 0;
      this.page = 1;
      this.recordsList = [];
      this.getRecordList(this.page);
      this.menuOpen = false;
    }
  },
  mounted () {
    this.startDateStr = this.$store.state.accountDate.start;
    this.endDateStr = this.$store.state.accountDate.end;
    this.getTypeData();
    this.getRecordList(this.page);
  },
  beforeRouteLeave (to, from, next) {//路由控制
    // console.log(to);
    if (to.name === 'Query') {
      this.$store.commit('CHANGE_ACCOUNT_DATE', {start: '', end: '', startDate: '', endDate: ''});
      next();
    }
    next();
  }
}
</script>
<style scoped>
  /* header */
  .journal-account{
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .delegate-header{
    position: fixed;
    height: 24px;
    /* line-height: 24px; */
    width: 100vw;
    text-align: center;
    top: 0;
    padding-top: 10px;
    padding-bottom: 10px;
    z-index: 1001;
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
  .journal-account .content-body{
    box-sizing: border-box;
    top: 89px;
  }
  .journal-account .content-body > div{
    overflow-y: scroll;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    text-align: left;
    position: relative;
  }
  .journal-account .content-body > div::-webkit-scrollbar{
    display: none;
  }


  .journal-account .content-body > div ul{
    padding: 0 10px;
  }
  .journal-account .content-body > div ul > li{
    padding: 10px 0;
    border-bottom-width: 1px;
    border-bottom-style: solid;
    position: relative;
  }
  .journal-account .content-body > div ul > li > p:nth-child(1) {
    margin-bottom: 5px;
  }
  .journal-account .content-body > div ul > li > span.deal-money{
    position: absolute;
    top: 10px;
    right: 0;
    font-size: 18px;
  }
  .journal-account .content-body > div ul > li > span.happen-money{
    position: absolute;
    bottom: 10px;
    right: 0;
  }
  /* 条件菜单 */
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
