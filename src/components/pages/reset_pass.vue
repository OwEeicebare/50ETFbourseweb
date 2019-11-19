<template>
  <div class="login">
    <CHeader title="重置密码" backBol="true"></CHeader>
    <div class="content-body has-header main-bg">
      <form class="font28">
        <div class="reset-title">
          <p class="font40 normal-margin">请您设置登录密码</p>
          <p class="font24 main-text-color2">请设置6-24位英文数字组合密码</p>
        </div>
        <div class="form-item">
          <input
            type="password"
            placeholder="请设置新密码"
            class="assist-color3 normal-padding main-text-color1"
            v-model="pass"
          >
        </div>
        <div class="form-item">
          <input
            type="password"
            placeholder="请重复新密码"
            class="assist-color3 normal-padding main-text-color1"
            v-model="repeatPass"
          >
        </div>
        <div class="form-item">
          <div class="main-color1 white-color" @click="sure">确定</div>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import api from "@/api";
import CHeader from "@/components/common/IHeader.vue";
export default {
  data() {
    return {
      pass: "",
      repeatPass: ""
    };
  },
  components: {
    CHeader
  },
  computed: {
    origin() {
      return this.$route.query.origin;
    },
    tel(){
      let tel = sessionStorage.getItem('tel');
      if (tel != null) {
        return tel;
      } else {
        return '';
      }
    }
  },
  methods: {
    sure() {
      if (this.pass.length < 6 || this.pass.length > 24) {
        this.$toast({
          message: "密码长度应在6-24区间内",
          position: "bottom",
          duration: 1000
        });
        return;
      }
      var reg = /^([a-zA-Z]+\d+)|(\d+[a-zA-Z]+)$/;
      if (!reg.test(this.pass)) {
        
        this.$toast({
          message: "密码由英文数字组成",
          position: "bottom",
          duration: 1000
        });
        return;
      }
      if (this.repeatPass !== this.pass) {
        this.$toast({
          message: "两次密码输入不一致",
          position: "bottom",
          duration: 1000
        });
        return;
      }
      if (this.origin === "change") {
        // 设置 修改密码 重置密码
        this.$http.post(api.resetPwd,{"Uphe": this.tel,"Pord":this.pass}).then(res=>{
        if(res.data.Status==1){
          this.$router.push({path: "/modify-success",query: { title: "重置密码", message: "重置密码成功",type:'resetPass' }});
        }else{
          this.$toast({
            message: res.data.Msg,
            position: "bottom",
            duration: 2000
          });
        }
      })
      
      } else if (this.origin === "register") {
        // 注册 设置密码
        this.$store.commit("SAVE_REGISTER", {type: "Apass",value: this.pass});
        this.$http.post(api.register, this.$store.state.register).then(res => {
          if (res.data.Status === "1") {
            this.$router.push({path: "/modify-success",query: { title: "注册", message: "注册成功", type: "register" }});
          } else { 
            this.$toast({
              message: res.data.Msg,
              position: "bottom",
              duration: 2000
            });
            this.$router.push("/register");
          }
        });
      } else if (this.origin === "forgetPass") {
        //忘记密码:修改密码
        this.$http.post(api.resetPwd,{"Uphe": this.tel,"Pord":this.pass}).then(res=>{
          if(res.data.Status==1){
            this.$router.push({path: "/modify-success", query: { title: "重置密码",message: "重置密码成功",type: "forgetPass"}});
          }else{
            this.$toast({
              message: res.data.Msg,
              position: "bottom",
              duration: 2000
            });
          }
        })
      }
    }
  }
};
</script>
<style scoped>
.login {
  height: 100%;
}
.reset-title {
  margin: 25px 0 15px;
}
.form-item {
  height: 40px;
  margin-bottom: 15px;
}
.content-body > form {
  text-align: left;
  width: 325px;
  margin: 0 auto;
}
.form-item > input {
  border-radius: 4px;
  border: none;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
.form-item > input:-ms-input-placeholder {
  color: #999;
}
.form-item > input::-webkit-input-placeholder {
  color: #999;
}
.form-item > div {
  width: 100%;
  border: none;
  border-radius: 4px;
  height: 40px;
  line-height: 40px;
  margin-top: 25px;
  text-align: center;
}
</style>
