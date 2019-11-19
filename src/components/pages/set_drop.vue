<template>
  <div class="set-stop">
    <CHeader :title="title" backBol="true" backUrl="/set-stop"></CHeader>
    <div class="content-body has-header font28">
      <div>
        <div  class="strategy main-bg normal-margin">
          <span>{{title}}</span>
          <span><input type="text" v-focus v-model="range" placeholder="0" ref="inputs" class="main-bg main-text-color1" >%</span>
        </div>
        <div class="strategy-tips font24 main-text-color2">
          <p>{{tips}}</p>
        </div>
        <div class="sure main-color1 white-color" @click="set()">确定</div>
      </div>
    </div>
  </div>
</template>
<script>
import CHeader from '@/components/common/IHeader.vue'
import Api from '@/api'
export default {
  data () {
    return {
      range: '',
    }
  },
  components: {
    CHeader
  },
  created(){
    this.range=this.$route.query.param==0?'':(this.$route.query.param);
  },
  computed: {
    type () {
      return this.$route.query.type;
    },
    title () {
      if (this.type === 'drop') {
        return '跌幅超过';
      } else {
        return '涨幅超过';
      }
    },
    tips () {
      if (this.type === 'drop') {
        return '止损策略：当价格向不利方向发展，距离（分笔持仓）开仓价满足止损条件后，自动委托止损';
      } else {
        return '止盈策略：当价格向有利方向发展，距离（分笔持仓）开仓价满足止盈条件后，自动委托止盈';
      }
    }
  },
  directives: {
    focus: {
      // 指令的定义
      inserted: function (el) {
        el.focus()
      }
    }
  },
  methods:{
    isPositiveInteger(s){//是否为正整数
      if(s.length==0){//允许为空
        return true;
      }
      var re = /^[0-9]+$/ ;
      return re.test(s)
    },
    
    set(){
      if(!this.isPositiveInteger(this.range)){//可以为空的整数
        this.$toast({
          position: 'bottom',
          message:"请输入0~9999的有效数字",
          duration: 1000
        })
        this.range='';
        this.$refs.inputs.focus();
        return;
      };
      if(Number(this.range)>9999){//有效方位的数
        this.$toast({
          position: 'bottom',
          message:"请输入0~9999的有效数字",
          duration: 1000
        })
        this.range='';
        this.$refs.inputs.focus();
        return;
      }
      if(this.type=="drop"){//设置止跌
        this.$http.post(Api.editLoss,this.range).then(res=>{
          if(res.data.Status==1){
            this.$router.push('/set-stop');
          }else{
            this.$toast({
              position: 'bottom',
              message: res.data.Msg,
              duration: 1000
            })
          }
        })
      }else if(this.type=="rise"){//设置止盈
        this.$http.post(Api.editProfit,this.range).then(res=>{
          if(res.data.Status==1){
            this.$router.push('/set-stop');
          }else{
            this.$toast({
              position: 'bottom',
              message: res.data.Msg,
              duration: 1000
            })
          }
        })
      }
    }
  }
}
</script>
<style scoped>
  .content-body{
    text-align: left;
    top: 54px;
  }
  .content-body > div{
    position: relative;
    height: 100%;
  }
  .strategy{
    padding: 0 10px;
    height: 50px;
    line-height: 50px;
    overflow: auto;
  }
  .strategy > span:nth-child(2) {
    float: right;
  }
  .strategy > span:nth-child(2) > input{
    border: none;
    text-align: right;
    margin-right: 2px;
  }
  .strategy-tips{
    padding: 0 10px;
  }
  .sure{
    position: absolute;
    height: 50px;
    line-height: 50px;
    left: 0;
    right: 0;
    text-align: center;
    bottom: 0;
  }
</style>

