<template>
  <div class="notice assist-color3">
    <CHeader title="公告" backBol="true"></CHeader>
    <div class="content-body has-header main-bg">
      <div>
        <ul>
          <router-link tag="li" :to="{path: '/notice-details', query: { id: item.Id }}" v-for="item in notices" :key="item.Id" class="notice-list normal-border-color">
            <p :class="{'font28': true, 'normal-margin': true, 'main-text-color2': item.IsRead && login }">{{item.Ti}}</p>
            <div class="main-text-color2 font24"><span>{{formatDate(item.Pt)}}</span></div>
            <img src="/static/images/home/arrow_right.svg" alt="">
          </router-link>
        </ul>
        <p class="font20 message-bottom assist-text-color1">已到最底部</p>
      </div>
    </div>
  </div>
</template>
<script>
import formatDate from '../../../static/js/format_date.js'
import CHeader from '@/components/common/IHeader.vue'
export default {
  data () {
    return {

    }
  },
  computed: {
    notices () {
      if (this.$store.state.notices.length === 0) {
        var info = JSON.parse(window.localStorage.getItem("againInfo"));
        if(!info){//取不到代理信息
          this.$store.dispatch("get_againInfo").then(res=>{
            info = JSON.parse(window.localStorage.getItem("againInfo")).id
            // console.log('info', info);
            this.$store.dispatch('get_visitor_notice',info).then(res => {
              return res;
              // return this.$store.state.notices;
            })
          })
        }else{
          this.$store.dispatch('get_visitor_notice',info.id).then(res => {
            return res;
          })
        }
      }
      return this.$store.state.notices;
      // if (this.$store.state.notices.length === 0) {
      //   if (this.login) {
      //     this.$store.dispatch('get_notice').then(res => {
      //       return this.$store.state.notices;
      //     });
      //   } else {
      //     this.$store.dispatch('get_visitor_notice').then(res => {
      //       return this.$store.state.notices;
      //     })
      //   }
      // }
      // return this.$store.state.notices;
    },
    login () {//登录状态
      if (localStorage.getItem('login') == null) {
        return false;
      } else {
        return true;
      }
    }
  },
  components: {
    CHeader
  },
  created() {
    // console.log(this.notices);
  },
  methods: {
    formatDate: formatDate.formatDate
  }
}
</script>
<style scoped>
  .notice{
    height: 100%;
  }
  .notice .content-body{
    text-align: left;
    top: 56px;
    padding: 0 10px;
  }
  .content-body > div{
    width: 100%;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    height: 100%;
  }
  .content-body > div::-webkit-scrollbar{
    display: none;
  }
  .content-body .notice-list{
    padding: 10px 0;
    /* border-bottom: 1px solid #d9d9d9; */
    border-bottom-width: 1px;
    border-bottom-style: solid;
    position: relative;
  }
  .content-body .notice-list > p{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 90%;
  }
  .content-body .notice-list > img{
    width: 5px;
    height: 10px;
    position: absolute;
    right: 0;
    top: 50%;
    margin-top: -2.5px;
  }
  .message-bottom{
    /* color: #d9d9d9; */
    text-align: center;
    padding: 10px 0;
  }
</style>
