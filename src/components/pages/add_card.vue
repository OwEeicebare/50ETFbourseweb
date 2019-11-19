<template>
  <div class="card">
    <CHeader title="添加银行卡" backBol="true"></CHeader>
    <div class="content-body has-header main-bg">
      <div class="authentication-info font28">
        <ul>
          <li class="normal-border-color">持卡人姓名<input type="text" :placeholder="name" readonly="readonly" class="main-text-color1 main-bg"></li>
          <li class="normal-border-color">身份证号码<input type="text" :placeholder="idCard" readonly="readonly" class="main-text-color1 main-bg"></li>
          <li class="normal-border-color bank">开户银行<input type="text" placeholder="请选择" v-model="currentBank" @focus="arouseBank" readonly="readonly" class="main-text-color1 main-bg"></li>
          <li class="normal-border-color region">开户地区<input type="text" placeholder="请选择" v-model="region" @focus="arouseRegion" readonly="readonly" class="main-text-color1 main-bg"></li>
          <li class="normal-border-color">开户支行<input type="text" placeholder="请输入" v-model="subbranch" class="main-text-color1 main-bg"></li>
          <li class="normal-border-color">银行卡号<input type="text" placeholder="请输入" v-model="card" class="main-text-color1 main-bg"></li>
          <li class="normal-border-color">银行卡预留手机号<input type="text" placeholder="请输入" v-model="tel" class="main-text-color1 main-bg"></li>
        </ul>
      </div>
      <div :class="{'next-step': true, 'font32': true, 'white-color': true,'line-color': !btnEnable, 'main-color1': btnEnable }" @click="next">下一步</div>
    </div>
    <div class="mask" v-if="showMask" @click="closeMask"></div>
    <!-- 控制银行选择器 和 地区选择器是否出现 -->
    <div :class="{'selector': true, 'anim': showMask}">
      <mt-picker :slots="banks" valueKey="Tile" @change="onBankChange" :showToolbar="true" ref="bank" v-if="showBank">
        <mt-button @click="handleCancel('bank')" class="cancel font28 main-text-color2">取消</mt-button>
        <mt-button @click="handleConfirm('bank')" class="sure font28 main-text-color2">确认</mt-button>
      </mt-picker>
      <div class="regions" v-if="showRegion">
        <div class="tool-bar font28"><span @click="handleCancel('regions')">取消</span><span @click="handleConfirm('regions')">确定</span></div>
        <div class="picker-wrap">
          <mt-picker :slots="province" valueKey="Nmet" @change="onProvinceChange" ref="province">
          </mt-picker>
          <mt-picker :slots="city" valueKey="Nmet" @change="onCityChange" ref="city">
          </mt-picker>
          <mt-picker :slots="area" valueKey="Nmet" @change="onAreaChange" ref="area">
          </mt-picker>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import $axios from 'axios';
import api from '@/api'
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
      name: '',
      idCard: '',
      region: '',
      subbranch: '',
      card: '',
      tel: '',
      banks: [
        {
          values: [],
          textAlign: 'center'
        }
      ],
      province: [
        {
          flex: 1,
          values: [],
          textAlign: 'center'
        }
      ],
      city: [
        {
          flex: 1,
          values: [],
          textAlign: 'center'
        }
      ],
      area: [
        {
          flex: 1,
          values: [],
          textAlign: 'center'
        }
      ],
      showMask: false,
      currentBank: '',
      currentBankId: 0,
      currentProvince: '',
      currentCity: '',
      currentArea: '',
      currentPCode: '',
      currentCCode: '',
      currentACode: '',
      showBank: false,
      showRegion: false,
      defaultPCode: 0,//默认省级id
      defaultCCode: 0,//默认市集id
      submitAble: true, //避免用户多次点击
    }
  },
  components: {
    CHeader
  },
  methods: {
    next () {
      if (this.btnEnable) {
        // this.$http.post(api.addBank, {BankName: this.currentBank, BankAddress: '中国', Province: this.currentProvince, City: this.currentCity, Area: this.currentArea, BankBranch: this.subbranch, BankCard: this.card, BankAccountName: this.name, IdCard: this.idCard, MobilePhone: this.tel, UserName: this.name, bandid: this.currentBankId}).then(res => {
        //   console.log(res.data);
        //   //保存到vuex中 验证完手机号之后真正提交给后台
        // })
        var strBin = [10,18,30,35,37,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,58,60,62,65,68,69,84,87,88,94,95,98,99];
        if (this.card.length >= 16 && this.card.length <= 19 && (/^[0-9]+$/).test(this.card) && strBin.indexOf(this.card.substring(0,2))) {
          if (this.submitAble) {
            this.submitAble = false;
          } else {
            this.$toast({
              message: '正在提交数据，请耐心等待',
              position: 'bottom'
            })
            return;
          }
           this.$http.post(api.vertifyBank, {"BankCard": this.card}).then(res => {
              // console.log('验证银行卡', res)
              if (res.data.Status === '1') {
                var obj = {
                  "BankName": this.currentBank,
                  "BankAddress": this.currentProvince + ' ' + this.currentCity + ' ' + this.currentArea,
                  "Province": this.currentPCode,
                  "City": this.currentCCode,
                  "Area": this.currentACode,
                  "BankBranch": this.subbranch,
                  "BankCard": this.card,
                  "BankAccountName": this.name,
                  "IdCard": this.idCard,
                  "MobilePhone": this.tel,
                  "UserName": this.name,
                  "bandid": parseInt(this.currentBankId),
                  "Code": "",
                  "SMSCode": "",
                  "Uphe": this.tel
                };
                this.$store.commit('SAVE_ADD_BANKINFO', obj);
                this.sendSms();
                sessionStorage.setItem('addInfo',JSON.stringify(obj));
                this.$router.push({path: '/card-vertify', query: {type: this.type}});
              } else {
                this.submitAble = true;
                this.$toast({
                  message: res.data.Msg,
                  position: 'bottom',
                  duration: 3000
                })
              }
            })
        } else {
          this.$toast({
            message: '银行卡号格式不正确',
            position: 'position',
            duration: 3000
          })
        }

      } else {
        return;
      }
    },
    onBankChange(picker, values) {//修改银行
      this.currentBank = values[0].Tile;
      this.currentBankId = values[0].Id;
    },
    onProvinceChange (picker, values) {//修改省
      if (values[0] === '900000'){
        this.currentProvince = values[0].Nmet;
        this.currentCity = '';
        this.currentArea = '';
        this.currentPCode = values[0].Cder;
        this.currentCCode = '';
        this.currentACode = '';
        this.city[0].values = [];
        this.area[0].values = [];
      } else {
        this.currentProvince = values[0].Nmet;
        this.currentPCode = values[0].Cder;
        this.getCitys(values[0].Cder);
        this.getArea(this.city[0].values[0].Cder);
      }
    },
    onCityChange (picker, values) {//修改市
      // console.log(values[0]);
      if (values[0]) {
        this.currentCity = values[0].Nmet;
        this.currentCCode = values[0].Cder;
        this.getArea(values[0].Cder);
      }
    },
    onAreaChange (picker, values) {//修改区
      // console.log(values[0]);
      if (values[0]) {
        this.currentArea = values[0].Nmet;
        this.currentACode = values[0].Cder;
      }
    },
    arouseBank () {
      // 打开银行选择列表
      this.showMask = true;
      this.showBank = true;
      this.showRegion = false;
    },
    arouseRegion () {
      // 打开地区选择列表
      this.showMask = true;
      this.showRegion = true;
      this.showBank = false;
    },
    handleConfirm (ref) {
      // 确定银行或地区
      if (ref === 'bank') {
        this.showMask = false;
        this.showBank = false;
      } else {
        this.region = this.currentProvince + ' ' + this.currentCity + ' ' + this.currentArea;
        this.showMask = false;
        this.showRegion = false;
      }
    },
    handleCancel (ref) {
      // 取消选择
      if (ref === 'bank') {
        this.currentBank = '';
        this.showMask = false;
        this.showBank = false;
      } else {
        this.currentProvince = '';
        this.currentCity = '';
        this.currentArea = '';
        this.region = '';
        this.showMask = false;
        this.showRegion = false;
      }
    },
    closeMask () {
      // 关闭蒙版
      this.showMask = false;
    },
    getProvince () {//省
      if (localStorage.getItem('province') == null) {
        this.$http.post(api.regions).then(res => {
          if (res.data.Status === '1') {
            var data = res.data.Data;
            if (data.length !== 0) {
              this.province[0].values = data;
              this.defaultPCode = data[0].Cder;
              localStorage.setItem('province',JSON.stringify(data));
            }
          }
        })
      } else {
        // console.log('拿缓存1');
        this.province[0].values = JSON.parse(localStorage.getItem('province'));
        this.defaultPCode = this.province[0].values[0].Cder;
      }
    },
    getCitys (code) {//市
      if (localStorage.getItem(code) == null) {
        this.$http({url: api.regions, method: 'post', params: {id: code}}).then(res => {
          if (res.data.Status === '1') {
            var data = res.data.Data;
            if (data.length !== 0) {
              this.city[0].values = data;
              this.defaultCCode = data[0].Cder;
              localStorage.setItem(code ,JSON.stringify(data));
            }
          }
        })
      } else {
        // console.log('拿缓存2')
        this.city[0].values = JSON.parse(localStorage.getItem(code));
        this.defaultCCode = this.city[0].values[0].Cder;
      }
    },
    getArea (code) {//区
      if (localStorage.getItem(code) == null){
        this.$http({url: api.regions, method: 'post', params: {id: code}}).then(res => {
          if (res.data.Status === '1') {
            var data = res.data.Data;
            this.area[0].values = data;
            localStorage.setItem(code, JSON.stringify(data));
          }
        })
      } else {
        // console.log('拿缓存3')
        this.area[0].values = JSON.parse(localStorage.getItem(code));
      }
    },
    getBank () {//银行列表
      this.$http.post(api.bankList).then(res => {
        // console.log('银行列表', res.data);
        if (res.data.Status === '1') {
          this.banks[0].values = res.data.Data;
        }
      })
    },
    getAutonym () {//获取实名后信息
      this.$http.post(api.authenInfo).then(res => {
        // console.log('实名后信息', res.data);
        if (res.data.Status === '1') {
          this.name = res.data.Data.name;
          this.idCard = res.data.Data.Idcrd;
        } else {
          this.$toast({
            message: res.data.Msg,
            position: 'bottom',
            duration: 3000
          })
        }
      })
    },
    authentication () {//认证
      if (this.authenticateState) {// 已认证
        this.getAutonym();
      } else {//请求是否已实名认证 未认证则弹窗
        this.$store.dispatch('get_authenticate_state').then(res => {
          // console.log(res);
          if (res.Status === '1') {
            this.getAutonym();
          } else {
            this.$router.push('/');
          }
        })
      }
    },
    sendSms () {
      this.$http.post(api.verificationPhone, {"Mobile": this.tel, "type": 8},{'xhrFields':{withCredentials: true},crossDomain: true}).then(res => {
        // console.log('添加银行卡短信验证码', res);
        this.$toast({
          message: res.data.Msg,
          position: 'bottom',
          duration: 3000
        })
      })
    }
  },
  computed: {
    btnEnable () {
      if (this.currentBank && this.region && this.subbranch && this.card && this.tel) {
        return true;
      } else {
        return false;
      }
    },
    type () {
      if (this.$route.query.type) {
        // console.log(this.$route.query.type);
        return this.$route.query.type;
      } else {
        return;
      }
    },
    authenticateState () {
      if (sessionStorage.getItem('authenticateState') != null) {
        return sessionStorage.getItem('authenticateState');
      } else {
        return this.$store.state.authenticateState;
      }
    },
    mobile () {
      var login = localStorage.getItem('login');
      // console.log(login);
      if (login != null) {
        return JSON.parse(login).Mobile;
      } else {
        return ''
      }
    }
  },
  created () {
    // 初始化银行数据
    this.getBank();
    this.getProvince();
    this.getCitys('110000');
    this.getArea('110100');
    this.authentication();//认证信息
    this.tel = this.mobile;//手机号
  },
  mounted () {

  }
}
</script>
<style scoped>
  .card{
    height: 100%;
    overflow: hidden;
  }
  .card .content-body{
    top: 56px;
    text-align: left;
  }
  ul{
    padding: 0 10px;
  }
  ul > li{
    height: 50px;
    line-height: 50px;
    /* border-bottom: 1px solid #d9d9d9; */
    border-bottom-width: 1px;
    border-bottom-style: solid;
    position: relative;
  }
  ul > li.bank,ul > li.region{

  }
   ul > li > input{
    position: absolute;
    right: 10px;
  }
  ul > li > input{
    height: 100%;
    border: none;
    text-align: right;

  }
  ul > li > input:-moz-placeholder{
    text-align: right;
  }
  ul > li > input:-ms-input-placeholder{
    text-align: right;
  }
  ul > li > input::-webkit-input-placeholder{
    text-align: right;
  }
  .next-step{
    position: fixed;
    bottom: 0;
    height: 50px;
    width: 100%;
    line-height: 50px;
    text-align: center;
  }
  .mask{
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, .3);
    z-index: 2001;
  }
  .selector{
    position: absolute;
    bottom: 0;
    width: 100%;
    z-index: 2002;
    transform: translateY(220px);
    background-color: #fff;
    transition: all .3s linear;
  }
  .anim{
    transform: translateY(0);
    transition: all .3s linear;
  }
  .regions > div.picker-wrap{
    display: flex;
  }
  .regions > div.picker-wrap > div{
   flex: 1;
  }
  .regions > div.tool-bar{
    display: flex;
    height: 40px;
    line-height: 40px;
    padding: 0 15px;
    color: #999;
  }
  .regions > div.tool-bar > span{
    flex: 1;
  }
  .regions > div.tool-bar > span:nth-child(1) {
    text-align: left;
  }
  .regions > div.tool-bar > span:nth-child(2) {
    text-align: right;
  }
  .sure,.cancel{
    background: transparent;
    border: none;
    box-shadow: none;
  }
  .sure{
    float: right;
  }
  .cancel{
    float: left;
  }
</style>
