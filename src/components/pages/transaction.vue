<template>
  <div class="transaction">
    <CHeader title="当日成交" backBol="true" backUrl="/query"></CHeader>
    <div class="content-body has-header">
      <div class="main-bg" id="init">
        <!-- 委托列表 -->
        <mt-loadmore class="main-bg"  :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore"  :auto-fill="false" >
          <div v-for="item in positions" :key="item.id" :class="{'list-item': true, 'normal-margin': true, 'deal-border': !theme, 'assist-color4': theme}">
            <div :class="{'title': true, 'white-color': true, 'deal-bg-color': !theme, 'normal-padding': true,'assist-color3': theme}">
              <span class="contract"><span>{{item.Sc}}</span>{{item.Sn}}</span>
              <span>{{item.Tc | time()}}&nbsp;&nbsp;{{item.Kj }}</span>
            </div>
            <div class="transaction-situation normal-padding">
              <div class="deal-money normal-margin">
                <span class="main-text-color2">交易金额</span>{{Number(item.Dm).toFixed(2)}}
              </div>
              <div class="left">
                <div class="normal-margin">
                  <span class="main-text-color2">委托价格</span>{{Number(item.Dp).toFixed(4)}}
                </div>
                <div class="normal-margin">
                  <span class="main-text-color2">委托数量</span>{{item.Dn}}张
                </div>
                <div v-if="item.Dpr != 0">
                  <span class="main-text-color2">成交价格</span>{{Number(item.Dpr).toFixed(4)}}
                </div>
              </div>
              <div class="right">
                <div class="normal-margin">
                  <span class="main-text-color2">交易类型</span><span :class="{'copy-color': item.Dts === '卖出平仓', 'rise-color':  item.Dts === '买入开仓', 'bold-type': true}">{{item.Dts}}</span>
                </div>
                <div class="normal-margin">
                  <span class="main-text-color2">订单状态</span>{{item.Kt}}
                </div>
                <div v-if="item.Dnu != 0">
                  <span class="main-text-color2">成交数量</span>{{item.Dnu}}张
                </div>
              </div>
            </div>
          </div>
          <div v-if="positions.length==0" class="no-data main-text-color2">暂无当日成交</div>
        </mt-loadmore>
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
      page: 1,
      limit: 5,
      allLoaded: true,
      positions: [
      ]
    }
  },
  computed: {
    theme () {
      // console.log(localStorage.getItem('theme') != null ? JSON.parse(localStorage.getItem('theme')).theme : 0);
      return localStorage.getItem('theme') != null ? JSON.parse(localStorage.getItem('theme')).theme : 0;
    }
  },
  created () {
    var objs = {
      id:"",
      AgentId: 0,
      OrderKey: "",
      SearchKey: "",
      Sort: "",
      limit: this.limit,
      page: this.page
    };
    this.get_data(objs).then(res => {
      this.$nextTick(function () {
        document.getElementById('init').scrollTop = 0;
      })
    });
  },
  components: {
    CHeader
  },
  methods: {
    loadBottom() {
      var objs = {
        id:"",
        AgentId: 0,
        OrderKey: "",
        SearchKey: "",
        Sort: "",
        limit: this.limit,
        page: this.page
      };
      this.get_data(objs);
    },
    get_data(obj){
      
      return this.$http.post(Api.transactionDay,obj).then(res=>{
        if(res.data.Status==1){
          var result = res.data.Data;
          for(var i = 0,len =result.length;i<len;i++){
            this.positions.push(result[i]);
          }
          this.page++;
          if(this.positions.length<res.data.Count){
            this.allLoaded = false;
          }else{
            this.allLoaded = true;
          }
          this.$refs.loadmore.onBottomLoaded();
        }
        return res;
      })
    },
  },
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
  .transaction .content-body{
    border-top: 1px solid #ededed;
    box-sizing: border-box;
  }
  .transaction .content-body > div{
    overflow-y: scroll;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    width: 100%;
    height: 100%;
    padding: 10px 10px 0;
    box-sizing: border-box;
    text-align: left;
  }
  .transaction .content-body > div::-webkit-scrollbar{
    display: none;
  }
  .transaction .transaction-situation {
    overflow: auto;
  }
  .transaction .transaction-situation > div.left,.transaction .transaction-situation > div.right{
    width: 50%;
    float: left;
  }
  .transaction .transaction-situation > div.deal-money > span:nth-child(1), .transaction .transaction-situation > div > div > span:nth-child(1) {
    margin-right: 10px;
  }
  .transaction .list-item{
    border-radius: 4px;
    position: relative;
  }
  .transaction .list-item .title{
    overflow: auto;
  }
  .transaction .list-item .title > span:nth-child(1){
    float: left;
  }
  .transaction .list-item .title > span.contract > span {
    margin-right: 10px;
  }
  .transaction .list-item .title > span:nth-child(2){
    float: right;
  }
</style>
