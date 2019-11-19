<template>
  <div id="app" class="font28">
    <router-view/>
  </div>
</template>

<script>
import api from '@/api'
export default {
  name: 'App',
  data () {
    return {
      
    }
  },
  computed: {
    theme () {
      var theme = localStorage.getItem('theme');
      if (theme != null) {
        return JSON.parse(theme);
      } else {
        return false;
      }
    },

  },
  methods: {
    set_expirationTime(){
      this.$store.dispatch("set_expirationTime");
    },
    getThemeInfo () {
      var hostName = window.location.hostname;
      var port = window.location.port;
      //0为白色版 1为黑色版
      var styles = localStorage.getItem('theme');
      let themeLink='',theme='';
      if(styles){//有设置颜色
        theme = localStorage.getItem('theme');
      }else{
        localStorage.setItem('theme', JSON.stringify({theme: 1,}));
      }
      themeLink = document.querySelector('link[name="theme"]');
      if (theme && theme != null) {
        if (JSON.parse(theme).theme == 0) {
          themeLink.setAttribute('href', 'static/styles/common.css');
        } else {
          themeLink.setAttribute('href', 'static/black/common.css');
        }
      } else {
        themeLink.setAttribute('href', 'static/black/common.css');
      }
    },
    platLogin () {
      let id = this.getUrlParams('platform');
      if(id){
        this.$http.post(api.platLogin, {'Uphe': id}).then(res => {
          // console.log('平台登录', res);
          if (res.data.Status === '1') {
            this.$store.commit('LOGIN',res.data.Data);
          } else {
            this.$toast({
              message: '平台登录失败',
              position: 'bottom'
            })
          }
        })
      }
    },
    getUrlParams (text) {
      let sUrl = window.location.href;
      let regstr = "/(\\?|\\&)" + text + "=([^\\&]+)/";
      let reg = eval(regstr);
      //eval可以将 regstr字符串转换为 正则表达式
      let result = sUrl.match(reg);
      if (result && result[2]) {
          return result[2];
      }
    },
    async query_recharge(){//查询充值订单状态
      let ua = navigator.userAgent.toLowerCase();
      //android终端
      let isAndroid = ua.indexOf('android') > -1 || ua.indexOf('adr') > -1;  
      //ios终端
      let isiOS = !!ua.match(/\(i[^;]+;( U;)? cpu.+mac os x/); 
      if(isiOS){
        //获取本地充值订单
        let orders =JSON.parse(window.localStorage.getItem('RECHAREORDER'));
        if(orders!=null){
          //获取服务器时间
          let servertime = await this.$http.post(api.getServerTime);
          servertime = new Date(Date.parse((servertime.data.Msg).replace(/-/g,"/")));//服务器时间;
          //循环充值订单
          for(var i = 0;i < orders.length;i++){
            var ordertime = new Date(Date.parse((orders[i].time).replace(/-/g,"/")));//充值委托时间
            var end = (servertime.getTime()-ordertime.getTime())/1000;//差秒数
            if(Number(end)<300){//如果充值时间相差5分钟内
              var c = orders[i];
              await this.$http.post(api.zfbEnd,{fxddh:orders[i].order,fxpay:'zfbwap'})
            }
          }
        }
      }
    }
  },
  created () {
    this.$store.dispatch("get_againInfo");//根据域名获取代理信息
    this.set_expirationTime();
    this.getThemeInfo();
    this.platLogin();
    setInterval(() => {
      this.query_recharge()
    }, 10000);
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  position: relative;
}
html,body,#app{
  height: 100%;
}
</style>
