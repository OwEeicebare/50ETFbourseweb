<template>
  <div class="questions">
    <CHeader title="常见问题" backBol="true"></CHeader>
    <div :class="{'content-body': true, 'has-header': true, 'font28': true, 'main-bg': theme}">
      <div>
        <ul v-if="questions.length">
          <li v-for="item in questions" :key="item.Id">
            <div class="question-wrap"><span class="question"></span><p class="main-color1 white-color normal-padding">{{item.TeName}}</p></div>
            <div class="answer-wrap"><span class="answer"></span><p class="normal-padding" v-html="item.MhSeoDes"></p></div>
          </li>
        </ul>
        <div v-else class="no-problem main-text-color2">
          <img :src="theme ? '/static/images/black/img_nodata.svg' : '/static/images/deal/img_nodata.svg'" alt="">
          <p>暂无数据</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import CHeader from '@/components/common/IHeader.vue'
import api from '@/api'
export default {
  data () {
    return {
      questions: []
    }
  },
  computed: {
    type () {
      return this.$route.query.type;
    },
    theme () {
      // console.log(localStorage.getItem('theme') != null ? JSON.parse(localStorage.getItem('theme')).theme : 0);
      return localStorage.getItem('theme') != null ? JSON.parse(localStorage.getItem('theme')).theme : 0;
    }
  },
  created () {
    // console.log(this.type);
    this.getNormal();
  },
  methods: {
    getNormal () {
      if (this.type === 'withdraw') {
        this.$http.post(api.withProblem).then(res => {
          // console.log(res);
          if (res.data.Status === '1') {
            this.questions = res.data.Data;
          } else {
            this.questions = [];
          }
        })
      } else if (this.type === 'recharge') {
        this.$http.post(api.rechargeProblem).then(res => {
          // console.log(res);
          if (res.data.Status === '1') {
            this.questions = res.data.Data;
          } else {
            this.questions = [];
          }
        })
      } else {
        this.questions = [];
      }
    }
  },
  components: {
    CHeader
  }
}
</script>
<style scoped>
  .questions{
    height: 100%;
  }
  .content-body{
    /* top: 54px; */
    padding: 0 10px;
    text-align: left;
  }
  .content-body > div{
    overflow-y: scroll;
    overflow-x: hidden;
    width: 100%;
    height: 100%;
    -webkit-overflow-scrolling: touch;
  }
  .content-body > div::-webkit-scrollbar{
    display: none;
  }
  ul > li{
    padding: 15px 0;
    overflow: auto;
  }
  ul > li > div{
    position: relative;
  }
  ul > li > div.question-wrap{
    margin-bottom: 15px;
    padding-left: 40px;
  }
  ul > li > div > p::before{
    position: absolute;
    content: '';
    width: 3px;
    height: 5px;
    bottom: 0;
  }
  ul > li > div.question-wrap > p{
    border-radius: 4px 4px 4px 0;
  }
  ul > li > div.question-wrap > p::before{
    left: -3px;
    background: linear-gradient(to right bottom, transparent 50%, #ff787b 50%);
  }
  ul > li > div.answer-wrap > p{
    border-radius: 4px 4px 0 4px;
    background-color: #fff;
    color: #000;
  }
  ul > li > div.answer-wrap > p >>> img{
    width: 100%;
  }
  ul > li > div.answer-wrap > p >>> p{
    line-height: 1.6;
  }
  ul > li > div.answer-wrap > p::before{
    right: -3px;
    background: linear-gradient(to left bottom, transparent 50%, #fff 50%);
  }
  ul > li > div.answer-wrap{
    max-width: 80%;
    float: right;
    padding-right: 40px;
  }
  ul > li > div > p{
    display: inline-block;
    position: relative;
  }
  ul > li > div > span{
    display: inline-block;
    width: 30px;
    height: 30px;
    position: absolute;
    bottom: 0;
    background-repeat: no-repeat;
    background-size: 100%;
    background-position: center;
  }
  ul > li > div > span.question{
    background-image: url('/static/images/home/icon_faq_Q.svg');
    left: 0;
  }
  ul > li > div > span.answer{
    background-image: url('/static/images/home/icon_faq_A.svg');
    right: 0;
  }
  .no-problem{
    margin: 50px auto 0;
    text-align: center;
  }
  .no-problem > img{
    width: 100px;
    height: 100px;
  }
</style>
