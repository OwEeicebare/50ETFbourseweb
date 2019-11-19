<template>
    <div id="app">
        <div  id="myChart" ref="myChart"></div>
    </div>
</template>
<script>
import Api from '@/api'
export default {
    data(){
        return{
            chart:'',//图表容器
            contract_code:this.contract,//合约代码
            list:[],//总数据
            x_data:[],//x轴值
            y_data:[],//左y轴数据
            price_data:[],//现价
            vol_data:[],//成交量
            zdf_data:[],//涨跌幅
            yestdatyclose:this.PriceYesterdayClose,//昨收，中间价
            min:0,//最大
            max:0,//最小
            interval:0,//分割值
            timer:'',
            style:{
                font_size:12,
                font_color:'#ccc',
                legend_color:JSON.parse(localStorage.getItem("theme")).theme==0?'#000':'#fff',
                border_color:JSON.parse(localStorage.getItem("theme")).theme==0?'#f0f0f0':'rgba(255,255,255,0.2)',
                z_color:'#ff464b',
                d_color:'#03c461'
            }
        }
    },
    props:["contract","PriceYesterdayClose"],
    created(){
        this.set_x();
        this.set_y();
        //第一次数据请求
        this.get_first();
        this.timer=setInterval(() => {
            this.set_chart()
        }, 3000);
    },
    mounted(){
        //没数据时先画表格
        this.draw();
    },
    destroyed(){
        window.clearInterval(this.timer); 
    },
    methods: {
        //设置固定x轴
        set_x(){
            var now_date = new Date().getFullYear()+"/"+(new Date().getMonth()+1)+"/"+new Date().getDate();//获取年/月/日
            var start_time = new Date(now_date+" 9:30");//上午开始时间
            var end_time = new Date(now_date+" 11:30");//上午结束时间
            var start_time2 = new Date(now_date+" 13:00");//下午开始时间
            var end_time2 = new Date(now_date+" 15:00");//下午结束时间
            var result=[];
            while(Date.parse(end_time) - Date.parse(start_time)>=0){//如果结束时间大于开始时间
                // result.push( start_time.getHours().toString().padStart(2,"0")+":"+start_time.getMinutes().toString().padStart(2,"0") );
                var hour = start_time.getHours().toString();
                var mint = start_time.getMinutes().toString();
                if(hour.length!=2){
                    hour='0'+hour;
                }
                if(mint.length!=2){
                    mint='0'+mint;
                }
                result.push(hour+":"+mint);
                start_time=new Date(start_time.valueOf() + 60 * 1000);
            }
            while(Date.parse(end_time2) - Date.parse(start_time2)>=0){//如果结束时间大于开始时间
                // result.push( start_time2.getHours().toString().padStart(2,"0")+":"+start_time2.getMinutes().toString().padStart(2,"0") );
                var hour = start_time2.getHours().toString();
                var mint = start_time2.getMinutes().toString();
                if(hour.length!=2){
                    hour='0'+hour;
                }
                if(mint.length!=2){
                    mint='0'+mint;
                }
                result.push(hour+":"+mint);
                start_time2=new Date(start_time2.valueOf() + 60 * 1000);
            }
            this.x_data=result;
        },
        //设置y轴值
        set_y(){
            //如果没有数据，则取昨天收盘价向两边延长，否则取最大值和最小值计算中间值
            if(this.price_data.length==0){
                //此时data里的变量还未被赋值，这里借助第三方变量
                this.interval = this.div(this.PriceYesterdayClose,4);
                this.min = this.mul(this.interval,2);
                this.max = this.mul(this.interval,6);
            }else{
                //获取y轴数据
                for(var i = 0;i < this.price_data.length;i++){
                    this.y_data.push(this.price_data[i][1]);
                }
                //取最大和最小值
                var max = Math.max.apply(null,this.y_data);
                var min = Math.min.apply(null,this.y_data);
                
                //根据情况修改最大值，最小值，分割值
                if(max>=this.PriceYesterdayClose && min>=this.PriceYesterdayClose){//如果两个值都比昨天价格大
                    var chazhi = 0;
                    if(max==this.PriceYesterdayClose && min==this.PriceYesterdayClose){//如果传进的值等于昨天收盘价
                        chazhi = max;
                        this.interval = this.div(chazhi,2);
                        this.min = this.sub(this.PriceYesterdayClose,chazhi);
                        this.max = this.add(this.PriceYesterdayClose,chazhi);
                    }else{
                        chazhi = this.sub(max,this.PriceYesterdayClose);
                        this.interval = this.div(chazhi,2);
                        this.min = this.sub(this.PriceYesterdayClose,chazhi);
                        this.max = max;
                    }
                    
                }else if(max<this.PriceYesterdayClose && min<this.PriceYesterdayClose){//如果两个值都比昨天价格小
                    var chazhi = this.sub(this.PriceYesterdayClose,min);
                    this.min = min;
                    this.interval = this.div(chazhi,2);
                    this.max = this.add(this.PriceYesterdayClose,chazhi);
                }else{//一个大一个小
                    var j_x = this.sub(this.PriceYesterdayClose,min);//昨收和最小值的差值
                    var m_j = this.sub(max,this.PriceYesterdayClose);//最大值和昨收的差值
                    if(j_x>=m_j){//如果最小值和昨收差距较大，则修改最大值
                        this.min = min;
                        this.max = this.add(this.PriceYesterdayClose,j_x);
                        this.interval = this.div(j_x,2);
                    }else{//否则修改最小值
                        this.max = max;
                        this.min = this.sub(this.PriceYesterdayClose,m_j);
                        this.interval = this.div(m_j,2);
                    }
                }
            }
        },
        //设置分时图头
        set_legend(){
            if(this.list.length==0){
                return;
            }
            //获取最新数据的最后一条数据
            var news = this.list[this.list.length-1];
            this.chart.setOption({
                legend:{
                    formatter: function (name) {
                        switch(name){
                            case "时间":return "时间："+news.time.substring(0,2)+":"+news.time.substring(2,4);break;
                            case "涨跌幅":return "幅："+news.autn;break;
                            case "现价":return "价："+news.price.toFixed(4);break;
                            case "成交量":return "量："+news.volume;break;
                        }
                    }
                }
            })
        },
        //分时图初始化
        draw () {
            // 实例化echarts对象
            this.chart = this.$echarts.init(this.$refs.myChart);
            // 绘制条形图
            var option = ({
                animation: false,
                grid: [{
                    show:true,
                    borderColor: this.style.border_color,
                    top:50,
                    left:0,
                    right:0,
                    height:150,
                },{
                    show:true,
                    borderColor: this.style.border_color,
                    top:230,
                    left:0,
                    bottom:20,
                    right:0,
                }],
                legend: {
                    show:true,
                    top: 10,
                    left:0,
                    itemWidth:0,//图标图片的宽度
                    itemHeight:0,//图片图例的高度
                    selectedMode:false,//禁止隐藏
                    itemGap:10,
                    textStyle: {
                        color:this.style.legend_color,
                    },
                    formatter: function (name) {
                        switch(name){
                            case "时间":return "时间：--";break;
                            case "涨跌幅":return "幅：--";break;
                            case "现价":return "价：--";break;
                            case "成交量":return "量：--";break;
                        }
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross'
                    },
                    showContent:true,
                    formatter:(value)=>{
                        //获取索引
                        var index = value[0].dataIndex;
                        this.chart.setOption({
                            legend: {
                                formatter:(name) =>{
                                    switch(name){
                                        case "时间":return "时间："+this.price_data[index][0];break;
                                        case "涨跌幅":return "幅："+this.zdf_data[index];break;
                                        case "现价":return "价："+this.price_data[index][1];break;
                                        case "成交量":return "量："+this.vol_data[index][1];break;
                                    }
                                }
                            },
                        })

                    }
                },
                axisPointer: {
                    link: {xAxisIndex: 'all'},
                    label: {
                        backgroundColor: '#777'
                    }
                },
                // X轴
                xAxis: [{
                    gridIndex:0,
                    type:'category',
                    axisLine:{
                        show:false,
                    },
                    axisTick: {
                        show:false,
                    },  
                    axisLabel:{
                        showMaxLabel:true,
                        fontSize:this.style.font_size,
                        color:this.style.font_color,
                        interval:120,
                        formatter: function (value, index) {
                            if(value=="09:30"){
                                return "         09:30"
                            }
                            if(value=="13:00"){
                                return "11:30/13:00"
                            }
                            if(value=="15:00"){  
                                return "15:00        "
                            }
                            return value;
                        }
                    },
                    splitLine:{
                        show: true,
                        interval:80,
                        lineStyle:{
                            color:this.style.border_color,
                        }
                    },
                    data:this.x_data
                },{
                    gridIndex:1,
                    type:'category',
                    axisLine:{
                        show:false,
                    },
                    axisTick: {
                        show:false,
                    },  
                    axisLabel:{
                        show:false
                    },
                    splitLine:{
                        show: true,
                        interval:80,
                        lineStyle:{
                            color:this.style.border_color,
                        }
                    },
                     axisPointer:{
                        label:{
                            show:false
                        }
                    },
                    data:this.x_data
                }],
                // Y轴
                yAxis: [{
                    gridIndex:0,
                    axisLine:{
                        show:false,
                    },
                    axisTick: {
                        show:false,
                    }, 
                    splitLine:{
                        lineStyle:{
                            color:this.style.border_color,
                        }
                    },
                    max:this.max,
                    min:this.min,
                    interval:this.interval,
                    axisLabel:{
                        inside:true,
                        verticalAlign:'bottom',
                        fontSize:this.style.font_size,
                        formatter:function(value){
                            return value.toFixed(4);
                        },
                        color:(value, index)=>{
                            var col=''
                            if(this.sub(this.yestdatyclose,value)<0){
                                col ='#ff464b'
                            }else if(this.sub(this.yestdatyclose,value)>0){
                                col = '#03c461'
                            }else{
                                col = '#ccc'
                            }
                            return col;
                        }
                    },
                    axisPointer: {
                        label: {
                            precision:4
                        }
                    }
                },{
                    gridIndex:0,
                    position:'right',
                    axisLine:{
                        show:false,
                    },
                    axisTick: {
                        show:false,
                    }, 
                     splitLine:{
                        lineStyle:{
                            color:this.style.border_color,
                        }
                    },
                    max:this.max,
                    min:this.min,
                    interval:this.interval,
                    axisLabel:{
                        inside:true,
                        verticalAlign:'bottom',
                        fontSize:this.style.font_size,
                        formatter:(value)=>{
                            //转换成振幅
                            var val =this.div(this.sub(value,this.yestdatyclose),this.yestdatyclose);
                            val =  (val*100).toFixed(2)+"%";
                            return val;
                        },
                        color:(value, index)=>{
                            var col=''
                            if( this.sub(value,this.yestdatyclose)<0){
                                col = '#03c461'
                            }else if(this.sub(value,this.yestdatyclose)>0){
                                col = '#ff464b'
                            }else{
                                col = '#ccc'
                            }
                            return col;
                        }
                    },
                    axisPointer: {
                        label:{
                            formatter:(params)=>{
                                var val = params.value;
                                val = this.sub(val,this.yestdatyclose);
                                val = this.div(val,this.yestdatyclose);
                                val = this.mul(val,100);
                                val = val.toFixed(2)+"%"
                                return val;
                            }
                        }
                       
                    }
                },{
                    gridIndex:1,
                    axisLine:{
                        show:false,
                    },
                    axisTick: {
                        show:false,
                    }, 
                     splitLine:{
                        lineStyle:{
                            color:this.style.border_color,
                        }
                    },
                    interval:1000000,
                    axisLabel:{
                        inside:true,
                        verticalAlign:'top',
                        showMinLabel:false,
                        fontSize:this.style.font_size,
                        color:this.style.font_color,
                        
                    }
                }],
                // 数据
                series: [{
                    xAxisIndex:0,
                    yAxisIndex:0,
                    name: '时间',
                    type:'bar',
                    animation:false,
                    data:[],
                },{
                    xAxisIndex:0,
                    yAxisIndex:0,
                    name: '涨跌幅',
                    type:'bar',
                    animation:false,
                    data: this.zdf_data,
                },{
                    xAxisIndex:0,
                    yAxisIndex:0,
                    name: '现价',
                    type: 'line',
                    symbol:'none',
                    itemStyle: {
                        color:'#51cbee',
                    },
                    lineStyle:{
                        width:1,
                    },
                    areaStyle: { //区域填充样式
                        normal: {
                            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(0, 136, 212, 0.2)'
                            }, {
                                offset: 1,
                                color: 'rgba(0, 136, 212, 0)'
                            }], false),
                            shadowColor: 'rgba(0, 0, 0, 0.1)',
                            shadowBlur: 10
                        }
                    },
                    animation:false,
                    markLine: {
                        symbol: ['none', 'none'],
                        animation:false,
                        silent:true,
                        label: {
                            show:false,
                        },
                        lineStyle: {
                            type:'solid',
                            width:1,
                            color:'rgb(255, 184, 0)',
                        },
                        data: [
                            {
                                name: 'Y 轴值为 中间值 的水平线',
                                yAxis: this.yestdatyclose.toFixed(4)
                            }
                        ]
                    },
                    z:10000,
                    data: this.price_data,
                },{
                    xAxisIndex:1,
                    yAxisIndex:2,
                    name: '成交量',
                    type: 'bar',
                    symbol:'none',
                    itemStyle: {
                        color:'#51cbee',
                    },
                    lineStyle:{
                        width:1,
                    },
                    animation:false,
                    itemStyle: {
                        normal: {
                            color: (params) =>{
                                if(params.value==undefined) return;
                                var colorList;
                                if(params.dataIndex==0){
                                    if(this.sub(this.price_data[0][1],this.yestdatyclose)>0){
                                        return this.style.z_color
                                    }else{
                                        return this.style.d_color
                                    }
                                }else{
                                    if (this.sub(this.price_data[params.dataIndex][1],this.price_data[params.dataIndex-1][1])>=0) {
                                        return this.style.z_color
                                    } else {
                                        return this.style.d_color
                                    }
                                }
                            },
                        }
                    },
                    data: this.vol_data,
                }]                       
            })
            this.chart.setOption(option);
        },
        get_first(){
            this.$http({url:Api.lineRedis,params:{key:this.contract_code+"t"},method:'post'}).then(res => {
                //接口没有成功状态
                //获取数据并处理
                if(res.data.Data.length!=0){
                    this.list = JSON.parse(res.data.Data).mins;
                }
                // console.log(this.list)
                this.init_data();
                this.set_y();
                this.draw();
                this.set_legend();
            });
        },
        /*定时请求 */
        set_chart(){
            this.$http({url:Api.lineRedis,params:{key:this.contract_code+"t"},method:'post'}).then(res => {
                this.price_data=[];
                this.vol_data=[];
                this.zdf_data=[];
                if(res.data.Data.length==0){
                   return;
                }
                this.list = JSON.parse(res.data.Data).mins;
                this.init_data();
                this.set_y();
                this.chart.setOption({//更新分时图数据
                    // 数据
                    series: [{
                        xAxisIndex:0,
                        yAxisIndex:0,
                        name: '时间',
                        data:[],
                    },{
                        xAxisIndex:0,
                        yAxisIndex:0,
                        name: '涨跌幅',
                        data: this.zdf_data,
                    },{
                        xAxisIndex:0,
                        yAxisIndex:0,
                        name: '现价',
                        data: this.price_data,
                    },{
                        xAxisIndex:1,
                        yAxisIndex:2,
                        name: '成交量',
                        data: this.vol_data,
                    }]  
                })
                //设置分时图头
                this.set_legend();
            })
        },
        //数据处理
        init_data(){
            var time ='',first_time='',last_time='';
            for(var i = 0;i<this.list.length;i++){
                //时间处理
                time = this.list[i].time;
                first_time = time.substring(0,2)+":";
                last_time = time.substring(2,4);
                //数据处理
                this.price_data.push([first_time+last_time,this.list[i].price])//获取现价
                this.vol_data.push([first_time+last_time,this.list[i].volume])//获取成交量
                this.zdf_data.push(this.list[i].autn)//获取涨跌幅
            }
            // console.log(this.list)
            // console.log(this.price_data);
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
        /*a-b*/
        sub(a, b) {
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
            return e = Math.pow(10, Math.max(c, d)), (this.mul(a, e) - this.mul(b, e)) / e;
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
        /*a/b*/
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
    }
}
</script>
<style scoped>
    #myChart {
        width: 95%;
        height: 300px;
        margin: 0 auto;
    }
</style>


