<template>
  <div class="message">
    <CHeader title="消息" backBol="true"  backUrl="/mine"></CHeader>
    <div class="content-body has-header main-bg">
      <div v-if="messageType.length">
        <ul>
          <router-link tag="li" :to="{path: '/message-details', query: { id: item.Typeid }}" v-for="item in messageType" :key="item.Typeid" class="message-list normal-border-color" :style="{'backgroundImage': 'url(' + (item.Typeid === 1 ? 'static/images/my/icon_message_contract.svg' : item.Typeid === 2 ? 'static/images/my/icon_message_topup.svg' :  item.Typeid === 3 ? 'static/images/my/icon_message_withdrawal.svg' : '') + ')'}">
            <p class="font28">{{item.MessageType}}<span class="has-new-message font20" v-if="item.isread != 1"><span class="white-color main-color1">NEW</span></span></p>
            <div class="main-text-color2 font24 message-content"><span>{{item.con ? item.con : '暂无通知'}}</span></div>
            <img src="/static/images/home/arrow_right.svg" alt="">
          </router-link>
        </ul>
      </div>
      <div v-else>
        <SimpleState imgSrc="/static/images/home/img_nomessage.svg"  message="暂时没有消息" fontClass="main-text-color2"></SimpleState>
      </div>
    </div>
  </div>
</template>
<script>
import CHeader from '@/components/common/IHeader.vue'
import SimpleState from '@/components/common/SimpleState.vue'
export default {
  data () {
    return {
      messageType: [],
    }
  },
  computed: {

  },
  created () {
    this.$store.dispatch('get_message_type').then(res => {
      // console.log(res);
      this.messageType = res;
    })
  },
  components: {
    CHeader,
    SimpleState
  },
  mounted() {

  }
}
</script>
<style scoped>
  .message{
    height: 100%;
  }
  .message .content-body{
    text-align: left;
    top: 54px;
    padding: 0 10px;
  }
  .content-body > div{
    width: 100%;
    overflow-y: scroll;
    height: 100%;
  }
  .content-body > div::-webkit-scrollbar{
    display: none;
  }
  .content-body > div > ul > li{
    box-sizing: border-box;
    padding: 10px 0 10px 30px;
    background-repeat: no-repeat;
    background-position: left 10px;
    background-size: 20px auto;
  }
  .content-body .message-list{
    /* border-bottom: 1px solid #d9d9d9; */
    border-bottom-width: 1px;
    border-bottom-style: solid;
    position: relative;
  }
  .content-body .message-list > p{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    /* padding-top: 10px; */
    margin-bottom: 5px;
    display: table;
  }
  .content-body .message-list > div{
    max-width: 90%;
    text-overflow:ellipsis; 
    display: -webkit-box;
     /* autoprefixer: off */
    -webkit-box-orient: vertical;
     /* autoprefixer: on */
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
  .content-body .message-list > img{
    width: 5px;
    height: 10px;
    position: absolute;
    right: 0;
    top: 50%;
    margin-top: -5px;
  }
  .message-content{
    min-height: 40px;
    line-height: 1.6;
  }
  .has-new-message{
    display:table-cell;
    vertical-align: middle;
  }
  .has-new-message > span{
    display: inline-block;
    width: 32px;
    height: 16px;
    line-height: 18px;
    margin-left: 10px;
    text-align: center;
    border-radius: 2px;
    margin-left: 8px;
  }
</style>
