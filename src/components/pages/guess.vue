<template>
  <div class="guess-index">
    <div class="back-head">
      <img src="/static/images/header/transparent_arrow_left.svg" alt="返回按钮" class="back" @click="back" />
    </div>
    <div class="content-body">
      <div class="guess-bg">
        <!-- 猜涨跌操作 -->
        <div class="guess-module">
          <p class="main-text-color1 font28">{{etf.StockName}}</p>
          <p class="rise-color number-font font40">{{etf.PriceCurrent}}</p>
          <p class="rise-color number-font font20"><span style="margin-right: 20px;" :class="{'rise-color': etf.PriceRise > 0, 'drop-color': etf.PriceRise < 0}">{{etf.PriceRise > 0 ? '+' : ''}}{{etf.PriceRise ? (etf.PriceRise).toFixed(4) : 0}}</span><span :class="{'rise-color': etf.PriceRisePercent > 0, 'drop-color': etf.PriceRisePercent < 0}">{{etf.PriceRisePercent > 0 ? '+' : ''}}{{etf.PriceRisePercent ? (etf.PriceRisePercent).toFixed(2) : 0}}%</span></p>
          <div class="progress-outer">
            <img src="/static/images/home/icon_guess_red.svg" alt="涨" class="rise-icon">
            <div class="progress-container">
              <div class="rise-progress" :style="{ width: risePercent + '%' }">
                <div class="rise-bg-color"></div>
              </div>
              <div class="drop-progress" :style="{ width: 100 - risePercent - 0.5 + '%'}">
                <div class="drop-bg-color"></div>
              </div>
            </div>
            <img src="/static/images/home/icon_guess_green.svg" alt="跌" class="drop-icon">
          </div>
          <div class="percent-number font28">
            <span class="rise-color">{{risePercent}}%</span>
            <span class="drop-color">{{100 - risePercent}}%</span>
          </div>
          <div class="guess-operate">
            <div :class="{'guess-button': true, 'animate': guessAnimate}">
              <button class="rise-bg-color white-color font32" data-type="rise" @click="guess">看涨</button>
              <button class="drop-bg-color white-color font32" data-type="drop" @click="guess">看跌</button>
            </div>
            <div :class="{'guess-result': true, 'animate': guessAnimate}">
              <p class="font28">您已猜行情： {{guessAble === 1 ? '涨' : '跌'}}</p>
              <p class="font28">2019年4月10日 15:00 收盘查看结果</p>
            </div>
          </div>
        </div>
        <!-- 参与信息 -->
        <div class="guess-info">
          <div class="participate-num">
            <p class="font28">{{login ? userLabel.num : '--'}}</p>
            <p class="font24 main-text-color2">参与次数</p>
          </div>
          <div class="accuracy-rate">
            <p class="font28">{{login ? userLabel.correctPer + '%' : '--'}}</p>
            <p class="font24 main-text-color2">准确率</p>
          </div>
          <div class="guess-name white-color">
            <p :class="{'font24': true, 'login-false': !login}">{{login ? userLabel.name : ''}}</p>
          </div>
        </div>
        <!-- 猜测记录 -->
        <div class="guess-record">
          <div class="no-login font28" v-if="!login">
            <p class="main-text-color2">您还未登录，不能参与</p>
            <router-link to="/login" tag="p" class="tab-active-color">马上登录</router-link>
          </div>
          <div class="login-record font28" v-else>
            <div class="font24 main-text-color2 record-title normal-border-color">猜测记录</div>
            <ul class="record-list font28">
              <li v-for="item in records" :key="item.id">
                <div class="record-left">{{formateDate(item[0])}}</div>
                <div class="record-right"><span>{{item[1] == '1' ? '涨' : '跌'}}</span><span>{{item[2] == '1' ? '成功' : item[2] == '2' ? '失败' : '未知'}}</span></div>
              </li>
            </ul>
            <div class="load-more font24 main-text-color2 normal-border-color" @click="loadMore">加载更多</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Api from '@/api'
export default {
  data () {
    return {
      risePercent: 50,
      guessAnimate: false,
      login: true,
      records: [],
      userLabel: {
        num: 0,//次数
        correctPer: 0,//准确率
        name: '',//称号
      },
      etf: {},
      page: 1, //页码
    }
  },
  computed: {
    guessAble () {
      var guessState =  this.$store.state.guess;
      if (guessState === 0) {
        this.guessAnimate = false;
      } else {
        this.guessAnimate = true;
      }
      return guessState;//0未猜 1涨 2跌
    }
  },
  methods: {
    back () {
      this.$router.back(-1);
    },
    guess (e) {
      // 先判断是否登录 是否已猜
      if (this.login) {//已登录
        if (!this.guessAble) {//未猜
          var now = new Date();
          var limitStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 13, 0, 0);
          var limitEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 15, 0, 0);
          var type = e.target.dataset.type;
          if (now.getTime() >= limitStart.getTime() && now.getTime() <= limitEnd.getTime()) {
            this.$toast({
              message: '封盘期间不可猜测',
              position: 'bottom',
              duration: 3000
            })
            return false;
          } else {
            if (type === 'rise') {//猜涨
              this.$http.post(Api.udAction, {Id: 1, st: 1}).then(res => {
                // console.log(res.data);
                this.guessAnimate = true;
              })
            } else {//猜跌
              this.$http.post(Api.udAction, {Id: 1, st: 2}).then(res => {
                // console.log(res.data);
              this.guessAnimate = true;
              })
            }
          }
        } else {
          return false;
        }
      } else {//未登录
        this.$message({
          title: '提示',
          message: '请先登录',
          confirmButtonText: '去登录',
          showCancelButton: true
        }).then(action => {
          if (action === 'confirm') {
            this.$router.push('/login');
          }
        })
      }
    },
    // 加载更多猜测记录
    loadMore () {
      this.page += 1;
      this.getRecords(this.page);
    },
    getUd () {//猜涨跌数据
      this.$http.post(Api.ud).then(res => {
        // console.log('猜涨跌数据', res.data);
        if (res.data.Data) {
          this.risePercent = Number(res.data.Data[0]);
        }
      })
    },
    getLabel () {//猜涨跌的称号
      this.$http.post(Api.topName, 1).then(res => {
        // console.log('猜涨跌称号', res.data);
        if (res.data.Status === '1') {
          this.userLabel.num = res.data.Data[0];
          this.userLabel.correctPer = res.data.Data[1];
          this.userLabel.name = res.data.Data[2];
          this.$store.commit('CHANGE_GUESS_STATE', Number(res.data.Data[3]));
        }
      })
    },
    getRecords (page) {//用户猜涨跌记录
      this.$http.post(Api.udRecords, {
        "Tid": 1,
        "UType": 0,
        "AgentId": 0,
        "page": page,
        "limit": 20,
        "OrderKey": "",
        "Sort": "",
        "SearchKey": ""
      }).then(res => {
        // console.log('猜涨跌记录', res.data);
        if (res.data.Status === '1') {
          for(let i = 0; i < res.data.Data.length; i++) {
            this.records.push(res.data.Data[i]);
          }
        }
      })
    },
    getetf () {//获取50etf的行情
      this.$http.post(Api.etfDetails).then(res => {
        // console.log('50etf行情', res.data);
        if (res.data.Status === '1') {
          this.etf = res.data.Data;
        }
      })
    },
    formateDate (date) {//时间处理
      var splitdate = date.split(' ');
      // console.log(splitdate);
      return splitdate[0];
    }
  },
  created () {
    this.getUd();//猜涨跌数据
    this.getLabel();//用户猜涨跌称号
    this.getRecords(this.page);//用户猜涨跌记录
    this.getetf();//获取50etf的行情
    // this.formateDate('2019年5月24日 0:00:00');
  }
}
</script>
<style scoped>
  .guess-index{
    height: 100%;
  }
  .content-body{
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    box-sizing: border-box;
  }
  .back-head{
    position: fixed;
    height: 24px;
    line-height: 24px;
    width: 100vw;
    text-align: center;
    top: 0;
    padding-top: 10px;
    padding-bottom: 10px;
    background: rgba(0, 0, 0, 0);
    z-index: 100001;
  }
  .back-head .back{
    position: absolute;
    height: 18px;
    top: 8px;
    cursor: pointer;
    padding: 10px;
    left: 0;
  }
  .guess-bg{
    position: absolute;
    min-height: 100%;
    left: 0;
    right: 0;
    background-image: url('/static/images/home/bg_guess_topbg.png');
    background-size: 100%;
    background-repeat: no-repeat;
    padding: 0 15px;
    background-color: #fc5d00;
  }
  /* 猜涨跌操作 */
  .guess-module{
    margin-top: 240px;
  }
  .guess-info, .guess-module, .guess-record{
    border-radius: 4px;
    padding: 15px;
    background-color: #fff;
    text-align: center;
    margin-bottom: 15px;
  }
  .guess-module > p.font40{
    font-size: 40px;
  }
  .progress-outer{
    position: relative;
    height: 25px;
    margin-top: 10px;
  }
  .progress-outer img{
    width: 17px;
    position: absolute;
    top: 0;
  }
  .progress-outer img.rise-icon{
    left: 0;
  }
  .progress-outer img.drop-icon{
    right: 0;
  }
  .progress-container{
    position: absolute;
    left: 20px;
    right: 20px;
    bottom: 13px;
  }
  .rise-progress{
    transform: skew(-20deg);
  }
  .drop-progress{
    transform: skew(-20deg);
  }
  .progress-container > div{
    height: 10px;
    overflow: hidden;
    position: absolute;
  }
  .progress-container > div.rise-progress{
    left: 0;
  }
  .progress-container > div.drop-progress{
    right: 0;
  }
  .progress-container > div > div{
    height: 100%;
    position: absolute;
    bottom: 0;
  }
  .progress-container > div > div.rise-bg-color{
    left: 0;
    right: 0;
    animation: runLeft .8s linear;
  }
  .progress-container > div > div.drop-bg-color{
    left: 0;
    right: 0;
    animation: runRight .8s linear;
  }
  @keyframes runLeft{
    0%{
      width: 0;
      right: 100%;
    }
    100%{
      right: 0;
      width: 100%;
    }
  }
  @keyframes runRight{
    0%{
      width: 0;
      left: 100%;
    }
    100%{
      left: 0;
      width: 100%;
    }
  }

  .percent-number{
    overflow: auto;
    margin-top: 5px;
    margin-bottom: 15px;
  }
  .percent-number > span:nth-child(1) {
    float: left;
  }
  .percent-number > span:nth-child(2) {
    float: right;
  }

  .guess-operate{
    height: 40px;
    width: 100%;
    opacity: 1;
    position: relative;
  }
  .guess-button {
    overflow: auto;
    width: 100%;
    margin-left: 0;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 3;
  }
  .guess-button.animate{
    opacity: 0;
    transition: all linear;
  }
  .guess-button > button{
    border: none;
    outline: none;
    width: 150px;
    height: 40px;
    border-radius: 4px;
  }
  .guess-button > button:nth-child(1) {
    float: left;
  }
  .guess-button > button:nth-child(2) {
    float: right;
  }
  .guess-result{
    width: 100%;
    height: 100%;
    opacity: 0;
    text-align: center;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 2;
  }
  .guess-result.animate{
    opacity: 1;
    transition: all 1s linear;
  }
  /* 猜涨跌个人信息 */
  .guess-info{
    display: flex;
  }
  .guess-info > div{
    flex: 1;
  }
  .guess-info > div.guess-name > p{
    background-image: url('/static/images/home/icon_badge_title.svg');
    background-repeat: no-repeat;
    height: 29px;
    background-size: 100% 100%;
    line-height: 29px;
    padding-left: 20px;
    margin-top: 3px;
  }
  .guess-info > div.guess-name > p.login-false{
    background-image: url('/static/images/home/icon_badge_title_n.svg')
  }
  /* 猜测记录 */
  .guess-record .no-login{
    padding: 15px 0;
  }
  .guess-record .record-title{
    padding-bottom: 15px;
    /* border-bottom: 1px solid #d9d9d9; */
    border-bottom-width: 1px;
    border-bottom-style: solid;
  }
  .login-record .record-list > li{
    padding: 15px 0;
    display: flex;
  }
  .login-record .record-list > li > div{
    flex: 1;
  }
  .login-record .record-list > li .record-right > span:nth-child(2){
    margin-left: 50px;
  }
  .login-record .record-list > li > div.record-right{
    text-align: right;
  }
  .login-record .record-list > li > div.record-left{
    text-align: left;
  }
  .guess-record .load-more{
    padding-top: 15px;
    /* border-top: 1px solid #d9d9d9; */
    border-top-width: 1px;
    border-top-style: solid;
  }
</style>
