<template>
  <div>
    <CHeader title="资讯详情" backBol="true"></CHeader>
    <div class="content-body has-header normal-padding main-bg">
      <div>
        <h2 class="font32 normal-margin">{{information.Ti}}</h2>
        <div class="main-text-color2 font24 normal-margin"><span>{{formatDate(information.Pt)}}</span></div>
        <img :src="information.img" class="normal-margin" alt="图片加载失败" v-if="information.img">
        <div class="font28 article-content">
          <p class="content-text-color"  v-html="information.Dibe"></p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Api from '@/api'
import formatDate from '../../../static/js/format_date.js'
import CHeader from '@/components/common/IHeader.vue'
export default {
  data () {
    return {
      information: {}
    }
  },
  computed: {
    id () {
      return this.$route.query.id;
    }
  },
  components: {
    CHeader
  },
  created () {
    // 获取资讯详情
    this.$http({
      url: Api.article,
      params: {
        Id: this.id
      },
      method: 'post'
    }).then(res => {
      // console.log('资讯详情', res.data);
      if(res.data.Status === '1') {
        this.information = res.data.Data[0];
        // console.log(this.formatDate(this.information.Pt));
      }
    })
  },
  mounted() {

  },
  methods: {
    formatDate: formatDate.formatDate
  }
}
</script>
<style scoped>
  .white-space{
    white-space: pre-wrap;
  }
  .content-body{
    text-align: left;
    border-top: 1px solid #d9d9d9;
  }
  .content-body > div img{
    width: 100%;
    height: 200px;
  }
  .content-body > div .article-content{
    color: #414141;
    line-height: 22px;
  }
  .content-body > div{
    overflow-y: scroll;
    overflow-x: hidden;
    height: 100%;
    width: 100%;
    -webkit-overflow-scrolling: touch;
  }
  .content-body > div::-webkit-scrollbar{
    display: none;
  }
  .content-body > div .article-content > p >>> img{
    width: 100%;
  }
  .content-body > div .article-content > p >>> p{
    line-height: 1.6;
  }
</style>
