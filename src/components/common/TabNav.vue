<template>
  <div class="tab-nav main-bg normal-border-color">
    <div class="tab">
      <router-link to="/" class="tab-item main-text-color1 font20">
        <img :src="currentRoute === '/' ? '/static/images/tab/home_s.svg' : (theme ? '/static/images/black/icon_buttom_home_n.svg' : '/static/images/tab/home_n.svg')" alt="首页"><p :class="currentRoute === '/' ? 'tab-active-color' : ''">首页</p>
      </router-link>
      <router-link to="/market" class="tab-item main-text-color1 font20">
        <img :src="currentRoute === '/market' ? '/static/images/tab/market_s.svg' : (theme ? '/static/images/black/icon_buttom_market_n.svg' : '/static/images/tab/market_n.svg')" alt="行情"><p :class="currentRoute === '/market' ? 'tab-active-color' : ''">行情</p>
      </router-link>
      <router-link to="/deal" class="tab-item main-text-color1 font20">
        <img :src="currentRoute === '/deal' ? '/static/images/tab/deal_s.svg' : (theme ? '/static/images/black/icon_buttom_deal_n.svg' : '/static/images/tab/deal_n.svg')" alt="交易"><p :class="currentRoute === '/deal' ? 'tab-active-color' : ''">交易</p>
      </router-link>
      <router-link to="/mine" class="tab-item main-text-color1 font20">
        <img :src="currentRoute === '/mine' ? '/static/images/tab/personal_s.svg' : (theme ? '/static/images/black/icon_buttom_personal_n.svg' : '/static/images/tab/personal_n.svg')" alt="我的"><p :class="currentRoute === '/mine' ? 'tab-active-color' : ''">我的</p>
      </router-link>
    </div>
  </div>
</template>

<style>
  .tab-nav{
    height: 50px;
    position: fixed;
    width: 100vw;
    bottom: 0;
    /* border-top: 1px solid #d9d9d9; */
    border-top-width: 1px;
    border-top-style: solid;
    box-sizing: border-box;
  }
  .tab{
    display: flex;
  }
  .tab-item{
    flex: 1;
    text-align: center;
    padding-top: 8px;
  }
  .tab-item img{
    height: 20px;
  }
  .tab-item p{
    margin-top: -3px;
  }
</style>

<script>
export default {
  data () {
    return {}
  },
  computed: {
    currentRoute () {
      return this.$route.path;
    },
    theme () {
      // console.log(localStorage.getItem('theme') != null ? JSON.parse(localStorage.getItem('theme')).theme : 0);
      return localStorage.getItem('theme') != null ? JSON.parse(localStorage.getItem('theme')).theme : 0;
    }
  },
  mounted () {

  }
}
</script>
