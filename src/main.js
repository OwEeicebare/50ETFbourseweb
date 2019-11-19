// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index.js'
import axios from 'axios'
import VueClipboard from 'vue-clipboard2'

import { Swipe, SwipeItem, Header, Button, Progress,TabContainer,TabContainerItem,Cell,Switch,DatetimePicker,Navbar,TabItem,MessageBox,Picker,Toast,Loadmore} from 'mint-ui'
Vue.component(Swipe.name, Swipe);
Vue.component(SwipeItem.name, SwipeItem);
Vue.component(Header.name, Header);
Vue.component(Button.name, Button);
Vue.component(Progress.name, Progress);
Vue.component(TabContainer.name, TabContainer);
Vue.component(TabContainerItem.name, TabContainerItem);
Vue.component(Cell.name, Cell);
Vue.component(Switch.name, Switch);
Vue.component(DatetimePicker.name, DatetimePicker);
Vue.component(Navbar.name, Navbar);
Vue.component(TabItem.name, TabItem);
Vue.component(Picker.name, Picker);
Vue.component(Loadmore.name, Loadmore);

Vue.use(VueClipboard);
// 防止415
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.retry = 10;
axios.defaults.retryDelay = 1000;
axios.defaults.timeout =  5000;

//不需要登录的白名单
const paths = ["/login","/msg-login","/vertify-code","/register","/reset-pass","/modify-success","/current-phone","/","/market","/market-details","/register-protocal","/rgg_details","/search_contract"];
// http request 拦截器
axios.interceptors.request.use(config => {
    var user = JSON.parse(localStorage.getItem("login"));
    if (user && config.url.indexOf('http://qt.gtimg.cn')) {  // 判断是否存在token，如果存在的话，则每个http header都加上token||指数不需要携带token
        config.headers.token = user.Token;
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);
// http response 拦截器
axios.interceptors.response.use(response => {
  var url = window.location.hash;
  // && url.indexOf(paths)!=-1
  if (response.data.Status === '401') {
    store.commit('LOGOUT');
    router.replace({
        path: 'login',
    })
  }
  return response;
},error => {
  var config = error.config;
  if(!config || !config.retry) return Promise.reject(error);
  config.__retryCount = config.__retryCount || 0;
  if(config.__retryCount >= config.retry) {
      // Reject with the error
      // console.log("重试次数"+config.__retryCount)
      return Promise.reject(error);
  }
  config.__retryCount += 1;
  var backoff = new Promise(function(resolve) {
      setTimeout(function() {
          resolve();
      }, config.retryDelay || 1);
  });
  return backoff.then(function() {
            return axios(config);
        });
  // if (error.response) {
  //   switch (error.response.status) {
  //     case 401:
  //       // 返回 401 清除token信息并跳转到登录页面
  //       store.commit('LOGOUT');
  //       router.replace({
  //           path: 'login',
  //           query: {redirect: router.currentRoute.fullPath}
  //       })
  //   }
  // }
  // return Promise.reject(error.response.data)   // 返回接口返回的错误信息
});
Vue.prototype.$http = axios;
Vue.prototype.$message = MessageBox;
Vue.prototype.$toast = Toast
Vue.config.productionTip = false


//路由跳转后，页面回到顶部
router.afterEach(() => {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
})
// router.beforeEach((to,from,next)=>{
  
//   if(paths.indexOf(to.path) !== -1){
//     next();
//   }else{
//     //获取登录信息
//     var user =JSON.parse(localStorage.getItem("login"));
//     if(user==null){
//       next('/login');
//     }else{
//       next();
//     }
//   }
// })



//引入基本模板
let echarts = require('echarts/lib/echarts')
// 引入折线图等组件
require('echarts/lib/chart/line')
require("echarts/lib/chart/bar");
require("echarts/lib/chart/candlestick");
// 引入提示框和title组件，图例
require('echarts/lib/component/tooltip')//提示窗
require('echarts/lib/component/legend')//图例
require("echarts/lib/component/markLine");//标线
require("echarts/lib/component/dataZoom");
Vue.prototype.$echarts = echarts


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
