<template>
  <div>
    <CHeader title="起止日期" backBol="true" :backUrl="backUrl"></CHeader>
    <div class="content-body has-header main-bg">
      <div>
        <mt-loadmore :top-method="loadTop" ref="loadmore">
          <div v-for="(item, index) in loadCalendar" :key="index" v-if="loadCalendar.length">
            <Calendar @ensureStartOrEnd="ensureStartOrEnd" :selectedStart="selectedStart" :selectedEnd="selectedEnd" :date="item.date"></Calendar>
          </div>
          <Calendar :date="preDate" @ensureStartOrEnd="ensureStartOrEnd" :selectedStart="selectedStart" :selectedEnd="selectedEnd"></Calendar>
          <Calendar :date="date" @ensureStartOrEnd="ensureStartOrEnd" :selectedStart="selectedStart" :selectedEnd="selectedEnd"></Calendar>
        </mt-loadmore>
      </div>
    </div>
    <div :class="{'next-step': true, 'font32': true, 'white-color': true,'line-color': !btnEnable, 'main-color1': btnEnable }" @click="ensure">确定</div>
  </div>

</template>
<script>
import CHeader from '@/components/common/IHeader.vue'
import Calendar from '@/components/common/calendar.vue'
export default {
  data () {
    return {
      date: new Date(),
      selectedStart: 0,//点击开始日期
      selectedEnd: 0,//点击结束日期
      loadCalendar: [],//加载更多日期的容器
    }
  },
  components: {
    CHeader,
    Calendar
  },
  computed: {
    //上个月
    preDate () {
      // 判断date是否为1月
      if (this.date.getMonth() + 1 === 1) {
        return new Date(this.date.getFullYear() - 1, 11, 1);
      } else {
        return new Date(this.date.getFullYear(), this.date.getMonth() - 1, 1);
      }
    },
    // 路由来源
    backUrl () {
      if (this.$route.query.origin) {
        return this.$route.query.origin
      } else {
        return '';
      }
    },
    start () {
      return this.$route.query.start;
    },
    end () {
      return this.$route.query.end;
    },
    btnEnable () {
      if (this.selectedStart && this.selectedEnd) {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    ensureStartOrEnd (data) {
      if (this.selectedStart && !this.selectedEnd){
        this.judgeStartEnd(data);
      } else {
        // 没有选中一个起止日期 或者有起止日期 重新定义一个开始日期
        this.selectedStart = new Date(data.year, data.month - 1, data.date);
        this.selectedEnd = 0;
      }
      //把数据传给vuex 中保存
      if (this.selectedEnd) {
        let localStart = this.selectedStart.getFullYear() + '.' + (this.selectedStart.getMonth() + 1 < 10 ? '0' : '') + (this.selectedStart.getMonth() + 1) + '.' + (this.selectedStart.getDate() < 10 ? '0' : '') + this.selectedStart.getDate();
        let localEnd = this.selectedEnd.getFullYear() + '.' + (this.selectedEnd.getMonth() + 1 < 10 ? '0' : '') + (this.selectedEnd.getMonth() + 1) + '.' + (this.selectedEnd.getDate() < 10 ? '0' : '') + this.selectedEnd.getDate();
        if (this.backUrl === 'recharge-records') {
          // 来源于充值记录
          this.$store.commit('CHANGE_RECHARGE_DATE', {start: localStart, end: localEnd, startDate: this.selectedStart.getTime(), endDate: this.selectedEnd.getTime()});
        } else if (this.backUrl === 'withdraw-records') {
          // 来源于提现记录
          this.$store.commit('CHANGE_WITHDRAW_DATE', {start: localStart, end: localEnd, startDate: this.selectedStart.getTime(), endDate: this.selectedEnd.getTime()});
        } else if (this.backUrl === 'history-delegate') {
          //来源于历史委托
          this.$store.commit('CHANGE_DELEGATE_DATE', {start: localStart, end: localEnd, startDate: this.selectedStart.getTime(), endDate: this.selectedEnd.getTime()});
        } else if (this.backUrl === 'history-transaction') {
          //来源于历史成交
          this.$store.commit('CHANGE_TRANSACTION_DATE', {start: localStart, end: localEnd, startDate: this.selectedStart.getTime(), endDate: this.selectedEnd.getTime()});
        } else if (this.backUrl === 'journal-account') {
          //来源于资金流水
          this.$store.commit('CHANGE_ACCOUNT_DATE', {start: localStart, end: localEnd, startDate: this.selectedStart.getTime(), endDate: this.selectedEnd.getTime()});
        } else if (this.backUrl === 'query-stop') {
          //来源于止盈止损
          this.$store.commit('CHANGE_STOP_DATE', {start: localStart, end: localEnd, startDate: this.selectedStart.getTime(), endDate: this.selectedEnd.getTime()});
        } else if (this.backUrl === 'overdue') {
          //来源于过期合约
          this.$store.commit('CHANGE_OVERDUE_DATE', {start: localStart, end: localEnd, startDate: this.selectedStart.getTime(), endDate: this.selectedEnd.getTime()});
        } else if (this.backUrl === 'settlement') {
          //来源于平仓结算
          this.$store.commit('CHANGE_SETTLEMENT_DATE', {start: localStart, end: localEnd, startDate: this.selectedStart.getTime(), endDate: this.selectedEnd.getTime()});
        }
      }
    },
    judgeStartEnd (data) {
      // 确定终点日期
      if (this.selectedStart.getFullYear() === data.year) {
        if (this.selectedStart.getMonth() + 1 === data.month) {
          // 同年同月
          if (this.selectedStart.getDate() < data.date) {
            // console.log("同年同月 起点日期小于终点日期");
            this.selectedEnd = new Date(data.year, data.month - 1, data.date);
          } else {
            // 同一年同一月中 起点日期大于终点日期， 起止日期交换
            // console.log("同年同月 起点日期大于终点日期");
            this.selectedEnd = this.selectedStart;
            this.selectedStart = new Date(data.year, data.month - 1, data.date);
          }
        } else {
          // 同年不同月
            // console.log("同年不同月");
          if (this.selectedStart.getMonth() + 1 > data.month) {
            // 起点月 > 终点月 起止交换
            // console.log("同年不同月 起点月大于终点月");
            this.selectedEnd = this.selectedStart;
            this.selectedStart = new Date(data.year, data.month - 1, data.date);
          } else {
            // console.log("同年不同月 起点月小于终点月");
            // 起点月 < 终点月
            this.selectedEnd = new Date(data.year, data.month - 1, data.date);
          }
        }
      } else {
        // 不为同年 有起点日期
        if (this.selectedStart.getFullYear() > data.year) {
          // 起点year > 终点 year 互换
          this.selectedEnd = this.selectedStart;
          this.selectedStart = new Date(data.year, data.month - 1, data.date);
        } else {
          this.selectedEnd = new Date(data.year, data.month - 1, data.date);
        }
      }
    },
    loadTop () {
      // 加载更多日历
      var date;
      if (this.loadCalendar.length) {
        date = this.createPreDate(this.loadCalendar[0].date);
      } else {
        date = this.createPreDate(this.preDate);
      }
      let dateObj = {date: date};
      this.loadCalendar.unshift(dateObj);
      this.$refs.loadmore.onTopLoaded();
    },
    createPreDate (date) {
      // 创建上一个月的日期
      if (date.getMonth() + 1 === 1) {
        return new Date(date.getFullYear() - 1, 11, 1);
      } else {
        return new Date(date.getFullYear(), date.getMonth() - 1, 1);
      }
    },
    ensure () {
      if (this.btnEnable) {
        this.$router.push(this.backUrl);
      } else {
        return;
      }
    }
  },
  created () {
    if (this.start) {
      this.selectedStart = this.start ? new Date(this.start) : 0;
      this.selectedEnd = this.end ? new Date(this.end) : 0;
    }
  },
  destroyed () {
    if (this.selectedEnd) {
      let localStart = this.selectedStart.getFullYear() + '.' + (this.selectedStart.getMonth() + 1 < 10 ? '0' : '') + (this.selectedStart.getMonth() + 1) + '.' + (this.selectedStart.getDate() < 10 ? '0' : '') + this.selectedStart.getDate();
      let localEnd = this.selectedEnd.getFullYear() + '.' + (this.selectedEnd.getMonth() + 1 < 10 ? '0' : '') + (this.selectedEnd.getMonth() + 1) + '.' + (this.selectedEnd.getDate() < 10 ? '0' : '') + this.selectedEnd.getDate();
      if (this.backUrl === 'recharge-records') {
        // 来源于充值记录 转换成时间戳存起来
        this.$store.commit('CHANGE_RECHARGE_DATE', {start: localStart, end: localEnd, startDate: this.selectedStart.getTime(), endDate: this.selectedEnd.getTime()});
      } else if (this.backUrl === 'withdraw-records') {
        // 来源于提现记录
        this.$store.commit('CHANGE_WITHDRAW_DATE', {start: localStart, end: localEnd, startDate: this.selectedStart.getTime(), endDate: this.selectedEnd.getTime()});
      } else if (this.backUrl === 'history-delegate') {
        //来源于历史委托
        this.$store.commit('CHANGE_DELEGATE_DATE', {start: localStart, end: localEnd, startDate: this.selectedStart.getTime(), endDate: this.selectedEnd.getTime()});
      } else if (this.backUrl === 'history-transaction') {
        //来源于历史成交
        this.$store.commit('CHANGE_TRANSACTION_DATE', {start: localStart, end: localEnd, startDate: this.selectedStart.getTime(), endDate: this.selectedEnd.getTime()});
      } else if (this.backUrl === 'journal-account') {
        //来源于资金流水
        this.$store.commit('CHANGE_ACCOUNT_DATE', {start: localStart, end: localEnd, startDate: this.selectedStart.getTime(), endDate: this.selectedEnd.getTime()});
      } else if (this.backUrl === 'query-stop') {
        //来源于止盈止损
        this.$store.commit('CHANGE_STOP_DATE', {start: localStart, end: localEnd, startDate: this.selectedStart.getTime(), endDate: this.selectedEnd.getTime()});
      } else if (this.backUrl === 'overdue') {
        //来源于过期合约
        this.$store.commit('CHANGE_OVERDUE_DATE', {start: localStart, end: localEnd, startDate: this.selectedStart.getTime(), endDate: this.selectedEnd.getTime()});
      } else if (this.backUrl === 'settlement') {
        //来源于平仓结算
        this.$store.commit('CHANGE_SETTLEMENT_DATE', {start: localStart, end: localEnd, startDate: this.selectedStart.getTime(), endDate: this.selectedEnd.getTime()});
      }
    } else {
      if (this.backUrl === 'recharge-records') {
        // 来源于充值记录 转换成时间戳存起来
        this.$store.commit('CHANGE_RECHARGE_DATE', {start: '', end: '', startDate: '', endDate: ''});
      } else if (this.backUrl === 'withdraw-records') {
        // 来源于提现记录
        this.$store.commit('CHANGE_WITHDRAW_DATE', {start: '', end: '', startDate: '', endDate: ''});
      } else if (this.backUrl === 'history-delegate') {
        //来源于历史委托
        this.$store.commit('CHANGE_DELEGATE_DATE', {start: '', end: '', startDate: '', endDate: ''});
      } else if (this.backUrl === 'history-transaction') {
        //来源于历史成交
        this.$store.commit('CHANGE_TRANSACTION_DATE', {start: '', end: '', startDate: '', endDate: ''});
      } else if (this.backUrl === 'journal-account') {
        //来源于资金流水
      // console.log('no end');
        this.$store.commit('CHANGE_ACCOUNT_DATE', {start: '', end: '', startDate: '', endDate: ''});
      } else if (this.backUrl === 'query-stop') {
        //来源于止盈止损
        this.$store.commit('CHANGE_STOP_DATE', {start: '', end: '', startDate: '', endDate: ''});
      } else if (this.backUrl === 'overdue') {
        //来源于过期合约
        this.$store.commit('CHANGE_OVERDUE_DATE', {start: '', end: '', startDate: '', endDate: ''});
      } else if (this.backUrl === 'settlement') {
        //来源于平仓结算
        this.$store.commit('CHANGE_SETTLEMENT_DATE', {start: '', end: '', startDate: '', endDate: ''});
      }
    }
  }
}
</script>
<style scoped>
  .content-body {
    bottom: 50px;
  }
  .content-body > div{
    overflow-y: scroll;
    overflow-x: hidden;
    width: 100%;
    height: 100%;
  }
  .next-step{
    position: fixed;
    bottom: 0;
    height: 50px;
    width: 100%;
    line-height: 50px;
    text-align: center;
  }
</style>
