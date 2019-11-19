<template>
  <div class="close-sell">
    <CHeader title="一键平仓卖出委托" backBol="true" backUrl="/close-out"></CHeader>
    <div class="content-body has-header main-bg font28">
        <div>
          <ul>
            <li v-for="(item,i) in end" :key="i">
              <div class="normal-padding">
                <div class="order-ticket">委托单{{i + 1}}</div>
                <div class="normal-margin-top"><span class="main-text-color2">合约名称</span>{{item.StockCode}}</div>
                <div class="normal-margin-top"><span class="main-text-color2">合约代码</span>{{item.StockName}}</div>
                <div class="normal-margin-top"><span class="main-text-color2">委托价格</span>{{item.NowPrice}}</div> 
                <div class="normal-margin-top"><span class="main-text-color2">委托数量</span>{{item.StockNum-item.DNum}}张<!-- <span class="font24 main-text-color2 order-num">预计成交后持仓0张</span> --></div>
                <div class="normal-margin-top"><span class="main-text-color2">交易金额</span>{{(Number(item.NowPrice* item.DealNum *(item.StockNum-item.DNum) - (item.StockNum-item.DNum)*item.SPrice) ).toFixed(2)}}元</div>
              </div>
              <div class="separate assist-color3"></div>
            </li>
          </ul>
          <div class="close-tips font24 rise-color">
            1、以上合约将以对五价进行委托，实际以成交为准，请谨慎操作！<br />
            2、以上平仓委托{{this.t}}分钟未成交的，系统将进行自动撤单。
          </div>
        </div>
    </div>
    <div class="operate-btns white-color font32">
      <div class="operate-cancel line-color" @click="backUP">取消</div>
      <div class="operate-ensure main-color1" @click="orderSuccess">确定</div>
    </div>
    <!-- 遮盖层 -->
    <div class="pup_cover" v-if="show_bg"></div>
    <!-- 加载动画 -->
    <div id="loding" v-if="show_loding"><img  src="../../../static/logding.svg" alt=""></div>
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
      t:this.$store.state.expirationTime,
      end:[],//结果数组
      fee: 0,//服务费，
      show_bg:false,
      show_loding:false,
    }
  },
  computed : {
    orderStr () {//合约代码或者持仓id
      let str = sessionStorage.getItem('str');
      // console.log("arr",str)
      if (str != null) {
        return str;
      } else {
        return '';
      }
    },
    type () {//平仓类型，0合并平仓，1分笔平仓
      let type = sessionStorage.getItem('type');
      if (type != null) {
        return type;
      } else {
        return '';
      }
    },
    userId () {
      let login = localStorage.getItem('login');
      if (login != null) {
        return (JSON.parse(login)).Id;
      } else {
        return 0;
      }
    },
    ids () {
      let ids = sessionStorage.getItem('ids');
      if (ids != null) {
        return ids;
      } else {
        return '';
      }
    }
  },
  methods: {
    backUP () {
      this.$router.push('/close-out');
    },
    init(){//订单初始化
      let order = sessionStorage.getItem('arr') ;
      if (order != null) {
        if(this.type==0){//如果是合并持仓平仓
          this.$http.post(api.getPosition,{stockid: "",stockcode:this.orderStr}).then(res => {
            if (res.data.Status === '1') {
              this.end=res.data.Data;
            }
          })
        }else if(this.type==1){//如果是分笔持仓平仓
          this.$http.post(api.getPosition,{stockid: this.orderStr,stockcode:""}).then(res => {
            if (res.data.Status === '1') {
              this.end=res.data.Data;
            }
          })
        }
      }
    },
    orderSuccess () {//卖出
      this.show_bg=true;
      this.show_loding=true;
      var obj = [];
      for(var i = 0,len = this.end.length;i<len;i++){
        obj.push({
          StockCode:this.end[i].StockCode,//代码
          DeclNum:this.end[i].StockNum-this.end[i].DNum,//数量
          DeclPrice:this.end[i].NowPrice,//价格
          ScID:this.end[i].ID,//持仓id,
          Remark:0,//现价
        })
      }
      this.$http.post(api.allSell,obj).then(res=>{
        if(res.data.Status==1){
          //委托卖出成功(快捷反手)
          this.$router.push({path: '/order-success'});
        }else{
          this.$toast({
            message:  res.data.Msg,
            position: 'bottom',
            duration: 1000
          });
        }
        setTimeout(() => {
         this.show_bg=false;
         this.show_loding=false;
        }, 200);
       
      })
    },
  },
  created () {
     this.init();
  }
}
</script>
<style scoped>
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
  .content-body{
    top: 54px;
    bottom: 50px;
    text-align: left;
  }
  .content-body > div{
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
  }
  .content-body > div::-webkit-scrollbar{
    display: none;
  }
  .separate{
    height: 10px;
  }
  .order-ticket{
    font-weight: bold;
    padding-bottom: 10px;
    border-bottom: 1px solid #ebebeb;
  }
  ul > li > div > div > span:nth-child(1) {
    margin-right: 10px;
  }
  .order-num{
    margin-left: 10px;
  }
  .operate-btns{
    position: fixed;
    height: 50px;
    line-height: 50px;
    display: flex;
    text-align: center;
    bottom: 0;
    left: 0;
    right: 0;
  }
  .operate-btns > div{
    flex: 1;
  }
  .close-tips{
    padding: 10px 10px 50px 10px;
  }
</style>
