
<template>
  <div class="overdue">
    <CHeader title="过期合约" backBol="true" backUrl="/query"></CHeader>
    <div class="content-body has-header">
      <div class="main-bg">
        <!--  撤单提示  -->
        <div class="time-filter normal-padding main-bg normal-border-color">
          起止日期
         <div class="assist-color3 date-piker-wrap">
          <input type="text" @focus="arouseStart" v-model="startDateStr" placeholder="起始日期" class="main-text-color1">
          <span>~</span>
          <input type="text" @focus="arouseEnd" v-model="endDateStr" placeholder="截止日期" class="main-text-color1">
        </div>
        </div>
        <!-- 撤单列表 -->
        <div class="overdues-container font28">
          <div>
            <div v-for="(item,i) in positions" :key="i">
              <div class="main-text-color2 assist-color3 normal-padding">到期时间{{item.SoDate}}</div>
              <ul>
                <li v-for="zitem in item.model" :key="zitem.id" class="normal-border-color">
                  <div class="normal-margin">{{zitem.StockCode}}<span class="left">{{zitem.StockName}}</span></div>
                  <div>
                    <span class="main-text-color2">成本均价</span>
                    <span class="left">{{Number(zitem.StockPrice).toFixed(4)}}</span>
                    <span class="main-text-color2 hold-position">持仓</span>
                    <span class="left">{{zitem.StockNum}}张</span>
                  </div>
                  <img src="/static/images/deal/icon_mark_expired.svg" alt="">
                </li>
              </ul>
            </div>
           
            <div v-if="positions.length==0" class="no-data main-text-color2">暂无过期合约</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import CHeader from '@/components/common/IHeader.vue'
import Api from '@/api'
export default {
  data () {
    return {
      positions: [
        
      ],
      startDateStr: '',
      endDateStr: ''
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
  },
  components: {
    CHeader
  },
  methods: {
    getList(startDate,endDateStr){
      this.$http.post(Api.overdue,{"Ts":startDate?startDate:'',"Te":endDateStr?endDateStr:""}).then(res=>{
        // console.log(res);
        if(res.data.Status==="1"){
          var result = res.data.Data;
          result = result ? result : [];
          this.positions = result;
        }
      })
    },
    arouseStart () {
      // this.$refs.start.open();
      this.$router.push({path: '/calendar', query: {origin: 'overdue', start: this.$store.state.overdueDate.startDate, end: this.$store.state.overdueDate.endDate}});
    },
    arouseEnd () {
      // this.$refs.end.open();
      this.$router.push({path: '/calendar', query: {origin: 'overdue', start: this.$store.state.overdueDate.startDate, end: this.$store.state.overdueDate.endDate}});
    },
    handleStartConfirm () {
      if (this.startDate) {
        this.startDateStr = this.formatDate(this.startDate);
      } else {
        this.startDateStr = this.formatDate(this.defaultDate);
      }
    },
    handleEndConfirm () {
      if (this.endDate) {
        this.endDateStr = this.formatDate(this.endDate);
      } else {
        this.endDateStr = this.formatDate(this.defaultEndDate);
      }
    },
    formatDate (time) {
      var date2 = time.replace(/\-/g, '/');
      var date = new Date(date2);
      var year = date.getFullYear();
      var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
      var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      return year + "." + month + "." + day;
    }
  },
  mounted () {
    this.startDateStr = this.$store.state.overdueDate.start;
    this.endDateStr = this.$store.state.overdueDate.end;
    this.getList(this.$store.state.overdueDate.startDate,this.$store.state.overdueDate.endDate);
    
  },
  destroyed(){
    var obj={
      start:'',
      end:'',
      startDate:'',
      endDate:''
    }
    this.$store.commit("CHANGE_OVERDUE_DATE",obj);
  }
}
</script>
<style scoped>
  .overdue .content-body{
    /* bottom: 50px; */
  }
  .overdue .content-body > div{
    width: 100%;
    height: 100%;
    position: relative;
    text-align: left;
  }
  .time-filter{
    overflow: auto;
    position: absolute;
    top: 0;
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
  /* 持仓列表 */
  .overdue .overdues-container{
    position: absolute;
    top: 46px;
    bottom: 0;
    left: 0;
    right: 0;
  }
  .overdue .overdues-container > div{
    overflow-y: scroll;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
  }
  .overdue .overdues-container > div::-webkit-scrollbar{
    display: none;
  }
  .overdue .overdues-container ul > li .left{
    margin-left: 10px;
  }
  .overdue .overdues-container ul{
    padding: 0 10px;
  }
  .overdue .overdues-container ul > li{
    padding: 10px 0;
    border-bottom-width: 1px;
    border-bottom-style: solid;
    position: relative;
  }
  .overdue .overdues-container ul > li:nth-last-child(1) {
    border-bottom: none;
  }
  .overdue .overdues-container ul > li > img{
    position: absolute;
    right: -10px;
    top: 0;
    width: 51px;
  }
  .overdue .overdues-container ul > li > div .hold-position{
    margin-left: 50px;
  }
</style>
