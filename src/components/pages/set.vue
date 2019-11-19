<template>
  <div class="set">
    <CHeader title="设置" backBol="true" backUrl="/mine"></CHeader>
    <div class="content-body has-header main-bg">
      <ul class="font28">
        <li to="/authentication" class="normal-border-color" @click="toAutonym">实名认证<span class="main-text-color2">{{realName.state_string}}</span></li>
        <li class="normal-border-color" @click="bindCard">绑定银行卡<span class="main-text-color2">{{bindState ? '已绑定' : '未绑定'}}</span></li>

        <li class="normal-border-color" @click="changeTel">更换手机号</li>
        <router-link tag="li" :to="{path: '/current-phone', query: {type: 'set'}}" class="normal-border-color">修改密码</router-link>
        <li class="normal-border-color">当前版本<span class="main-text-color2">V1.0.1</span></li>
        <li class="normal-border-color">切换模式<span class="main-text-color2" style="margin-top:15px"><mt-switch v-model="value"></mt-switch></span></li>
      </ul>
    </div>

  </div>
</template>
<script>
import api from '@/api'
import CHeader from '@/components/common/IHeader.vue'
export default {
  data () {
    return {
      realName:{
        state_string:'',//实名状态
        state_status:'',//状态码
      },
      
      value:JSON.parse(localStorage.getItem("theme")).theme==0?false:true
    }
  },
  watch:{
    value(newval,oldval){
      localStorage.setItem("theme",JSON.stringify({"theme":newval==false?0:1}))
      let themeLink = document.querySelector('link[name="theme"]');
      let theme = localStorage.getItem('theme');
      if (theme != null) {
        if (JSON.parse(theme).theme == 0) {
          themeLink.setAttribute('href', 'static/styles/common.css');
        } else {
          themeLink.setAttribute('href', 'static/black/common.css');
        }
      } else {
        themeLink.setAttribute('href', 'static/styles/common.css');
      }
    },
  },
  computed: {
    
    authenticateState () {
      return this.$store.state.authenticateState;
      // return false;
    },
    bindState () {
      if (sessionStorage.getItem('bindState') != null) {
        return true;
      } else {
        return this.$store.state.bindState;
      }
    },
    tel () {
      let login = localStorage.getItem('login');
      if (login != null) {
        return (JSON.parse(login)).Mobile;
      } else {
        return '';
      }
    }
  },
  components: {
    CHeader
  },
  methods: {
    authenticate () {//判断是否实名状态
      this.$http.post(api.autonymState).then(res=>{
        var result = res.data.Data;
        this.realName.state_status=result.NTure;
        // console.log(result);
        if(result.NTure==1){
          this.realName.state_string="已认证";
        }else if(result.NTure==2){
          this.realName.state_string="审核中";
        }else if(result.NTure==3){
          this.realName.state_string="未认证";
        }
      })
    },
    bindCard () {//绑定银行卡
      if (this.realName.state_status==1) {//已认证跳转绑定银行卡
        //已认证直接绑定银行卡
        this.$router.push('/bank-card');
      } else if(this.realName.state_status==2){//待审核
        this.$message({
          title: '提示',
          message: '您认证资料正在审核中',
          showCancelButton: true,
          cancelButtonText: '取消绑定',
          cancelButtonClass: 'main-text-color2',
          confirmButtonText: '查看资料'
        }).then(action => {
          if (action === 'confirm') {
            this.$router.push('/againauthentication');
          }
        })
      }else if(this.realName.state_status==3){//未认证
        this.$message({
          title: '提示',
          message: '您尚未进行实名认证',
          showCancelButton: true,
          cancelButtonText: '稍后认证',
          cancelButtonClass: 'main-text-color2',
          confirmButtonText: '马上认证'
        }).then(action => {
          if (action === 'confirm') {
            this.$router.push('/authenticationSelect');
          }
        })
      }
    },
    toAutonym () {//实名认证
      if (this.realName.state_status==1) {
        this.$router.push('/authenticate-success');
      } else if(this.realName.state_status==2){
        this.$router.push('/againauthentication');
      }else if(this.realName.state_status==3){//未认证
        this.$router.push('/authenticationSelect');
      }
    },
    sendMsg () {
      return this.$http.post(api.verificationPhone,{"Mobile":this.tel,"type": 5}).then(res=>{
        return res;
        if(res.data.Status==0){
          this.$toast({
            message:"发送成功",
            position: 'bottom',
            duration: 1000
          })
        }else{
          this.$toast({
            message:"请求失败",
            position: 'bottom',
            duration: 1000
          })
        }
      });
    },
    changeTel () {//更换手机号
      // if (!this.tel) {
      //   return;
      // }
      // this.sendMsg().then(res => {
      //   // if (res.data.Status === '1') {
      //     this.$router.push({path: '/vertify-code', query: {type: 'changeTel'}});
      //   // }
      // })
      this.$router.push('/change_phone');
    }
  },
  created () {
    this.authenticate(); //先判断认证状态
    this.$store.dispatch('get_card_list');
    // this.getTel();// 获取当前手机号
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
  ul > li:nth-last-child(1) {
    background: none;
  }
  ul > li:nth-last-child(1) > span {
    background: none;
    right: 0;
  }
  ul > li:nth-last-child(2) > span {
    background: none;
    right: 0;
  }
  ul > li:nth-last-child(2) {
    background: none;
  }
 
</style>
