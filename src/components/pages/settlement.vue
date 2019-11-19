<template>
  <div class="settlement">
    <div class="delegate-header font32 main-bg">
      <img :src="theme ? '/static/images/header/transparent_arrow_left.svg' : '/static/images/header/arrow_left.svg'" alt="返回按钮" class="back"  @click="back">
      <h1 class="font32">平仓结算</h1>
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
    <div class="content-body has-header">
      <div class="main-bg">
        <!-- 委托列表 -->
        <router-link tag="div" 
        :to="{path: '/settlement-details',
         query: {id: item.Id,type: item.TypeId}}" 
         v-for="item in positions"
          :key="item.id" 
           :class="{'list-item': true, 'normal-margin': true, 'deal-border': !theme, 'assist-color4': theme}">
          <div :class="{'title': true, 'white-color': true, 'deal-bg-color': !theme, 'normal-padding': true,'assist-color3': theme}">
            <span class="contract"><span>{{item.Sc}}</span>{{item.Sn}}</span>
            <span>{{formatDate(item.Td)}}</span>
          </div>
          <div class="settlement-situation normal-padding">
            <div class="main-text-color2 font24"><span class="span140">盈亏金额</span><span class="span120">盈亏比例</span><span class="main-text-color1">已平仓</span></div>
            <div :class="{'font40':true,'number-font':true,'rise-color':item.Pm>0,'drop-color':item.Pm<0}">
              <span class="span140">{{item.Pm}}</span>
              <span class="span120">{{item.Pr}}</span>
              <span class="main-text-color1">{{item.Sa}}/{{item.Bn}}</span>
            </div>
          </div>
        </router-link>
        <div v-if="positions.length==0" class="no-data main-text-color2">暂无平仓结算数据</div>
      </div>
    </div>
  </div>
</template>
<script>
import Api from '@/api'
export default {
 
  data () {
    return {
      positions: [
     
      ],
      startDate: '',
      startDateStr: '',
      endDate: '',
      endDateStr: ''
    }
  },  
  created() {
    
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
    getList(startDate,endDateStr){
       this.$http.post(Api.settlement,{"Ts":startDate?startDate:'',"Te":endDateStr?endDateStr:""}).then(res=>{
        if(res.data.Status==="1"){
          var result = res.data.Data;
          this.positions = result
          
        }
      })
    },
    back () {
      this.$router.push('/query');
    },
    arouseStart () {
      // this.$refs.start.open();
      this.$router.push({path: '/calendar', query: {origin: 'settlement', start: this.$store.state.settlementDate.startDate, end: this.$store.state.settlementDate.endDate}});
    },
    arouseEnd () {
      // this.$refs.end.open();
      this.$router.push({path: '/calendar', query: {origin: 'settlement', start: this.$store.state.settlementDate.startDate, end: this.$store.state.settlementDate.endDate}});
    },

    formatDate (time) {
      var date2 = time.replace(/\-/g, '/');
      var date1 = new Date(date2);
      var year = date1.getFullYear();
      var month = date1.getMonth() + 1 < 10 ? "0" + (date1.getMonth() + 1) : date1.getMonth() + 1;
      var day = date1.getDate() < 10 ? "0" + date1.getDate() : date1.getDate();
      return year + "." + month + "." + day;
    }
  },
  mounted () {
    this.startDateStr = this.$store.state.settlementDate.start;
    this.endDateStr = this.$store.state.settlementDate.end;
     this.getList(this.$store.state.settlementDate.startDate,this.$store.state.settlementDate.endDate);
  },
  beforeDestroy(){
    var obj={
        start:'',
        end:'',
        startDate:'',
        endDate:''
      }
      this.$store.commit("CHANGE_SETTLEMENT_DATE",obj)
     
  }
}
</script>
<style scoped>
  .settlement{
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
  .settlement .content-body{
    box-sizing: border-box;
    top: 89px;
  }
  .settlement .content-body > div{
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
  .settlement .content-body > div::-webkit-scrollbar{
    display: none;
  }
  .settlement .settlement-situation {
    /* overflow: auto; */
  }
  .settlement .settlement-situation > div > span{
      display: inline-block;
  }
  .settlement .settlement-situation > div > span.span140{
      width: 140px;
  }
  .settlement .settlement-situation > div > span.span120{
      width: 120px;
  }
  .settlement .list-item{
    border-radius: 4px;
    position: relative;
  }
  .settlement .list-item .title{
    overflow: auto;
    line-height: 20px;
  }
  .settlement .list-item .title > span:nth-child(1){
    float: left;
  }
  .settlement .list-item .title > span.contract > span {
    margin-right: 10px;
  }
  .settlement .list-item .title > span:nth-child(2){
    float: right;
  }
</style>
