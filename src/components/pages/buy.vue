<template>
    <!-- 快捷反手买入 -->
    <div id="buy">
        <CHeader title="买入" backBol="true" backUrl="/deal"></CHeader>
        <div class="content-body has-header">
          <div>
            <div class="top main-bg">
                <input type="text" alt="搜索" id="search" placeholder="请输入合约代码/名称/缩写" @focus="toSearch" class="assist-color3"/>
                <div class="data_wrap normal-border-color">
                    <div class="left">
                        <p><span>代码</span><span>{{code ? code : "- -"}}</span></p>
                        <p><span>名称</span><span>{{code ? codeDetail.StockName : "- -"}}</span></p>
                    </div>
                    <div :class="{'right': true, 'number-font': true, 'rise-color':codeDetail.PriceCurrent>codeDetail.PriceYesterdayClose&&codeDetail.PriceOpen!=0,'drop-color': codeDetail.PriceCurrent<codeDetail.PriceYesterdayClose&&codeDetail.PriceOpen!=0 }">
                        <div>{{codeDetail.PriceCurrent?Number(codeDetail.PriceCurrent).toFixed(4):codeDetail.PriceOpen&&codeDetail.PriceOpen!=0?'0.0000':"-.----"}}</div>
                        <div>
                            <p>{{codeDetail.PriceRise > 0 ? '+' : ''}}{{codeDetail.PriceRise&&codeDetail.PriceOpen? Number(codeDetail.PriceRise).toFixed(4):codeDetail.PriceOpen&&codeDetail.PriceOpen!=0?'0.0000':'-.----'}}</p>
                            <p>{{codeDetail.PriceRisePercent > 0 ? '+' : ''}}{{codeDetail.PriceRisePercent&&codeDetail.PriceOpen?Number(codeDetail.PriceRisePercent).toFixed(2)+'%':codeDetail.PriceOpen&&codeDetail.PriceOpen!=0?'0.00%':'--'}}</p>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 买卖五档 -->
            <div class="buy_sell_five normal-margin-top main-bg">
                <div class="title">
                <span>买盘5档</span>
                <span>卖盘5档</span>
                </div>
                <div class="content">
                <div class="content_left">
                    <div class="left_row">
                      <span class="main-color1">5</span>
                      <span class="rise-color">{{codeDetail.BuyFiveAmount?Number(codeDetail.BuyFiveAmount).toFixed(4):'-.- -'}}</span>
                      <span>{{codeDetail.BuyFiveNum&&codeDetail.BuyFiveAmount?codeDetail.BuyFiveNum: '- -'}}</span>
                    </div>
                    <div class="left_row">
                      <span class="main-color1">4</span>
                      <span class="rise-color">{{codeDetail.BuyFourAmount? Number(codeDetail.BuyFourAmount).toFixed(4) : '-.- -'}}</span>
                      <span>{{codeDetail.BuyFourNum&&codeDetail.BuyFourAmount?codeDetail.BuyFourNum : '- -'}}</span>
                    </div>
                    <div class="left_row">
                      <span class="main-color1">3</span>
                      <span class="rise-color">{{codeDetail.BuyThreeAmount? Number(codeDetail.BuyThreeAmount).toFixed(4) : '-.- -'}}</span>
                      <span>{{codeDetail.BuyThreeNum&&codeDetail.BuyThreeAmount?codeDetail.BuyThreeNum : '- -'}}</span>
                    </div>
                    <div class="left_row">
                      <span class="main-color1">2</span>
                      <span class="rise-color">{{codeDetail.BuyTwoAmount? Number(codeDetail.BuyTwoAmount).toFixed(4) : '-.- -'}}</span>
                      <span>{{codeDetail.BuyTwoNum&&codeDetail.BuyTwoAmount?codeDetail.BuyTwoNum : '- -'}}</span>
                    </div>
                    <div class="left_row">
                      <span class="main-color1">1</span>
                      <span class="rise-color">{{codeDetail.BuyOneAmount? Number(codeDetail.BuyOneAmount).toFixed(4) : '-.- -'}}</span>
                      <span>{{codeDetail.BuyOneNum&&codeDetail.BuyOneAmount?codeDetail.BuyOneNum : '- -'}}</span>
                    </div>
                </div>
                <div class="content_line"></div>
                <div class="content_right">
                    <div class="left_row">
                    <span>{{codeDetail.SaleFiveNum&&codeDetail.SaleFiveAmount?codeDetail.SaleFiveNum : '- -'}}</span>
                    <span class="drop-color">{{codeDetail.SaleFiveAmount? Number(codeDetail.SaleFiveAmount).toFixed(4) : '-.- -'}}</span>
                    <span class="main-color2">5</span>
                    </div>
                    <div class="left_row">
                    <span>{{codeDetail.SaleFourNum&&codeDetail.SaleFourAmount?codeDetail.SaleFourNum : '- -'}}</span>
                    <span class="drop-color">{{codeDetail.SaleFourAmount? Number(codeDetail.SaleFourAmount).toFixed(4) : '-.- -'}}</span>
                    <span class="main-color2">4</span>
                    </div>
                    <div class="left_row">
                    <span>{{codeDetail.SaleThreeNum&&codeDetail.SaleThreeAmount?codeDetail.SaleThreeNum : '- -'}}</span>
                    <span class="drop-color">{{codeDetail.SaleThreeAmount? Number(codeDetail.SaleThreeAmount).toFixed(4) : '-.- -'}}</span>
                    <span class="main-color2">3</span>
                    </div>
                    <div class="left_row">
                    <span>{{codeDetail.SaleTwoAmount&&codeDetail.SaleTwoAmount? codeDetail.SaleTwoNum : '- -'}}</span>
                    <span class="drop-color">{{codeDetail.SaleTwoAmount? Number(codeDetail.SaleTwoAmount).toFixed(4) : '-.- -'}}</span>
                    <span class="main-color2">2</span>
                    </div>
                    <div class="left_row">
                    <span>{{codeDetail.SaleOneAmount&&codeDetail.SaleOneAmount?codeDetail.SaleOneNum : '- -'}}</span>
                    <span class="drop-color">{{codeDetail.SaleOneAmount? Number(codeDetail.SaleOneAmount).toFixed(4) : '-.- -'}}</span>
                    <span class="main-color2">1</span>
                    </div>
                </div>
                </div>
            </div>
            <div class="bottom normal-margin-top main-bg">
                <div class="row normal-border-color">
                    <label>价格类型</label>
                    <div class="prices">
                    <div v-for="(item,i) in price_type" :key="i" :class="{'assist-color3': true,'this_check':item.check && !theme, 'this_check_black': item.check && theme}"  @click="check_type(i)" class="assist-color3">{{item.name}}</div>
                    </div>
                </div>
                <div class="row normal-border-color">
                    <label>委托价格</label>
                    <div ><NumberBox :max="num_box1.max" :min="num_box1.min" :vals="num_box1.val" :step="num_box1.step" :dec="num_box1.dec"  :inputs="num_box1.inputs" @getNum="getboxnum1"></NumberBox></div>
                </div>
                <div class="row del_border">
                    <label>委托数量</label>
                    <div><NumberBox :max="num_box2.max" :min="num_box2.min" :vals="num_box2.val" :step="num_box2.step"  :dec="num_box2.dec"  :inputs="num_box2.inputs" @getNum="getboxnum2"></NumberBox></div>
                </div>
                <div class="row normal-border-color">
                    <label></label>
                    <div class="ent_numbers">
                      <div v-for="(item,i) in ent_num" :key="i" :data-value="item.value" @click="update_ent(i)" :class="{'whether':!item.check, 'main-text-color2': !item.check, 'assist-color3': true, 'num-black': item.check && theme}">{{item.name}}</div>
                    </div>
                </div>
                <div class="row normal-border-color">
                  <label>当日策略</label>
                  <div class="strategys">
                      <div v-if="strategys[0].number=='0'" @click="set_stop(strategys[0].id)" class="assist-color3">设置止盈</div>
                      <div v-else  @click="select_strategy(strategys[0].id)" :class="{this_check:strategys[0].check,'assist-color3':true}" >涨幅{{strategys[0].number}}止盈</div>
                      <div v-if="strategys[1].number=='0'" @click="set_stop(strategys[1].id)" class="assist-color3">设置止损</div>
                      <div v-else @click="select_strategy(strategys[1].id)" :class="{this_check:strategys[1].check,'assist-color3':true}" >跌幅{{strategys[1].number}}止损</div>
                  </div>
                </div>
                <div :class="{'close-out-tips': true, 'normal-padding': true, 'rise-color': !theme, 'assist-color1': true, 'font24': true, 'tab-active-color': theme, 'tips': true}" v-if="strategys[0].check||strategys[1].check">合约当日有效，满足涨幅或跌幅时自动卖出平仓</div>
                <div class="other_data">
                  <div><span>可用金额</span><span>{{(account).toFixed(2)}}元</span></div>
                  <div><span>可买数量</span><span>{{maxNum}}张</span></div>
                  <div><span>交易金额</span><span>{{(dealMoney).toFixed(2)}}元</span></div>
                </div>
            </div>
          </div>
        </div>
       
        <div  :class="{'buy_btn':!theme,'active_btn':action_click && !theme, 'buy-black-btn': theme, 'active-black-btn': action_click && theme}">
          <div @click="cross" :class="{'yjks_bg':code}">一键跨式</div>
          <div @click="sub">提交买入委托</div>
        </div>
         <!-- 弹窗口 -->
        <div class="pup" v-if="show_pop">
          <div class="pup_title">买入开仓委托</div>
          <div class="pup_content">
            <div><span>合约名称</span><span>{{codeDetail.StockName}}</span></div>
            <div><span>合约代码</span><span>{{code}}</span></div>
            <div><span>委托价格</span><span>{{num_box1.val}}</span></div>
            <div><span>委托数量</span><span>{{num_box2.val}}张</span></div>
            <div><span>交易金额</span><span>{{dealMoney.toFixed(2)}}元</span></div>
            <div class="pup_tips assist-color1">买入{{this.t}}分钟未成交自动撤单</div>
          </div>
          <div class="pup_btns">
            <span @click="cancel_pup">取消</span>
            <span @click="sure_pup">确认</span>
          </div>
        </div>
        <!-- 遮盖层 -->
        <div class="pup_cover" v-if="show_bg"></div>
        <!-- 加载动画 -->
        <div id="loding" v-if="show_loding"><img  src="../../../static/logding.svg" alt=""></div>
    </div>
</template>

<script>
import Api from '@/api'
import $axios from 'axios'
import CHeader from '@/components/common/IHeader.vue'
import NumberBox from '@/components/common/number.vue'
export default {
    data(){
      return {
        t:this.$store.state.expirationTime,
        //价格类型
        price_type:[
          {name:"对手价",value:0,check:true},
          // {name:"追涨价",value:1,check:false},
          {name:"限价",value:2,check:false},
        ],
        //第一个数字输入框
        num_box1:{
          min:0,//最小值
          max:100,//最大值
          val:0,//初始值
          step:0.0001,//步长
          inputs:false,//是否可以手动输入，true:不能手动输入，false:可手动输入
          dec:4
        },
        //第二个数字输入框
        num_box2:{
          min:0,//最小值
          max:0,//最大值
          val:0,//初始值
          step:1,//步长
          inputs:false,//是否可以手动输入，true:不能手动输入，false:可手动输入
          dec:0
        },
        //委托数量快捷按钮
        ent_num:[
          { name: "全仓", value: "0",check:true},
          { name: "5", value: "5",check:true },
          { name: "10", value: "10",check:true },
          { name: "20", value: "20",check:true},
          { name: "30", value: "30",check:true}
        ],
        //设置止盈止损
        strategys:[
            //如果无涨跌幅则返回0，否则返回~%
            {id:1,number:"0",check:false},
            {id:2,number:"0",check:false},
        ],
        //代码详情:代码，名称，现价，涨跌额，涨跌幅，五档
        codeDetail: {},
        account: 0,//可用余额
        seviceCharge: 5, //服务费
        dumn:0,//合约单位
        ab:0,//涨幅
        before_ab:0,//涨幅前的价格

        show_pop: false,//是否显示弹窗
        show_bg:false,
        show_loding:false,

        timer: null, //定时器
        action_click:false,//按钮事件

        file_number:0,//档数，价格取的是第几档
      }
    },
    //进入路由验证是否实名
    beforeRouteEnter:(to,from,next)=>{
      $axios.post(Api.autonymState).then(res=>{
        if(res.data.Status==="1"){
          if(res.data.Data.NTure!==1){//未实名
            next('/')
          }else{
            next();
          }
        }
      })
    },
    methods:{
      check_type(par){//选择价格类型
        for(var i = 0;i < this.price_type.length;i++){
          this.price_type[i].check=false;
        }
        this.price_type[par].check=true;
        if(this.code && this.price_type[par].name=="对手价"){
          // if(this.price_type[par].name=="追涨价"){
          //   this.num_box1.val = this.codeDetail.SaleFiveAmount
          // }else{
            //委托价
            if(this.codeDetail.SaleFiveAmount){
              this.num_box1.val = this.codeDetail.SaleFiveAmount;
              this.file_number=5;
            }else if(this.codeDetail.SaleFourAmount){
              this.num_box1.val = this.codeDetail.SaleFourAmount;
              this.file_number=4;
            }else if(this.codeDetail.SaleThreeAmount){
              this.num_box1.val = this.codeDetail.SaleThreeAmount;
              this.file_number=3;
            }else if(this.codeDetail.SaleTwoAmount){
              this.num_box1.val = this.codeDetail.SaleTwoAmount;
              this.file_number=2;
            }else if(this.codeDetail.SaleOneAmount){
              this.num_box1.val = this.codeDetail.SaleOneAmount;
              this.file_number=1;
            }else{
                this.num_box1.val=0;
            }
          // }
        }
      },
      getboxnum1(num){//获取子组件返回值
        if(this.code){
          if(num==0 || this.num_box2.val==0){
            this.action_click=false;
          }else{
            this.action_click=true;
          }
          this.num_box1.val = num;
          switch(this.file_number){
            case 1:if(this.num_box1.val==this.codeDetail.SaleOneAmount) return;break;
            case 2:if(this.num_box1.val==this.codeDetail.SaleTwoAmount) return;break;
            case 3:if(this.num_box1.val==this.codeDetail.SaleThreeAmount) return;break;
            case 4:if(this.num_box1.val==this.codeDetail.SaleFourAmount) return;break;
            case 5:if(this.num_box1.val==this.codeDetail.SaleFiveAmount) return;break;
            default :return;break;
          }
          // if(this.num_box1.val==this.codeDetail.SaleOneAmount || this.num_box1.val==this.codeDetail.SaleFiveAmount){
          //   return;
          // }
          //跳选价格类型
          this.price_type[0].check=false;
          this.price_type[1].check=true;
          // this.price_type[2].check=true;
        }
      },
      getboxnum2(num){//获取子数量组件返回值
        if(num==0 || this.num_box1.val==0){
          this.action_click=false;
        }else{
          this.action_click=true;
        }
        this.num_box2.val = num;
      },
      update_ent(par){//快捷修改委托数量输入框
        if(this.ent_num[par].check){
          this.num_box2.val=this.ent_num[par].value;
        }
      },
      select_strategy(par){//选择止盈止损
        var obj = this.strategys.find(item=>{
            return item.id == par;
        })
        obj.check = !obj.check;
      },
      set_stop(params){//询问是否设置止盈止损
        //询问是否设置止盈止损
        this.$message({
          title: "设置止盈止损",
          message: "您还未设置止盈和止损策略",
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: "马上设置",
          confirmButtonHighlight: true,
          cancelButtonText: "返回交易"
        }).then(action => {
          if (action == "confirm") {
            var type = params=="1"?"rise":"drop";
            this.$router.push('/set-drop?type='+type+'&param=0');
          }
        });
      },
      toSearch () {//跳转到搜索页
        this.$router.push({path: '/search_contract', query: {origin: 'deal', type: 'buy'}})
      },
      getCodeDetail () {//获取代码详情（初始化）
        if (this.code) {
          //获取顶部数据
          this.$http.post(Api.codeDetail, this.code).then(res => {
            if (res.data.Status === '1') {
              this.codeDetail = res.data.Data;
              //获取最大可买数量，最小可买数量，单张服务费，合约单位，用户可用余额，止盈止损值
              this.$http.post(Api.transactionInit, this.code).then(res=>{
                if(res.data.Status==='1'){
                  var result = res.data.Data;
                  this.account = Number(result.yue);//余额
                  this.seviceCharge=result.buate; //服务费
                  this.dumn=result.num;//合约单位
                  this.strategys[0].number=result.tarofit==0?0:result.tarofit+"%";//止盈
                  this.strategys[1].number=result.stooss==0?0:result.stooss+"%";//止损
                  this.ab=result.ab;//自动追涨涨幅
                  //委托价
                  if(this.codeDetail.SaleFiveAmount){
                    this.num_box1.val = this.codeDetail.SaleFiveAmount;
                    this.file_number=5;
                  }else if(this.codeDetail.SaleFourAmount){
                    this.num_box1.val = this.codeDetail.SaleFourAmount;
                    this.file_number=4;
                  }else if(this.codeDetail.SaleThreeAmount){
                    this.num_box1.val = this.codeDetail.SaleThreeAmount;
                    this.file_number=3;
                  }else if(this.codeDetail.SaleTwoAmount){
                    this.num_box1.val = this.codeDetail.SaleTwoAmount;
                    this.file_number=2;
                  }else if(this.codeDetail.SaleOneAmount){
                    this.num_box1.val = this.codeDetail.SaleOneAmount;
                    this.file_number=1;
                  }else{
                     this.num_box1.val=0;
                  }
                  
                  //委托数量
                  if(this.$route.query.type){//如果是快捷反手进入
                      this.num_box2.val=sessionStorage.getItem("quick");
                  }else{
                    this.num_box2.val = 0;
                    this.$nextTick(function () {
                      this.action_click=false;
                    })
                    
                  }
                }
              })
            }else{//如果查询不到合约记录则返回交易首页
              this.$router.push('/deal')
            }
          })
        } else {//如果没有合约代码
          this.num_box1.val = '0.0000';
          this.num_box2.val = 0;
          this.ent_num[0].value = 0;
        }
      },
      get_data(){//获取数据
         if (this.code) {
          //获取顶部数据
          this.$http.post(Api.codeDetail, this.code).then(res => {
            if (res.data.Status === '1') {
              this.codeDetail = res.data.Data;
            }else{//如果查询不到合约记录则返回交易首页
              this.$router.push('/deal')
            }
          })
        } else {//如果没有合约代码
          this.num_box1.val = '0.0000';
          this.num_box2.val = 0;
          this.ent_num[0].value = 0;
        }
      },
      cross(){//一键跨式
        if(this.code){
          //目前合约类型
          var cross_type = this.codeDetail.StockName.indexOf("购")!=-1?"gou":"gu";
          //获取相应合约代码
          this.$http.post(Api.oneCross,this.code).then(res=>{
            if(res.data.Status==="1"){
              var corss_cord=res.data.Data[0];
              var obj = {
                type:cross_type,
                cord_gou:cross_type==="gou"?this.code:corss_cord,
                cord_gu:cross_type==="gu"?this.code:corss_cord,
              }
              sessionStorage.setItem("cross",JSON.stringify(obj));
              this.$router.push({path:'/one_cross_rgou',query:{code:this.code}});
            }
          });
        }else{
          this.$toast({
            message: "请先选择买入合约",
            position: 'bottom',
            duration: 1000
          });
        }
      },
      sub(){//提交买入委托
        if(!this.action_click){
          return;
        }
        if(this.num_box1.val<=0){
          this.$toast({
            message: "请输入有效的委托价格",
            position: 'bottom',
            duration: 1000
          });
          return;
        }
        if(this.num_box2.val<=0){
          this.$toast({
            message: "请输入有效的委托数量",
            position: 'bottom',
            duration: 1000
          });
          return;
        }
        if(this.num_box2.val>this.maxNum){
          this.$toast({
            message: "余额不足，请及时充值",
            position: 'bottom',
            duration: 1000
          });
          return;
        }
        this.show_pop=true;
        this.show_bg=true;
      },
      cancel_pup(){//弹窗取消
        this.show_pop=false;
        this.show_bg=false;
      },
      sure_pup(){//弹窗确认
        this.show_pop=false;
        this.show_loding=true;
        //如果买入
        var tk='';//价格类型
        for(var i = 0,len=this.price_type.length;i<len;i++){
          if(this.price_type[i].check){
            tk=this.price_type[i].value;
          }
        }
        var ty = this.strategys[0].check==true?1:0;//是否开启止盈
        var ts = this.strategys[1].check==true?1:0;//是否开启止损
        //提交参数合约sc，价格类型Tk，委托价格dp，委托数量dn，止盈Ty，止损Ts 
        this.$http.post(Api.buy,{"Dt":10,"Sc": this.code,"Dp":Number(this.num_box1.val),"Dn":this.num_box2.val,"Ty":ty,"Ts": ts,"Tk":tk}).then(res=>{
          if(res.data.Status==1){
            //委托买入成功
            this.$router.push({path: '/order-success'});
          }else{
            this.$toast({
              message: res.data.Msg,
              position: 'bottom',
              duration:2000
            });
          }
          this.show_loding=false;
          this.show_bg=false;
        })
      },
      /*a+b*/
      add(a, b) {
        var c, d, e;
        try {
            c = a.toString().split(".")[1].length;
        } catch (f) {
            c = 0;
        }
        try {
            d = b.toString().split(".")[1].length;
        } catch (f) {
            d = 0;
        }
        return e = Math.pow(10, Math.max(c, d)), (this.mul(a, e) + this.mul(b, e)) / e;
      },
      /*a*b*/
      mul(a, b) {
        var c = 0,
            d = a.toString(),
            e = b.toString();
        try {
            c += d.split(".")[1].length;
        } catch (f) {}
        try {
            c += e.split(".")[1].length;
        } catch (f) {}
        return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
      },
      /**a/b */
      div(a, b) {
        var c, d, e = 0,
            f = 0;
        try {
            e = a.toString().split(".")[1].length;
        } catch (g) {}
        try {
            f = b.toString().split(".")[1].length;
        } catch (g) {}
        return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), this.mul(c / d, Math.pow(10, f - e));
      },
    },
    components: {
        CHeader,
        NumberBox
    },
    computed: {
      code () {//当前合约代码
        if (this.$route.query.code) {
          return this.$route.query.code;
        } else {
          return '';
        }
      },
      dealMoney () {//计算交易金额
        if (this.code) {
          var result = 0;
          if(this.num_box1.val<=0 || this.num_box2.val <= 0){
            result=0;
          }else{
            result=this.mul(this.add(this.mul(this.num_box1.val,this.dumn),this.seviceCharge),this.num_box2.val)//交易金额 合约金额 + 服务费
          }
          return result;
        }else{
          return 0;
        }
      },
      maxNum () {//计算最大可买
        if (this.code) {
          var result = 0 ;//最大可买数量
          if(this.num_box1.val<=0){//如果委托价格小于0等于0
            if(this.seviceCharge==0){
              result=this.account;
            }else{
              result=Math.floor(this.div(this.account,this.seviceCharge));
            }
          }else{
            result = Math.floor(this.div(this.account,this.add(this.seviceCharge,this.mul(this.num_box1.val,this.dumn))));
          }
          //最大可买=余额（最小单价：1块算）
          this.num_box2.max = result;
          // console.log(result);
          // this.num_box2.val = result;
          this.ent_num[0].value=result;
          for(var i = 0,len=this.ent_num.length;i<len;i++){
            this.ent_num[i].check=true;
            if(this.ent_num[i].value>result){
              this.ent_num[i].check=false;
            }
          }
          return result;//可用余额/（单张服务费 + 委托价格 * 合约单位） 向下取整
        } else {
          return 0;
        }
      },
      theme () {
        // console.log(localStorage.getItem('theme') != null ? JSON.parse(localStorage.getItem('theme')).theme : 0);
        return localStorage.getItem('theme') != null ? JSON.parse(localStorage.getItem('theme')).theme : 0;
      }
    },
    created () {
      //初始化
      this.getCodeDetail();
      this.timer = setInterval(() => {
        this.get_data();
      }, 2000);
    },
    destroyed () {
      sessionStorage.removeItem("quick");
      window.clearInterval(this.timer);
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
.has-header>div{
  -webkit-overflow-scrolling: touch;
}
.num-black{
  background: rgba(255, 255, 255, 0.5);
  color: #000;
}
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
.pup{
  position: fixed;
  z-index: 200001;
  left: 0;
  right: 0;
  top:50%;
  transform: translateY(-50%);
  width: 250px;
  margin:auto;

  border-radius: 5px;
}
.pup .pup_title{
  height: 40px;
  line-height: 40px;
  font-size: 16px;
  font-weight: bold;
}
.pup .pup_content>div{
  text-align: left;
  padding: 0 10px;
  height: 30px;
  line-height: 30px;
  box-sizing: border-box;
}
.pup_tips{
  font-size: 12px;
  text-align: left;
  /* background:#FFEBEB; */
  color: #FF7A7D;
  margin:  10px;
  padding: 0
}
.pup .pup_content>div>span:first-child{
  margin-right: 10px;
  color: #999;
}
.pup_btns{
  height: 50px;
  line-height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.pup_btns>span{
  flex-grow: 1
}
.pup_btns>span:first-child{
  color: #999;
}
.pup_btns>span:last-child{
  color: #3aaaff;
}
.sell_btn{
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 50px;
  color: #fff;
  background: #3aafff;
  line-height:50px;
  font-size: 14px;
}
.whether{
  /* background: #F2F2F2; */
  border: none !important;
}
.content-body{
  bottom: 50px;
}
.content-body > div{
  overflow-y: scroll;
  overflow-x: hidden;
  width: 100%;
  height: 100%;
}
.content-body > div::-webkit-scrollbar{
  display: none;
}
.top{
    /* background: #fff; */
    padding: 10px;
}
.top #search{
    width: 100%;
    border: none;
    /* background: #F2F2F2; */
    height: 38px;
    border-radius: 5px;
    text-indent: 10px;
    margin-bottom: 10px;
    /* border-bottom: #e6e6e6; */
}
.data_wrap{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 10px;
    border-top-width: 1px;
    border-top-style: solid;
}
.data_wrap .left{
    text-align: left;
    display: flex;
    justify-content:space-around;
    flex-direction: column;
}
.data_wrap .left p:first-child{
    margin-bottom: 5px;
}
.data_wrap .left p span:first-child{
    color: #999;
    margin-right: 10px
}
.data_wrap .right{
    display: flex;
    justify-content: space-between;
    align-items: center
}
.data_wrap .right>div:first-child{
    font-size: 37px;
    margin-right: 10px;
    /* font-family: font; */
}
.data_wrap .right>div:last-child>p:first-child{
    margin-bottom: 10px;
}
.buy_sell_five{
  /* margin-top: 10px; */
  padding: 10px;
  /* background: #fff; */
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
  /* border-right: 1px solid #d4d4d4; */
  width: 1px;
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
.buy_sell_five .content .content_left>div>span:nth-child(2){
  /* color: #ff787b; */
}
.buy_sell_five .content .content_right>div>span:nth-child(2){
  /* color: #03c461; */
}
.buy_sell_five .content .content_left>div>span:not(:first-child),.buy_sell_five .content .content_right>div>span:not(:last-child){
  display: inline-block;
  width: 50px;
}
.buy_sell_five .content .content_left>div>span:last-child{
  text-align: left;
}
.buy_sell_five .content .content_right>div>span:first-child{
  text-align: right;
}
/*=========买卖五档end=========*/
.bottom{
  /* margin-top: 10px; */
  /* background: #fff; */
  padding: 10px 0;
}
.bottom .row{
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 35px;
  padding: 10px;
  /* border-bottom: 1px solid #eaeaea; */
  border-bottom-width: 1px;
  border-bottom-style: solid;
}
.bottom .del_border{
  border-bottom: none;
  padding-bottom: 0px;
}
.bottom .row>label{
  min-width: 100px;
  text-align: left;
}
.bottom .row>div{
 flex-grow: 1;
}
.bottom .row .prices{
  display: flex;
  /* justify-content: space-between; */
  align-items: center;
}
.bottom .row .prices>div{
  /* width:75px; */
  height: 35px;
  line-height: 35px;
  /* background: #F2F2F2; */
  border-radius: 5px;
  flex: 1;
}
.bottom .row .prices>div:nth-child(1) {
  margin-right: 10px;
}
.bottom .row .prices>div:nth-child(2) {
  margin-right: 10px;
}
.bottom .row .prices>.this_check{
  background: #FECACB;
  color: #FF464b;
}
.bottom .row .prices > .this_check_black{
  background: #ff787b;
  color: #fff;
}
.bottom .ent_data{
  text-align: right;
}
.bottom .tips{
  /* font-size: 12px; */
  text-align: left;
  /* background:#FFEBEB;
  color: #FF7A7D; */
  padding: 10px;
}
.bottom .row .ent_numbers{
  display: flex;
  /* justify-content: space-between; */
  align-items: center;
}
.bottom .row .ent_numbers>div{
  /* width:41px; */
  height: 35px;
  line-height: 35px;
  /* border:1px solid #d9d9d9; */
  border-radius: 5px;
  box-sizing: border-box;
  flex: 1;
  margin-right: 10px;
}
.bottom .row .ent_numbers>div:nth-last-child(1) {
  margin-right: 0;
}
.bottom .row .strategys{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.bottom .row .strategys>div{
  width:120px;
  height: 35px;
  line-height: 35px;
  /* background: #F2F2F2; */
  border-radius: 5px;
}
.bottom .row .strategys>.this_check{
  background: #FECACB;
  color: #FF4E53;
  background-image: url("../../../static/images/deal/icon_buy_select.svg");
  background-repeat:no-repeat;
  background-position: right bottom;
  background-size:20px;
}
.other_data{
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  padding: 0 10px;
}
.other_data>div{
  width: 50%;
  text-align: left;
  margin: 8px 0;
}
.other_data>div>span:first-child{
  color: gray;
  margin-right: 10px;
}
.buy_btn,.buy-black-btn{
    position:fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 50px;
    line-height: 50px;
    color: #fff;
}
.buy_btn > div:nth-child(1){
  width: 90px;
  background-color: #3aaaff;
}
.buy_btn > div:nth-child(2){
  position: absolute;
  left: 90px;
  right: 0;
  top: 0;
  background-color: #d9d9d9;
}
.buy-black-btn > div:nth-child(1){
  width: 90px;
  background-color: rgba(255, 255, 255, 0.1);
}
.buy-black-btn > div:nth-child(2){
  position: absolute;
  left: 90px;
  right: 0;
  top: 0;
  background-color: rgba(255, 255, 255, 0.2);
}
.active_btn>div:nth-child(1){
  background: #3aaaff;
}
.active_btn>div:nth-child(2){
  background: #ff787b;
}
.active-black-btn>div:nth-child(1){
  background: #2579d3;
}
.active-black-btn>div:nth-child(2){
  background: #ff787b;
}
</style>
