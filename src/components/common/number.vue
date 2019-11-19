<template>
    <div id="a">
        <div class="mui-numbox" :data-numbox-step='box_step' :data-numbox-min='box_min' :data-numbox-max='box_max'>
            <button :class="{'mui-btn': !theme, 'mui-numbox-btn-minus': true, 'black-btn': theme}" type="button" @click="tocude">-</button>
            <input :class="{'mui-numbox-input': true, 'black-input': theme, 'normal-input': !theme}" type="number"  v-model="box_value"  :disabled="box_input"  @change="num_change" @blur="end_num"/>
            <button :class="{'mui-btn': !theme, 'mui-numbox-btn-plus': true, 'black-btn': theme}" type="button" @click="toadd">+</button>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return{
            box_max:this.max,//最大值
            box_min:this.min,//最小值
            box_step:this.step,//步长
            box_value:this.vals,//默认值
            box_input:this.inputs,//是否禁用输入
            decimal:this.dec//保留小数点后几位
        }
    },
    computed: {
        theme () {
            // console.log(localStorage.getItem('theme') != null ? JSON.parse(localStorage.getItem('theme')).theme : 0);
            return localStorage.getItem('theme') != null ? JSON.parse(localStorage.getItem('theme')).theme : 0;
        }
    },
    mounted(){
    },
    methods:{
        end_num(){
            this.box_value=Number(this.box_value).toFixed(this.decimal);
        },
        // 减点击
        tocude(){
            var end = this.accSub(this.box_value,this.box_step);//获取减后的值
            if(this.box_value<=this.box_min || end<this.box_min){
                 this.box_value = this.box_min;
            }else{//否则取减后的值
                this.box_value=Number(end).toFixed(this.decimal);
            }
        },
        // 加点击
        toadd(){
            var end = this.accAdd(this.box_value,this.box_step);//获取加后的值
            if(this.box_value>=this.box_max || end>this.box_max) {
                this.box_value = this.box_max;
            }else{//否则取加后的值
                this.box_value=Number(end).toFixed(this.decimal);
            }
        },
        // 值改变
        num_change(){
            if(this.box_value.trim().length==0){
                this.box_value=this.box_min;
            }else{
                if(this.box_value<this.box_min){
                    this.box_value=this.box_min;
                }else if(this.box_value>this.box_max){
                    this.box_value=this.box_max
                }
            }
            
        },
        //浮点数加法
        accAdd(arg1, arg2) {
            if (isNaN(arg1)) {
                arg1 = 0;
            }
            if (isNaN(arg2)) {
                arg2 = 0;
            }
            arg1 = Number(arg1);
            arg2 = Number(arg2);
            var r1, r2, m, c;
            try {
                r1 = arg1.toString().split(".")[1].length;
            }
            catch (e) {
                r1 = 0;
            }
            try {
                r2 = arg2.toString().split(".")[1].length;
            }
            catch (e) {
                r2 = 0;
            }
            c = Math.abs(r1 - r2);
            m = Math.pow(10, Math.max(r1, r2));
            if (c > 0) {
                var cm = Math.pow(10, c);
                if (r1 > r2) {
                    arg1 = Number(arg1.toString().replace(".", ""));
                    arg2 = Number(arg2.toString().replace(".", "")) * cm;
                } else {
                    arg1 = Number(arg1.toString().replace(".", "")) * cm;
                    arg2 = Number(arg2.toString().replace(".", ""));
                }
            } else {
                arg1 = Number(arg1.toString().replace(".", ""));
                arg2 = Number(arg2.toString().replace(".", ""));
            }
            return (arg1 + arg2) / m;
        },
        //浮点数减法
        accSub(arg1, arg2) {
            if (isNaN(arg1)) {
                arg1 = 0;
            }
            if (isNaN(arg2)) {
                arg2 = 0;
            }
            arg1 = Number(arg1);
            arg2 = Number(arg2);

            var r1, r2, m, n;
            try {
                r1 = arg1.toString().split(".")[1].length;
            }
            catch (e) {
                r1 = 0;
            }
            try {
                r2 = arg2.toString().split(".")[1].length;
            }
            catch (e) {
                r2 = 0;
            }
            m = Math.pow(10, Math.max(r1, r2)); //last modify by deeka //动态控制精度长度
            n = (r1 >= r2) ? r1 : r2;
            return ((arg1 * m - arg2 * m) / m).toFixed(n);
        }
    },
    watch:{
        box_value(newval,oldval){//监听值变化并返回给父组件
            this.$emit("getNum",newval);
        },
        vals(newval,oldval){//监听父组件的值是否发生改变
            this.box_value = newval;
        },
        max(newval,oldval){//监听父组件最大值是否发生改变
            this.box_max=newval;
        },
        min(newval,oldval){//监听父组件最小值是否发生改变
            this.box_min=newval;
        }
    },
    props:["max","min","vals","step","inputs","dec"]

}
</script>

<style scoped>
@import url("../../../static/mui/css/mui.css");
.mui-numbox{
    width: 100%;
    border: none;
    background-color: unset;
}
.mui-numbox .mui-numbox-input{
    border-left: none !important;
    border-right: none !important;
    /* background: #F2F2F2; */
}
.mui-numbox [class*=numbox-btn]{
    background: #E9E9E9;
    color: #000;
}
.mui-numbox > button.black-btn{
    background: rgba(255, 255, 255, 0.5);
    color: #000;
}
input[type='number']{
    background-color: unset;
}
.mui-numbox > input.black-input{
    background-color: rgba(255, 255, 255, 0.2);
    color: #fff;
}
.mui-numbox > input.normal-input{
    background-color: #f2f2f2;
    color: #000;
}
.mui-numbox > button[class*=numbox-btn]{
    font-size: 28px;
}
</style>

