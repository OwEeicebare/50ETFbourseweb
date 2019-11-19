<template>
    <div id="app">
        <div id="myChart" ref="myChart" ></div> 
    </div>
</template>

<script>
import Api from '@/api'
export default {
    data(){
        return{
            chart:'',//图表容器
            char_data:[],//日k数据数组
            max:10,//最大值
            min:0,//最小值
            interval:2.5,//分割值
            style:{
                font_size:12,
                font_color:'#ccc',
                border_color:JSON.parse(localStorage.getItem("theme")).theme==0?'#f0f0f0':'rgba(255,255,255,0.2)',
                z_color:'#ff464b',
                d_color:'#03c461'
            },
            tiemr:'',
        }
    },
    props:["contract"],
    created(){
        this.set_y();//设置y轴
        this.set_x();//设置x轴
        this.get_first();
        this.tiemr = setInterval(() => {
            this.set_chart()
        }, 10000);
    },
    mounted(){
        this.draw();
    },
    destroyed(){
        window.clearInterval(this.tiemr)
    },
    methods: {
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
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'line'
                    },
                    position: function (pos, params, el, elRect, size) {
                        var obj = {top: 10};
                        obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
                        return obj;
                    },
                    formatter:(params)=>{
                        var val = [];
                        for(var i = 0,len = params.length;i < len;i++){
                            switch(params[i].componentIndex){
                                case 0:val[0]=params[i];break;//k
                                case 1:val[1]=params[i];break;//MA5
                                case 2:val[2]=params[i];break;//MA10
                                case 3:val[3]=params[i];break;//MA20
                                case 4:val[4]=params[i];break;//MA30
                                case 5:val[5]=params[i];break;//成交量
                            }
                        }
                        //设置提示框
                        return [
                            "<div class='tipbox'><span>" + val[0].name + '</span></div>',
                            "<div class='tipbox'><div><span>开:</span><span>" + val[0].data[1].toFixed(4) + '</span></div><div><span>高:</span><span>'+ val[0].data[4].toFixed(4) +'</span></div></div>',
                            "<div class='tipbox'><div><span>收:</span><span>" + val[0].data[2].toFixed(4) + '</span></div><div><span>低:</span><span>'+ val[0].data[3].toFixed(4) +'</span></div></div>',
                            "<div class='tipbox'><div><span>MA5:</span><span>" + val[1].data + '</span></div><div><span>MA10:</span><span>'+ val[2].data +'</span></div></div>',
                            "<div class='tipbox'><div><span>MA20:</span><span>" +val[3].data + '</span></div><div><span>MA30:</span><span>'+ val[4].data +'</span></div></div>',
                            "<div class='tipbox'><span>成交量：</span><span>" + val[5].data + '</span></div>',
                        ].join('');
                    },
                    
                },
                axisPointer: {
                    link: {xAxisIndex: 'all'},
                    label: {
                        backgroundColor: '#777'
                    }
                },
                xAxis: [
                    {
                        gridIndex:0,
                        type:'category',
                        axisLine:{
                            show:false,
                        },
                        axisTick: {
                            show:false,
                        },  
                        axisLabel:{
                            interval:19,
                            fontSize:this.style.font_size,
                            color:this.style.font_color,
                            formatter:function(value, index){
                                value=value.slice(2);
                                value=value.replace(/-/g,"/");
                                if(index==0){
                                    return "             "+value;
                                }
                                return value;
                            }
                        },
                        splitLine:{
                            show: true,
                            lineStyle:{
                                color:this.style.border_color,
                            }
                        },
                        axisPointer: {
                            label: {
                                show:true
                            }
                        },
                        data: this.char_data.categoryData?this.char_data.categoryData:[],
                    },
                    {
                        gridIndex:1,
                        type:'category',
                        axisLine:{
                            show:false,
                        },
                        axisTick: {
                            show:false,
                        },  
                        axisLabel:{
                            show:false,
                            interval:19,
                        },
                        splitLine:{
                            show: true,
                            lineStyle:{
                                color:this.style.border_color,
                            }
                        },
                        data: this.char_data.categoryData?this.char_data.categoryData:[],
                    }
                ],
                yAxis: [
                    {
                        splitLine:{
                            lineStyle:{
                                color:this.style.border_color,
                            }
                        },
                        axisLine:{
                            show:false,
                        },
                        axisTick: {
                            show:false,
                        },  
                        axisLabel: {
                            inside:true,
                            verticalAlign:'bottom',
                            fontSize:this.style.font_size,
                            color:this.style.font_color,
                            formatter: function (value, index) {
                               
                                return value.toFixed(4);
                            }
                        },
                        min:this.min,
                        max:this.max,
                        interval:this.interval,
                    },
                    {
                        splitLine:{
                            lineStyle:{
                                color:this.style.border_color,
                            }
                        },
                        gridIndex: 1,
                        scale: true,
                        axisLine:{
                            show:false,
                        },
                        axisTick: {
                            show:false,
                        },  
                        interval:1000000,
                        axisLabel: {
                            inside:true,
                            verticalAlign:'top',
                            showMinLabel:false,
                            fontSize:this.style.font_size,
                            color:this.style.font_color,
                        },
                    }
                ],
                series: [
                    {
                        name: 'k',
                        type: 'candlestick',
                        itemStyle: {
                            normal: {
                                color: this.style.z_color,
                                color0:this.style.d_color,
                                borderColor: null,
                                borderColor0: null
                            }
                        },
                        barWidth:3,
                        data: this.char_data.values?this.char_data.values:[],
                        
                    },
                    {
                        name: 'MA5',
                        type: 'line',
                        symbol:'none',
                        lineStyle: {
                            width:1
                        },
                        data: this.calculateMA(5, this.char_data),
                    },
                    {
                        name: 'MA10',
                        type: 'line',
                        symbol:'none',
                        lineStyle: {
                            width:1
                        },
                        data: this.calculateMA(10, this.char_data),
                    },
                    {
                        name: 'MA20',
                        type: 'line',
                        symbol:'none',
                        smooth: true,
                        lineStyle: {
                            width:1
                        },
                        data: this.calculateMA(20, this.char_data),
                    },
                    {
                        name: 'MA30',
                        type: 'line',
                        symbol:'none',
                        lineStyle: {
                            width:1
                        },
                        data: this.calculateMA(30, this.char_data),
                    },
                    {
                        name: 'Volumn',
                        type: 'bar',
                        barWidth:2,
                        xAxisIndex: 1,
                        yAxisIndex: 1,
                        itemStyle: {
                            normal: {
                                color: (params)=> {
                                    var colorList;
                                    if (this.char_data.values[params.dataIndex][1]>this.char_data.values[params.dataIndex][0]) {
                                        colorList = this.style.z_color;
                                    } else {
                                        colorList = this.style.d_color;
                                    }
                                    return colorList;
                                },
                            }
                        },
                        data: this.char_data.volumns?this.char_data.volumns:[]
                    }
                ]
            });
            this.chart.setOption(option);
        },
        get_first(){
            this.$http({url:Api.lineRedis,params:{key:this.contract+"k"},method:'post'}).then(res => {
                if(res.data.Data && res.data.Data.length!=0){
                    this.char_data =this.splitData(JSON.parse(res.data.Data).kmins);//获取数据
                }
                this.set_y();//设置y轴
                this.set_x();//设置x轴
                this.draw();
            })
        },
        //定时请求
        set_chart(){
             this.$http({url:Api.lineRedis,params:{key:this.contract+"k"},method:'post'}).then(res => {
                if(res.data.Data && res.data.Data.length!=0){
                    this.char_data =this.splitData(JSON.parse(res.data.Data).kmins);//获取数据
                }
                this.set_y();//设置y轴
                this.set_x();//设置x轴
                this.chart.setOption({
                    xAxis: [
                        {
                            gridIndex:0,
                            data: this.char_data.categoryData,
                        },
                        {
                            gridIndex:1,
                            data: this.char_data.categoryData,
                        }
                    ],
                    yAxis: [
                        {
                            min:this.min,
                            max:this.max,
                            interval:this.interval,
                        },{}
                    ],
                    series: [
                        {
                            name: 'k',
                            data: this.char_data.values,
                            
                        },
                        {
                            name: 'MA5',
                            data: this.calculateMA(5, this.char_data),
                        },
                        {
                            name: 'MA10',
                            data: this.calculateMA(10, this.char_data),
                        },
                        {
                            name: 'MA20',
                            data: this.calculateMA(20, this.char_data),
                        },
                        {
                            name: 'MA30',
                            data: this.calculateMA(30, this.char_data),

                        },
                        {
                            name: 'Volumn',
                            data: this.char_data.volumns
                        }
                    ]
                })
            })
        },
        //设置y轴
        set_y(){
            //得到去除成交量的数组
            var datas=this.char_data.values;
            if(!datas || datas.length==0){
                this.max = 1;
                this.min = 0;
                this.interval =this.div(this.sub(this.max,this.min),4);
            }else{
                for(var i = 0,len = this.char_data.values.length;i<len;i++){
                    datas[i].pop();
                }
                //转化为一维数组
                datas = datas.join(",").split(",");
                //得到最大值和最小值
                this.max = Math.max.apply(null,datas);
                this.min = Math.min.apply(null,datas);
                //得到分割值
                this.interval =this.div(this.sub(this.max,this.min),4);
            }
        },
        set_x(){
            var time_len = this.char_data.categoryData;
            if(time_len&&time_len.length<60){
                for(var i = 0,len=this.sub(60,time_len.length);i<len;i++){
                    this.char_data.categoryData.push('');
                }
            }
        },
        splitData(rawData) {
            var categoryData = [];
            var temp=[];
            var values = [];
            var volumns = [];
            for (var i = 0; i < rawData.length; i++) {
                categoryData.push(this.formattTime(rawData[i].time));
                values.push([rawData[i].open,rawData[i].price,rawData[i].lowest,rawData[i].highest,'']);
                volumns.push(rawData[i].volume);
            }
            // console.log(values);
            return {
                categoryData: categoryData,
                values: values,
                volumns: volumns
            };
        },
        //时间格式修改
        formattTime(val){
            return val.toString().substring(0,4)+'-'+val.toString().substring(4,6)+'-'+val.toString().substring(6);
        },
        //计算ma
        calculateMA(dayCount, data) {
            if(data.length==0){
                return  [];
            }
            var result = [];
            for (var i = 0, len = data.values.length; i < len; i++) {
                if (i < dayCount) {
                    result.push('-');
                    continue;
                }
                var sum = 0;
                for (var j = 0; j < dayCount; j++) {
                    sum += data.values[i - j][1];
                }
                result.push((sum / dayCount).toFixed(4));
            }
            return result;
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

<style>
    #myChart {
        width: 95%;
        height: 300px;
        margin: 0 auto;
    }
    .tipbox{
        display: flex;
        justify-content: flex-start;
        text-align: left;
        font-size: 10px;
    }
    .tipbox>div{
        min-width: 70px;
    }
    .tipbox>div:first-child{
        margin-right: 10px;
    }
</style>
