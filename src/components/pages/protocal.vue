<template>
  <div class="protocal">
    <CHeader :title="information.MaNa" backBol="true" ></CHeader>
    <div class="content-body has-header main-bg">
      <div>
        <h2 class="font32 normal-margin">{{information.MaNa}}</h2>
        <div class="protocal-content font28 table-text-color">
          <p v-html="information.MhCo"></p>
        </div>
        <div class="line"></div>
        <div class="agreen-term font24">
          <div class="protocal-term main-text-color2" v-for="(item,i) in protocal.term" :key="i">
            <input type="checkbox" :id="'term' + i" v-model="item.state" :name="'term' + i">
            <label :for="'term' + i" class="rise-color">{{item.value}}</label>
          </div>
        </div>
      </div>
    </div>
    <div :class="{'agreen': true, 'font32': true, 'white-color': true,'line-color': !btnEnable, 'main-color1': btnEnable }" @click="agreen">同意</div>
  </div>

</template>
<script>
import CHeader from '@/components/common/IHeader.vue'
export default {
  data () {
    return {
      protocal: {},
      type: ''
    }
  },
  components: {
    CHeader
  },
  computed: {
    btnEnable () {
      for (let i = 0; i < this.protocal.term.length; i++) {
        if (!this.protocal.term[i].state) {
          // console.log('false', this.protocal.term[i].state);
          return false;
        }
      }
      // console.log('true');
      return true;
    },
    id () {
      return Number(this.$route.query.id);
    },
    information () {
      for (let i = 0; i < this.$store.state.auProtocal.length; i++) {
        if (this.id === this.$store.state.auProtocal[i].Id) {
          return this.$store.state.auProtocal[i];
        }
      }
      return '';
    }
  },
  created () {
    // console.log(this.$store.state.protocal , this.id);
    for (let i = 0; i < this.$store.state.protocal.length; i++) {
      if (this.id === this.$store.state.protocal[i].id) {
        // console.log(this.$store.state.protocal[i], this.id)
        this.protocal = this.$store.state.protocal[i];
        break;
      }
    }
    // console.log(this.protocal);
  },
  mounted () {

  },
  methods: {
    agreen () {
      if (this.btnEnable) {
        this.$store.commit('CHANGE_PROTOCAL_STATE', { id: this.id, 'value': true });
        this.$router.go(-1);
      } else {
        return false;
      }
    }
  },
  destroyed () {
    if (this.btnEnable) {
      this.$store.commit('CHANGE_PROTOCAL_STATE', { 'type': this.type, 'value': true });
    } else {
      this.$store.commit('CHANGE_PROTOCAL_STATE', { 'type': this.type, 'value': false });
    }
  }
}
</script>
<style scoped>
  .protocal{
    height: 100%;
    text-align: left;
  }
  .content-body{
    top: 56px;
    bottom: 50px;
    padding: 10px 10px 0 10px;
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
    line-height: 24px;
  }
  .protocal-content > p >>> img{
    width: 100%;
  }
  .protocal-content > p >>> p{
    line-height: 1.6;
  }
  .agreen{
    position: fixed;
    bottom: 0;
    height: 50px;
    width: 100%;
    line-height: 50px;
    text-align: center;
  }
  .line{
    margin: 15px auto;
    width: 100%;
    height: 1px;
    background-color: #ebebeb;
  }
  .protocal-term > input[type='checkbox']{
    width: 15px;
    height: 15px;
    background-color: #d9d9d9;
    -webkit-appearance: none;
    border-radius: 2px;
    border: none;
    outline: none;
    position: absolute;
    top: 2px;
    left: 0;
  }
  .protocal-term > input[type='checkbox']:checked{
    background: #ff787b url('/static/images/my/icon_certification_select.svg') no-repeat center;
    background-size: 90%;
  }
  .protocal-term {
    margin-bottom: 15px;
    text-align: left;
    vertical-align: top;
    position: relative;
    padding-left: 24px;
  }
</style>
