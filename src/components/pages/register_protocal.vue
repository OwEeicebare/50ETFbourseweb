<template>
  <div class="protocal">
    <CHeader title="注册协议" backBol="true" backUrl="/register"></CHeader>
    <div class="content-body has-header main-bg normal-padding">
      <div>
        <h2 class="font32 normal-margin">{{protocal != null ? protocal.MaNa : ''}}</h2>
        <div class="protocal-content font28 table-text-color">
          <p v-html="protocal != null ? protocal.MhCo : ''"></p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import api from '@/api'
import CHeader from '@/components/common/IHeader.vue'
export default {
  data () {
    return {
      protocal: null
    }
  },
  components: {
    CHeader
  },
  computed: {

  },
  mounted () {

  },
  created () {
    // 获取注册协议信息
    this.$http.post(api.registerProtocal).then(res => {
      // console.log('注册协议信息', res.data);
      if (res.data.Status === '1') {
        this.protocal = res.data.Data[0];
      }
    })
  },
  methods: {

  }
}
</script>
<style scoped>
  .protocal{
    height: 100%;
    text-align: left;
  }
  .content-body{
    top: 54px;
  }
  .content-body > div{
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
  }
  .content-body > div::-webkit-scrollbar{
    display: none;
  }
  .protocal-content{
    line-height: 1.6;
  }
  .protocal-content > p >>> img{
    width: 100%;
  }
  .protocal-content > p >>> p{
    line-height: 1.6;
  }
  .line{
    margin: 10px auto;
    width: 100%;
    height: 1px;
    background-color: #ebebeb;
  }
</style>
