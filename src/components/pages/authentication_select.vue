<template>
  <div class="set">
    <CHeader title="实名认证" backBol="true" :backUrl='b'></CHeader>
    <div class="content-body has-header main-bg">
      <ul class="font28">
        <li class="normal-border-color" @click="tocardname">系统自动验证</li>
        <li to="/authentication" class="normal-border-color"  @click="tocard">人工审核验证</li>
        <!-- <li class="normal-border-color" @click="toface">人脸识别验证</li> -->
      </ul>
    </div>

  </div>
</template>
<script>
import api from '@/api'
import $axios from 'axios'
import CHeader from '@/components/common/IHeader.vue'
export default {
    data () {
        return {
          b:''
        }
    },
    //只有未认证才可以进入此路由
    beforeRouteEnter:(to,from,next)=>{
      var p = from.path;
      if(  p!='/authentication' &&  p!='/authenticatecar' && p!='/authenticateCarName'){
        window.sessionStorage.setItem("LBACK",from.fullPath);
      }
      $axios.post(api.autonymState).then(res=>{
        if(res.data.Status==="1"){
          if(res.data.Data.NTure!==3){//如果不是未认证返回首页
              next('/')
          }else{
              next();
          }
        }
      })
    },
    created(){
      this.b=window.sessionStorage.getItem("LBACK")
      // console.log(window.sessionStorage.getItem("LBACK"))
    },
    components: {
        CHeader
    },
    methods:{
        toface(){
            this.$router.push('/authentication');
        },
        tocard(){
            this.$router.push('/authenticatecar');
        },
        tocardname(){
            this.$router.push('/authenticateCarName');
        }
    }
}
</script>
<style scoped>
  .content-body{
    top: 56px;
    text-align: left;
    padding: 0 10px;
  }
  ul > li{
    height: 50px;
    line-height: 50px;
    /* border-bottom: 1px solid #d9d9d9; */
    border-bottom-width: 1px;
    border-bottom-style: solid;
    background: url('/static/images/home/arrow_right.svg') no-repeat right center;
    background-size: auto 12px;
    position: relative;
  }
  ul > li > span{
    position: absolute;
    right: 12px;
  }
  
 
</style>
