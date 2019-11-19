<template>
  <div class="recharge_records">
    <CHeader title="充值记录" backBol="true" backUrl="/recharge"></CHeader>
    <div class="font28 content-body has-header main-bg">
      <div class="time-filter normal-padding main-bg">
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
      <div class="records-list">
        <div>
            <mt-loadmore :bottom-method="loadBottom" ref="loadmore" :bottom-all-loaded="isAllLoaded" :auto-fill="false">
              <div v-if="recordsList.length" class="load-body">
                <div v-for="(item,index) in recordsList" :key="index">
                  <!-- <div class="assist-color3 main-text-color2 month-total normal-padding">{{item.Ym}}<span>充值：{{subMoney(item.GetMoneys)}}元</span></div> -->
                  <ul>
                    <router-link :to="{path: '/recharge-details', query: {id: zitem.Id} }" tag="li" class="normal-border-color" v-for="zitem in item.MoneyFlowList" :key="zitem.Id">
                      <p>充值<span>({{zitem.strName}})</span></p>
                      <p class="main-text-color2">{{formateDate(zitem.time)}}</p>
                      <span>{{subMoney(zitem.bann)}}元</span>
                    </router-link>
                  </ul>
                </div>
            </div>
            <div v-else class="main-text-color2 no-data">无数据</div>
            </mt-loadmore>
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
      // startDate: '',
      // endDate: '',mint 组件
      startDateStr: '',
      endDateStr: '',
      page: 1, //页码
      limit: 10, //限制
      recordsList: [], //
      isAllLoaded: false,
    }
  },
  computed: {
    agenceId () {
      var login = localStorage.getItem('login');
      if (login != null) {
        return JSON.parse(login).AgentsId;
      } else {
        return 0;
      }
    },
    login () {
      var login = localStorage.getItem('login');
      if (login != null) {
        return true;
      } else {
        return false;
      }
    }
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
  },
  methods: {
    arouseStart () {
      this.$router.push({path: '/calendar', query: {origin: 'recharge-records', start: this.$store.state.rechargeDate.startDate, end: this.$store.state.rechargeDate.endDate}});
      // this.$refs.start.open(); //mintui picker组件
    },
    arouseEnd () {
      this.$router.push({path: '/calendar', query: {origin: 'recharge-records', start: this.$store.state.rechargeDate.startDate, end: this.$store.state.rechargeDate.endDate}});
      // this.$refs.end.open();//mintui picker组件
    },
    getRecordList (page) {//获取充值记录
      if (this.login) {
        return this.$http.post(api.recordList, {
          "strTime": this.$store.state.rechargeDate.startDate + '',
          "enTime": this.$store.state.rechargeDate.endDate + '',
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
            this.page = this.page + 1;
          } else {
            this.$toast({
              message: res.data.Msg,
              position: 'bottom',
              duration: 3000
            })
          }
          return res;
        })
      }
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
    loadBottom () {
      // console.log('loadmore');
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
    formateDate (date) {//时间处理
      // console.log(new Date(date));
      var date2 = date.replace(/\-/g, '/');
      var date1 = new Date(date2);
      return date1.getFullYear() + '.' + (date1.getMonth() + 1 < 10 ? '0' + (date1.getMonth() + 1) : date1.getMonth() + 1) + '.' + (date1.getDate() < 10 ? '0' + date1.getDate() : date1.getDate()) + ' ' + (date1.getHours() < 0 ? '0' + date1.getHours() : date1.getHours()) + ':' + (date1.getMinutes() < 10 ? '0' + date1.getMinutes() : date1.getMinutes());
    },
    // handleStartConfirm () {
      // if (this.startDate) {
      //   this.startDateStr = this.formatDate(this.startDate);
      // } else {
      //   this.startDateStr = this.formatDate(this.defaultDate);
      // }
    // },
    // handleEndConfirm () {
      // if (this.endDate) {
      //   this.endDateStr = this.formatDate(this.endDate);
      // } else {
      //   this.endDateStr = this.formatDate(this.defaultEndDate);
      // }
    // },
    // formatDate (time) {
      // var date = new Date();
      // date.setTime(time);
      // var year = date.getFullYear();
      // var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
      // var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      // return year + "." + month + "." + day;
    // }
  },
  created () {
    this.getRecordList(this.page);
  },
  mounted () {
    this.startDateStr = this.$store.state.rechargeDate.start;
    this.endDateStr = this.$store.state.rechargeDate.end;
    // console.log(this.$store.state.rechargeDate.startDate, new Date(this.$store.state.rechargeDate.startDate));
  },
  beforeRouteLeave (to, from, next) {//路由控制
    // console.log(to);
    if (to.name === 'Recharge') {
      this.$store.commit('CHANGE_RECHARGE_DATE', {start: '', end: '', startDate: '', endDate: ''});
      next();
    }
    next();
  }
}
</script>
<style scoped>
  .content-body{
    text-align: left;
  }
  .content-body > div.records-list {
    position: absolute;
    top: 46px;
    bottom: 0;
    width: 100%;
  }
  .content-body > div.records-list > div{
    overflow-y: scroll;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    width: 100%;
    height: 100%;
  }
  .content-body > div.records-list > div::-webkit-scrollbar {
    display: none;
  }
  ul{
    padding: 0 10px;
  }
  ul > li > p > span,div.month-total > span {
    margin-left: 5px;
  }
  ul > li{
    /* border-bottom: 1px solid #d9d9d9; */
    border-bottom-width: 1px;
    border-bottom-style: solid;
    position: relative;
    padding: 10px 0;
  }
  ul > li:nth-last-child(1) {
    border-bottom: none;
  }
  ul > li > span{
    position: absolute;
    right: 0;
    top: 10px;
  }
  .time-filter{
    overflow: auto;
    position: fixed;
    top: 45px;
    /* border-top: 1px solid #d9d9d9; */
    width: 100%;
    text-align: left;
    box-sizing: border-box;
    z-index: 100001;
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
  .load-body{
    overflow-y: scroll;
    height: 100%;
  }
</style>
