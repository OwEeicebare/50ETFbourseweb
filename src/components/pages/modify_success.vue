<template>
  <div class="modify">
    <CHeader :title="title" backBol="true" :backUrl="backUrl"></CHeader>
    <div class="content-body has-header main-bg">
      <SimpleState imgSrc="/static/images/market/img_success.svg"  :message="message"></SimpleState>
    </div>
  </div>
</template>
<script>
import CHeader from '@/components/common/IHeader.vue'
import SimpleState from '@/components/common/SimpleState.vue'
export default {
  data () {
    return {
      timer: null,//定时器
    }
  },
  components: {
    CHeader,
    SimpleState
  },
  computed: {
    title () {
      if (this.$route.query.title) {
        return this.$route.query.title;
      } else {
        return '';
      }
    },
    message () {
      if (this.$route.query.message) {
        return this.$route.query.message;
      } else {
        return '操作成功';
      }
    },
    backUrl () {
      if (this.$route.query.type === 'register') {
        return '/login'
      } else if (this.$route.query.type === 'forgetPass' || this.$route.query.type === 'changeTel' ||this.$route.query.type === 'resetPass') {
        // 重置密码 入口为忘记密码
        this.$store.commit('LOGOUT');
        return '/login';
      } else if (this.$route.query.type === 'withdraw') {
        return '/withdraw'
      }
      return '/set'
    }
  },
  mounted () {
    this.timer = setTimeout(() => {
      this.$router.push(this.backUrl);
    }, 1500);
  },
  destroyed () {
    clearTimeout(this.timer);
    sessionStorage.removeItem('tel');
  }
}
</script>
<style scoped>
  .modify{
    height: 100%;
  }
  .content-body{
    /* top: 54px; */
  }

</style>
