<template>
  <div class="message-details">
    <div class="message-details-header font32 main-bg">
      <img :src="theme ? '/static/images/header/transparent_arrow_left.svg' : '/static/images/header/arrow_left.svg'" alt="返回按钮" class="back"  @click="back">
      <h1 class="font32">消息详情</h1>
      <span class="tab-active-color font28 clear-message" @click="clear">清空</span>
    </div>
    <div :class="{'content-body': true, 'has-header': true, 'main-bg': theme}">
      <div>
        <ul class="font28" v-if="!noMessage">
          <li v-for="item in messageList" :key="item.id">
            <div class="normal-margin message-time main-text-color2">{{item.creime ? timeHandle(item.creime) : ''}}</div>
            <div :class="{'message-body': true, 'normal-padding': true, 'main-bg': !theme, 'assist-color3': theme}">
              <h3 class="normal-border-color">{{id ==  1 ? item.messagetype : id == 2 ? '充值通知' : id == 3 ? '提现通知' : ''}}</h3>
              <p class="main-text-color2 white-wrap">{{item.mtent}}
              <span>{{item.mtus}}</span></p>
            </div>
          </li>
        </ul>
        <div v-else>
          <SimpleState imgSrc="/static/images/home/img_nomessage.svg"  message="暂时没有消息" fontClass="main-text-color2"></SimpleState>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import api from '@/api'
import SimpleState from '@/components/common/SimpleState.vue'
export default {
  data () {
    return {
      noMessage: false,
      messageList: []
    }
  },
  computed: {
    id () {
      return this.$route.query.id;
    },
    theme () {
      // console.log(localStorage.getItem('theme') != null ? JSON.parse(localStorage.getItem('theme')).theme : 0);
      return localStorage.getItem('theme') != null ? JSON.parse(localStorage.getItem('theme')).theme : 0;
    }
  },
  components: {
    SimpleState
  },
  methods: {
    back () {
      this.$router.back(-1);
    },
    clear () {//清空消息
      this.$store.dispatch('clear_message', this.id).then(res => {
        // console.log(res);
        if (res.Status === '1') {
          this.$toast({
            message: '清空成功',
            position: 'bottom'
          })
          this.$router.push('/message');
        } else {
          this.$toast({
            message: res.Msg,
            position: 'bottom'
          })
        }
      })
    },
    timeHandle (time) {
      var data1 = time.replace(/\-/g, '/');
      var data2 = new Date(data1);
      let year = data2.getFullYear();
      let month = data2.getMonth();
      let date = data2.getDate();
      let nowDate = new Date();//6.1
      var data3 = (new Date(nowDate.getFullYear(), nowDate.getMonth() , 0)).getDate();//上个月的天数 31
      // console.log('now',nowDate.getFullYear(), year, nowDate.getMonth(), month, nowDate.getDate(), 1, date, data3);
      if (nowDate.getFullYear() === year && nowDate.getMonth() === month && date === nowDate.getDate()) {//当天
        return (data2.getHours() < 10 ? '0' + data2.getHours() : data2.getHours()) + ':' + (data2.getMinutes() < 10 ? '0' + data2.getMinutes() : data2.getMinutes());
      } else if ((nowDate.getFullYear() === year && nowDate.getMonth() === month && date === nowDate.getDate() - 1) || (nowDate.getFullYear() === year && nowDate.getMonth() === month + 1 && nowDate.getDate() === 1 && date === data3)) {//-1为昨天  假如今天为6.1 输入为5.31
        return '昨天';
      } else if ((nowDate.getFullYear() === year && nowDate.getMonth() === month && date === nowDate.getDate() - 2) || (nowDate.getFullYear() === year && nowDate.getMonth() === month + 1 && nowDate.getDate() === 2 && date === data3) || (nowDate.getFullYear() === year && nowDate.getMonth() === month + 1 && nowDate.getDate() === 1 && date === data3 - 1)) {
        return '前天'
      }
      // return data3;
      return time;
    }
  },
  created () {
    this.$store.dispatch('get_message_detail', this.id).then(res => {
      // console.log(res);
      this.messageList = res;
      if (this.messageList.length === 0) {
        this.noMessage = true;
      }
    })
    // console.log('data2 天数', this.timeHandle('2019-05-31 19:59:44'));
  },
  mounted () {

  }
}
</script>
<style scoped>
  .white-wrap{
    white-space: pre-wrap;
  }
  .message-details{
    height: 100%;
  }
  .content-body{
    text-align: left;
    padding: 0 10px;
  }
  .content-body > div{
    overflow-y: scroll;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    width: 100%;
    height: 100%;
  }
  .content-body > div::-webkit-scrollbar{
    display: none;
  }
  .message-details-header{
    position: fixed;
    height: 24px;
    line-height: 24px;
    width: 100vw;
    text-align: center;
    top: 0;
    padding-top: 10px;
    padding-bottom: 10px;
    z-index: 100001;
  }
  .back{
    left: 0;
    position: absolute;
    height: 20px;
    top: 2px;
    cursor: pointer;
    padding: 10px;
  }
  .message-details-header .clear-message{
    position: absolute;
    right: 0;
    top: 2px;
    padding: 10px;
  }
  .message-time{
    text-align: center;
    margin-top: 20px;
  }
  .message-body{
    border-radius: 4px;
  }
  .message-body > h3{
    /* border-bottom: 1px solid #d9d9d9; */
    border-bottom-width: 1px;
    border-bottom-style: solid;
    padding-bottom: 10px;
  }
  .message-body > p{
    /* height: 40px; */
    padding-top: 10px;
    position: relative;
  }
  .message-body > p > span{
    bottom: 0;
    position: absolute;
    right: 0;
  }
</style>
