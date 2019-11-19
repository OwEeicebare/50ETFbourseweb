<template>
  <div class="authenticate">
    <CHeader title="系统自动验证" backBol="true" backUrl="/authenticationSelect"></CHeader>
    
    <div class="content-body has-header main-bg">
      <span :class="{'revoke-tips': true, 'normal-padding': true, 'rise-color': !theme, 'assist-color1': true, 'font24': true, 'tab-active-color': theme,'toptip':true}">此认证方式仅支持大陆身份证</span>
      <div>
        <ul class="font28">
          <li class="normal-border-color">
            真实姓名
            <input
              type="text"
              placeholder="请输入"
              v-model="name"
              @input="monitorName"
              class="main-bg main-text-color1"
            >
          </li>
          <li class="normal-border-color">
            身份证号
            <input
              type="text"
              placeholder="请输入"
              v-model="id"
              @input="monitorId"
              class="main-bg main-text-color1"
            >
          </li>
        </ul>
        <p class="font24 assist-color3 main-text-color2 read-tips">请认真阅读并确认以下协议</p>
        <ul class="font28">
          <router-link
            tag="li"
            v-for="item in auProtocal"
            :key="item.Id"
            :to="{ path: '/protocal', query: {id: item.Id}}"
            class="normal-border-color"
          >
            {{item.MaNa}}
            <span class="main-text-color2">{{item.state ? '已签' : '未签'}}</span>
          </router-link>
        </ul>
      </div>
    </div>
    <div
      :class="{'next-step': true, 'font32': true, 'white-color': true,'line-color': !btnEnable, 'main-color1': btnEnable}"
      @click="next"
    >提交</div>
  </div>
</template>
<script>
import api from '@/api'
import CHeader from '@/components/common/IHeader.vue'
export default {
  data () {
    return {
      name: '',//姓名
      id: '',//身份证号
      temp_btnEnable:true,
      
    }
  },
  components: {
    CHeader
  },
  computed: {
    protocals () {//带状态的协议数组
      return this.$store.state.protocal;
    },
    auProtocal () {//所有待签定的协议
      var authenProtocals = [];
      for (let j = 0; j < this.$store.state.auProtocal.length; j++) {
        authenProtocals.push(this.$store.state.auProtocal[j]);
        for (let i = 0; i < this.protocals.length; i++) {
          if (this.protocals[i].id === authenProtocals[j].Id) {
            authenProtocals[j].state = this.protocals[i].state;
            break;
          }
        }
      }
      return authenProtocals;
    },
    theme () {
      // console.log(localStorage.getItem('theme') != null ? JSON.parse(localStorage.getItem('theme')).theme : 0);
      return localStorage.getItem('theme') != null ? JSON.parse(localStorage.getItem('theme')).theme : 0;
    },
    againId(){
      if (!this.protocals.length) {
        var info = JSON.parse(window.localStorage.getItem("againInfo"));
        if(!info){//取不到代理信息
          this.$store.dispatch("get_againInfo").then(res=>{
            info = JSON.parse(window.localStorage.getItem("againInfo")).id;
            this.$store.dispatch('get_protocal',info).then(res => {
              // console.log('初始化协议', this.auProtocal);
            })
          })
        }else{
          this.$store.dispatch('get_protocal',info.id).then(res => {
            // console.log('初始化协议', this.auProtocal);
          })
        }
      }
    },
    btnEnable(){//是否启用提交按钮
        if(this.trim(this.name).length>0 && this.trim(this.id).length>0){
          for (let i = 0; i < this.auProtocal.length; i++) {
              if (!this.auProtocal[i].state) {
                return false;
              }
          }
          return true;
        }
        return false;
    }
  },
  //进入路由验证是否实名
  beforeRouteEnter:(to,from,next)=>{
    window.sessionStorage.setItem("FROMPATH",from.path);
    next();
  },
  methods: {
    back () {
        this.$router.go(-1);
    },
    monitorName () {
         this.$store.commit('SAVE_AUTONYM', { 'type': 'name', 'value': this.name });
    },
    monitorId () {
         this.$store.commit('SAVE_AUTONYM', { 'type': 'id', 'value': this.id });
    },
    trim (str) {   
      return str.replace(/(^\s*)|(\s*$)/g, "");   
    },
    //校验是否包含中文
    verifiChiness(value){
      let reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
      if(reg.test(value)){
        this.$message({
          title: "",
          message: "身份证不能包含中文字符",
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: "切换认证方式",
          confirmButtonHighlight: true,
          cancelButtonText: "重新填写"
        }).then(action => {
            if (action == "confirm") {
                this.$router.push('/authenticationSelect');
            }
        });
        return false
      }
      return true
    },
    //校验身份证长度
    verifiLength(value){
      if(value.length!=15 && value.length!=18){
        this.$message({
          title: "",
          message: "身份证位数不正确",
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: "切换认证方式",
          confirmButtonHighlight: true,
          cancelButtonText: "重新填写"
        }).then(action => {
            if (action == "confirm") {
                this.$router.push('/authenticationSelect');
            }
        });
        return false
      }
      return true
    },
    next(){
        if(this.btnEnable && this.temp_btnEnable && this.verifiChiness(this.id) && this.verifiLength(this.id)){
          this.temp_btnEnable=false;
          this.$http.post(api.authenticateCardName,{UserName:this.trim(this.name),CarNo:this.trim(this.id)}).then(res=>{
              if(res.data.Status==1){//认证成功
                  this.$router.push('/authenticate-success')
              }else{//认证失败
              this.temp_btnEnable=true;
                this.$message({
                    title: "",
                    message: res.data.Msg,
                    showConfirmButton: true,
                    showCancelButton: true,
                    confirmButtonText: "切换认证方式",
                    confirmButtonHighlight: true,
                    cancelButtonText: "重新填写"
                }).then(action => {
                    if (action == "confirm") {
                        this.$router.push('/authenticationSelect');
                    }
                });
              }
          })
        }
    }
  },

  created () {
    if(window.sessionStorage.getItem("FROMPATH")!='/protocal'){
      this.$message({
          title: "提示",
          message: '认证信息需与绑定的银行卡信息一致，切勿冒用他人身份证信息',
      })
    }
    console.log(this.againId)//为了执行计算机属性
  },
  mounted () {
    this.name = this.$store.state.autonym.name ? this.$store.state.autonym.name : '';
    this.id = this.$store.state.autonym.id ? this.$store.state.autonym.id : '';
  },
}
</script>
<style scoped>
.toptip{
    text-align: left;
    display: block
}
.authenticate {
  height: 100%;
}
.content-body {
  /* top: 56px; */
  bottom: 50px;
  text-align: left;
  /* padding: 0 10px; */
}
.content-body > div {
  overflow-y: scroll;
  width: 100%;
  overflow-x: hidden;
  height: 100%;
}
.authenticate-header {
  position: fixed;
  height: 24px;
  line-height: 24px;
  width: 100vw;
  text-align: center;
  top: 0;
  padding-top: 10px;
  padding-bottom: 10px;
  z-index: 100001;
}
.back {
  left: 0;
  position: absolute;
  height: 20px;
  top: 2px;
  cursor: pointer;
  padding: 10px;
}
.authenticate-header .circle {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 5px;
  position: relative;
}
.authenticate-header .circle::before {
  content: "";
  width: 16px;
  height: 16px;
  position: absolute;
  left: -3px;
  top: -3px;
  border-radius: 50%;
}
.authenticate-header .circle:nth-of-type(1):before {
  background-color: rgba(255, 120, 123, 0.3);
}
.authenticate-header .circle:nth-of-type(4):before {
  background-color: rgba(217, 217, 217, 0.3);
}
.authenticate-header .circle:nth-of-type(4) {
  margin-left: 10px;
}
.authenticate-header span:nth-of-type(2) {
  margin-right: 10px;
}
.authenticate-header .line {
  width: 50px;
  height: 1px;
  display: inline-block;
  vertical-align: middle;
  background-color: #ebebeb;
}
ul {
  padding: 0 10px;
}
ul > li > span,
ul > li > input {
  position: absolute;
  right: 10px;
  z-index: 100;
}
ul > li.higher-li {
  height: 80px;
  line-height: 80px;
  overflow: hidden;
}
ul > li > input[type="file"] {
  height: 100%;
  border: none;
  opacity: 0;
}

ul > li > i > img {
  width: 30px;
}
ul > li {
  height: 50px;
  line-height: 50px;
  /* border-bottom: 1px solid #d9d9d9; */
  border-bottom-width: 1px;
  border-bottom-style: solid;
  background: url("/static/images/home/arrow_right.svg") no-repeat right center;
  background-size: auto 12px;
  position: relative;
}
ul > li > span,
ul > li > input {
  position: absolute;
  right: 12px;
}
ul > li > input {
  height: 100%;
  border: none;
  text-align: right;
  right: 0;
}
ul > li > input:-moz-placeholder {
  text-align: right;
}
ul > li > input:-ms-input-placeholder {
  text-align: right;
}
ul > li > input::-webkit-input-placeholder {
  text-align: right;
}
img.alter-upload {
  position: absolute;
  width: 60px;
  right: 10px;
  top: 10px;
  z-index: 99;
  height: 60px;
}
.next-step {
  position: fixed;
  bottom: 0;
  height: 50px;
  width: 100%;
  line-height: 50px;
}
.read-tips {
  padding: 10px 0 5px 10px;
}
</style>
