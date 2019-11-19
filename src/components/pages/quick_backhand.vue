<template>
    <!-- 快捷反手买入 -->
    <div id="quick-backhand">
        <CHeader title="快捷反手买入" backBol="true"></CHeader>
        <div class="content_wrap">
            <div class="top">
                <input type="text" alt="搜索" id="search"/>
                <div class="data_wrap">
                    <div class="left">
                        <p><span>代码</span><span>100001234</span></p>
                        <p><span>名称</span><span>购物橘红颗粒时代峻</span></p>
                    </div>
                    <div class="right">
                        <div>2.3243</div>
                        <div>
                            <p>+0.1231</p>
                            <p>+0.12%</p>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 买卖五档 -->
            <div class="buy_sell_five">
                <div class="title">
                <span>买盘5档</span>
                <span>卖盘5档</span>
                </div>
                <div class="content">
                <div class="content_left">
                    <div class="left_row">
                    <span>5</span><span>2.1231</span><span>1233</span>
                    </div>
                    <div class="left_row">
                    <span>4</span><span>2.1231</span><span>23</span>
                    </div>
                    <div class="left_row">
                    <span>3</span><span>2.1231</span><span>13</span>
                    </div>
                    <div class="left_row">
                    <span>2</span><span>2.1231</span><span>1243</span>
                    </div>
                    <div class="left_row">
                    <span>1</span><span>2.1231</span><span>1243</span>
                    </div>
                </div>
                <div class="content_line"></div>
                <div class="content_right">
                    <div class="left_row">
                    <span>123</span><span>2.1231</span><span>5</span>
                    </div>
                    <div class="left_row">
                    <span>123</span><span>2.1231</span><span>4</span>
                    </div>
                    <div class="left_row">
                    <span>123</span><span>2.1231</span><span>3</span>
                    </div>
                    <div class="left_row">
                    <span>123</span><span>2.1231</span><span>2</span>
                    </div>
                    <div class="left_row">
                    <span>123</span><span>2.1231</span><span>1</span>
                    </div>
                </div>
                </div>
            </div>
            <div class="bottom">
                <div class="row">
                    <label>价格类型</label>
                    <div class="prices">
                    <div v-for="(item,i) in price_type" :key="i" :class="{this_check:item.check}" @click="check_type(i)">{{item.name}}</div>
                    </div>
                </div>
                <div class="row">
                    <label>委托价格</label>
                    <div v-if="!price_type[1].check"><NumberBox :max="num_box1.max" :min="num_box1.min" :vals="num_box1.val" :step="num_box1.step" :inputs="num_box1.inputs" @getNum="getboxnum1"></NumberBox></div>
                    <div v-else class="ent_data">0.1234~0.1234 涨幅12.12%</div>
                </div>
                <div class="tips" v-if="price_type[1].check">自动追涨：成交价格会在区间内浮动，以实际成交价格为准。</div>
                <div class="row del_border">
                    <label>委托数量</label>
                    <div><NumberBox :max="num_box2.max" :min="num_box2.min" :vals="num_box2.val" :step="num_box2.step" :inputs="num_box2.inputs" @getNum="getboxnum2"></NumberBox></div>
                </div>
                <div class="row">
                    <label></label>
                    <div class="ent_numbers">
                    <div v-for="(item,i) in ent_num" :key="i" :data-value="item.value" @click="update_ent(i)">{{item.name}}</div>
                    </div>
                </div>
                <div class="row">
                    <label>当日策略</label>
                    <div class="strategys">
                        <div v-if="strategys[0].number==='0'" @click="set_stop()">设置止盈</div>
                        <div v-else @click="select_strategy(strategys[0].id)" :class="{this_check:strategys[0].check}">涨幅{{strategys[0].number}}止盈</div>
                        <div v-if="strategys[1].number==='0'" >设置止损</div>
                        <div v-else @click="select_strategy(strategys[1].id)" :class="{this_check:strategys[1].check}">跌幅{{strategys[1].number}}止损</div>
                    </div>
                </div>
                <div class="tips" v-if="price_type[1].check">合约当日有效，满足涨幅时自动卖出平仓</div>
                <div class="other_data">
                    <div><span>可用金额</span><span>12314545.00元</span></div>
                    <div><span>最大可买</span><span>100张</span></div>
                    <div><span>交易金额</span><span>200元</span></div>
                </div>
            </div>
        </div>
        <div class="buy_btn">提交买入委托</div>
    </div>
</template>

<script>
import CHeader from '@/components/common/IHeader.vue'
import NumberBox from '@/components/common/number.vue'
export default {
   
    data(){
      return {
        //价格类型
        price_type:[
          {name:"市价",value:0,check:true},
          {name:"自动追涨",value:1,check:false},
          {name:"限价",value:2,check:false},
        ],
        //第一个数字输入框
        num_box1:{
          min:1.9999,//最小值
          max:2.9999,//最大值
          val:2.8888,//初始值
          step:0.1,//步长
          inputs:true,//是否可以手动输入，true:不能手动输入，false:可手动输入
        },
        //第二个数字输入框
        num_box2:{
          min:10,//最小值
          max:20,//最大值
          val:11,//初始值
          step:2,//步长
          inputs:false,//是否可以手动输入，true:不能手动输入，false:可手动输入
        },
        //委托数量快捷按钮
        ent_num:[
          {name:"全仓",value:"0"},
          {name:"5",value:"5"},
          {name:"10",value:"10"},
          {name:"20",value:"20"},
          {name:"30",value:"30"}
        ],
        //设置止盈止损
        strategys:[
            //如果无涨跌幅则返回0，否则返回~%
            {id:1,number:"0",check:false},
            {id:2,number:"10%",check:false},
        ],
      }
    },
    methods:{
      check_type(par){//选择价格类型
        for(var i = 0;i < this.price_type.length;i++){
          this.price_type[i].check=false;
        }
        this.price_type[par].check=true;
      },
      getboxnum1(num){//获取子组件返回值
        this.num_box1.val = num;
        //跳选价格类型
        this.price_type[0].check=false;
        this.price_type[2].check=true;
      },
      getboxnum2(num){//获取子组件返回值
        this.num_box2.val = num;
      },
      update_ent(par){//修改委托数量输入框
        this.num_box2.val=this.ent_num[par].value;
      },
      select_strategy(par){//选择止盈止损
        var obj = this.strategys.find(item=>{
            return item.id == par;
        })
        obj.check = !obj.check;
      },
      set_stop(){//询问是否设置止盈止损
        this.$message({
            title: '设置止盈止损',
            message: '您还未设置止盈和止损策略',
            showConfirmButton:true,
            showCancelButton:true,
            confirmButtonText:"马上设置",
            confirmButtonHighlight:true,
            cancelButtonText:"返回交易"
        }).then( action =>{
            if(action=="confirm"){//如果确认
                //跳转设置todo...
            }
        })

      }
    },
    components: {
        CHeader,
        NumberBox
    },
}
</script>

<style scoped>
.content_wrap{
    margin-top: 44px;
    margin-bottom: 50px;
    font-size: 14px;
    border-top: 1px solid #e6e6e6;
}
.top{
    background: #fff;
    padding: 10px;
}
.top #search{
    width: 100%;
    border: none;
    background: #F2F2F2;
    height: 38px;
    border-radius: 5px;
    text-indent: 10px;
    margin-bottom: 10px;
    border-bottom: #e6e6e6;
}
.data_wrap{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 10px;
    border-top: 1px solid #e6e6e6;
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
    font-size: 26px;
    margin-right: 10px;
    font-family: font;
}
.data_wrap .right>div:last-child>p:first-child{
    margin-bottom: 10px;
}
.buy_sell_five{
  margin-top: 10px;
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
/*=========买卖五档end=========*/
.bottom{
  margin-top: 10px;
  background: #fff;
  padding: 10px 0;
}
.bottom .row{
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 35px;
  padding: 10px;
  border-bottom: 1px solid #eaeaea;
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
  justify-content: space-between;
  align-items: center;
}
.bottom .row .prices>div{
  width:80px;
  height: 35px;
  line-height: 35px;
  background: #F2F2F2;
  border-radius: 5px;
}
.bottom .row .prices>.this_check{
  background: #FECACB;
  color: #FF4E53;
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
  justify-content: space-between;
  align-items: center;
}
.bottom .row .ent_numbers>div{
  width:40px;
  height: 35px;
  line-height: 35px;
  border:1px solid #d9d9d9;
  border-radius: 5px;
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
    background: #FF777E;
    color: #fff;
    height: 50px;
    line-height: 50px;
}
</style>
