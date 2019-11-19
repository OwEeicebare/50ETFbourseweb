<template>
  <div id="app">
    <div class="font32 custom-header main-bg normal-border-color">
      <img :src="theme ? '/static/images/header/transparent_arrow_left.svg' : '/static/images/header/arrow_left.svg'" alt="返回按钮" class="back" @click="back">
      <div :class="{'tabs': true, 'tabs-black': theme}">
        <div :class="{this_tab1:types=='buy'}" @click="change_types('buy')">买入</div>
        <div :class="{this_tab2:types=='sell'}" @click="change_types('sell')">卖出</div>
      </div>
    </div>
    <div class="content_wrap has-header assist-wrap">
      <div>
        <!-- 顶部合约数据 -->
        <div class="data_wrap main-bg">
            <div class="left">
            <p>
                <span>代码</span>
                <span>{{contract_code?contract_code:'- -'}}</span>
            </p>
            <p>
                <span>名称</span>
                <span>{{contract_name?contract_name:'- -'}}</span>
            </p>
            </div>
            <div class="right" :class="{'rise-color':data.PriceRise>0&&data.PriceOpen!=0,'drop-color':data.PriceRise < 0&&data.PriceOpen!=0}">
              <div class="number-font">{{data.PriceCurrent?Number(data.PriceCurrent).toFixed(4):data.PriceOpen&&data.PriceOpen!=0?'0.0000':'-.----'}}</div>
              <div class="number-font">
                  <p>{{data.PriceRise&&data.PriceOpen?Number(data.PriceRise).toFixed(4):data.PriceOpen&&data.PriceOpen!=0?'0.0000':'-.----'}}</p>
                  <p>{{data.PriceRisePercent&&data.PriceOpen?Number(data.PriceRisePercent).toFixed(2)+'%':data.PriceOpen&&data.PriceOpen!=0?'0.00%':'--'}}</p>
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
                <span>{{data.BuyFiveAmount?Number(data.BuyFiveAmount).toFixed(4):'-.- -'}}</span>
                <span>{{data.BuyFiveNum&&data.BuyFiveAmount?data.BuyFiveNum:'- -'}}</span>
                </div>
                <div class="left_row">
                <span>4</span>
                <span>{{data.BuyFourAmount?Number(data.BuyFourAmount).toFixed(4):'-.- -'}}</span>
                <span>{{data.BuyFourNum&&data.BuyFourAmount?data.BuyFourNum:'- -'}}</span>
                </div>
                <div class="left_row">
                <span>3</span>
                <span>{{data.BuyThreeAmount?Number(data.BuyThreeAmount).toFixed(4):'-.- -'}}</span>
                <span>{{data.BuyThreeNum&&data.BuyThreeAmount?data.BuyThreeNum:'- -'}}</span>
                </div>
                <div class="left_row">
                <span>2</span>
                <span>{{data.BuyTwoAmount?Number(data.BuyTwoAmount).toFixed(4):'-.- -'}}</span>
                <span>{{data.BuyTwoNum&&data.BuyTwoAmount?data.BuyTwoNum:'- -'}}</span>
                </div>
                <div class="left_row">
                <span>1</span>
                <span>{{data.BuyOneAmount?Number(data.BuyOneAmount).toFixed(4):'-.- -'}}</span>
                <span>{{data.BuyOneNum&&data.BuyOneAmount?data.BuyOneNum:'- -'}}</span>
                </div>
            </div>
            <div class="content_right">
                <div class="left_row">
                <span>{{data.SaleFiveNum&&data.SaleFiveAmount?data.SaleFiveNum:'- -'}}</span>
                <span>{{data.SaleFiveAmount?Number(data.SaleFiveAmount).toFixed(4):'-.- -'}}</span>
                <span>5</span>
                </div>
                <div class="left_row">
                <span>{{data.SaleFourNum&&data.SaleFourAmount?data.SaleFourNum:'- -'}}</span>
                <span>{{data.SaleFourAmount?Number(data.SaleFourAmount).toFixed(4):'-.- -'}}</span>
                <span>4</span>
                </div>
                <div class="left_row">
                <span>{{data.SaleThreeNum&&data.SaleThreeAmount?data.SaleThreeNum:'- -'}}</span>
                <span>{{data.SaleThreeAmount?Number(data.SaleThreeAmount).toFixed(4):'-.- -'}}</span>
                <span>3</span>
                </div>
                <div class="left_row">
                <span>{{data.SaleTwoNum&&data.SaleTwoAmount?data.SaleTwoNum:'- -'}}</span>
                <span>{{data.SaleTwoAmount?Number(data.SaleTwoAmount).toFixed(4):'-.- -'}}</span>
                <span>2</span>
                </div>
                <div class="left_row">
                <span>{{data.SaleOneNum&&data.SaleOneAmount?data.SaleOneNum:'- -'}}</span>
                <span>{{data.SaleOneAmount?Number(data.SaleOneAmount).toFixed(4):'-.- -'}}</span>
                <span>1</span>
                </div>
            </div>
            </div>
        </div>
        <!-- 用户操作buy -->
        <div class="bottom normal-margin-top main-bg" v-if="types=='buy'">
          <!-- 价格类型 -->
          <div class="row normal-border-color">
              <label>价格类型</label>
              <div class="prices">
                  <div  v-for="(item,i) in b_price_type" :key="i" :class="{'assist-color3': true,'this_check':item.check && !theme, 'this_check_black': item.check && theme}"  @click="b_check_type(i)" >{{item.name}}</div>
              </div>
          </div>
          <!-- 委托价格 -->
          <div class="row normal-border-color">
              <label>委托价格</label>
              <div>
                  <NumberBox :max="b_num_box1.max" :min="b_num_box1.min" :vals="b_num_box1.val" :step="b_num_box1.step" :dec="b_num_box1.dec" :inputs="b_num_box1.inputs" @getNum="getboxnum1" ></NumberBox>
              </div>
          </div>
          <!-- 价格提示信息1 -->
          <!-- 委托数量 -->
          <div class="row del_border normal-border-color">
              <label>委托数量</label>
              <div>
                  <NumberBox :max="b_num_box2.max" :min="b_num_box2.min" :vals="b_num_box2.val" :step="b_num_box2.step" :dec="b_num_box2.dec" :inputs="b_num_box2.inputs" @getNum="getboxnum2" ></NumberBox>
              </div>
          </div>
          <!-- 数量快捷键 -->
          <div class="row normal-border-color">
              <label></label>
              <div class="b_ent_numbers">
                  <div v-for="(item,i) in b_ent_num" :key="i" :data-value="item.value" @click="b_update_ent(i)" :class="{'whether':!item.check, 'assist-color3': true, 'no-border': theme, 'main-text-color2': !item.check && theme, 'num-black': item.check && theme}" >{{item.name}}</div>
              </div>
          </div>
          <!-- 单日策略 -->
          <div class="row normal-border-color">
              <label>当日策略</label>
              <div class="strategys">
                  <div v-if="strategys[0].number=='0'" @click="set_stop(strategys[0].id)" class="assist-color3">设置止盈</div>
                  <div v-else  @click="select_strategy(strategys[0].id)" :class="{this_check:strategys[0].check,'assist-color3':true}" >涨幅{{strategys[0].number}}止盈</div>
                  <div v-if="strategys[1].number=='0'" @click="set_stop(strategys[1].id)" class="assist-color3">设置止损</div>
                  <div v-else @click="select_strategy(strategys[1].id)" :class="{this_check:strategys[1].check,'assist-color3':true}" >跌幅{{strategys[1].number}}止损</div>
              </div>
          </div>
          <!-- 价格提示信息2 -->
          <div :class="{'close-out-tips': true, 'normal-padding': true, 'rise-color': !theme, 'assist-color1': true, 'font24': true, 'tab-active-color': theme, 'tips': true}" v-if="strategys[0].check||strategys[1].check">合约当日有效，满足涨幅或跌幅时自动卖出平仓</div>
          <div class="other_data">
              <div>
                  <span>可用金额</span>
                  <span>{{(balance).toFixed(2)}}元</span>
              </div>
              <div>
                  <span>可买数量</span>
                  <span>{{max_number}}张</span>
              </div>
              <div>
                  <span>交易金额</span>
                  <span>{{(transaction_amount).toFixed(2)}}元</span>
              </div>
          </div>
          <!-- 提交按钮 -->
          <div :class="{'btns':!theme,'active_btn':b_action_click && !theme, 'buy-black-btn': theme, 'active-black-btn': b_action_click && theme,'font32':true}">
            <div @click="one_cross" class="yjks_bg">一键跨式</div>
            <div @click="sub_btn">提交买入委托</div>
          </div>
        </div>
        <!-- 用户操作sell -->
        <div class="bottom normal-margin-top main-bg" v-if="types=='sell'">
          <!-- 价格类型 -->
          <div class="row normal-border-color">
            <label>价格类型</label>
            <div class="prices">
                <div :class="{'assist-color3': true,'this_check':item.check && !theme, 'this_check_black': item.check && theme}" v-for="(item,i) in s_price_type" :key="i"  @click="s_check_type(i)">{{item.name}}</div>
            </div>
          </div>
          <!-- 委托价格 -->
          <div class="row normal-border-color">
              <label>委托价格</label>
              <div>
                  <NumberBox :max="s_num_box3.max" :min="s_num_box3.min" :vals="s_num_box3.val" :dec="s_num_box3.dec" :step="s_num_box3.step" :inputs="s_num_box3.inputs" @getNum="getboxnum3" ></NumberBox>
              </div>
          </div>
          <!-- 委托数量 -->
          <div class="row del_border normal-border-color">
              <label>委托数量</label>
              <div>
                  <NumberBox :max="s_num_box4.max" :min="s_num_box4.min" :vals="s_num_box4.val" :dec="s_num_box4.dec" :step="s_num_box4.step" :inputs="s_num_box4.inputs" @getNum="getboxnum4" ></NumberBox>
              </div>
          </div>
          <!-- 数量快捷键 -->
          <div class="row normal-border-color">
              <label></label>
              <div class="b_ent_numbers">
                  <div v-for="(item,i) in s_ent_num" :key="i" :data-value="item.value" @click="s_update_ent(i)" :class="{'whether':!item.check && !theme, 'assist-color3': true, 'no-border': theme, 'main-text-color2': !item.check && theme, 'num-black': item.check && theme}">{{item.name}}</div>
              </div>
          </div>
          <div class="other_data">
              <div>
                  <span>可用金额</span>
                  <span>{{(balance).toFixed(2)}}元</span>
              </div>
              <div>
                  <span>持仓数量</span>
                  <span>{{s_max_number}}张</span>
              </div>
              <div>
                  <span>交易金额</span>
                  <span>{{(s_transaction_amount).toFixed(2)}}元</span>
              </div>
              <div>
                <span>已委托数量</span>
                <span>{{s_number_dogin}}张</span>
              </div>
          </div>
          <div :class="{'sell_btn':true,'font32':true, 'sell_active':s_action_click && !theme, 'assist-color3': true, 'sell-active-btn': s_action_click && theme}" @click="sell_btn">提交卖出委托</div>
        </div>
        
        <!-- 弹窗口 -->
        <div class="pup" v-if="show_pop">
          <div class="pup_title">{{p_title}}</div>
          <div class="pup_content">
            <div><span>合约名称</span><span>{{contract_name}}</span></div>
            <div><span>合约代码</span><span>{{contract_code}}</span></div>
            <div><span>委托价格</span><span>{{p_price}}</span></div>
            <div><span>委托数量</span><span>{{p_num}}张</span></div>
            <div><span>交易金额</span><span>{{Number(p_total_price).toFixed(2)}}元</span></div>
            <div class="pup_tips assist-color1">{{p_tip}}</div>
          </div>
          <div class="pup_btns">
            <span @click="cancel_pup">取消</span>
            <span @click="sure_pup">确认</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 遮盖层 -->
    <div class="pup_cover" v-if="show_bg"></div>
    <div id="loding" v-if="show_loding"><img  src="../../../static/logding.svg" alt=""></div>
  </div>
</template>

<script>
import NumberBox from "@/components/common/number.vue";
import $axios from 'axios'
import api from '../../api/index';
export default {
  //进入路由验证是否实名
  beforeRouteEnter:(to,from,next)=>{
    $axios.post(api.autonymState).then(res=>{
      if(res.data.Status==="1"){
        if(res.data.Data.NTure!==1){//未实名
          next('/')
        }else{
          next();
        }
      }
    })
  },
  computed: {
    theme () {
      // console.log(localStorage.getItem('theme') != null ? JSON.parse(localStorage.getItem('theme')).theme : 0);
      return localStorage.getItem('theme') != null ? JSON.parse(localStorage.getItem('theme')).theme : 0;
    }
  },
  data() {
    return {
        t:this.$store.state.expirationTime,
        //顶部数据
        types: "buy", //操作类型（买入/卖出)
        back_url: "", //返回地址
        contract_code: " ", //合约代码
        contract_name: " ", //合约名称

        data:[],//顶部数据，五档

        //买入
        unit_price:0,//买入单价（市价×合约单位）
        buy_pice:0,//买入委托价（市价交易时卖一的价）
        one_service:0,//单张服务费 
        max_number:0,//最大可买数量
        min_number:0,//最小买入数量
        transaction_amount:0,//买入交易金额
        gain:0,//涨幅
        gain_before:0,//卖五的价格
        //买入价格类型
        b_price_type: [
            { name: "对手价", value: 0, check: true },
            // { name: "追涨价", value: 1, check: false },
            { name: "限价", value: 2, check: false }
        ],
        //买入价格输入框
        b_num_box1: {
            min: 0, //最小值
            max: 100, //最大值
            val: 0, //初始值
            step: 0.0001, //步长
            inputs: false, //是否可以手动输入，true:不能手动输入，false:可手动输入
            dec:4
        },
        //买入数量输入框
        b_num_box2: {
            min: 0, //最小值
            max: 0, //最大值
            val: 0, //初始值
            step: 1, //步长
            inputs: false,//是否可以手动输入，true:不能手动输入，false:可手动输入
            dec:0
        },
        //买入委托数量快捷按钮
        b_ent_num: [
            { name: "全仓", value: "0",check:true},
            { name: "5", value: "5",check:true },
            { name: "10", value: "10",check:true },
            { name: "20", value: "20",check:true},
            { name: "30", value: "30",check:true}
        ],
        //设置止盈止损
        strategys: [
            //如果无涨跌幅则返回0，否则返回~%
            { id: 1, number: "0", check: false },
            { id: 2, number: "0", check: false }
        ],
         //卖出
        s_unit_price:0,//卖出单价（市价×合约单位）
        sell_price:0,//卖出委托价（市价交易时买一的价）
        s_one_service:0,//单张服务费 
        s_max_number:0,//持仓数量
        s_number_dogin:0,//委托数量
        s_transaction_amount:0,//卖出交易金额
        //卖出价格类型
        s_price_type: [
            { name: "对手价", value: 0, check: true },
            { name: "限价", value: 1, check: false }
        ],
        //卖出价格输入框
        s_num_box3: {
          min: 0, //最小值
          max: 100, //最大值
          val: 0, //初始值
          step: 0.0001, //步长
          inputs: false, //是否可以手动输入，true:不能手动输入，false:可手动输入
          dec:4
        },
        //卖出数量输入框
        s_num_box4: {
          min: 0, //最小值
          max: 0, //最大值
          val: 0, //初始值
          step:1, //步长
          inputs: false, //是否可以手动输入，true:不能手动输入，false:可手动输入
          dec:0
        },
        //买入委托数量快捷按钮
        s_ent_num: [
          { name: "全仓", value: "0",check:true},
          { name: "5", value: "5",check:true },
          { name: "10", value: "10",check:true },
          { name: "20", value: "20",check:true},
          { name: "30", value: "30",check:true}
        ],
        //通用
        balance:0,//可用余额
        denum:0,//合约单位
        timer: "", //计时器
        show_pop: false,//是否显示弹窗
        show_loding:false,//显示加载特效
        show_bg:false,//显示蒙版
        //弹窗参数
        p_title:'',//弹窗标题
        p_price:0,//弹窗价格
        p_num:0,//弹窗数量
        p_total_price:0,//弹窗交易金额
        p_tip:'',//弹窗提示文字

        b_action_click:false,
        s_action_click:false,

        bfile_number:0,//买入取几档价格
        sfile_number:0,//卖出取几档价格
    };
  },
  created() {
    this.init_all();
    this.timer = setInterval(() => {
      this.get_data();
    }, 1000);
  },
  destroyed(){
    window.clearInterval(this.timer);
  },
  methods: {
    //页面加载初始化
    init_all(){
      //参数
      this.types = this.$route.query.type; //获取买卖类型
      this.contract_name=this.$route.query.contract_name.split("-")[0]; //获取合约名称
      this.contract_code=this.$route.query.contract_name.split("-")[1]; //获取合约代码
      //根据合约代码查询顶部数据
      this.$http.post(api.contractDetail,this.contract_code).then(res=>{
        if(res.data.Status==1){
          this.data = res.data.Data;
          //this.buy_pice= this.data.SaleFiveAmount.toFixed(4);//买入现价
          if(this.data.SaleFiveAmount){
            this.buy_pice = this.data.SaleFiveAmount.toFixed(4);
            this.bfile_number=5;
          }else if(this.data.SaleFourAmount){
            this.buy_pice = this.data.SaleFourAmount.toFixed(4);
            this.bfile_number=4;
          }else if(this.data.SaleThreeAmount){
            this.buy_pice = this.data.SaleThreeAmount.toFixed(4);
            this.bfile_number=3;
          }else if(this.data.SaleTwoAmount){
            this.buy_pice = this.data.SaleTwoAmount.toFixed(4);
            this.bfile_number=2;
          }else if(this.data.SaleOneAmount){
            this.buy_pice = this.data.SaleOneAmount.toFixed(4);
            this.bfile_number=1;
          }else{
            this.buy_pice=0;
          }
          // this.sell_price= this.data.BuyFiveAmount.toFixed(4);//卖出现价
          if(this.data.BuyFiveAmount){
            this.sell_price = this.data.BuyFiveAmount.toFixed(4);
            this.sfile_number=5;
          }else if(this.data.BuyFourAmount){
            this.sell_price = this.data.BuyFourAmount.toFixed(4);
            this.sfile_number=4;
          }else if(this.data.BuyThreeAmount){
            this.sell_price = this.data.BuyThreeAmount.toFixed(4);
            this.sfile_number=3;
          }else if(this.data.BuyTwoAmount){
            this.sell_price = this.data.BuyTwoAmount.toFixed(4);
            this.sfile_number=2;
          }else if(this.data.BuyOneAmount){
            this.sell_price = this.data.BuyOneAmount.toFixed(4);
            this.sfile_number=1;
          }else{
            this.sell_price=0;
          }

          //1、获取余额、买入单张服务费，卖出单张服务费，持仓数量，最低可买数量，设置的止损止盈值
          this.$http.post(api.transactionInit,this.contract_code).then(res=>{
            if(res.data.Status==='1'){
              var result = res.data.Data;
              this.balance=result.yue;//余额
              this.denum=result.num ;//合约单位
              this.one_service=result.buate;//买入单张手续费
              this.s_one_service=result.saate;//卖出单张手续费
              this.gain=result.ab; //涨幅
              this.s_max_number=result.stocknum;//持仓数量
              this.s_number_dogin = result.applynum;//已委托数量
              this.strategys[0].number=result.tarofit==0?result.tarofit:result.tarofit+"%";//获取止盈
              this.strategys[1].number=result.stooss==0?result.stooss:result.stooss+"%";//获取止损
              // console.log("初始值",result)
              //买入初始化
              //初始化委托价格输入框
              this.b_num_box1.val=this.buy_pice;
              //计算最大委托数量
              this.update_maxnumber(this.buy_pice);
              //计算交易金额
              this.update_tranamount();

              //卖出数据初始化:
              //初始化委托价格输入框
              this.s_num_box3.val=this.sell_price;
              //委托数量等于持仓数量
              this.s_ent_num[0].value = this.s_num_box4.max = this.s_num_box4.val = this.s_max_number-this.s_number_dogin;
              for(var i = 0,len=this.s_ent_num.length;i<len;i++){
                this.s_ent_num[i].check=true;
                if(this.s_ent_num[i].value-this.s_max_number>0){
                  
                  this.s_ent_num[i].check=false;
                }
              }
            }else{
              this.$toast({
                message: res.data.Msg,
                position: 'bottom',
                duration: 1000
              });
            }
          })
        }
      })
    },
    //获取合约详情和五档数据
    get_data(){
      this.$http.post(api.contractDetail,this.contract_code).then(res=>{
        if(res.data.Status==="1"){
          this.data = res.data.Data;
          // this.buy_pice=this.data.SaleFiveAmount.toFixed(4);
          // this.sell_price=this.data.BuyFiveAmount.toFixed(4);
          //买价格
          if(this.data.SaleFiveAmount){
            this.buy_pice = this.data.SaleFiveAmount.toFixed(4);
            this.bfile_number=5;
          }else if(this.data.SaleFourAmount){
            this.buy_pice = this.data.SaleFourAmount.toFixed(4);
            this.bfile_number=4;
          }else if(this.data.SaleThreeAmount){
            this.buy_pice = this.data.SaleThreeAmount.toFixed(4);
            this.bfile_number=3;
          }else if(this.data.SaleTwoAmount){
            this.buy_pice = this.data.SaleTwoAmount.toFixed(4);
            this.bfile_number=2;
          }else if(this.data.SaleOneAmount){
            this.buy_pice = this.data.SaleOneAmount.toFixed(4);
            this.bfile_number=1;
          }else{
            this.buy_pice=0;
          }
          //卖价格
          if(this.data.BuyFiveAmount){
            this.sell_price = this.data.BuyFiveAmount.toFixed(4);
            this.sfile_number=5;
          }else if(this.data.BuyFourAmount){
            this.sell_price = this.data.BuyFourAmount.toFixed(4);
            this.sfile_number=4;
          }else if(this.data.BuyThreeAmount){
            this.sell_price = this.data.BuyThreeAmount.toFixed(4);
            this.sfile_number=3;
          }else if(this.data.BuyTwoAmount){
            this.sell_price = this.data.BuyTwoAmount.toFixed(4);
            this.sfile_number=2;
          }else if(this.data.BuyOneAmount){
            this.sell_price = this.data.BuyOneAmount.toFixed(4);
            this.sfile_number=1;
          }else{
            this.sell_price=0;
          }


          this.gain_before=this.data.SaleFiveAmount.toFixed(4);
        }
      })
    },
    //返回
    back() {
        this.back_url = this.$route.query.back ? this.$route.query.back : "/"; //返回地址
        if (this.back_url === "market-details") {
            this.$router.push({ path: "/market-details", query: { title:this.$route.query.contract_name, prev:"market" }});
        } else {
            this.$router.push(this.back_url);
        }
    },
    //切换操作类型（买入/卖出）
    change_types(params){
      this.types = params;
    },
    //买入快捷方式修改委托数量输入框
    b_update_ent(params) {
      if(this.b_ent_num[params].check){
         this.b_num_box2.val = this.b_ent_num[params].value;
      }
    },
    //买入切换价格类型
    b_check_type(params) {
      //取消其他价格类型的选中状态
      for (var i = 0; i < this.b_price_type.length; i++) {
        this.b_price_type[i].check = false;
      }
      this.b_price_type[params].check = true;
     
      // if(this.b_price_type[params].name=="追涨价"){
      //   //获取卖五价格，初始化委托价格输入框
      //   this.b_num_box1.val=this.gain_before;
      // }else{
      //   //获取卖一价格，初始化委托价格输入框
      //   this.b_num_box1.val=this.buy_pice;
      // };
      if(this.b_price_type[params].name=="对手价"){
        if(this.data.SaleFiveAmount){
          this.buy_pice = this.data.SaleFiveAmount.toFixed(4);
          this.bfile_number=5;
        }else if(this.data.SaleFourAmount){
          this.buy_pice = this.data.SaleFourAmount.toFixed(4);
          this.bfile_number=4;
        }else if(this.data.SaleThreeAmount){
          this.buy_pice = this.data.SaleThreeAmount.toFixed(4);
          this.bfile_number=3;
        }else if(this.data.SaleTwoAmount){
          this.buy_pice = this.data.SaleTwoAmount.toFixed(4);
          this.bfile_number=2;
        }else if(this.data.SaleOneAmount){
          this.buy_pice = this.data.SaleOneAmount.toFixed(4);
          this.bfile_number=1;
        }else{
          this.buy_pice=0;
        }
        this.b_num_box1.val=this.buy_pice;
      }
      //计算委托数量（以最大委托价格）
      this.update_maxnumber(this.b_num_box1.val);
      this.update_tranamount();
    },
    //计算买入最大委托数量
    //参数：委托价格
    update_maxnumber(params){
      if(params<=0){
        this.max_number=Math.floor(this.balance);//如果委托价格小于等于0，则最大可买数量等于可用余额向下取整
      }else{
        this.unit_price =this.mul(params,this.denum);//单价=市价×合约单位
        this.max_number=Math.floor(this.div(this.balance,this.add(this.one_service,this.unit_price)));//余额÷（单价+单张服务费）向下取整
      }
      //初始化全仓数量和限制最大委托数量
      this.b_ent_num[0].value=this.max_number;
      this.b_num_box2.max=this.max_number;
      //禁用大于最大委托数量的快捷键
      for(var i = 0,len=this.b_ent_num.length;i<len;i++){
        this.b_ent_num[i].check=true;
        if(this.b_ent_num[i].value>this.max_number){
          this.b_ent_num[i].check=false;
        }
      }
    },
    //买入计算交易金额
    update_tranamount(){
      if(this.b_num_box1.val<=0 || this.b_num_box2.val<=0){
        this.transaction_amount=0;
        return;
      }
      //获取单价（委托价格*合约单位）
      this.unit_price = this.mul(this.b_num_box1.val,this.denum);
      //获取交易金额
      this.transaction_amount=this.mul(this.add(this.unit_price,this.one_service),this.b_num_box2.val)
    },
    //买入委托价格输入框
    getboxnum1(num) {
      if(num == 0 || this.b_num_box2.val==0){
        this.b_action_click=false;
      }else{
        this.b_action_click=true;
      }
      //获取子组件返回值
      this.b_num_box1.val = num;
      this.update_maxnumber(num);
      //重新计算交易金额
      this.update_tranamount();
      //委托价格如果等于卖一价格则不跳转价格类型
      // if(this.b_num_box1.val==this.buy_pice || this.b_num_box1.val == this.data.SaleFiveAmount ){
      //   return;
      // }
      switch(this.bfile_number){
        case 1:if(this.b_num_box1.val==this.data.SaleOneAmount) return;break;
        case 2:if(this.b_num_box1.val==this.data.SaleTwoAmount) return;break;
        case 3:if(this.b_num_box1.val==this.data.SaleThreeAmount) return;break;
        case 4:if(this.b_num_box1.val==this.data.SaleFourAmount) return;break;
        case 5:if(this.b_num_box1.val==this.data.SaleFiveAmount) return;break;
        default :return;break;
      }
      //跳选价格类型
      this.b_price_type[0].check = false;
      this.b_price_type[1].check = true;
      // this.b_price_type[2].check = true;
    },
    //买入委托数量输入框
    getboxnum2(num) {
      if(num == 0 || this.b_num_box1.val==0){
        this.b_action_click=false;
      }else{
        this.b_action_click=true;
      }
      //获取子组件返回值
      this.b_num_box2.val = num;
      //重新计算交易金额
      this.update_tranamount();
    },
    //选择止盈止损
    select_strategy(par) {
      //选择止盈止损
      var obj = this.strategys.find(item => {
        return item.id == par;
      });
      obj.check = !obj.check;
    },
    //如果没有设置止盈止损则弹窗提示
    set_stop(params) {
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
    //提交买入委托
    sub_btn(){
      if(!this.b_action_click){
        return;
      }
      //委托价格大于0
      if(this.b_num_box1.val <= 0){
        this.$toast({
          message: "请填写正确的委托价格",
          position: 'bottom',
          duration: 1000
        });
        return
      }
      //委托数量大于0
      if(this.b_num_box2.val <= 0){
        this.$toast({
          message: "请填写正确的委托数量",
          position: 'bottom',
          duration: 1000
        });
        return
      }
      //委托数量不能大于可用余额/单价得出的数量
      if(this.b_num_box2.val > this.max_number){
        this.$toast({
          message: "余额不足，请及时充值",
          position: 'bottom',
          duration: 1000
        });
        return
      }
      //显示窗口
      this.p_price=this.b_num_box1.val;
      this.p_title="买入开仓委托",
      this.p_tip="买入"+this.t+"分钟未成交自动撤单";
      this.p_num=this.b_num_box2.val;
      this.p_total_price=this.transaction_amount;
      this.show_pop=true;
      this.show_bg=true;
    },
    //卖出切换价格类型
    s_check_type(params){
      //取消其他价格类型的选中状态
      for (var i = 0; i < this.s_price_type.length; i++) {
        this.s_price_type[i].check = false;
      }
      this.s_price_type[params].check = true;

      if(this.s_price_type[params].name=="对手价"){
        // this.s_num_box3.val=this.sell_price;
        if(this.data.BuyFiveAmount){
          this.sell_price = this.data.BuyFiveAmount.toFixed(4);
          this.sfile_number=5;
        }else if(this.data.BuyFourAmount){
          this.sell_price = this.data.BuyFourAmount.toFixed(4);
          this.sfile_number=4;
        }else if(this.data.BuyThreeAmount){
          this.sell_price = this.data.BuyThreeAmount.toFixed(4);
          this.sfile_number=3;
        }else if(this.data.BuyTwoAmount){
          this.sell_price = this.data.BuyTwoAmount.toFixed(4);
          this.sfile_number=2;
        }else if(this.data.BuyOneAmount){
          this.sell_price = this.data.BuyOneAmount.toFixed(4);
          this.sfile_number=1;
        }else{
          this.sell_price=0;
        }
        this.s_num_box3.val=this.sell_price;
      }
    },
    //卖出快捷方式修改委托数量输入框
    s_update_ent(params){
      if(this.s_ent_num[params].check){
         this.s_num_box4.val = this.s_ent_num[params].value;
      }
    },
    //卖入委托价格输入框
    getboxnum3(num) {
      if(num == 0 || this.s_num_box4.val==0){
        this.s_action_click=false;
      }else{
        this.s_action_click=true;
      }
      //获取子组件返回值
      this.s_num_box3.val = num;
      this.s_update_tranamount();
      //委托价格如果等于买一价格则不跳转价格类型
      // if(this.s_num_box3.val==this.sell_price){
      //   return;
      // }
      switch(this.sfile_number){
        case 1:if(this.s_num_box3.val==this.data.BuyOneAmount) return;break;
        case 2:if(this.s_num_box3.val==this.data.BuyTwoAmount) return;break;
        case 3:if(this.s_num_box3.val==this.data.BuyThreeAmount) return;break;
        case 4:if(this.s_num_box3.val==this.data.BuyFourAmount) return;break;
        case 5:if(this.s_num_box3.val==this.data.BuyFiveAmount) return;break;
        default :return;break;
      }
      //跳选价格类型
      this.s_price_type[0].check = false;
      this.s_price_type[1].check = true;
    },
    //卖入委托数量输入框
    getboxnum4(num) {
      if(num == 0 || this.s_num_box3.val==0){
        this.s_action_click=false;
      }else{
        this.s_action_click=true;
      }
      //获取子组件返回值
      this.s_num_box4.val = num;
      this.s_update_tranamount();
    },
    //卖出计算交易金额
    s_update_tranamount(){
      if(this.s_num_box3.val<=0 || this.s_num_box4.val<=0){
        this.s_transaction_amount=0;
        return;
      }
      //获取单价（委托价格*合约单位）
      this.unit_price = this.mul(this.s_num_box3.val,this.denum);
      //获取交易金额
      this.s_transaction_amount=this.mul((this.unit_price-this.one_service),this.s_num_box4.val)
    },
    //卖出提交按钮
    sell_btn(){
      if(!this.s_action_click){
        return;
      }
      //委托价格不能为0
      if(this.s_num_box3.val<=0){
        this.$toast({
          message: "请填写正确的委托价格",
          duration: 1000,
          position: 'bottom'
        });
        return
      }
      //如果有持仓数量还为0
      if(this.s_max_number != 0 && this.s_num_box4.val<= 0){
        this.$toast({
          message: "请填写正确的委托数量",
          duration: 1000,
          position: 'bottom'
        });
        return
      }
      //如果没有持仓数量还为0
      if(this.s_num_box4.val<=0){
        this.$toast({
          message: "请先购买该合约",
          duration: 1000,
          position: 'bottom'
        });
        return
      }
      //显示窗口
      this.p_price=this.s_num_box3.val;
      this.p_title="卖出平仓委托",
      this.p_tip="买入"+this.t+"分钟未成交自动撤单；手动操作卖出后，止盈止损功能将自动取消";
      this.p_num=this.s_num_box4.val;
      this.p_total_price=this.s_transaction_amount;
      this.show_pop=true;
      this.show_bg=true;
    },
    cancel_pup(){//弹窗取消
      this.show_pop=false;
      this.show_bg=false;
    },
    sure_pup(){//弹窗确认
      this.show_pop=false;//关闭弹窗
      this.show_loding=true;
      //如果买入
      if(this.types=="buy"){
        var tk='';
        for(var i = 0,len=this.b_price_type.length;i<len;i++){
          if(this.b_price_type[i].check){
            tk=this.b_price_type[i].value;
          }
        }
        var ty = this.strategys[0].check==true?1:0;
        var ts = this.strategys[1].check==true?1:0;
        //提交参数合约sc，价格类型Tk，委托价格dp，委托数量dn，止盈Ty，止损Ts 
        this.$http.post(api.buy,{"Dt":10,"Sc": this.contract_code,"Dp":Number(this.p_price),"Dn":this.p_num,"Ty":ty,"Ts": ts,"Tk":tk}).then(res=>{
          if(res.data.Status==1){
            //委托买入成功
            this.$router.push({path: '/order-success'});
          }else{
             this.$toast({
              message: res.data.Msg,
              position: 'bottom',
              duration: 1000
            });
          }
          this.show_loding=false;
          this.show_bg=false;
        })
      }else if(this.types="sell"){
        var tk='';
        for(var i = 0,len=this.s_price_type.length;i<len;i++){
          if(this.s_price_type[i].check){
            tk=this.s_price_type[i].value;
          }
        }
        this.$http.post(api.allSell,[{StockCode:this.contract_code,DeclNum:this.p_num,DeclPrice:Number(this.p_price),ScID:-1,Remark:tk}]).then(res=>{
        // this.$http.post(api.allSell,{Id:1,Dp:Number(this.p_price),Sn:this.p_num,Ts:tk,Sk:this.contract_code}).then(res=>{
          if(res.data.Status==1){
            //委托卖出成功(快捷反手)
            this.$router.push({path: '/sell-order',query:{contract:this.contract_code}});
          }else{
            this.$toast({
              message:  res.data.Msg,
              position: 'bottom',
              duration: 1000
            });
          }
          this.show_bg=false;
          this.show_loding=false;
        })
      }
      
    },
    one_cross(){//一键跨式跳转
      //目前合约类型
      var cross_type = this.contract_name.indexOf("购")!=-1?"gou":"gu";
      //获取相应合约代码
      this.$http.post(api.oneCross,this.contract_code).then(res=>{
        if(res.data.Status==="1"){
          var corss_cord=res.data.Data[0];
          var obj = {
            type:cross_type,
            cord_gou:cross_type==="gou"?this.contract_code:corss_cord,
            cord_gu:cross_type==="gu"?this.contract_code:corss_cord,
          }
          sessionStorage.setItem("cross",JSON.stringify(obj));
          sessionStorage.setItem("state",JSON.stringify({type:"buy",back:"market-details",contract_name:this.contract_name+"-"+this.contract_code,denum:this.denum}));//保存跳转状态
          this.$router.push({path:'/one_cross_rgou'});
        }
      });
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
    NumberBox
  },
  filters: {
    toRetain(val, len) {
      //数字保留后四位
      return Number(val).toFixed(len);
    },
    setPercent(val) {
      return val + "%";
    }
  }
};
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
.whether{
  /* background: #F2F2F2; */
  color:#999;
  border: none !important;
}
.num-black{
  background: rgba(255, 255, 255, 0.5);
  color: #000;
}
.bottom .row .b_ent_numbers > div.no-border{
  border: none;
}
.custom-header {
  position: fixed;
  height: 24px;
  line-height: 24px;
  width: 100vw;
  text-align: center;
  top: 0;
  padding-top: 10px;
  padding-bottom: 10px;
  z-index: 1001;
  border-bottom-width: 1px;
  border-bottom-style: solid;
}
.back {
  position: absolute;
  height: 20px;
  top: 2px;
  cursor: pointer;
  padding: 10px;
  left: 0;
}
.tabs {
  display: flex;
  justify-content: center;
  align-items: center;
}
.tabs > div {
  color: #999;
  border-bottom: 2px solid #fff;
}
.tabs-black > div{
  color: rgba(255, 255, 255, 0.5);
  border-bottom: 2px solid #222;
}
.tabs > div:first-child {
  margin-right: 20px;
}
.tabs .this_tab1 {
  color: #ff787b;
  border-bottom: 2px solid #ff787b;
  font-weight: 600;
}
.tabs .this_tab2 {
  color: #3aaaff;
  border-bottom: 2px solid #3aaaff;
  font-weight: 600;
}
.content_wrap {
  /* margin-top: 44px;
  margin-bottom: 50px; */
  bottom: 50px;
}
.content_wrap > div:nth-child(1) {
  overflow-y: scroll;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
}
.data_wrap {
  /* background: #fff; */
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.data_wrap .left {
  text-align: left;
  height: 44px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
}
.data_wrap .left p {
  display: inline-block;
  width: 100%;
  text-align: left;
}
.data_wrap .left p span:first-child {
  color: #999;
  margin-right: 10px;
}
.data_wrap .right {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.data_wrap .right > div:first-child {
  font-size: 37px;
  margin-right: 10px;
  /* font-family: font; */
}
.data_wrap .right > div:last-child > p:first-child {
  margin-bottom: 10px;
}
/*买卖五档*/
.buy_sell_five {
  /* margin-top: 10px; */
  padding: 10px;
  /* background: #fff; */
  font-size: 14px;
}
.buy_sell_five .title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.buy_sell_five .content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}
.buy_sell_five .content .content_left,
.buy_sell_five .content .content_right {
  width: 50%;
}
.buy_sell_five .content .content_left > div,
.buy_sell_five .content .content_right > div {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px;
}
.buy_sell_five .content .content_left > .left_row:after {
  display: block;
  content: "";
  /* border-right: 1px solid #d4d4d4; */
  /* border-right-width: 1px;
  border-right-style: solid; */
  width: 1px;
  height: 10px;
  position: relative;
  left: 10px;
}
.buy_sell_five .content .content_left > div > span:first-child {
  background: #ff787b;
  color: white;
  padding: 2px 5px;
  font-size: 14px;
  border-radius: 2px;
  margin-right: 15px;
}
.buy_sell_five .content .content_right > div > span:last-child {
  background: #3aaaff;
  color: white;
  padding: 2px 5px;
  font-size: 14px;
  border-radius: 2px;
  margin-left: 15px;
}
.buy_sell_five .content .content_left > div > span:nth-child(2) {
  color: #ff787b;
}
.buy_sell_five .content .content_right > div > span:nth-child(2) {
  color: #03c461;
}
.buy_sell_five .content .content_left > div > span:not(:first-child),
.buy_sell_five .content .content_right > div > span:not(:last-child) {
  display: inline-block;
  width: 50px;
}
/*=========买卖五档end=========*/
.bottom {
  /* margin-top: 10px; */
  /* background: #fff; */
  padding: 10px 0;
}
.bottom .row {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 35px;
  padding: 10px;
  /* border-bottom: 1px solid #eaeaea; */
  border-bottom-width: 1px;
  border-bottom-style: solid;
}
.bottom .del_border {
  border-bottom: none;
  padding-bottom: 0px;
}
.bottom .row > label {
  min-width: 100px;
  text-align: left;
}
.bottom .row > div {
  flex-grow: 1;
}
.bottom .row .prices {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.bottom .row .prices > div {
  width: 75px;
  height: 35px;
  line-height: 35px;
  /* background: #f2f2f2; */
  border-radius: 5px;
  /* margin-left: 2px; */
  margin-right: 10px;
  flex-grow: 1
}
.bottom .row .prices > div:nth-last-child(1) {
  margin-right: 0;
}
.bottom .row .prices > .this_check {
  background: #fecacb;
  color: #ff4e53;
}
.bottom .row .prices > .this_check_black{
  background: #ff787b;
  color: #fff;
}
.bottom .ent_data {
  text-align: right;
}
.bottom .tips {
  /* font-size: 12px; */
  text-align: left;
  /* background: #ffebeb;
  color: #ff7a7d; */
  padding: 10px;
}
.bottom .row .b_ent_numbers {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.bottom .row .b_ent_numbers > div {
  width: 41px;
  height: 35px;
  line-height: 35px;
  border: 1px solid #d9d9d9;
  border-radius: 5px;
  box-sizing: border-box;
}
.bottom .row .strategys {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.bottom .row .strategys > div {
  width: 120px;
  height: 35px;
  line-height: 35px;
  /* background: #f2f2f2; */
  border-radius: 5px;
}
.bottom .row .strategys > .this_check {
  background: #fecacb;
  color: #ff4e53;
  background-image: url("../../../static/images/deal/icon_buy_select.svg");
  background-repeat: no-repeat;
  background-position: right bottom;
  background-size: 20px;
}
.other_data {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  padding: 0 10px;
}
.other_data > div {
  width: 50%;
  text-align: left;
  margin: 8px 0;
}
.other_data > div > span:first-child {
  color: gray;
  margin-right: 4px;
}
.other_data > div:nth-child(even) {
  text-align: left;
}
.btns,.buy-black-btn{
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 50px;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.btns>div:first-child{
  width: 90px;
  background: #3aafff;
  height: 100%;
  line-height: 50px;
}
.btns>div:last-child{
  /* width: 285px; */
  flex: auto;
  /* background: #ff787b; */
  background: #d9d9d9;
  height: 100%;
  line-height: 50px;
}
.buy-black-btn > div:nth-child(1){
  width: 90px;
  height: 100%;
  line-height: 50px;
  /* background-color: rgba(255, 255, 255, 0.1); */
  
}
.buy-black-btn > div:nth-child(2){
  flex: auto;
  height: 100%;
  line-height: 50px;
  background-color: rgba(255, 255, 255, 0.2);
}
.active_btn>div:nth-child(1){
  background: #3aafff;
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
  height: 49px;
  line-height: 49px;
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
  /* background: #3aafff; */
  /* background: #d9d9d9; */
  line-height:50px;
}
.sell_active{
  background: #3aafff;
}
.sell-active-btn{
  background: #2579d3;
}
</style>
