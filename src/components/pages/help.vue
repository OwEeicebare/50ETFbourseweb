<template>
  <div class="help">
    <CHeader title="帮助中心" backBol="true" backUrl="/mine"></CHeader>
    <div :class="{'content-body': true, 'has-header': true, 'font28': true, 'main-bg': theme, 'assist-color3': !theme}">
      <div>
        <ul>
          <li v-for="item in helpType" :key="item.Id" :class="{'normal-margin': true, 'open': activeType === item.Id}">
            <div @click="switchType" :data-id="item.Id" :class="{'main-bg': !theme, 'help-title': true, 'assist-color3': theme}">{{item.Tie}}<span :class="{'icon': true, 'rotate90': activeType === item.Id}"></span></div>
            <div :class="{'open': activeType === item.Id, 'content': true, 'assist-color3': !theme, 'main-bg': theme}">
              <ul>
                <li v-for="zitem in typeList" :key="zitem.id">
                  <div class="question-wrap"><span class="question"></span><p class="main-color1 white-color normal-padding">{{zitem.TeName}}</p></div>
                  <div class="answer-wrap"><span class="answer"></span><p class="normal-padding" v-html="zitem.MhSeoDes"></p></div>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import Api from '@/api'
import CHeader from '@/components/common/IHeader.vue'
export default {
  components: {
    CHeader
  },
  data () {
    return {
      helpType: [],
      activeType: 0,
      typeList: []
    }
  },
  computed: {
    theme () {
      // console.log(localStorage.getItem('theme') != null ? JSON.parse(localStorage.getItem('theme')).theme : 0);
      return localStorage.getItem('theme') != null ? JSON.parse(localStorage.getItem('theme')).theme : 0;
    }
  },
  methods: {
    switchType (e) {
      var id = Number(e.target.dataset.id);
      if (this.activeType === id) {
        this.activeType = 0;
      } else {
        this.$http({url: Api.helpList, method: 'post', params: {Id: id}}).then(res => {
          // console.log('帮助列表',res.data);
          if (res.data.Status === '1') {
            this.activeType = id;
            this.typeList = res.data.Data;
          }
        })
      }
    }
  },
  created () {
    //获取帮助数据
    this.$http({url:Api.help,params:{iAgentId:JSON.parse(window.localStorage.getItem("againInfo")).id},method:'post'}).then(res => {
      // console.log('帮助中心', res.data);
      if (res.data.Status === '1') {
        this.helpType = res.data.Data;
      }
    })
  }
}
</script>
<style scoped>
  .content-body{
    padding: 10px 10px 0 10px;
  }
  .content-body > div{
    overflow-y: scroll;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    width: 100%;
    height: 100%;
    text-align: left;
  }
  .content-body > div::-webkit-scrollbar{
    display: none;
  }
  .content-body > div > ul > li{
    height: 40px;
  }
  .content-body > div > ul > li.open{
    height: auto;
  }
  ul > li > div.help-title{
    position: relative;
    height: 40px;
    line-height: 40px;
    border-radius: 4px;
    padding-left: 10px;
  }
  ul > li > div.help-title > span.icon{
    position: absolute;
    width: 6px;
    height: 12px;
    top: 14px;
    right: 10px;
    background: url('/static/images/home/arrow_right.svg') no-repeat center;
    background-size: 100%;
    animation: all .8s linear;
  }
  ul > li > div.help-title > span.rotate90{
    transform: rotate(90deg);
    animation: all .8s linear;
  }
  ul > li > div.content {
    overflow: hidden;
    height: 0;
    animation: all .8s linear;
  }
  ul > li > div.open{
    height: auto;
    animation: all .8s linear;
  }

  ul >  li > div.content > ul > li{
    padding: 15px 0;
    overflow: hidden;
  }
  ul >  li > div.content > ul > li > div{
    position: relative;
  }
  ul >  li > div.content > ul > li > div.question-wrap{
    margin-bottom: 15px;
    padding-left: 40px;
  }
  ul >  li > div.content > ul > li > div > p::before{
    position: absolute;
    content: '';
    width: 3px;
    height: 5px;
    bottom: 0;
  }
  ul >  li > div.content > ul > li > div.question-wrap > p{
    border-radius: 4px 4px 4px 0;
  }
  ul >  li > div.content > ul > li > div.question-wrap > p::before{
    left: -3px;
    background: linear-gradient(to right bottom, transparent 50%, #ff787b 50%);
  }
  ul >  li > div.content > ul > li > div.answer-wrap > p{
    border-radius: 4px 4px 0 4px;
    background-color: #fff;
    color: #000;
  }
  ul >  li > div.content > ul > li > div.answer-wrap > p >>> img{
    width: 100%;
  }
  ul >  li > div.content > ul > li > div.answer-wrap > p >>> p{
    line-height: 1.6;
  }
  ul >  li > div.content > ul > li > div.answer-wrap > p::before{
    right: -3px;
    background: linear-gradient(to left bottom, transparent 50%, #fff 50%);
  }
  ul >  li > div.content > ul > li > div.answer-wrap{
    max-width: 80%;
    float: right;
    padding-right: 40px;
  }
  ul >  li > div.content > ul > li > div > p{
    display: inline-block;
    position: relative;
  }
  ul >  li > div.content > ul > li > div > span{
    display: inline-block;
    width: 30px;
    height: 30px;
    position: absolute;
    bottom: 0;
    background-repeat: no-repeat;
    background-size: 100%;
    background-position: center;
  }
  ul >  li > div.content > ul > li > div > span.question{
    background-image: url('/static/images/home/icon_faq_Q.svg');
    left: 0;
  }
  ul >  li > div.content > ul > li > div > span.answer{
    background-image: url('/static/images/home/icon_faq_A.svg');
    right: 0;
  }

</style>
