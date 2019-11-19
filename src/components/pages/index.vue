<template>
  <div class="home main-bg">
    <CHeader title="首页" ref="headerDom"></CHeader>
    <div class="content-body assist-color3" @click="handleTouchMove">
      <div>
        <!-- 轮播图 -->
        <div class="swiper" v-if="ads.length">
          <mt-swipe :auto="10000000">
            <mt-swipe-item v-for="item in ads" :key="item.Id">
              <!-- <router-link tag='a'  :to="{path:'/return_link',query: {u:item.url}}"  >
                <img :src="item.img" alt="">
              </router-link>-->
              <a href="#" >
                <img :src="item.img" alt />
              </a>
            </mt-swipe-item>
          </mt-swipe>
        </div>
        
        <!-- 通告 -->
        <router-link
          tag="div"
          to="/notice"
          class="notice font28 normal-margin main-bg normal-padding"
        >
          <img
            :src="theme ? '/static/images/black/icon_system_notice.svg' : '/static/images/home/icon_system_notice.svg'"
            alt="系统公告"
          />
          <span class="notice-icon rise-color font20">通知</span>
          <div class="notice-box">
            <ul :class="{'main-text-color1': true, 'anim': animate === true}">
              <router-link
                :to="{path: '/notice-details', query: { id: item.Id }}"
                v-for="(item,i) in latestNotice"
                tag="li"
                :key="i"
              >{{item.Ti}}</router-link>
            </ul>
          </div>
        </router-link>
        <!-- 指数 -->
        <div class="float normal-margin main-bg normal-padding" >
          <div v-for="(item,i) in stock" :key="i" >
            <p class="font28">{{item.StockName ? item.StockName : '----'}}</p>
            <p
              :class="{'font36':true,'float-index':true,'number-font':true,'rise-color':item.PriceRise>0,'drop-color':item.PriceRise<0}"
            >{{item.PriceCurrent&&item.PriceCurrent ? i!= 0 ? Number(item.PriceCurrent).toFixed(2):Number(item.PriceCurrent).toFixed(4) : '--.--'}}</p>
            <p
              :class="{'font24':true,'number-font':true,'rise-color':item.PriceRise>0,'drop-color':item.PriceRise<0}"
            >
              <span v-if="item.PriceRise>0">+</span>{{item.PriceRise ? i!= 0 ? Number(item.PriceRise).toFixed(2): Number(item.PriceRise).toFixed(4):item.PriceCurrent?'0.0000':'-.---'}}&nbsp;&nbsp;
              <span v-if="item.PriceRise>0">+</span>{{item.PriceRisePercent ? Number(item.PriceRisePercent).toFixed(2)+'%' :item.PriceCurrent?'0.00%': '-.--'}}
            </p>
          </div>
        </div>
        <!-- 猜涨跌 -->
        <!-- <router-link to="/guess" tag="div" class="main-bg normal-padding guess normal-margin">
          <h3 class="font28">猜涨跌<span class="font24 main-text-color2 guess-tips">50ETF预测王就是你</span></h3>
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
          <div class="percent-number font24">
            <span class="rise-color">{{risePercent}}%</span>
            <span class="drop-color">{{100 - risePercent}}%</span>
          </div>
        </router-link>-->
        <!-- 我的资产 -->
        <div class="my-asset main-bg normal-padding normal-margin">
          <h3 class="font28 normal-border-color">我的资产</h3>
          <div class="asset-content">
            <!-- 未登录资产显示 -->
            <div class="asset-unregister" v-if="!login">
              <p class="font24 main-text-color2">
                您还未登录账号，登录后可见我的资产。
                <router-link to="/login" class="tab-active-color">立即登录</router-link>
              </p>
            </div>
            <!-- 已登录资产显示 -->
            <div class="asset-login" v-else>
              <div>
                <div>
                  <p class="main-text-color2 font24">总资产(￥)</p>
                  <p class="font32">{{judgeEmptyObj(asset) ? subMoney(asset.Total) : '0.00'}}</p>
                </div>
                <div>
                  <p class="main-text-color2 font24">持仓市值(￥)</p>
                  <p class="font32">{{totalValue ? subMoney(totalValue) : '0.00'}}</p>
                </div>
              </div>
              <div>
                <div>
                  <p class="main-text-color2 font24">可用余额(￥)</p>
                  <p class="font32">{{judgeEmptyObj(asset) ? subMoney(asset.Balance) : '0.00'}}</p>
                </div>
                <div>
                  <p class="main-text-color2 font24">持仓盈亏(￥)</p>
                  <p class="font32">{{judgeEmptyObj(asset) ? subMoney(asset.YingKui) : '0.00'}}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 栏目文章 -->
      <div class="index-article main-bg" id="programa">
        <div
          :class="{ 'article-title': true, 'main-bg': true, 'isFixedTop': isProgramaFixed }"
          ref="fixedDom"
        >
          <div>
            <span
              v-for="item in articleType"
              :key="item.Id"
              :class="{'main-color1': item.Id === active, 'font28': true}"
              @click="changeActive"
              :data-id="item.Id"
            >{{item.Tie}}</span>
          </div>
        </div>
        <!--  :swipeable="true" -->
        <mt-tab-container
          v-model="active"
          :class="{ 'articles-list': true, 'fixed-programa': isProgramaFixed }"
        >
          <mt-tab-container-item v-show="active">
            <div v-if="articleList.length">
              <router-link
                :to="{path: '/article-details', query: {id: zitem.Id}}"
                v-for="zitem in articleList"
                :key="zitem.Id"
                class="article-item normal-border-color"
                tag="div"
              >
                <img :src="zitem.img" :alt="zitem.Ti" v-if="zitem.img" class="article-cover" />
                <h3 class="font32 normal-margin text-overflow">{{zitem.Ti}}</h3>
                <div class="main-text-color2 font24">
                  <span>{{formatDate(zitem.Pt)}}</span>
                </div>
              </router-link>
              <div :class="{'loadmore':true}" v-if="is_paging" @click="addmore">加载更多</div>
            </div>
            <div v-else class="main-text-color2" style="text-align: center; line-height: 50px;">无数据</div>
          </mt-tab-container-item>
        </mt-tab-container>
      </div>
    </div>
    <TabNav></TabNav>
  </div>
</template>

<script>
import Api from "@/api";
import CHeader from "@/components/common/IHeader.vue";
import TabNav from "@/components/common/TabNav.vue";
import formatDate from "../../../static/js/format_date.js";
export default {
  data() {
    return {
      animate: false,
      time: null,
      risePercent: 50,
      active: 0, //选中的文章类目
      articleType: [], //资讯类目
      articleList: [], //资讯列表
      isProgramaFixed: false, //类目是否吸顶
      ads: [], //banner
      latestNotice: this.$store.state.latestNotice, //最新三条公告
      timer: null, //定时器
      asset: {}, //资产
      stock: [], //50etf，上证指数，深证成指
      allStr: "",
      allPositions: [],
      totalValue: 0, //持仓市值 后

      page: 1,
      limit: 10,
      is_paging: true

      //againId:'',//域名代理id
    };
  },
  components: {
    TabNav,
    CHeader
  },
  computed: {
    authenticateState() {
      if (sessionStorage.getItem("authenticateState") != null) {
        return sessionStorage.getItem("authenticateState");
      } else {
        return this.$store.state.authenticateState;
      }
    },
    urgentNotice() {
      let temUrgent = [];
      temUrgent = this.$store.state.urgentNotice;
      return temUrgent;
    },
    login() {
      if (localStorage.getItem("login") != null) {
        return true;
      } else {
        return false;
      }
    },
    theme() {
      // console.log(localStorage.getItem('theme') != null ? JSON.parse(localStorage.getItem('theme')).theme : 0);
      return localStorage.getItem("theme") != null
        ? JSON.parse(localStorage.getItem("theme")).theme
        : 0;
    },
    againId() {
      var info = JSON.parse(window.localStorage.getItem("againInfo"));
      if (!info) {
        //取不到代理信息
        this.$store.dispatch("get_againInfo").then(res => {
          info = JSON.parse(window.localStorage.getItem("againInfo")).id;
          this.getArticleType(info); //获取文章栏目
          this.getadList(info); //获取banan轮播图
          this.getNotice(info);
          return info;
        });
      } else {
        this.getArticleType(info.id); //获取文章栏目
        this.getadList(info.id); //获取banan轮播图
        this.getNotice(info.id);
        return info.id;
      }
    }
  },
  methods: {
    addmore() {
      this.page++;
      this.$http
        .post(Api.articleList, {
          cid: this.active,
          page: this.page,
          limit: this.limit
        })
        .then(res => {
          if (res.data.Status === "1") {
            for (let i = 0; i < res.data.Data.length; i++) {
              this.articleList.push(res.data.Data[i]);
            }
            if (this.articleList.length < res.data.Count) {
              this.is_paging = true;
            } else {
              this.is_paging = false;
            }
          }
        });
    },

    getstock() {
      //获取指数（老）
      this.$http.post(Api.indexStock).then(res => {
        if (res.data.Status == 1) {
          this.stock = res.data.Data;
        }
        // else{
        //   this.$toast({
        //     message: res.data.Msg,
        //     position: 'bottom',
        //     duration: 2000
        //   });
        // }
      });
    },
    toNotice() {
      this.$router.push("/notice");
    },
    scroll() {
      this.animate = true;
      this.time = setTimeout(() => {
        this.latestNotice.push(this.latestNotice[0]);
        this.latestNotice.shift();
        this.animate = false;
        clearTimeout(this.time);
      }, 1000);
    },
    changeActive(e) {
      this.active = Number(e.target.dataset.id);
      this.articleList.length = 0;
      this.page = 1;
      this.limit = 10;
      this.$http
        .post(Api.articleList, {
          cid: this.active,
          page: this.page,
          limit: this.limit
        })
        .then(res => {
          // console.log('切换文章类目', res.data);
          if (res.data.Status === "1") {
            this.articleList = res.data.Data;
            if (this.articleList.length < res.data.Count) {
              this.is_paging = true;
            } else {
              this.is_paging = false;
            }
          } else if (res.data.Status === "0") {
            //没有资讯
          }
        });
    },
    handleScroll() {
      // 监听页面是否滚动到指定元素， 到了指定元素该元素吸顶
      // 吸顶后取消监听页面滚动，监听元素列表滚动，
      var scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      var eleTop = document.querySelector("#programa").offsetTop;
      this.isProgramaFixed =
        scrollTop >= eleTop && scrollTop > 0 ? true : false;
      // console.log('scrolltop', scrollTop);
    },
    formatDate: formatDate.formatDate,
    showUrgentNotice() {
      //紧急公告
      //紧急公告 先判断是否有未读的紧急公告，有则弹窗
      // console.log(this.urgentNotice);
      if (this.login) {
        //未登录不弹窗紧急公告
        if (this.urgentNotice.length) {
          if (sessionStorage.getItem("noticeState") != null) {
            return;
          }
          var str = "";
          var urgentId = [];
          for (let i = 0; i < this.urgentNotice.length; i++) {
            if (!this.urgentNotice[i].IsRead) {
              str += this.urgentNotice[i].Cc + "<br/>";
              urgentId.push(this.urgentNotice[i].Id);
            }
            this.$message({
              title: "紧急公告",
              message: str,
              confirmButtonClass: "copy-color",
              confirmButtonText: "已阅",
              closeOnClickModal: false
            }).then(action => {
              // console.log(action); 关闭后状态为已读 判断是否实名认证
              for (let j = 0; j < urgentId.length; j++) {
                this.$store.dispatch("read_notice", urgentId[j]);
              }
              this.authenticate();
              sessionStorage.setItem("noticeState", true);
            });
          }
        } else {
          this.authenticate();
        }
      }
    },
    authenticate() {
      //判断是否实名认证
      //先判断state里面authenticate状态
      if (this.authenticateState) {
        // 已认证 则判断是否有过期合约提示
        this.expiration();
      } else {
        //请求是否已实名认证 未认证则弹窗
        this.$store.dispatch("get_authenticate_state").then(res => {
          // console.log('实名状态', res);
          if (res.Status !== "401" && res.Data.NTure === 3) {
            //未实名
            this.$message({
              title: "实名认证",
              message: "您尚未进行实名认证，无法交易，现在就去认证吗",
              closeOnClickModal: false,
              showCancelButton: true,
              cancelButtonClass: "main-text-color2"
            }).then(action => {
              sessionStorage.setItem("authenticateState", true);
              if (action === "confirm") {
                this.$router.push("/authenticationSelect");//方案选择
              }
            });
          }
          if (res.Status === "1" && res.Data.NTure === 1) {
            this.expiration();
          }
        });
      }
    },
    expiration() {
      //是否有合约到期 有则到期提醒
      // if () {//有过期合约
      //   this.$message({
      //     title: '合约到期提醒',
      //     message: '您的合约'
      //   }).then(action => {
      //     if (action === 'confirm') {
      //       this.$router.push('/authentication');
      //     }
      //   })
      // } else {

      // }
      this.$http.post(Api.contractNotice).then(res => {
        // console.log('合约到期提醒', res);
        // console.log(localStorage.getItem('expire'), localStorage.getItem('expire') !== res.data.Data[0].dDay);
        if (res.data.Status === "1") {
          let result = res.data.Data;
          if (
            result.length &&
            localStorage.getItem("expire") !== res.data.Data[0].dDay
          ) {
            let date = res.data.Data[0].dDate.replace(/\-/g, "/");
            let day = res.data.Data[0].dDay;
            // console.log(new Date(date).getDate(), day);
            this.$message({
              title: "温馨提醒",
              message:
                "您购买的" +
                (new Date(date).getMonth() + 1) +
                "月期合约即将在" +
                (new Date(date).getMonth() + 1 < 10
                  ? "0" + (new Date(date).getMonth() + 1)
                  : new Date(date).getMonth() + 1) +
                "月" +
                (new Date(date).getDate() < 10
                  ? "0" + new Date(date).getDate()
                  : new Date(date).getDate()) +
                "日到期，请在" +
                (new Date(date).getMonth() + 1 < 10
                  ? "0" + (new Date(date).getMonth() + 1)
                  : new Date(date).getMonth() + 1) +
                "月" +
                (new Date(date).getDate() < 10
                  ? "0" + new Date(date).getDate()
                  : new Date(date).getDate()) +
                "日下午14：30前，将有盈利有价值的合约提前准备平仓，14:55分之前没有平仓的，合约将自动作废，价值将全部归零！请提前妥善安排！"
            }).then(action => {
              localStorage.setItem("expire", day);
            });
          }
        }
      });
    },
    getNotice(id) {
      //获取公告信息
      // if (this.login) {
      //   this.$store.dispatch('get_notice').then(res => {
      //     this.showUrgentNotice();
      //   });
      // } else {
      this.$store.dispatch("get_visitor_notice", id).then(res => {
        this.showUrgentNotice();
      });

      // }
    },
    getUd() {
      //猜涨跌数据
      this.$http.post(Api.ud).then(res => {
        // console.log('猜涨跌数据', res.data);
        if (res.data.Status === "1") {
          this.risePercent = Number(res.data.Data[0]);
        }
      });
    },
    getAsset() {
      //获取资产信息
      if (this.login) {
        var loginObj = localStorage.getItem("login");
        this.$http({
          method: "post",
          url: Api.mineInfo,
          params: { id: loginObj.Id }
        }).then(res => {
          // console.log('首页我的资产数据', res);
          if (res.data.Status == "1") {
            this.asset = res.data.Data;
          }
        });
        this.getHoldStocks();
      }
    },
    getHoldStocks() {
      //获取合并持仓数据
      this.$http.post(Api.stockHold).then(res => {
        // console.log('合并持仓', res);
        if (res.data.Status === "1") {
          this.allStr = "";
          for (let i = 0; i < res.data.Data.length; i++) {
            if (i !== res.data.Data.length - 1) {
              this.allStr += "CON_OP_" + res.data.Data[i].Sc + ",";
            } else {
              this.allStr += "CON_OP_" + res.data.Data[i].Sc;
            }
          }
          this.allPositions = res.data.Data;
          this.getCurrentPrice(this.allStr, "combine");
          // console.log('合并持仓字符串', this.allStr);
        } else {
          this.$toast({
            message: res.data.Msg,
            position: "bottom",
            duration: 3000
          });
        }
      });
    },
    getCurrentPrice(str, type) {
      //获取持仓合约的现价
      if (str) {
        this.$http.post(Api.stockCurrent, { id: str, status: 0 }).then(res => {
          // console.log('获取持仓合约的现价', res);
          if (res.data.Status === "1") {
            for (let i = 0; i < res.data.Data.length; i++) {
              for (let j = 0; j < this.allPositions.length; j++) {
                if (res.data.Data[i].stock == this.allPositions[j].Sc) {
                  this.allPositions[j].PriceCu = res.data.Data[i].PriceCu;
                  this.allPositions[j].PriceDa = res.data.Data[i].PriceDa;
                  this.allPositions[j].PriceDatye = res.data.Data[i].PriceDatye;
                  this.allPositions[j].BuyOneAmount =
                    res.data.Data[i].BuyOneAmount;
                  this.totalValue +=
                    Number(this.allPositions[j].PriceCu) *
                    Number(this.allPositions[j].Num) *
                    Number(this.allPositions[j].Dnu);
                  // break;
                  // console.log(this.allPositions[j].BuyOneAmount, this.allPositions[j].Num, this.allPositions[j].Dnu);
                  // console.log(this.totalValue);
                }
              }
            }
          }
        });
      }
    },
    judgeEmptyObj(obj) {
      //非空对象判断
      for (let item in obj) {
        return true;
      }
      return false;
    },
    subMoney(money) {
      //处理资产金额小数点后两位
      var mStr = money + "";
      var mArr = mStr.split(".");
      var pointStr = "";
      if (mArr.length === 1) {
        return money + ".00";
      } else {
        if (mArr[1].length === 1) {
          pointStr = mArr[1] + "0";
        } else {
          pointStr = mArr[1].substring(0, 2);
        }
      }
      return mArr[0] + "." + pointStr;
    },
    handleTouchMove(e) {
      //禁止滚动
      // e.preventDefault();
    },
    getArticleType(id) {
      //获取文章栏目
      // 获取文章类目
      this.$http({
        url: Api.articleType,
        params: { iAgentId: id },
        method: "post"
      }).then(res => {
        // console.log(res.data);
        if (res.data.Status === "1") {
          this.articleType = res.data.Data;
          this.active = res.data.Data[0].Id;
          // console.log(this.articleList);
          //初始化文章列表
          this.articleList.length = 0;
          this.$http
            .post(Api.articleList, {
              cid: this.active,
              page: this.page,
              limit: this.limit
            })
            .then(res => {
              // console.log('初始化文章类目', res.data);
              if (res.data.Status === "1") {
                for (let i = 0; i < res.data.Data.length; i++) {
                  this.articleList.push(res.data.Data[i]);
                }
                if (this.articleList.length < res.data.Count) {
                  this.is_paging = true;
                } else {
                  this.is_paging = false;
                }
                // console.log('测试拿到文章列表', this.articleList);
              }
              this.$forceUpdate();
            });
        }
        // console.log('articleType 文章类目', res);
      });
    },
    getadList(id) {
      //获取banner广告列表
      this.$http({
        url: Api.adList,
        params: { iAgentId: id },
        method: "post"
      }).then(res => {
        // console.log('banner广告列表', res.data);
        if (res.data.Status === "1") {
          this.ads = res.data.Data;
        }
      });
    },
    //获取轮播图列表（新）
    // getadList(id) {
    //   var data={
    //     "OId": 0,
    //     "AgentId":id,
    //     "page": 0,
    //     "limit": 0,
    //     "OrderKey": "",
    //     "Sort": "",
    //     "SearchKey": ""
    //   };
    //   this.$http.post(Api.getLunBo,data).then(res => {
    //     // console.log('banner广告列表', res.data);
    //     if (res.data.Status === "1") {
    //       this.ads = res.data.Data;
    //     }
    //   });
    // },
    get_indexs() {
      //获取指数
      this.$http({
        url: "http://qt.gtimg.cn",
        params: { q: "sh510050,sh000001,sz399001" },
        method: "get"
      }).then(res => {
        var indexs = res.data.split(";");
        for (var i = 0, len = indexs.length; i < len; i++) {
          var obj = {};
          indexs[i] = indexs[i].split("~");
          obj.StockName = indexs[i][1]; //名称
          obj.PriceRise = indexs[i][31]; //涨跌额
          obj.PriceCurrent = indexs[i][3]; //现价
          obj.PriceRisePercent = indexs[i][32]; //涨跌幅
          obj.stock = indexs[i][0].split("=")[0];
          indexs[i] = obj;
        }
        this.stock = [indexs[0], indexs[1], indexs[2]];
      });
      // console.log(this.stock)
    }
  },
  created() {
    this.get_indexs();
    // this.getstock();
    this.timer = setInterval(() => {
      this.scroll();
      this.get_indexs();
      // this.getstock();
    }, 2000);
    console.log(this.againId); //为了执行计算机属性
    this.getUd(); //猜涨跌数据
    this.getAsset(); //获取资产信息
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
    clearInterval(this.timer);
  },
  watch: {
    //active: function (newValue) {
    // console.log(newValue);
    // this.$http({url: Api.articleList, params: {Id: this.active}, method: 'post'}).then(res => {
    //   console.log('切换文章类目', res.data);
    //   if (res.data.Status === '1') {
    //     this.articleList = res.data.Data;
    //     console.log(this.articleList);
    //   } else if (res.data.Status === '0') {
    //     //没有资讯
    //     this.articleList.length = 0;
    //   }
    // })
    //},
  }
};
</script>

<style>
#app {
  /* overflow: auto; */
}
.loadmore {
  text-align: center;
  margin: 10px auto;
}

.home .swiper {
  height: 110px;
}
.home .swiper img {
  width: 100%;
}
.home .content-body {
  overflow: hidden;
  margin-top: 44px;
  position: relative;
}
/* 通知 */
.home .notice {
  overflow: hidden;
  position: relative;
  text-align: left;
  width: 100%;
  line-height: 28px;
  height: 28px;
}
.home .notice .notice-icon {
  display: inline-block;
  border: 1px solid #ff464b;
  border-radius: 4px;
  width: 28px;
  text-align: center;
  height: 15px;
  line-height: 16px;
  vertical-align: middle;
}
.home .notice > img {
  margin-right: 5px;
  height: 16px;
  vertical-align: middle;
}
.home .notice-box {
  position: absolute;
  left: 120px;
  top: 15px;
  width: 60%;
  height: 20px;
  overflow: hidden;
  vertical-align: middle;
}
.home .notice-box > ul.anim {
  transition: all 1s;
  margin-top: -20px;
}
.home .notice-box li {
  line-height: 20px;
  height: 20px;
  overflow: hidden;
  white-space: nowrap;
}
/* 上证指数 */
.home .float {
  display: flex;
}
.home .float > div {
  flex: 1;
}
.home .float > div > .float-index {
  margin-top: 2px;
}
/* 猜涨跌 */
.home .guess {
  text-align: left;
}
.home .guess .guess-tips {
  margin-left: 10px;
}
.home .guess > .progress-outer {
  position: relative;
  height: 25px;
  margin-top: 10px;
}
.home .guess img {
  width: 17px;
  position: absolute;
  top: 0;
}
.home .guess img.rise-icon {
  left: 0;
}
.home .guess img.drop-icon {
  right: 0;
}
.home .guess .progress-container {
  position: absolute;
  left: 20px;
  right: 20px;
  bottom: 13px;
}
.home .rise-progress {
  transform: skew(-20deg);
}
.home .drop-progress {
  transform: skew(-20deg);
}
.home .progress-container > div {
  height: 10px;
  overflow: hidden;
  position: absolute;
}
.home .progress-container > div.rise-progress {
  left: 0;
}
.home .progress-container > div.drop-progress {
  right: 0;
}
.home .progress-container > div > div {
  height: 100%;
  position: absolute;
  bottom: 0;
}
.home .progress-container > div > div.rise-bg-color {
  left: 0;
  right: 0;
  animation: runLeft 0.8s linear;
}
.home .progress-container > div > div.drop-bg-color {
  left: 0;
  right: 0;
  animation: runRight 0.8s linear;
}
@keyframes runLeft {
  0% {
    width: 0;
    right: 100%;
  }
  100% {
    right: 0;
    width: 100%;
  }
}
@keyframes runRight {
  0% {
    width: 0;
    left: 100%;
  }
  100% {
    left: 0;
    width: 100%;
  }
}
.home .percent-number {
  overflow: auto;
  margin-top: 10px;
  /* margin-bottom: 10px; */
}
.home .percent-number > span:nth-child(1) {
  float: left;
}
.home .percent-number > span:nth-child(2) {
  float: right;
}
/* 我的资产 */
.home .my-asset {
  text-align: left;
}
.home .my-asset > h3 {
  padding-bottom: 10px;
  /* border-bottom: 1px solid #d9d9d9; */
  border-bottom-width: 1px;
  border-bottom-style: solid;
}
.home .my-asset .asset-unregister {
  padding: 20px 0 10px;
}
.home .my-asset .asset-login > div {
  display: flex;
}
.home .my-asset .asset-login > div:nth-child(1) {
  margin: 10px 0 15px 0;
}
.home .my-asset .asset-login > div > div {
  flex: 1;
  position: relative;
}
.home .my-asset .asset-login > div > div:nth-child(2):before {
  content: "";
  position: absolute;
  width: 1px;
  height: 25px;
  left: -10px;
  top: 5px;
  /* background-color: #d9d9d9; */
}
/* 财经文章 */
.home .index-article {
  overflow: hidden;
  position: relative;
  width: 100%;
  box-sizing: border-box;
  padding: 0 10px;
}
.home .index-article .article-title {
  width: 100%;
  padding-top: 12px;
}
.home .index-article .article-title > div {
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  text-align: left;
  height: 36px;
}
.home .index-article .article-title > div::-webkit-scrollbar {
  display: none;
}
.home .index-article .article-title.isFixedTop {
  position: fixed;
  width: 100%;
  top: 44px;
  z-index: 100;
  /* background-color: #fff; */
}
.home .index-article .article-title > div > span {
  display: inline-block;
  padding: 2px 8px;
  margin-right: 10px;
  border-radius: 4px;
}
.home .index-article .article-title > div > span.main-color1 {
  color: #fff;
}
.home .index-article .article-title > div > span:nth-last-child(1) {
  margin-right: 0;
}
.home .articles-list {
  margin-bottom: 50px;
  text-align: left;
  min-height: 308px;
}
.home .articles-list.fixed-programa {
  margin-top: 28px;
}
.home .articles-list .article-item {
  /* border-top: 1px solid #d9d9d9; */
  border-top-width: 1px;
  border-top-style: solid;
  padding: 10px 0;
  overflow: hidden;
  max-height: 77px;
}
.home .articles-list .article-item > h3 {
  padding-right: 20px;
}
.home .articles-list .article-item > img.article-cover {
  float: right;
  width: 118px;
  height: 77px;
  border-radius: 4px;
}
.home .text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  /* autoprefixer: off */
  -webkit-box-orient: vertical;
  /* autoprefixer: on */
  -webkit-line-clamp: 2;
  line-clamp: 2;
}
.home .mint-tab-container-wrap {
  transform: translate3d(0, 0, 0) !important;
}
</style>
