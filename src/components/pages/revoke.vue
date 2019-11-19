<template>
  <div class="revoke">
    <CHeader title="撤单" backBol="true" backUrl="/deal"></CHeader>
    <div class="content-body has-header">
      <div class="main-bg">
        <!--  撤单提示  -->
        <div :class="{'revoke-tips': true, 'normal-padding': true, 'rise-color': !theme, 'assist-color1': true, 'font24': true, 'tab-active-color': theme}">未成交整单撤单，部分成交委托单未成交部分支持撤单</div>
        <!-- 撤单列表 -->
        <div class="revokes-container">
          <div id="init">
            <mt-loadmore class="main-bg"  :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore" :auto-fill="false">
              <div v-for="item in removeData" :key="item.Id" :class="{'list-item': true, 'normal-margin': true, 'deal-border': !theme, 'assist-color4': theme}">
                <div :class="{'title': true, 'white-color': true, 'deal-bg-color': !theme, 'normal-padding': true,'assist-color3': theme}">
                  <span class="contract"><span>{{item.Sc}}</span>{{item.Sn}}</span>
                  <span>{{formateDate(item.Tc)}}&nbsp;&nbsp;委托</span>
                </div>
                <div class="revoke-situation normal-padding">
                  <div class="deal-money normal-margin">
                    <span class="main-text-color2">交易金额</span>{{Number(item.Dm).toFixed(2)}}
                  </div>
                  <div class="left">
                    <div class="normal-margin">
                      <span class="main-text-color2">委托价格</span>{{Number(item.Dp).toFixed(4)}}
                    </div>
                    <div class="normal-margin">
                      <span class="main-text-color2">委托数量</span>{{item.Dn}}张<span class="main-text-color2" v-if="item.St === 11" style="margin-left: 3px;">(已成{{item.Dnu}}张)</span>
                    </div>
                  </div>
                  <div class="right">
                    <div class="normal-margin">
                      <span class="main-text-color2">交易类型</span><span :class="{'copy-color': item.Dts === '卖出平仓', 'rise-color':  item.Dts === '买入开仓', 'bold-type': true}">{{item.Dts}}</span>
                    </div>
                    <div class="normal-margin">
                      <span class="main-text-color2">订单状态</span>{{item.Kt}}
                    </div>
                  </div>
                  <!-- <div :class="{'revoke-operate': true,  'white-color': item.St === 0 || item.St === 1 || item.St === 6 || item.St === 11 || item.St === 101, 'deal-bg-color': item.St === 0 || item.St === 1 || item.St === 6 || item.St === 11 || item.St === 101, 'assist-color3': item.St !== 0 && item.St !== 1 && item.St !== 6 && item.St && item.St !== 11 && item.St !== 101}" :data-code="item.Id" @click="messageBox" v-if="item.St === 0 || item.St === 1 || item.St === 6 || item.St === 11 || item.St === 101 || item.Kt === '撤单处理中'" >{{item.Kt === '撤单处理中' ? '撤单处理中' : '撤单'}}</div> -->
                   <div :class="{'revoke-operate': true,  'white-color': item.St === 0 || item.St === 1 || item.St === 6 || item.St === 11 || item.St === 101, 'deal-bg-color': item.St === 0 || item.St === 1 || item.St === 6 || item.St === 11 || item.St === 101, 'assist-color3': item.St !== 0 && item.St !== 1 && item.St !== 6 && item.St && item.St !== 11 && item.St !== 101}" :data-code="item.Id" :data-time='item.Tc' @click="messageBox" v-if="item.St === 0 || item.St === 1 || item.St === 6 || item.St === 11" >撤单</div>
                </div>
              </div>
             
            </mt-loadmore>
          </div>
        </div>
      </div>
    </div>
    <!-- 遮盖层 -->
    <div class="pup_cover" v-if="show_bg"></div>
    <div id="loding" v-if="show_loding"><img  src="../../../static/logding.svg" alt=""></div>
    <div class="tips" v-if="show_t">
      <div>撤单</div>
      <div>请于{{t}}秒之后再进行撤单</div>
      <div @click="cleartimer()">确定</div>
    </div>
  </div>
</template>
<script>
import api from '@/api'
import CHeader from '@/components/common/IHeader.vue'
export default {
  data () {
    return {
      allLoaded:false,
      limit: 5,
      page: 1,
      show_loding:false,//显示加载特效
      show_bg:false,//显示蒙版
      revokeData: [],//撤单数据
      
      t_timer:'',
      server_time:'',//服务器时间
      show_t:false,
      standard_t:3,//允许撤单时间
      t:0,//递减时间
    }
  },
  computed: {
    removeData () {//列表list
      if (this.revokeData.length) {
        for (let i = 0; i < this.revokeData.length; i++) {
          if (this.revokeData[i].St != 0 && this.revokeData[i].St != 1 && this.revokeData[i].St != 6 && this.revokeData[i].St != 11 && this.revokeData[i].St != 101 && this.revokeData[i].St != 100){
            this.revokeData.splice(i,1);
            i--;
          }
        }
      }
      return this.revokeData;
    },
    theme () {
      // console.log(localStorage.getItem('theme') != null ? JSON.parse(localStorage.getItem('theme')).theme : 0);
      return localStorage.getItem('theme') != null ? JSON.parse(localStorage.getItem('theme')).theme : 0;
    },
  },
  components: {
    CHeader
  },
  methods: {
    //关闭撤单弹窗（时间未到提示弹窗）
    cleartimer(){
      window.clearInterval(this.t_timer)
      this.show_t=false;
      this.show_bg=false;
    },
    //撤单
    messageBox (e) {
      let code = Number(e.target.dataset.code);
      let time = e.target.dataset.time;
      for (let i in this.revokeData) {
        if (code == this.revokeData[i].Id) {
          if(this.removeData[i].St==101){
            //如果是撤单申请中则不让操作
            this.$toast({
              position: 'bottom',
              message:"该订单不可撤销",
              duration: 1000
            })
            return;
          }
        }
      }
      //如果委托时间没超过3秒，不允许撤单
      var endtime = new Date(Date.parse(time.replace(/-/g,"/")));//委托时间
      this.$http.post(api.getServerTime).then(res=>{
        var servertime = new Date(Date.parse(res.data.Msg.replace(/-/g,"/")));//服务器时间
        var end = (servertime.getTime()-endtime.getTime())/1000;//差秒数
        console.log("委托时间：",endtime);
        console.log("服务器时间：",servertime);
        if(end<this.standard_t){
          this.show_bg=true;
          this.show_t=true;
          this.t=this.standard_t-end;
          this.t_timer= setInterval(() => {
            this.t--;
            if(this.t==0){
              window.clearInterval(this.t_timer);
            }
          }, 1000);
        }else{
          //撤单
          this.show_loding=true;
          this.show_bg=true;
          this.$http.post(api.askCancel,{ID:code}).then(res=>{
            if(res.data.Status==1){
              this.show_loding=false;
              this.show_bg=false;
              if(!res.data.Data){//撤单中设置过止盈止损,询问撤单
                this.$message({
                  title: '温馨提示',
                  message: '本委托为止盈止损委托，撤单后将停止该分笔持仓的止盈止损功能，如需要请重新开启！',
                  showCancelButton: true,
                }).then(action => {
                  if (action == "confirm") {//确认撤单
                    this.$http.post(api.revoke, {id: code}).then(res => {
                      // console.log('撤单', res);
                      if (res.data.Status === '1') {
                        // 撤单处理中  revoke
                        // this.getData();
                        this.$message({
                          title: '撤单',
                          message: '撤单处理中',
                          closeOnClickModal:false
                        }).then(action => {
                          for (let i in this.revokeData) {
                            // console.log(code,  this.revokeData[i].Id);
                            if (code == this.revokeData[i].Id) {
                              this.removeData[i].St=101;
                              this.removeData[i].Kt='撤单处理中';
                              //this.revokeData.splice(i, 1);
                              // console.log('撤单处理中', this.revokeData);
                              break;
                            }
                          }
                        })
                      } else {
                        // 撤单失败
                        this.$message({
                          title: '撤单',
                          message: '撤单失败，请重新发起撤单'
                        })
                      }
                    })
                  }
                })
              }else{//否则直接申请撤单
                this.show_loding=false;
                this.show_bg=false;
                this.$http.post(api.revoke, {id: code}).then(res => {//直接撤单
                  if (res.data.Status === '1') {//撤单申请成功
                    //this.getData();
                    this.$message({
                      title: '撤单',
                      message: '撤单处理中',
                      closeOnClickModal:false
                    }).then(action => {
                      for (let i in this.revokeData) {
                        if (code == this.revokeData[i].Id) {
                          this.removeData[i].St=101;
                          this.removeData[i].Kt='撤单处理中';
                          //this.revokeData.splice(i, 1);
                          // console.log('撤单处理中', this.revokeData);
                          break;
                        }
                      }
                    })
                  } else {
                    // 撤单失败
                    this.$message({
                      title: '撤单',
                      message: '撤单失败，请重新发起撤单',
                      closeOnClickModal:false
                    })
                  }
                })
              }
            }else{}
          });
        }
      })
      
      
      
      
    },
    loadBottom() {
      var objs = {
        id: "",
        AgentId: 0,
        limit: this.limit,
        page: this.page,
        OrderKey: "",
        Sort: "",
        SearchKey: ""
      };
      this.get_data(objs);
    },
    get_data(obj){
      return this.$http.post(api.getRevoke,obj).then(res => {
        if (res.data.Status === '1') {
          for (let i in res.data.Data) {
            this.revokeData.push(res.data.Data[i]);
          }
          this.page++;
          if(this.revokeData.length<res.data.Count){
            this.allLoaded = false;
          }else{
            this.allLoaded = true;
          }
          this.$refs.loadmore.onBottomLoaded();
        }
        return res;
      })
    },
    // getData () {//获取撤单数据
    //   this.$http.post(api.commday).then(res => {
    //     // console.log('撤单数据', res);
    //     if (res.data.Status === '1') {
    //       for (let i in res.data.Data) {
    //         this.revokeData.push(res.data.Data[i]);
    //       }
    //     }
    //   })
    // },
    formateDate (date) {//时间处理
      // console.log(new Date(date));
      var date2 = date.replace(/\-/g, '/');
      var date1 = new Date(date2);
      return date1.getFullYear() + '.' + (date1.getMonth() + 1 < 10 ? '0' + (date1.getMonth() + 1) : date1.getMonth() + 1) + '.' + (date1.getDate() < 10 ? '0' + date1.getDate() : date1.getDate() );
    }
  },
  created () {
    var objs = {
      id: "",
      AgentId: 0,
      limit: this.limit,
      page: this.page,
      OrderKey: "",
      Sort: "",
      SearchKey: ""
    };
    this.get_data(objs).then(res => {
      this.$nextTick(function () {
        document.getElementById('init').scrollTop = 0;
      })
    })
  },
  mounted () {

  }
}
</script>
<style scoped>
  /* 遮盖层 */
  .pup_cover{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(0, 0,0, 0.5);
    z-index: 200000;
  }
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
  .revoke .content-body{
    /* bottom: 50px; */
  }
  .revoke .content-body > div{
    width: 100%;
    height: 100%;
    position: relative;
    text-align: left;
  }

  /* 持仓列表 */
  .revoke .revokes-container{
    position: absolute;
    top: 46px;
    bottom: 0;
    left: 0;
    right: 0;
    margin-top: 10px;
  }
  .revoke .revokes-container > div{
    overflow-y: scroll;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    width: 100%;
    height: 100%;
    padding: 0 10px;
    box-sizing: border-box;
  }
  .revoke .revokes-container > div::-webkit-scrollbar{
    display: none;
  }
  .revoke .revoke-situation {
    overflow: auto;
  }
  .revoke .revoke-situation > div.left{
    width: 50%;
  }
  .revoke .revoke-situation > div.right{
    width: 50%;
  }
  .revoke .revoke-situation > div.left,.revoke .revoke-situation > div.right{
    /* width: 50%; */
    float: left;
  }
  .revoke .revoke-situation > div.deal-money > span:nth-child(1), .revoke .revoke-situation > div > div > span:nth-child(1) {
    margin-right: 6px;
  }
  .revoke .list-item{
    border-radius: 4px;
    position: relative;
  }
  .revoke .list-item .title{
    overflow: auto;
  }
  .revoke .list-item .title > span:nth-child(1){
    float: left;
  }
  .revoke .list-item .title > span.contract > span {
    margin-right: 10px;
  }
  .revoke .list-item .title > span:nth-child(2){
    float: right;
  }
  .revoke-operate{
    height: 40px;
    line-height: 40px;
    clear: both;
    text-align: center;
    border-radius: 4px;
  }
  .tips{
    position: absolute;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%,-50%);
    -ms-transform: translate(-50%,-50%);
    transform: translate(-50%,-50%);
    width: 75%;
    border-radius: 3px;
    z-index: 200001;
  }
  .tips>div:nth-child(1){
    font-size: 16px;
    font-weight: 700;
    text-align: center;
    margin-top: 15px;
  }
  .tips>div:nth-child(2){
    min-height: 100px;
    max-height: 400px;
    width: 100%;
    display: flex;
    justify-content: space-around;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
  }
  .tips>div:nth-child(3){
    font-size: 15px;
    height: 50px;
    line-height: 50px;
    color: #26a2ff;
  }
</style>
