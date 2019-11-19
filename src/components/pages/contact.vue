<template>
  <div class="contact main-bg">
    <CHeader title="联系客服" backBol="true" backUrl="/mine"></CHeader>
    <div class="content-body has-header">
      <div class="authentication-info font28 assist-color3" v-if="contact.cumqq || contact.cumweixin || contact.cumTel">
        <ul class="main-bg">
          <li class="normal-border-color" v-if="contact.cumqq">
            <span>客服Q<span class="hidden">a</span>Q：{{contact.cumqq}}</span>
            <span class="copy-color" v-clipboard:copy="contact.cumqq" v-clipboard:success="onCopy" v-clipboard:error="onError">点击复制</span>
          </li>
          <li v-if="contact.cumweixin">
            <span>客服微信：{{contact.cumweixin}}</span>
            <span class="copy-color" v-clipboard:copy="contact.cumweixin" v-clipboard:success="onCopy" v-clipboard:error="onError">点击复制</span>
          </li>
        </ul>
        <div class="main-text-color2 normal-padding font24">工作时间：工作日{{contact.Wt}}</div>
        <ul class="urgent main-bg">
          <li v-if="contact.cumTel" class="normal-border-color">
            <span>客服热线</span>
            <span><a :href="'tel:' + contact.cumTel" class="main-text-color1">{{contact.cumTel}}</a></span>
          </li>
        </ul>
      </div>
      <div class="normal-padding" v-else>暂无相关信息</div>
    </div>
  </div>
</template>
<script>
import CHeader from '@/components/common/IHeader.vue'
export default {
  data () {
    return {
      contact: this.$store.state.contact
    }
  },
  components: {
    CHeader
  },
  methods: {
    onCopy: function (e) {
      // alert('You just copied: ' + e.text);
      this.$toast({
        message: '已复制',
        position: 'bottom',
        duration: 3000
      })
    },
    onError: function (e) {
      // alert('Failed to copy texts');
    },
    judgeEmptyObj (obj) {
      for (let item in obj) {
        return true;
      }
      return false;
    }
  },
  created () {
    if (!this.judgeEmptyObj(this.contact)) {
      var info = JSON.parse(window.localStorage.getItem("againInfo"));
      if(!info){//取不到代理信息
        this.$store.dispatch("get_againInfo").then(res=>{
          info = JSON.parse(window.localStorage.getItem("againInfo")).id;
          this.$store.dispatch('get_contact',info).then(res => {
            this.contact = res;
          })
        })
      }else{
        this.$store.dispatch('get_contact',info.id).then(res => {
          this.contact = res;
        })
      }
    }
  },
  mounted () {

  }
}
</script>
<style scoped>
  .contact{
    height: 100%;
  }
  .contact .content-body{
    /* top: 56px; */
    text-align: left;
  }
  .contact .content-body > div{
    padding-top: 10px;
  }
  .contact .authentication-info > ul{
    padding: 0 10px;
  }
  .contact .authentication-info ul > li{
    height: 50px;
    line-height: 50px;
    /* border-bottom: 1px solid #d9d9d9; */
    border-bottom-width: 1px;
    border-bottom-style: solid;
    overflow: auto;
  }
  .contact .authentication-info > ul:nth-child(1) > li:nth-last-child(1) {
    border: none;
  }
  .contact .authentication-info ul > li > span:nth-child(1) {
    float: left;
  }
  .contact .authentication-info ul > li > span:nth-child(2) {
    float: right;
  }
  .contact .separate{
    width: 100%;
  }
  .contact .urgent{
    padding: 0 10px;
    height: 50px;
    line-height: 50px;
  }
  .contact  .authentication-info ul.urgent > li{
    border-bottom-width: 1px;
    border-bottom-style: solid;
  }
</style>



