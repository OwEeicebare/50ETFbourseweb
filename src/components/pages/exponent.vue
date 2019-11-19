<template>
  <div>
    <CHeader :title="title" backBol="true" :backUrl="prev_path"></CHeader>
    <div class="content-body has-header">
      <div>
        <!-- 第一部分数据 -->
        <div class="top_wrap">
          <div class="top_row1">
            <div class="left">
              <div class="xj">{{datas.xj}}</div>
              <div class="zde_zdf">
                <div>{{datas.zde}}</div>
                <div>{{datas.zdf}}</div>
              </div>
            </div>
            <div class="right">
              <div><span class="data_title main-text-color2">成交量</span><span class="data_nub">{{datas.cjl}}</span></div>
              <div><span class="data_title main-text-color2">持仓量</span><span class="data_nub">{{datas.ccl}}</span></div>
            </div>
          </div>
          <div class="top_row2">
            <div>
              <div><span class="data_title main-text-color2">今开</span><span class="data_nub">{{datas.jk}}</span></div>
              <div><span class="data_title main-text-color2">昨收</span><span class="data_nub">{{datas.zs}}</span></div>
            </div>
            <div>
              <div><span class="data_title main-text-color2">最高</span><span class="data_nub">{{datas.zg}}</span></div>
              <div><span class="data_title main-text-color2">最低</span><span class="data_nub">{{datas.zd}}</span></div>
            </div>
            <div>
              <div><span class="data_title main-text-color2">委比</span><span class="data_nub">{{datas.wb}}</span></div>
              <div><span class="data_title main-text-color2">振幅</span><span class="data_nub">{{datas.zf}}</span></div>
            </div>
          </div>
        </div>
        <!-- k线 -->
        <div class="echart_wrap normal-margin-top">
          <!-- <div class="select_charts">
            <router-link tag="span" class="every_select" to="/LineEcharts">分时</router-link>
            <router-link tag="span" class="every_select" to="/KEcharts">日k</router-link>
          </div>
          <router-view></router-view> -->
          <div class="select_charts">
            <span class="every_select" @click="flag=true">分时</span>
            <span class="every_select" @click="flag=false">日k</span>
          </div>
          <div class="views">
            <div :class="{is_hide:!flag}"><LineEcharts></LineEcharts></div>
            <div :class="{is_hide:flag}"><KEcharts></KEcharts></div>
          </div>
        </div>
        <!-- 买卖五档 -->
        <div class="buy_sell_five normal-margin-top">
          <div class="title">
            <span>买盘5档</span>
            <span>卖盘5档</span>
          </div>
          <div class="content">
            <div class="content_left">
              <div class="left_row">
                <span class="main-color1">5</span><span class="rise-color">2.1231</span><span>1233</span>
              </div>
              <div class="left_row">
                <span class="main-color1">4</span><span class="rise-color">2.1231</span><span>23</span>
              </div>
              <div class="left_row">
                <span class="main-color1">3</span><span class="rise-color">2.1231</span><span>13</span>
              </div>
              <div class="left_row">
                <span class="main-color1">2</span><span class="rise-color">2.1231</span><span>1243</span>
              </div>
              <div class="left_row">
                <span class="main-color1">1</span><span class="rise-color">2.1231</span><span>1243</span>
              </div>
            </div>
            <div class="content_line"></div>
            <div class="content_right">
              <div class="left_row">
                <span>123</span><span class="drop-color">2.1231</span><span class="main-color2">5</span>
              </div>
              <div class="left_row">
                <span>123</span><span class="drop-color">2.1231</span><span class="main-color2">4</span>
              </div>
              <div class="left_row">
                <span>123</span><span class="drop-color">2.1231</span><span class="main-color2">3</span>
              </div>
              <div class="left_row">
                <span>123</span><span class="drop-color">2.1231</span><span class="main-color2">2</span>
              </div>
              <div class="left_row">
                <span>123</span><span class="drop-color">2.1231</span><span class="main-color2">1</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
<script>
import CHeader from '@/components/common/IHeader.vue'
import LineEcharts from '@/components/common/LineEcharts.vue'
import KEcharts from '@/components/common/KEcharts.vue'
export default {
  data () {
    return {
      datas:{//上部分数据
        xj:2.2222,
        zde:"+0.9999",
        zdf:"+2.22%",
        cjl:'1111万',
        ccl:'34.34亿',
        jk:0.1324,
        zs:0.1234,
        zg:0.1231,
        zd:0.1234,
        wb:"12.34%",
        zf:"0.12%",
        xqjg:"3.1211",
        xqrq:"2012.04.12",
        hydw:3.3344,
        syts:"23天"
      },
      flag:true,
      prev_path:'/'//行情详情固定跳转行情也买
    }
  },
  computed: {
    title () {
      return this.$route.query.title;
    }
  },
  components: {
    CHeader,
    LineEcharts,
    KEcharts
  },
  mounted() {

  }
}
</script>
<style scoped>
.content-body > div{
  overflow-y: scroll;
  overflow-x: hidden;
  width: 100%;
  height: 100%;
}
.content-body > div::-webkit-scrollbar{
  display: none;
}

.top_wrap{
  background: #ffffff;
  padding: 10px;
  font-size: 14px;
}
.top_row1{
  display: flex;
  justify-content: space-between;
}
.top_row1>.left{
  width: 60%;
  display: flex;

}
.xj{
  font-size: 26px;
  font-family: fonts;
}
.zde_zdf{
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  margin-left: 20px;
}
.top_row1>.right{
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  width: 40%;
  text-align: left;
}
.top_row1>.right>div:first-child{
  margin-bottom: 5px;
}
.top_row2{
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}
.top_row2>div>div{
  margin-bottom: 10px;
}
.data_title{
  /* color:gray; */
  margin-right: 10px;
}
.data_nub{
  display: inline-block;
  width: 70px;
  text-align: left;
}
.echart_wrap{
  background: #fff;
  /* margin-top: 12px; */
}
/*买卖五档*/
.buy_sell_five{
  /* margin-top: 10px; */
  padding: 10px;
  background: #fff;
  font-size: 14px;
}
.buy_sell_five .title{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.buy_sell_five .content{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}
.buy_sell_five .content .content_left,.buy_sell_five .content .content_right{
  width: 50%;
}
.buy_sell_five .content .content_left>div,.buy_sell_five .content .content_right>div{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px;
}
.buy_sell_five .content .content_left>.left_row:after{
  display: block;
  content: '';
  border-right: 1px solid #d4d4d4;
  height: 10px;
  position: relative;
  left: 10px;
}
.buy_sell_five .content .content_left>div>span:first-child{
  /* background: #ff787b; */
  color: white;
  padding:2px 5px;
  font-size: 14px;
  border-radius: 2px;
  margin-right: 15px;
}
.buy_sell_five .content .content_right>div>span:last-child{
  /* background: #3aaaff; */
  color: white;
  padding:2px 5px;
  font-size: 14px;
  border-radius: 2px;
  margin-left: 15px;
}
.buy_sell_five .content .content_left>div>span:not(:first-child),.buy_sell_five .content .content_right>div>span:not(:last-child){
  display: inline-block;
  width: 50px;
}
.btns{
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
}
.select_charts{
  display: flex;
  justify-content: center;
  align-items: center;
  margin:0 10px;
  padding-top: 10px;
}
.select_charts>span{
  border: 1px solid black;
}
.views{
  position: relative;
  height: 300px;
}
.views>div{
  position: absolute;
  width: 100%
}
.views>.is_hide{
  visibility: hidden;
}
</style>

