<template>
    <div class="one-cross-rgou">
        <CHeader title="一键跨式买入" backBol="true" :backUrl="back"></CHeader>
        <div class="content_wrap">
            <div class="top main-bg">
                <div class="row1 normal-border-color">
                    <label>跨式购买预算</label>
                    <div class="input_wrap assist-color3"><input type="text"  class="l_input main-text-color1" placeholder="0.00"  @blur="calculation_number" v-model="budget" /></div>
                </div>
                <div class="row2">
                    <div>跨式购买合约</div>
                    <div class="inputs">
                        <div class="input_wrap assist-color3"><input type="text" class="l_input rengou_input main-text-color1" placeholder="选择合约代码/名称" :value="gou_data.StockCode" @focus="change('gou')"/></div>
                        <div class="input_wrap assist-color3"><input type="text" class="l_input rengu_input main-text-color1" placeholder="选择合约代码/名称" :value="gu_data.StockCode" @focus="change('gu')"/></div>
                    </div>
                </div>
            </div>
            <div class="middle normal-margin-top main-bg">
                <div class="title">
                    <div class="t_left">
                        <div>{{gou_data.StockName?gou_data.StockName:'--'}}</div>
                        <div :class="gou_data.PriceRise>0 ? 'rise-color': gou_data.PriceRise < 0 ? 'drop-color' : ''">
                            <span class="font32 number-font">{{gou_data.PriceCurrent?Number(gou_data.PriceCurrent).toFixed(4):gou_data.PriceOpen&&gou_data.PriceOpen!=0?'0.0000':'-.----'}}</span>
                            <span class="number-font">{{gou_data.PriceRise&&gou_data.PriceOpen?Number(gou_data.PriceRise).toFixed(4):gou_data.PriceOpen&&gou_data.PriceOpen!=0?'0.0000':'-.----'}}</span>
                            <span class="number-font">{{gou_data.PriceRisePercent&&gou_data.PriceOpen?Number(gou_data.PriceRisePercent).toFixed(2)+'%':gou_data.PriceOpen&&gou_data.PriceOpen!=0?'0.00%':'--'}}</span>
                        </div>
                    </div>
                    <div class="t_center font20" @click="is_open=!is_open" v-html="is_open?'收起':'展开'">收起</div>
                    <div class="t_right" >
                        <div>{{gu_data.StockName?gu_data.StockName:'--'}}</div>
                        <div :class="gu_data.PriceRise>0 ? 'rise-color': gu_data.PriceRise < 0 ? 'drop-color' : ''">
                            <span class="number-font">{{gu_data.PriceRisePercent&&gu_data.PriceOpen?Number(gu_data.PriceRisePercent).toFixed(2)+'%':gou_data.PriceOpen&&gou_data.PriceOpen!=0?'0.00%':'-.--'}}</span>
                            <span class="number-font">{{gu_data.PriceRise&&gu_data.PriceOpen?Number(gu_data.PriceRise).toFixed(4):gou_data.PriceOpen&&gou_data.PriceOpen!=0?'0.0000':'-.----'}}</span>
                            <span class="font32 number-font">{{gu_data.PriceCurrent?Number(gu_data.PriceCurrent).toFixed(4):gou_data.PriceOpen&&gou_data.PriceOpen!=0?'0.0000':'-.----'}}</span>
                        </div>
                    </div>
                </div>
                <div class="content" v-if="is_open">
                    <div class="five_panel sell_panel normal-border-color">
                        <div class="f_left">
                            <div>
                                <span class="main-text-color1">{{gou_data.SaleFiveNum&&gou_data.SaleFiveAmount?gou_data.SaleFiveNum:'- -'}}</span>
                                <span>{{gou_data.SaleFiveAmount?gou_data.SaleFiveAmount.toFixed(4):'-.----'}}</span>
                            </div>
                            <div>
                                <span class="main-text-color1">{{gou_data.SaleFourNum&&gou_data.SaleFourAmount?gou_data.SaleFourNum:'- -'}}</span>
                                <span>{{gou_data.SaleFourAmount?gou_data.SaleFourAmount.toFixed(4):'-.----'}}</span>
                            </div>
                            <div>
                                <span class="main-text-color1">{{gou_data.SaleThreeNum&&gou_data.SaleThreeAmount?gou_data.SaleThreeNum:'- -'}}</span>
                                <span>{{gou_data.SaleThreeAmount?gou_data.SaleThreeAmount.toFixed(4):'-.----'}}</span>
                            </div>
                            <div>
                                <span class="main-text-color1">{{gou_data.SaleTwoNum&&gou_data.SaleTwoAmount?gou_data.SaleTwoNum:'- -'}}</span>
                                <span>{{gou_data.SaleTwoAmount?gou_data.SaleTwoAmount.toFixed(4):'-.----'}}</span>
                            </div>
                            <div>
                                <span class="main-text-color1">{{gou_data.SaleOneNum&&gou_data.SaleOneAmount?gou_data.SaleOneNum:'- -'}}</span>
                                <span>{{gou_data.SaleOneAmount?gou_data.SaleOneAmount.toFixed(4):'-.----'}}</span>
                            </div>
                        </div>
                        <div class="f_center five_bg1 ">
                            <div v-for="(item,i) in 5" :key="i">卖{{5-i}}</div>
                        </div>
                        <div class="f_right">
                            <div>
                                <span>{{gu_data.SaleFiveAmount?gu_data.SaleFiveAmount.toFixed(4):'-.-----'}}</span>
                                <span class="main-text-color1">{{gu_data.SaleFiveNum&&gou_data.SaleFiveAmount?gu_data.SaleFiveNum:'- -' }}</span>
                            </div>
                            <div>
                                <span>{{gu_data.SaleFourAmount?gu_data.SaleFourAmount.toFixed(4):'-.-----'}}</span>
                                <span class="main-text-color1">{{gu_data.SaleFourNum&&gu_data.SaleFourAmount?gu_data.SaleFourNum:'- -'}}</span>
                            </div>
                            <div>
                                <span>{{gu_data.SaleThreeAmount?gu_data.SaleThreeAmount.toFixed(4):'-.----'}}</span>
                                <span class="main-text-color1">{{gu_data.SaleThreeNum&&gu_data.SaleThreeAmount?gu_data.SaleThreeNum:'- -'}}</span>
                            </div>
                            <div>
                                <span>{{gu_data.SaleTwoAmount?gu_data.SaleTwoAmount.toFixed(4):'-.----'}}</span>
                                <span class="main-text-color1">{{gu_data.SaleTwoNum&&gu_data.SaleTwoAmount?gu_data.SaleTwoNum:'- -'}}</span>
                            </div>
                            <div>
                                <span>{{gu_data.SaleOneAmount?gu_data.SaleOneAmount.toFixed(4):'-.----'}}</span>
                                <span class="main-text-color1">{{gu_data.SaleOneNum&&gu_data.SaleOneAmount?gu_data.SaleOneNum:'- -'}}</span>
                            </div>
                        </div>
                    </div>
                    <div class="five_panel buy_panel normal-border-color">
                        <div class="f_left">
                            <div>
                                <span class="main-text-color1">{{gou_data.BuyOneNum&&gou_data.BuyOneAmount?gou_data.BuyOneNum:'- -'}}</span>
                                <span>{{gou_data.BuyOneAmount?gou_data.BuyOneAmount.toFixed(4):'-.----'}}</span>
                            </div>
                            <div>
                                <span class="main-text-color1">{{gou_data.BuyTwoNum&&gou_data.BuyTwoAmount?gou_data.BuyTwoNum:'- -'}}</span>
                                <span>{{gou_data.BuyTwoAmount?gou_data.BuyTwoAmount.toFixed(4):'-.----'}}</span>
                            </div>
                            <div>
                                <span class="main-text-color1">{{gou_data.BuyThreeNum&&gou_data.BuyThreeAmount?gou_data.BuyThreeNum:'- -'}}</span>
                                <span>{{gou_data.BuyThreeAmount?gou_data.BuyThreeAmount.toFixed(4):'-.----'}}</span>
                            </div>
                            <div>
                                <span class="main-text-color1">{{gou_data.BuyFourNum&&gou_data.BuyFourAmount?gou_data.BuyFourNum:'- -'}}</span>
                                <span>{{gou_data.BuyFourAmount?gou_data.BuyFourAmount.toFixed(4):'-.----'}}</span>
                            </div>
                            <div>
                                <span class="main-text-color1">{{gou_data.BuyFiveNum&&gou_data.BuyFiveAmount?gou_data.BuyFiveNum:'- -'}}</span>
                                <span>{{gou_data.BuyFiveAmount?gou_data.BuyFiveAmount.toFixed(4):'-.----'}}</span>
                            </div>
                        </div>
                        <div class="f_center five_bg2 ">
                           <div v-for="(item,i) in 5" :key="i">买{{1+i}}</div>
                        </div>
                        <div class="f_right">
                            <div>
                                <span>{{gu_data.BuyOneAmount?gu_data.BuyOneAmount.toFixed(4):'-.-----'}}</span>
                                <span class="main-text-color1">{{gu_data.BuyOneNum&&gou_data.BuyOneAmount?gu_data.BuyOneNum:'- -' }}</span>
                            </div>
                            <div>
                                <span>{{gu_data.BuyTwoAmount?gu_data.BuyTwoAmount.toFixed(4):'-.-----'}}</span>
                                <span class="main-text-color1">{{gu_data.BuyTwoNum&&gou_data.BuyTwoAmount?gu_data.BuyTwoNum:'- -' }}</span>
                            </div>
                            <div>
                                <span>{{gu_data.BuyThreeAmount?gu_data.BuyThreeAmount.toFixed(4):'-.-----'}}</span>
                                <span class="main-text-color1">{{gu_data.BuyThreeNum&&gou_data.BuyThreeAmount?gu_data.BuyThreeNum:'- -' }}</span>
                            </div>
                            <div>
                                <span>{{gu_data.BuyFourAmount?gu_data.BuyFourAmount.toFixed(4):'-.-----'}}</span>
                                <span class="main-text-color1">{{gu_data.BuyFourNum&&gou_data.BuyFourAmount?gu_data.BuyFourNum:'- -' }}</span>
                            </div>
                            <div>
                                <span>{{gu_data.BuyFiveAmount?gu_data.BuyFiveAmount.toFixed(4):'-.-----'}}</span>
                                <span class="main-text-color1">{{gu_data.BuyFiveNum&&gou_data.BuyFiveAmount?gu_data.BuyFiveNum:'- -' }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bottom normal-margin-top main-bg">
                <div class="ks_price normal-border-color">
                    <div>跨式委托价格</div>
                    <div class="prices">
                        <NumberBox :max="rgou_price.max" :min="rgou_price.min" :vals="rgou_price.val" :step="rgou_price.step" :inputs="rgou_price.inputs" :dec="rgou_price.dec"  @getNum="get_rgou_price"></NumberBox>
                        <NumberBox :max="rgu_price.max" :min="rgu_price.min" :vals="rgu_price.val" :step="rgu_price.step" :inputs="rgu_price.inputs" :dec="rgu_price.dec"  @getNum="get_rgu_price"></NumberBox>
                    </div>
                </div>
                <div class="ks_number normal-border-color">
                    <div>跨式委托数量</div>
                    <div class="numbers">
                        <NumberBox :max="rgou_number.max" :min="rgou_number.min" :vals="rgou_number.val" :step="rgou_number.step" :inputs="rgou_number.inputs"  :dec="rgou_number.dec" @getNum="get_rgou_number"></NumberBox>
                        <NumberBox :max="rgu_number.max" :min="rgu_number.min" :vals="rgu_number.val" :step="rgu_number.step" :inputs="rgu_number.inputs"  :dec="rgu_number.dec" @getNum="get_rgu_number"></NumberBox>
                    </div>
                </div>
                <div class="moneys">
                    <div><span>交易金额</span><span>{{gou_tranprice}}元</span></div>
                    <div><span>交易金额</span><span>{{gu_tranprice}}元</span></div>
                </div>
            </div>
            <div class="bottom_other normal-margin-top main-bg">
                <div class="other_money">
                    <div><span>可用余额</span><span>{{surplus_price}}元</span></div>
                    <div><span>交易总金额</span><span>{{Number(tranprice).toFixed(2)}}元</span></div>
                </div>
            </div>
        </div>
        <div :class="{'is_could':couldClick,'submit_btn':true,'font32':true}"  @click="sub">提交买入委托</div>
    </div>
</template>

<script>
import CHeader from '@/components/common/IHeader.vue'
import NumberBox from '@/components/common/number.vue'
import api from '../../api/index';
export default {
    data(){
        return{
            is_open:true,//是否展开五档
            obj:'',
            budget:"",//预算金额
            surplus_price:0,//可用余额
            hand_price:0,//买入每张手续费
            transaction_acount:0,//交易总金额
            gou_data:{},//购合约详情
            gu_data:{},
            rgou_price:{//认购价格文本框
                max:10000,
                min:0,
                val:0,
                step:0.0001,
                inputs:false,
                dec:4
            },
            rgu_price:{//认沽价格文本框
                max:10000,
                min:0,
                val:0,
                step:0.0001,
                inputs:false,
                dec:4
            },
            rgou_number:{//认购数量文本框
                max:10000,
                min:0,
                val:0,
                step:1,
                inputs:false,
                dec:0
            },
            rgu_number:{//认沽数量文本框
                max:10000,
                min:0,
                val:0,
                step:1,
                inputs:false,
                dec:0
            },
            timer:'',
            couldClick:false
        }
    },
    created(){
        this.init();
        this.timer=setInterval(() => {
            this.get_data();
        }, 2000);
    },
    destroyed(){
        window.clearInterval(this.timer);
    },
    computed:{
        //指定返回的路径
        back(){
            var headers = this.$route.query.code;
            if(headers){//如果是买入进入本页面
                return '/buy?code='+headers;
            }else{//如果是买入卖出进入本页面
                var backurl =JSON.parse(sessionStorage.getItem("state"));
                return '/buy_details?type=buy&back=market-details&contract_name='+backurl.contract_name+'&denum='+backurl.denum;
            }
        },
        //实时购合约，卖一价格
        gou_price(){
            return Number(this.gou_data.SaleOneAmount).toFixed(4);
        },
        //实时沽合约，卖一价格
        gu_price(){
            return Number(this.gu_data.SaleOneAmount).toFixed(4);
        },
        //认购交易金额
        gou_tranprice(){
            if(this.gou_data.Dm){
                var dj = this.mul(this.rgou_price.val,this.gou_data.Dm);
                return Number(this.mul(this.add(this.hand_price,dj),this.rgou_number.val)).toFixed(2);
            }else{
                return 0.00
            }
            
        },
        //认沽交易金额
        gu_tranprice(){
            if(this.gu_data.Dm){
                var dj = this.mul(this.rgu_price.val,this.gu_data.Dm);
                return Number(this.mul(this.add(this.hand_price,dj),this.rgu_number.val)).toFixed(2);
            }else{
                return 0.00
            }
        },
        //总金额
        tranprice(){
            var end = this.add(this.gou_tranprice,this.gu_tranprice);
            if(end>0){
                this.couldClick=true;
            }else{
                this.couldClick=false;
            }
            return end;
        }
    },
    methods:{
        //获取传进合约类型，合约数据
        init(){
            this.obj =JSON.parse(sessionStorage.getItem("cross"));
            //获取认购合约
            this.$http.post(api.contractDetail,this.obj.cord_gou).then(res=>{
                if(res.data.Status==1){
                    var result = res.data.Data;
                    this.gou_data=result;
                    //获取余额
                    this.$http.post(api.transactionInit,this.obj.cord_gou).then(res=>{
                        this.surplus_price=Number(res.data.Data.yue).toFixed(2);//余额
                        this.hand_price=Number(res.data.Data.buate);//买入手续费
                    })
                    //第一次加载认购价格
                    this.rgou_price.val=Number(this.gou_data.SaleOneAmount).toFixed(4);

                }else{
                    //查询失败
                    this.$toast({
                        position: 'bottom',
                        message: res.data.Msg,
                        duration: 1000
                    })
                }
            })
            //获取认沽合约
            this.$http.post(api.contractDetail,this.obj.cord_gu).then(res=>{
                if(res.data.Status==1){
                    var result = res.data.Data;
                    this.gu_data=result;
                    //第一次加载认沽价格
                    this.rgu_price.val=Number(this.gu_data.SaleOneAmount).toFixed(4);
                }else{
                    //查询失败
                    this.$toast({
                        position: 'bottom',
                        message: res.data.Msg,
                        duration: 1000
                    })
                }
            })
        },
        get_data(){
            this.obj =JSON.parse(sessionStorage.getItem("cross"));
            //获取认购合约
            this.$http.post(api.contractDetail,this.obj.cord_gou).then(res=>{
                if(res.data.Status==1){
                    var result = res.data.Data;
                    this.gou_data=result;
                }else{
                    //查询失败
                    this.$toast({
                        position: 'bottom',
                        message: res.data.Msg,
                        duration: 1000
                    })
                }
            })
            //获取认沽合约
            this.$http.post(api.contractDetail,this.obj.cord_gu).then(res=>{
                if(res.data.Status==1){
                    var result = res.data.Data;
                    this.gu_data=result;
                }else{
                    //查询失败
                    this.$toast({
                        position: 'bottom',
                        message: res.data.Msg,
                        duration: 1000
                    })
                }
            })
        },
        //搜索合约
        change(cord){
            this.obj.change_type=cord;
            sessionStorage.setItem("cross",JSON.stringify(this.obj))
            this.$router.push('/cross_search');
        },
        //认购价格文本框
        get_rgou_price(num){
            this.rgou_price.val = num;
        },
        //认沽价格文本框
        get_rgu_price(num){
            this.rgu_price.val = num;
        },
        //认购数量价格文本框
        get_rgou_number(num){
            this.rgou_number.val = num;
        },
        //认沽数量价格文本框
        get_rgu_number(num){
            this.rgu_number.val = num;
        },
        //计算数量:已知价格、合约单位、交易金额，得出数量
        calculation_number(){
            //每一条合约的最大交易金额
            var every = this.div(this.budget,2).toFixed(2);
            //认购合约的数量
            this.rgou_price.val=this.gou_price;//实时市价
            var goudj = this.mul(this.rgou_price.val,this.gou_data.Dm);//认购合约单价：价格×合约单位
            this.rgou_number.val = Math.floor(this.div(every,this.add(this.hand_price,goudj)));//数量：交易余额÷（单张服务费+单价）=====>向下取整
            //认沽合约的数量
            this.rgu_price.val=this.gu_price;//实时市价
            var gudj = this.mul(this.rgu_price.val,this.gu_data.Dm);//认购合约单价：价格×合约单位
            this.rgu_number.val = Math.floor(this.div(every,this.add(this.hand_price,gudj)));//数量：交易余额÷（单张服务费+单价）=====>向下取整
        },
        //提交委托
        sub(){
            //需解锁按钮
            if(!this.couldClick){
                return
            }
            //要购买的合约委托价格不能为0
            if((this.rgou_number.val>0&&this.rgou_price.val<=0) || (this.rgu_number.val>0&&this.rgu_price.val<=0)){
                this.$toast({
                    message: "请填写正确的委托价格",
                    position: 'bottom',
                    duration: 1000
                });
                return;
            }
            //购买合约数量不能为0
            if((this.rgou_number.val+this.rgu_number.val)<=0){
                this.$toast({
                    message: "请填写正确的委托数量",
                    position: 'bottom',
                    duration: 1000
                });
                return;
            }
            //交易余额大于可用余额
            if(this.surplus_price<this.tranprice){
                this.$toast({
                    message: "余额不足，请充值",
                    position: 'bottom',
                    duration: 1000
                });
                return;
            }
            var obj = {
                Sc:this.gou_data.StockCode,
                ScName:this.gou_data.StockName,
                Dp:this.rgou_price.val,
                Dn:this.rgou_number.val,
                money:this.gou_tranprice,

                Sct:this.gu_data.StockCode,
                SctName:this.gu_data.StockName,
                Dpt:this.rgu_price.val,
                Dnt:this.rgu_number.val,
                moneyt:this.gu_tranprice,
            }
            sessionStorage.setItem("cross_buy",JSON.stringify(obj));
            this.$router.push("/one_cross_submit");
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
    filters:{
        toRetain(val,len){
            return Number(val).toFixed(len);
        },
    },
}
</script>

<style scoped>
.sell_panel{
   color: #51D691;
}
.buy_panel{
    color: #FF787B;
}
.content_wrap{
    margin-top: 44px;
    margin-bottom: 50px;
    /* border-top: 1px solid #e6e6e6; */
    font-size: 14px;
}
.l_input{
   border: none;
   background: none;
   height: 35px;
   width: 100%;
}
.font32{
    margin-bottom: -2px;
}
.five_bg1>div{
    background: #3AAAFF;
}
.five_bg2>div{
    background: #FF8487;
}
.top{
    /* background: #fff; */
    padding:0 10px;
}
.top .row1{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    /* border-bottom: 1px solid #e6e6e6; */
    border-bottom-width: 1px;
    border-bottom-style: solid;
}
.top .row1>label{
    width: 50%;
    margin-right: 10px;
    text-align: left;
    padding-right: 20px;
}
.top .row1>.input_wrap{
    margin-left: 10px;
}
.input_wrap{
    width: 50%;
    /* background: #F2F2F2; */
    padding: 0 10px;
    border-radius: 5px;
}
.top .row2{
    padding: 10px 0;
}
.row2>div:first-child{
    text-align: left;
    margin-bottom: 10px;
}
.top .row2 .inputs{
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.top .row2 .inputs>div:first-child{
    margin-right: 10px;
}
.top .row2 .inputs>div:last-child{
    margin-left: 10px;
}
.middle{
    /* background: #fff; */
    /* margin-top: 10px; */
    padding: 10px;
}
.middle .title{
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}
.middle .title .t_center{
    min-width: 40px;
    background: #3AAAFF;
    color: #fff;
    border-radius: 2px;
    padding: 2px 0;
}
.middle .title .t_left,.middle .title .t_right{
    width: 50%;
    overflow: hidden;
}
.middle .title .t_left>div:first-child,.middle .title .t_right>div:first-child{
    font-weight: bold;
    margin-bottom: 20px;
    font-size: 15px;
}
.middle .title .t_left>div:first-child{
    text-align: left;
}
.middle .title .t_right>div:first-child{
    text-align: right;
}
.middle .title .t_left>div:last-child,.middle .title .t_right>div:last-child{
    width: 90%;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    font-size: 12px;
}
/* .middle .title .t_left>div:last-child > span{
    margin-right: 10px;
    float: left;
}
.middle .title .t_right>div:last-child > span{
    margin-left: 10px;
    float: left;
    text-align: right;
} */
.middle .title .t_right>div:last-child {
    float: right;
}

.middle .content .five_panel{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 10px;
    margin-top: 10px;
    /* border-top: 1px solid #e6e6e6; */
    border-top-width: 1px;
    border-top-style: solid;
}
.middle .content .five_panel .f_left,.middle .content .five_panel .f_right{
    width: 50%
}
.middle .content .five_panel .f_center{
    min-width: 35px;
    margin: 0 10px;
}
.middle .content .five_panel .f_left>div,
.middle .content .five_panel .f_right>div{
    height: 20px;
    line-height: 20px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
}
.middle .content .five_panel .f_center>div{
    height: 20px;
    line-height: 22px;
    text-align: center;
    color: #fff;
    margin-bottom: 10px;
    border-radius: 2px
}
.middle .content .five_panel .f_left>div span{
    text-align: left;
    width: 50%;
}
.middle .content .five_panel .f_right>div span{
    text-align: right;
    width: 50%;
}
.middle .content .five_panel .f_left>div span:first-child,
.middle .content .five_panel .f_right>div span:last-child{
    /* color: #000; */
}
.bottom{
    /* margin-top: 10px; */
    /* background: #fff; */
    padding: 10px;
}
.bottom .ks_price,.bottom .ks_number{
    padding: 10px 0;
    /* border-bottom: 1px solid #e6e6e6; */
    border-bottom-width: 1px;
    border-bottom-style: solid;
}
.bottom .ks_price>div:first-child,
.bottom .ks_number>div:first-child{
    text-align: left;
    margin-bottom: 10px;
}
.bottom .ks_price .prices,
.bottom .ks_number .numbers{
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.bottom .ks_price .prices>div:first-child,
.bottom .ks_number .numbers>div:first-child{
    margin-right: 10px;
}
.bottom .ks_price .prices>div:last-child,
.bottom .ks_number .numbers>div:last-child{
    margin-left: 10px;
}
.bottom .moneys{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 10px;
}
.bottom .moneys>div{
    width: 50%;
    text-align: left;
}
.bottom .moneys>div:first-child{
    margin-right: 10px;
}
.bottom .moneys>div:last-child{
    margin-left: 10px;
}
.bottom .moneys>div>span:first-child{
    color: #999;
    margin-right: 10px;
}
.bottom_other{
    padding: 10px;
    /* margin-top: 10px; */
    /* background: #fff; */
    padding-bottom: 20px;
    padding-top: 0;
    margin-top: 0;
}
.bottom_other .moneys{
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.bottom_other .moneys>div{
    width: 50%;
    text-align: left;
}
.bottom_other .moneys>div:first-child{
    margin-right: 10px;
}
.bottom_other .moneys>div:last-child{
    margin-left: 10px;
}
.bottom_other .moneys>div>span:first-child{
    color: #999;
    margin-right: 10px;
}
.submit_btn{
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50px;
    line-height: 50px;
    color: white;
    /* background: #ff787b; */
    background: #d0d0d0;
    /* box-shadow: 0 0 8px #dadada; */
}
.is_could{
    background: #ff787b;
}
.other_money{
    text-align: left;
}
.other_money>div:first-child{
    margin-bottom: 10px
}
.other_money>div>span:first-child{
    display: inline-block;
    color: #999;
    width: 85px;
}
</style>

