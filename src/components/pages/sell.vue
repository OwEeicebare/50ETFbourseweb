<template>
    <!-- 快捷反手买入 -->
    <div id="buy">
        <CHeader title="卖出" backBol="true" backUrl="/deal"></CHeader>
        <div class="content-body has-header">
          <div>
            <div class="top main-bg">
                <input type="text" alt="搜索" id="search" placeholder="请输入合约代码/名称/缩写" @focus="toSearch" class="assist-color3 main-text-color1"/>
                <div class="data_wrap normal-border-color">
                    <div class="left">
                        <p><span>代码</span><span>{{code ? code : "- -"}}</span></p>
                        <p><span>名称</span><span>{{codeDetail.StockName ? codeDetail.StockName : "- -"}}</span></p>
                    </div>
                    <div :class="{'right': true, 'number-font': true, 'rise-color': codeDetail.PriceCurrent>codeDetail.PriceYesterdayClose&&codeDetail.PriceOpen!=0 , 'drop-color': codeDetail.PriceCurrent<codeDetail.PriceYesterdayClose&&codeDetail.PriceOpen!=0}">
                        <div>{{codeDetail.PriceCurrent ? Number(codeDetail.PriceCurrent).toFixed(4) : codeDetail.PriceOpen&&codeDetail.PriceOpen!=0?'0.0000': "-.----"}}</div>
                        <div>
                            <p>{{codeDetail.PriceRise > 0 ? '+' : ''}}{{codeDetail.PriceRise&&codeDetail.PriceOpen?codeDetail.PriceRise: codeDetail.PriceOpen&&codeDetail.PriceOpen!=0?'0.0000': '-.----'}}</p>
                            <p>{{codeDetail.PriceRisePercent > 0 ? '+' : ''}}{{codeDetail.PriceRisePercent&&codeDetail.PriceOpen? Number(codeDetail.PriceRisePercent).toFixed(2)+'%': codeDetail.PriceOpen&&codeDetail.PriceOpen!=0?'0.00%': '--'}}</p>
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
                    <span>5</span>
                    <span>{{codeDetail.BuyFiveAmount? Number(codeDetail.BuyFiveAmount).toFixed(4) : '-.- -'}}</span>
                    <span>{{codeDetail.BuyFiveNum&&codeDetail.BuyFiveAmount?codeDetail.BuyFiveNum : '- -'}}</span>
                    </div>
                    <div class="left_row">
                    <span>4</span>
                    <span>{{codeDetail.BuyFourAmount? Number(codeDetail.BuyFourAmount).toFixed(4) : '-.- -'}}</span>
                    <span>{{codeDetail.BuyFourNum&&codeDetail.BuyFourAmount?codeDetail.BuyFourNum : '- -'}}</span>
                    </div>
                    <div class="left_row">
                    <span>3</span>
                    <span>{{codeDetail.BuyThreeAmount? Number(codeDetail.BuyThreeAmount).toFixed(4) : '-.- -'}}</span>
                    <span>{{codeDetail.BuyThreeNum&&codeDetail.BuyThreeAmount?codeDetail.BuyThreeNum : '- -'}}</span>
                    </div>
                    <div class="left_row">
                    <span>2</span>
                    <span>{{codeDetail.BuyTwoAmount? Number(codeDetail.BuyTwoAmount).toFixed(4) : '-.- -'}}</span>
                    <span>{{codeDetail.BuyTwoNum&&codeDetail.BuyTwoAmount? codeDetail.BuyTwoNum : '- -'}}</span>
                    </div>
                    <div class="left_row">
                    <span>1</span>
                    <span>{{codeDetail.BuyOneAmount? Number(codeDetail.BuyOneAmount).toFixed(4) : '-.- -'}}</span>
                    <span>{{codeDetail.BuyOneNum&&codeDetail.BuyOneAmount?codeDetail.BuyOneNum : '- -'}}</span>
                    </div>
                </div>
                <div class="content_line"></div>
                <div class="content_right">
                    <div class="left_row">
                    <span>{{codeDetail.SaleFiveNum&&codeDetail.SaleFiveAmount?codeDetail.SaleFiveNum : '- -'}}</span>
                    <span>{{codeDetail.SaleFiveAmount? Number(codeDetail.SaleFiveAmount).toFixed(4) : '-.- -'}}</span>
                    <span>5</span>
                    </div>
                    <div class="left_row">
                    <span>{{codeDetail.SaleFourNum&&codeDetail.SaleFourAmount?codeDetail.SaleFourNum : '- -'}}</span>
                    <span>{{codeDetail.SaleFourAmount? Number(codeDetail.SaleFourAmount).toFixed(4) : '-.- -'}}</span>
                    <span>4</span>
                    </div>
                    <div class="left_row">
                    <span>{{codeDetail.SaleThreeNum&&codeDetail.SaleThreeAmount?codeDetail.SaleThreeNum : '- -'}}</span>
                    <span>{{codeDetail.SaleThreeAmount ? Number(codeDetail.SaleThreeAmount).toFixed(4) : '-.- -'}}</span>
                    <span>3</span>
                    </div>
                    <div class="left_row">
                    <span>{{codeDetail.SaleTwoNum&&codeDetail.SaleTwoAmount?codeDetail.SaleTwoNum : '- -'}}</span>
                    <span>{{codeDetail.SaleTwoAmount? Number(codeDetail.SaleTwoAmount).toFixed(4) : '-.- -'}}</span>
                    <span>2</span>
                    </div>
                    <div class="left_row">
                    <span>{{codeDetail.SaleOneNum&&codeDetail.SaleOneAmount?codeDetail.SaleOneNum : '- -'}}</span>
                    <span>{{codeDetail.SaleOneAmount ? Number(codeDetail.SaleOneAmount).toFixed(4) : '-.- -'}}</span>
                    <span>1</span>
                    </div>
                </div>
                </div>
            </div>
            <div class="bottom normal-margin-top main-bg">
                <div class="row normal-border-color">
                    <label>价格类型</label>
                    <div class="prices">
                    <div v-for="(item,i) in price_type" :key="i" :class="{'assist-color3': true,'this_check':item.check && !theme, 'this_check_black': item.check && theme}" @click="check_type(i)">{{item.name}}</div>
                    </div>
                </div>
                <div class="row normal-border-color">
                    <label>委托价格</label>
                    <div><NumberBox :max="num_box1.max" :min="num_box1.min" :vals="num_box1.val" :step="num_box1.step" :inputs="num_box1.inputs"  :dec="num_box1.dec" @getNum="getboxnum1"></NumberBox></div>
                </div>
                <div class="row normal-border-color del_border">
                    <label>委托数量</label>
                    <div><NumberBox :max="num_box2.max" :min="num_box2.min" :vals="num_box2.val" :step="num_box2.step" :inputs="num_box2.inputs"  :dec="num_box2.dec" @getNum="getboxnum2"></NumberBox></div>
                </div>
                <div class="row normal-border-color">
                    <label></label>
                    <div class="ent_numbers">
                      <div v-for="(item,i) in ent_num" :key="i" :data-value="item.value" @click="update_ent(i)"  :class="{'whether':!item.check, 'assist-color3': true , 'no-border': theme, 'main-text-color2': !item.check && theme, 'num-black': item.check && theme}">{{item.name}}</div>
                    </div>
                </div>
                <div class="other_data">
                    <div><span>可用金额</span><span>{{(account).toFixed(2)}}元</span></div>
                    <div><span>持仓数量</span><span>{{have_num}}张</span></div>
                    <div><span>交易金额</span><span>{{(dealMoney).toFixed(2)}}元</span></div>
                    <div><span>已委托数量</span><span>{{s_number_dogin}}张</span></div>
                </div>
            </div>
          </div>
        </div>
        <div class="buy_btn" :class="{'active_btn':action_click, 'assist-color3': true}" @click="sell">提交卖出委托</div>
         <!-- 弹窗口 -->
        <div class="pup" v-if="show_pop">
          <div class="pup_title">卖出平仓委托</div>
          <div class="pup_content">
            <div><span>合约名称</span><span>{{codeDetail.StockName}}</span></div>
            <div><span>合约代码</span><span>{{code}}</span></div>
            <div><span>委托价格</span><span>{{num_box1.val}}</span></div>
            <div><span>委托数量</span><span>{{num_box2.val}}张</span></div>
            <div><span>交易金额</span><span>{{Number(dealMoney).toFixed(2)}}元</span></div>
            <div class="pup_tips assist-color1">卖出{{this.t}}分钟未成交自动撤单；手动操作卖出后，止盈止损功能将自动取消</div>
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
          {name:"限价",value:1,check:false},
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
          {name:"全仓",value:"0",check:true},
          {name:"5",value:"5",check:true},
          {name:"10",value:"10",check:true},
          {name:"20",value:"20",check:true},
          {name:"30",value:"30",check:true}
        ],
        codeDetail: {},//代码详情
        account: 0,//可用余额
        dumn:0,//合约单位
        seviceCharge: 0, //服务费
        have_num:0,//持仓数量
        s_number_dogin:0,//委托数量，持仓-委托=可卖
        timer: null, //定时器
        action_click:false,//按钮事件

        show_pop: false,//是否显示弹窗
        show_bg:false,
        show_loding:false,

        deal_obj:"",//分笔持仓对象 进入卖出

        file_number:0,//卖出价格取第几档
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
        //委托价(开始)
        if(this.code && this.price_type[par].name=="对手价"){
          if(this.codeDetail.BuyFiveAmount){
            this.num_box1.val = this.codeDetail.BuyFiveAmount;
            this.file_number=5;
          }else if(this.codeDetail.BuyFourAmount){
            this.num_box1.val = this.codeDetail.BuyFourAmount;
            this.file_number=4;
          }else if(this.codeDetail.BuyThreeAmount){
            this.num_box1.val = this.codeDetail.BuyThreeAmount;
            this.file_number=3;
          }else if(this.codeDetail.BuyTwoAmount){
            this.num_box1.val = this.codeDetail.BuyTwoAmount;
            this.file_number=2;
          }else if(this.codeDetail.BuyOneAmount){
            this.num_box1.val = this.codeDetail.BuyOneAmount;
            this.file_number=1;
          }else {
            this.num_box1.val=0;
          }
        }
      },
      getboxnum1(num){//获取价格子组件返回值
        if(num==0 || this.num_box2.val==0){
          this.action_click=false;
        }else{
          this.action_click=true;
        }
        this.num_box1.val = num;
        switch(this.file_number){
          case 1:if(this.num_box1.val==this.codeDetail.BuyOneAmount) return;break;
          case 2:if(this.num_box1.val==this.codeDetail.BuyTwoAmount) return;break;
          case 3:if(this.num_box1.val==this.codeDetail.BuyThreeAmount) return;break;
          case 4:if(this.num_box1.val==this.codeDetail.BuyFourAmount) return;break;
          case 5:if(this.num_box1.val==this.codeDetail.BuyFiveAmount) return;break;
          default :return;break;
        }
        // if(this.num_box1.val==this.codeDetail.BuyFiveAmount){
        //   return;
        // }
        //跳选价格类型
        this.price_type[0].check=false;
        this.price_type[1].check=true;
      },
      getboxnum2(num){//获取数量子组件返回值
        if(num==0 || this.num_box1.val==0){
          this.action_click=false;
        }else{
          this.action_click=true;
        }
        this.num_box2.val = num;
      },
      update_ent(par){//修改委托数量输入框
        if(this.ent_num[par].check){
          this.num_box2.val=this.ent_num[par].value;
        }
      },
      toSearch () {//跳转到搜索页
        this.$router.push({path: '/search_contract', query: {origin: 'deal', type: 'sell'}})
      },
      getCodeDetail () {//获取代码详情(初始化)
        if (this.code) {
          this.$http.post(Api.codeDetail, this.code).then(res => {
            if (res.data.Status === '1') {
              this.codeDetail = res.data.Data;
              //初始化交易数据
              this.deal_obj = JSON.parse(sessionStorage.getItem("deal"));//获取查询持仓对象
              if(this.deal_obj){//如果是分笔持仓卖出进入
                this.$http.post(Api.divideSell,{stockcode:this.code,stockid:this.deal_obj.Id} ).then(res=>{
                  if(res.data.Status==='1'){
                    var result = res.data.Data;
                    this.account = Number(result.yue);//余额
                    this.seviceCharge=result.saate; //服务费
                    this.have_num=this.deal_obj.Dnu;//持仓数量
                    this.s_number_dogin =result.applynum;//已委托数量todo....
                    this.dumn=result.num=result.num;//合约单位
                    //委托价(开始)
                    if(this.codeDetail.BuyFiveAmount){
                      this.num_box1.val = this.codeDetail.BuyFiveAmount;
                      this.file_number=5;
                    }else if(this.codeDetail.BuyFourAmount){
                      this.num_box1.val = this.codeDetail.BuyFourAmount;
                      this.file_number=4;
                    }else if(this.codeDetail.BuyThreeAmount){
                      this.num_box1.val = this.codeDetail.BuyThreeAmount;
                      this.file_number=3;
                    }else if(this.codeDetail.BuyTwoAmount){
                      this.num_box1.val = this.codeDetail.BuyTwoAmount;
                      this.file_number=2;
                    }else if(this.codeDetail.BuyOneAmount){
                      this.num_box1.val = this.codeDetail.BuyOneAmount;
                      this.file_number=1;
                    }else {
                      this.num_box1.val=0;
                    }
                    //委托数量
                    this.ent_num[0].value = this.num_box2.max = this.num_box2.val= this.have_num-this.s_number_dogin;
                    for(var i = 0,len=this.ent_num.length;i<len;i++){
                      this.ent_num[i].check=true;
                      if(this.ent_num[i].value>this.num_box2.max){
                        this.ent_num[i].check=false;
                      }
                    }
                  }
                })
              }else{//搜索合约卖出进入
                this.$http.post(Api.transactionInit, this.code).then(res=>{
                  if(res.data.Status==='1'){
                    var result = res.data.Data;
                    this.account = Number(result.yue);//余额
                    this.seviceCharge=result.saate; //服务费
                    this.have_num=result.stocknum;//持仓数量
                    this.s_number_dogin = result.applynum;//已委托数量
                    this.dumn=result.num=result.num;//合约单位
                    //委托价(开始)
                    if(this.codeDetail.BuyFiveAmount){
                      this.num_box1.val = this.codeDetail.BuyFiveAmount;
                      this.file_number=5;
                    }else if(this.codeDetail.BuyFourAmount){
                      this.num_box1.val = this.codeDetail.BuyFourAmount;
                      this.file_number=4;
                    }else if(this.codeDetail.BuyThreeAmount){
                      this.num_box1.val = this.codeDetail.BuyThreeAmount;
                      this.file_number=3;
                    }else if(this.codeDetail.BuyTwoAmount){
                      this.num_box1.val = this.codeDetail.BuyTwoAmount;
                      this.file_number=2;
                    }else if(this.codeDetail.BuyOneAmount){
                      this.num_box1.val = this.codeDetail.BuyOneAmount;
                      this.file_number=1;
                    }else {
                      this.num_box1.val=0;
                    }
                    //委托数量
                    this.ent_num[0].value = this.num_box2.max = this.num_box2.val= this.have_num-this.s_number_dogin;
                    for(var i = 0,len=this.ent_num.length;i<len;i++){
                      this.ent_num[i].check=true;
                      if(this.ent_num[i].value>this.num_box2.max){
                        this.ent_num[i].check=false;
                      }
                    }
                  }
                })
              }
            }else{//如果查询不到合约记录则返回交易首页
              this.$router.push('/deal')
            }
          })
        } else {
          this.num_box1.val = '0.0000';
          this.num_box2.val = 0;
          this.ent_num[0].value = 0;
          for(var i = 0,len=this.ent_num.length;i<len;i++){
            this.ent_num[i].check=false;
          }
        }
      },
      get_data(){
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
      sell(){//卖出提交
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
        if(this.num_box2.val>(this.have_num-this.s_number_dogin)){
          this.$toast({
            message: "委托数量大于可卖数量",
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
        var tk='';
        for(var i = 0,len=this.price_type.length;i<len;i++){
          if(this.price_type[i].check){
            tk=this.price_type[i].value;
          }
        }
        if(this.deal_obj){//持仓卖出
          this.$http.post(Api.allSell,[{StockCode:this.code,DeclNum:this.num_box2.val,DeclPrice:Number(this.num_box1.val),ScID:this.deal_obj.Id,Remark:tk}]).then(res=>{
            if(res.data.Status==1){
              //委托卖出成功(快捷反手)
              sessionStorage.setItem("quick",this.num_box2.val);//卖出数量
              this.$router.push({path: '/sell-order',query:{contract:this.code}});
            }else{
              this.$toast({
                message:  res.data.Msg,
                position: 'bottom',
                duration: 1000
              });
            }
            this.show_loding=false;
            this.show_bg=false;
          })
        }else{//普通卖出
          this.$http.post(Api.allSell,[{StockCode:this.code,DeclNum:this.num_box2.val,DeclPrice:Number(this.num_box1.val),ScID:-1,Remark:tk}]).then(res=>{
            if(res.data.Status==1){
              //委托卖出成功(快捷反手)
              sessionStorage.setItem("quick",this.num_box2.val);//卖出数量
              this.$router.push({path: '/sell-order',query:{contract:this.code}});
            }else{
              this.$toast({
                message:  res.data.Msg,
                position: 'bottom',
                duration: 1000
              });
            }
            this.show_loding=false;
            this.show_bg=false;
          })
        }
        
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
      dealMoney () {//交易金额 合约金额 + 服务费
        if (this.code) {
          var result = 0;
          if(this.num_box1.val<=0 || this.num_box2.val <= 0){
            result=0;
          }else{
            result=this.mul((this.mul(this.num_box1.val,this.dumn)-this.seviceCharge),this.num_box2.val)
          }
          return result;
        } else {
          return 0.00;
        }
      },
      theme () {
        // console.log(localStorage.getItem('theme') != null ? JSON.parse(localStorage.getItem('theme')).theme : 0);
        return localStorage.getItem('theme') != null ? JSON.parse(localStorage.getItem('theme')).theme : 0;
      }
      // maxNum () {//最大可卖，如果持仓大于平仓数量，则最大可卖张数为两者最小值
      //   if (this.code) {
      //     var result = this.have_num;
      //     this.num_box2.max =result ;
      //     this.ent_num[0].value=result;
      //     //禁用大于最大委托数量的快捷键
      //     for(var i = 0,len=this.ent_num.length;i<len;i++){
      //       this.ent_num[i].check=true;
      //       if(this.ent_num[i].value>result){
      //         this.ent_num[i].check=false;
      //       }
      //     }
      //     return result;
      //   } else {
      //     return 0;
      //   }
      // },
    },
    created () {
      //初始化
      this.getCodeDetail();
      //改变按钮样式
      if(this.code){
        this.action_click=true;
      }else{
        this.action_click=false;
      }
      this.timer = setInterval(() => {
        this.get_data()
      }, 1000);
    },
    destroyed () {
      sessionStorage.removeItem("deal")
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
.whether{
  color: #666;
  border: none !important;
}
.num-black{
  background: rgba(255, 255, 255, 0.5);
  color: #000;
}
.bottom .row .ent_numbers>div.no-border{
  border: none;
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
.pup .pup_content .pup_tips{
  font-size: 12px;
  height: auto;
  line-height: 20px;
  text-align: left;
  /* background:#FFEBEB; */
  color: #FF7A7D;
  margin:  10px;
  padding: 5px 0;
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
    /* border-top: 1px solid #e6e6e6; */
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
  background: #ff787b;
  color: white;
  padding:2px 5px;
  font-size: 14px;
  border-radius: 2px;
  margin-right: 15px;
}
.buy_sell_five .content .content_right>div>span:last-child{
  background: #3aaaff;
  color: white;
  padding:2px 5px;
  font-size: 14px;
  border-radius: 2px;
  margin-left: 15px;
}
.buy_sell_five .content .content_left>div>span:nth-child(2){
  color: #ff787b;
}
.buy_sell_five .content .content_right>div>span:nth-child(2){
  color: #03c461;
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
  height: 35px;
  line-height: 35px;
  /* background: #F2F2F2; */
  border-radius: 5px;
  flex: 1;
}
.bottom .row .prices>div:nth-child(1) {
  margin-right: 10px;
}
.bottom .row .prices>.this_check{
  background: #FECACB;
  color: #FF4E53;
}
.bottom .row .prices > .this_check_black{
  background: #ff787b;
  color: #fff;
}
.bottom .ent_data{
  text-align: right;
}
.bottom .tips{
  font-size: 12px;
  text-align: left;
  background:#FFEBEB;
  color: #FF7A7D;
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
  border:1px solid #d9d9d9;
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
  background: #F2F2F2;
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
.buy_btn{
    position:fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 50px;
    line-height: 50px;
    /* background-color: #d9d9d9; */
    color: #fff;
}
.active_btn{
  background: #3aaaff !important;
}
</style>
