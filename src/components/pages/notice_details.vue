<template>
  <div class="notice-details">
    <CHeader title="公告详情" backBol="true"></CHeader>
    <div class="content-body has-header normal-padding main-bg">
      <div>
        <h2 class="font32 normal-margin">{{notices.length ? notice.Ti : ''}}</h2>
        <div class="main-text-color2 font24 notice-info">
          <span>{{notices.length ? formatDate(notice.Pt) : '--:--'}}</span>
        </div>
        <div class="font28 article-content" v-if="notices.length">
          <p class="content-text-color" v-html="notice.Cc"></p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Api from "@/api";
import formatDate from "../../../static/js/format_date.js";
import CHeader from "@/components/common/IHeader.vue";
export default {
  data() {
    return {
      notices: []
      // notice: {}
    };
  },
  computed: {
    id() {
      return this.$route.query.id;
    },
    notice() {
      if (this.id) {
        // console.log(this.id)
        for (let i = 0; i < this.notices.length; i++) {
          if (Number(this.id) === this.notices[i].Id) {
            return this.notices[i];
          }
        }
      } else {
        this.$router.push("/");
      }
    },
    login() {
      //登录状态
      if (localStorage.getItem("login") == null) {
        return false;
      } else {
        return true;
      }
    }
  },
  components: {
    CHeader
  },
  mounted() {},
  methods: {
    formatDate: formatDate.formatDate,
    getNotice() {//获取公告信息
      var info = JSON.parse(window.localStorage.getItem("againInfo"));
      if(!info){//取不到代理信息
        this.$store.dispatch("get_againInfo").then(res=>{
          info = JSON.parse(window.localStorage.getItem("againInfo")).id
          this.$store.dispatch("get_visitor_notice",info).then(res => {
            this.notices = res;
          });
        })
      }else{
        this.$store.dispatch('get_visitor_notice',info.id).then(res => {
          this.notices = res;
        })
      }
    }
  },
  created() {
    // this.$store.dispatch("read_notice", this.id);
    this.getNotice();
  }
};
</script>
<style scoped>
.notice-details {
  height: 100%;
}
.content-body {
  text-align: left;
  top: 56px;
}
.content-body > div {
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}
.content-body > div img {
  width: 100%;
}
.content-body > div::-webkit-scrollbar {
  display: none;
}
.content-body > div .article-content {
  color: #414141;
  line-height: 1.6;
}
.content-body > div .article-content > p >>> img {
  width: 100%;
}
.content-body > div .article-content > p >>> p {
  line-height: 1.6;
}
.notice-info {
  margin-bottom: 20px;
}
</style>
