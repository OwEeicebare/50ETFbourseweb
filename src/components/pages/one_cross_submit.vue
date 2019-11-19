<template>
  <div class="close-sell">
    <CHeader title="一键跨式买入委托" backBol="true" backUrl="/one_cross_rgou"></CHeader>
    <div class="content-body has-header main-bg font28">
        <div>
          <ul>
            <li v-if="gou.number!=0">
              <div class="normal-padding">
                <div class="order-ticket">委托单1</div>
                <div class="normal-margin-top"><span class="main-text-color2">合约名称</span>{{gou.name}}</div>
                <div class="normal-margin-top"><span class="main-text-color2">合约代码</span>{{gou.cord}}</div>
                <div class="normal-margin-top"><span class="main-text-color2">委托价格</span>{{gou.price}}</div>
                <div class="normal-margin-top"><span class="main-text-color2">委托数量</span>{{gou.number}}张</div>
                <div class="normal-margin-top"><span class="main-text-color2">交易金额</span>{{(gou.money)}}元</div>
              </div>
              <div class="separate assist-color3"></div>
            </li>
            <li v-if="gu.number!=0">
              <div class="normal-padding">
                <div class="order-ticket">委托单{{gou.number==0?1:2}}</div>
                <div class="normal-margin-top"><span class="main-text-color2">合约名称</span>{{gu.name}}</div>
                <div class="normal-margin-top"><span class="main-text-color2">合约代码</span>{{gu.cord}}</div>
                <div class="normal-margin-top"><span class="main-text-color2">委托价格</span>{{gu.price}}</div>
                <div class="normal-margin-top"><span class="main-text-color2">委托数量</span>{{gu.number}}张</div>
                <div class="normal-margin-top"><span class="main-text-color2">交易金额</span>{{(gu.money)}}元</div>
              </div>
              <div class="separate assist-color3"></div>
            </li>
          </ul>
          <div class="close-tips font24 rise-color">买入{{this.t}}分钟未成交自动撤单</div>
        </div>
    </div>
    <div class="operate-btns white-color">
      <div class="operate-cancel line-color" @click="backUP">取消</div>
      <div class="operate-ensure main-color1" @click="orderSuccess">确定</div>
    </div>
  </div>
</template>
<script>
import CHeader from '@/components/common/IHeader.vue'
import api from '../../api/index';
export default{
  components: {
    CHeader
  },
  data () {
    return {
      t:this.$store.state.expirationTime,
      gou:{
        cord:'',
        name:'',
        price:'',
        number:'',
        money:''
      },
      gu:{
        cord:'',
        name:'',
        price:'',
        number:'',
        money:''
      }
    }
  },
  created(){
    //初始化订单
    var obj = JSON.parse(sessionStorage.getItem("cross_buy"));
    this.gou.cord=obj.Sc;//购代码
    this.gou.name=obj.ScName;
    this.gou.price=obj.Dp;
    this.gou.number=obj.Dn;
    this.gou.money=obj.money;

    this.gu.cord=obj.Sct;//购代码
    this.gu.name=obj.SctName;
    this.gu.price=obj.Dpt;
    this.gu.number=obj.Dnt;
    this.gu.money=obj.moneyt;

  },
  methods: {
    backUP () {
      this.$router.go(-1);
    },
    orderSuccess () {
      var obj = {
        "Dt": 10,
        "Sc": this.gou.cord,
        "Dp": this.gou.price,
        "Dn": this.gou.number,
        "Sct":this.gu.cord,
        "Dpt":this.gu.price,
        "Dnt":this.gu.number,
        "Ty": 0,
        "Ts": 0,
        "Tk": 0
      }
      this.$http.post(api.oneCrossBuy,obj).then(res=>{
        if(res.data.Status==="1"){//买入成功跳转页面
          this.$router.push({path: '/order-success'});
        }else{
          this.$toast({
              message: res.data.Msg,
              position: 'bottom',
              duration: 2000
          });
        }
      });
    }
  }
}
</script>
<style scoped>
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
