<template>
  <div class="bank">
    <CHeader title="绑定银行卡" backBol="true" :backUrl="type"></CHeader>
    <div class="content-body has-header main-bg">
      <div>
        <ul>
          <li v-for="item in cardList" :key="item.Id" class="white-color font28 card" :style="{'backgroundImage': 'url(' + (item.Log && item.Log.length > 1 ? item.Log : '/static/images/my/g.svg') + ')', 'backgroundColor': item.YanSe && item.YanSe.length > 1 ? item.YanSe : '#ff787b' }" :data-id="item.Id" @click="next">
            <p class="normal-margin bank-name">{{item.BkName}}<span class="white-color font20 main-color2" v-if="item.sort">默认</span></p>
            <p>{{formatCardNumber(item.BkCard)}}</p>
          </li>
          <router-link :to="{path: '/add-card', query: {type: type}}" tag="div" class="add-entrance assist-color3 main-text-color2 font28">添加银行卡</router-link>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import $axios from 'axios';
import api from '@/api';
import CHeader from '@/components/common/IHeader.vue'
export default {
  //进入路由验证是否实名
  beforeRouteEnter:(to,from,next)=>{
    $axios.post(api.autonymState).then(res=>{
      if(res.data.Status==="1"){
        if(res.data.Data.NTure!==1){//未实名
          next('/')
        }else{
          next();
        }
      }
    })
  },
  data () {
    return {
      cardList: []
    }
  },
  components: {
    CHeader
  },
  methods: {
    judgeEmptyObj (obj) {
      for (var key in obj) {
        // console.log(key);
        return false;//不为空对象
      }
      return true//空对象
    },
    judgeRequestData () {
      this.$store.dispatch('get_card_list').then(res => {
        this.cardList = res;
      });
    },
    formatCardNumber (num) {
      if (num && num.length > 12) {
        return `${"*".repeat(num.length - 4).replace(/(.{4})/g, `$1 `)}${num.length % 4 ? " " : ""}${num.slice(-4)}`;
      }
      return num;
    },
    next (e) {
      // console.log('拿到的id', e.target.dataset.id, e.currentTarget.dataset.id);
      let id = e.target.dataset.id ? Number(e.target.dataset.id) : Number(e.currentTarget.dataset.id);
      if (this.type === 'withdraw') {
        // console.log('提交到mutation', id);
        this.$store.commit('CHANGE_DEFAULT_BANK', id);
        // console.log('withdraw', this.$store.state.defaultCard);
        this.$router.push(this.type);
      } else {
        this.$router.push({path: '/card', query: {type: this.type, id: id }});
      }
    }
  },
  computed: {
    type () {
      if (this.$route.query.type) {
        // console.log(this.$route.query.type);
        return this.$route.query.type;
      } else {
        return '/set';
      }
    },
    defaultCard () {
      return this.$store.state.defaultCard;
    }
  },
  mounted () {

  },
  created () {
    this.judgeRequestData();
  }
}
</script>
<style scoped>
  .bank{
    height: 100%;
  }
  .content-body{
    top: 56px;
    padding: 10px;
    text-align: left;
  }
  .content-body > div{
    overflow-y: scroll;
    width: 100%;
    height: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  li.card{
    /* height: 75px; */
    padding: 15px 0;
    background-repeat: no-repeat;
    border-radius: 4px;
    background-size: 30px 30px;
    background-position: 10px 15px;
    padding-left: 50px;
    padding-top: 15px;
    margin-bottom: 15px;
  }
  .add-entrance{
    padding: 10px 0 10px 35px;
    background-image: url('/static/images/my/icon_card_add.svg');
    background-repeat: no-repeat;
    background-size: 15px;
    background-position: 10px;
    border-radius: 4px;
  }
  .bank-name > span{
    display: inline-block;
    margin-left: 10px;
    width: 24px;
    padding: 0 3px;
    border-radius: 2px;
  }
</style>
