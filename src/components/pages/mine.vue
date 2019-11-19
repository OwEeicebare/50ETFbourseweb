<template>
  <div>
    <CHeader title="我的" funBol="true" :elseSrc="theme ? '/static/images/black/icon_message.svg' : '/static/images/my/icon_message.svg'" directRoute="/message">
      <template v-slot:message v-if="messageRead">
        <!--  v-if="messageRead" -->
        <span class="new-message main-color1"></span>
      </template>
    </CHeader>
    <div class="content-body has-header main-bg">
      <div class="assist-color3">
        <div class="my-asset normal-padding main-bg normal-margin">
          <div class="white-color">
            <div class="mycount">当前账号<span>{{phone}}</span></div>
            <div class="set-total">
              <div>
                <p class="font24">总资产(￥)</p>
                <p class="number-font font32">{{Total?subMoney(Total):Total===0?'0.00':'- -'}}</p>
              </div>
              <div>
                <p class="font24">盈亏金额</p>
                <!-- <p class="number-font font32">{{Overnightfee?subMoney(Overnightfee): Overnightfee===0 ? '0.00': '- -'}}</p> -->
                 <p class="number-font font32">{{YingKui ? subMoney(YingKui) : YingKui===0?'0.00':'- -'}}</p>
              </div>
            </div>
            <div class="set-deal normal-margin">
              <!-- <div>
                <p class="font24">可用余额(￥)</p>
                <p class="number-font font32">{{Balance ? subMoney(Balance) : '0.00'}}</p>
              </div>
              <div>
                <p class="font24">持仓市值(￥)</p>
                <p class="number-font font32">{{NowMoney ? subMoney(NowMoney) : '0.00'}}</p>
              </div> -->
              <div>
                <p class="font24">动态资产(￥)</p>
                <p class="number-font font32">{{Dynamic?subMoney(Dynamic):Dynamic===0?'0.00':'- -'}}</p>
              </div>
              <div>
                <p class="font24">冻结资金(￥)</p>
                <p class="number-font font32">{{Frozen?subMoney(Frozen):Frozen===0?'0.00':  '- -'}}</p>
              </div>
            </div>
            <div class="set-operate font32">
              <div data-type="recharge" @click="verifyAu">充值</div>
              <div data-type="withdraw" @click="verifyAu">提现</div>
            </div>
          </div>
        </div>
        <div class="dynamic-asset normal-padding main-bg normal-margin">
          <h3 class="font28 normal-margin">动态资产</h3>
          <div class="dynamic font28 normal-border-color">
            <!-- <div>
              <p class="main-text-color2">动态资产</p>
              <p class="font32">{{Dynamic ? subMoney(Dynamic) : '0.00'}}</p>
            </div> -->
            <div>
              <p class="main-text-color2">可用余额(￥)</p>
              <p class="font32">{{Balance ? subMoney(Balance) : Balance===0?'0.00':'- -'}}</p>
            </div>
            <!-- <div>
              <p class="main-text-color2">可用余额</p>
              <p class="font32">{{KeBalance ? subMoney(KeBalance) : '0.00'}}%</p>
            </div> -->
            <!-- <div>
              <p class="main-text-color2">持仓市值</p>
              <p class="font32">{{BNowMoneyget ? subMoney(BNowMoneyget) : '0.00'}}</p>
            </div> -->
            <div>
              <p class="main-text-color2">持仓市值(￥)</p>
              <p class="font32">{{NowMoney ? subMoney(NowMoney) :NowMoney===0?'0.00': '- -'}}</p>
            </div> 
          </div>
          <h3 class="font28 normal-margin">持仓盈亏</h3>
          <div class="dynamic font28 normal-border-color">
            <div>
              <p class="main-text-color2">盈亏金额</p>
              <p class="font32">{{YingKui ? subMoney(YingKui) : YingKui===0?'0.00':'- -'}}</p>
            </div>
            <div>
              <p class="main-text-color2">盈亏比例</p>
              <p class="font32">{{BYingKui ?subMoney(BYingKui)+'%' :BYingKui===0?'0.00':  '- -'}}</p>
            </div>
          </div>
          <h3 class="font28 normal-margin">冻结资金</h3>
          <div class="dynamic font28 normal-border-color">
            <div>
              <p class="main-text-color2">合约委托金额</p>
              <p class="font32">{{Coment ? subMoney(Coment) :Coment===0?'0.00': '- -'}}</p>
            </div>
            <div>
              <p class="main-text-color2">提现金额</p>
              <p class="font32">{{withd ? subMoney(withd) : withd===0?'0.00': '- -'}}</p>
            </div>
          </div>
        </div>
        <ul class="set font28 normal-margin">
          <router-link tag="li" to="/set-stop" class="main-bg stop"><p>止盈止损</p></router-link>
          <router-link tag="li" to="/help" class="main-bg help"><p class="normal-border-color">帮助中心</p></router-link>
          <router-link tag="li" to="/contact" class="main-bg contact"><p class="normal-border-color">联系客服</p></router-link>
          <router-link tag="li" to="/set" class="normal-margin main-bg set"><p class="normal-border-color">我的设置</p></router-link>
          <li class="main-bg" @click="exit()"><p>退出登录</p></li>
        </ul>
      </div>
    </div>
    <TabNav></TabNav>
  </div>
</template>

<script>
import CHeader from '@/components/common/IHeader.vue'
import TabNav from '@/components/common/TabNav.vue'
import Api from '@/api'
export default {
  data () {
    return {
      Balance:'',//可用余额
      NowMoney:'',//持仓市值
      YingKui:'',//盈亏金额
      Total:'',//总资产
      Overnightfee :'',//过夜费
      Frozen:'',//冻结金额
      Dynamic:'',//动态资产
      KeBalance:'',//可用余额百分比
      BNowMoneyget:'',//持仓市值百分比
      BYingKui:'',//盈亏比例
      Coment:'',//合约委托
      withd:'',//提现金额
      messageRead: this.$store.state.messageRead,
      auState: 0 //认证状态 3为未认证
    }
  },
  components: {
    TabNav,
    CHeader
  },
  computed: {
    authenticateState () {
      return this.$store.state.authenticateState;
      // return false;
    },
    theme () {
      // console.log(localStorage.getItem('theme') != null ? JSON.parse(localStorage.getItem('theme')).theme : 0);
      return localStorage.getItem('theme') != null ? JSON.parse(localStorage.getItem('theme')).theme : 0;
    },
    phone(){
      var temp = JSON.parse(localStorage.getItem('login'));
      if(temp){
        temp=temp.Mobile;
        temp = temp.substring(0,3)+"****"+temp.substring(7);
      }
      return temp;
    }
  },
  created(){
    this.init();
    // this.authenticate();
    this.$store.dispatch('get_message_type').then(res => {
      let state = true;
      if (res.length) {
        for (let i = 0; i < res.length; i++) {
          if (res[i].isread === 0) {
            state = false;
            this.messageRead = true;
          }
        }
        if (state) {
          this.messageRead = false;
        }
      } else {
        this.messageRead = false;
      }
    });
  },
  methods:{
    init(){
      var user =JSON.parse(localStorage.getItem("login"));
      if (user != null) {
        this.$http({url: Api.mineInfo, method: 'post'}).then(res=>{
          if(res.data.Status==1){
            var result = res.data.Data;
            this.Balance=result.Balance;
            this.NowMoney=result.NowMoney;
            this.YingKui=result.YingKui;
            this.Total=result.Total;
            this.Overnightfee=result.Overnightfee;
            this.Frozen=result.Frozen;
            this.Dynamic=result.Dynamic;
            this.KeBalance=result.KeBalance;
            this.BNowMoneyget=result.BNowMoneyget;
            this.BYingKui=result.BYingKui;
            this.Coment=result.Coment;
            this.withd=result.withd;
          }
        })
      } else {
        this.$store.commit('LOGOUT');
      }
    },
    exit(){
      this.$message({
        title: "",
        message: "是否退出登录",
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: "确定",
        confirmButtonHighlight: true,
        cancelButtonText: "取消"
      }).then(action => {
        if (action == "confirm") {
          this.$store.commit("LOGOUT");
          this.$router.push({path: '/login'});
        }
      });

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
    // authenticate () {//判断是否实名认证
    //   //先判断state里面authenticate状态
    //   // if (!this.authenticateState) {
    //   this.$store.dispatch('get_authenticate_state').then(res => {
    //     if (res.Status === '1') {
    //       this.auState = res.Data.NTure;
    //       // console.log(res)
    //     }
    //   });
    //   // }
    // },
    verifyAu (e) {
      let type = e.target.dataset.type;
      this.$store.dispatch('get_authenticate_state').then(res => {
        if (res.Status === '1') {
          this.auState = res.Data.NTure;
          if (this.auState==1) {//实名
            let url = '/' + type;
            this.$router.push(url);
          }else if(this.auState==2){//待审核
            this.$message({
              title: '实名认证',
              message: '您的认证资料正在审核中，无法交易，是否查看认证资料',
              showCancelButton: true,
              cancelButtonClass: 'main-text-color2'
            }).then(action => {
              if (action === 'confirm') {
                this.$router.push('/againauthentication');
              }
            })
          }else{//未认证
            this.$message({
              title: '实名认证',
              message: '您尚未进行实名认证，无法交易，现在就去认证吗',
              showCancelButton: true,
              cancelButtonClass: 'main-text-color2'
            }).then(action => {
              if (action === 'confirm') {
                this.$router.push('/authenticationSelect');
              }
            })
          }
        }
      });
      
    },
  },
  // beforeRouteLeave (to, from, next) {//路由拦截
  //   // console.log(to);
  //   if (to.name === 'Withdraw' || to.name === 'Recharge') {
  //     if (this.authenticateState) {
  //       next();
  //     } else {
  //       this.$message({
  //         title: '实名认证',
  //         message: '您尚未进行实名认证，无法交易，现在就去认证吗',
  //         showCancelButton: true,
  //         cancelButtonClass: 'main-text-color2'
  //       }).then(action => {
  //         if (action === 'confirm') {
  //           this.$router.push('/authentication');
  //           next();
  //         }
  //       })
  //     }
  //   } else {
  //     next()
  //   }
  // }
}
</script>
<style scoped>
  .mycount{
    height:30px;
    line-height: 30px;
    border-bottom-style: solid;
    border-bottom-width: 1px;
    border-bottom-color: rgba(255,255,255,0.5);
    margin-bottom: 8px
  }
  .mycount>span{
    margin-left: 10px;
  }
  .content-body{
    bottom: 50px;
    text-align: left;
  }
  .content-body > div{
    height: 100%;
    width: 100%;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    overflow-x: hidden;
  }
  .content-body > div::-webkit-scrollbar{
    display: none;
  }

  .content-body .my-asset > div{
    background: url('/static/images/my/img_bg_mine.svg') no-repeat center;
    background-size: cover;
    /* height: 164px; */
    padding: 10px;
    box-sizing: border-box;
    border-radius: 4px;
  }
  .dynamic-asset > h3{
    margin: 10px 0;
  }
  .dynamic-asset > h3:nth-of-type(1) {
    margin: 0 0 10px;
  }
  .set-total, .set-deal, .dynamic{
    display: flex;
  }
  .set-total{
    margin-bottom: 15px;
  }
  .set-total > div, .set-deal > div, .dynamic > div{
    flex: 1;
  }
  .set-total > div > p:nth-child(1), .set-deal > div > p:nth-child(1){
    margin-bottom: 2px;
  }
  .set-operate{
    overflow: auto;
  }
  .set-operate > div{
    text-align: center;
    background-color: rgba(255, 255, 255, .3);
    width: 48%;
    border-radius: 4px;
    padding: 8px 0;
  }
  .set-operate > div:nth-child(1) {
    float: left;
  }
  .set-operate > div:nth-child(2) {
    float: right;
  }
  .dynamic, .profit{
    /* border-top: 1px solid #d9d9d9; */
    border-top-width: 1px;
    border-top-style: solid;
    padding: 10px 0;
  }
  .profit{
    overflow: auto;
  }
  .profit > div{
    min-width: 34%;
    float: left;
  }
  .set > li {
    padding: 0 10px;
    height: 50px;
    line-height: 50px;
  }
  .set > li > p{
    /* padding: 10px 0 10px 30px; */
    padding-left: 30px;
    /* border-top: 1px solid #d9d9d9; */
    border-top-width: 1px;
    border-top-style: solid;
    background-repeat: no-repeat, no-repeat;
    background-position: right center, left center;
    background-size: auto 12px, 20px 20px;
  }
  .set > li.stop > p{
    border-top: none;
    background-image: url('/static/images/home/arrow_right.svg'), url('/static/images/my/icon_mine_stopmoney.svg');
  }
  .set > li.help > p{
    background-image: url('/static/images/home/arrow_right.svg'), url('/static/images/my/icon_mine_help.svg');
  }
  .set > li.contact > p{
    background-image: url('/static/images/home/arrow_right.svg'), url('/static/images/my/icon_mine_service.svg');
  }
  .set > li.set > p{
    background-image: url('/static/images/home/arrow_right.svg'), url('/static/images/my/icon_mine_setting.svg');
  }
  .set > li:nth-last-child(1) > p{
    border-top: none;
    background-image: url('/static/images/home/arrow_right.svg'), url('/static/images/my/icon_mine_logout.svg');
  }
  .new-message{
    position: absolute;
    right: 9px;
    top: 12px;
    width: 7px;
    height: 7px;
    border-radius: 50%;
  }
</style>
