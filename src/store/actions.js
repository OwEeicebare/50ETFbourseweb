import http from "axios"
import api from '@/api'
import { comment } from 'postcss'
export default {
  get_notice ({commit}) {//获取notice数据(作废)
    return http.post(api.noticeList).then(res => {
      // console.log('公告列表', res.data);
      if (res.data.Status === '1') {
        var data = res.data.Data;
        data.sort(function (a, b) {
          return a.Pt < b.Pt ? 1 : -1;
        });
        commit('UPDATE_NOTICELIST', {data: data, type: 'login'});
        return data;
      } else if (res.data.Status === '401') {
        return http({url:api.tourNotice, params:{agentsId:JSON.parse(window.localStorage.getItem("againInfo")).id},method:'post'}).then(res => {
          // console.log('游客身份公告', res);
          if (res.data.Status === '1') {
            var data = res.data.Data;
            data.sort(function (a, b) {
              return a.Pt < b.Pt ? 1 : -1;
            });
            commit('UPDATE_NOTICELIST', {data: data, type: 'unlogin'});
            return data;
          }
        })
      }
    })
  },
  get_visitor_notice ({commit},id) {//获取游客公告
    return http({url:api.tourNotice, params:{agentsId:id},method:'post'}).then(res => {
      if (res.data.Status === '1') {
        var data = res.data.Data;
        if(data){
          data.sort(function (a, b) {
            return a.Pt < b.Pt ? 1 : -1;
          });
        }
        commit('UPDATE_NOTICELIST', {data: data, type: 'unlogin'});
        // console.log(data);
        return data;
      }
    })
  },
  read_notice ({commit}, id) {//标记公告为已读
    http({url: api.markNotice, method: 'post', params: {noticeId: id}}).then(res => {
      // console.log('id 为' + id + '已读', res.data);
      //更新公告列表
      commit('UPDATE_SINGLE_NOTICE', id);
    })
  },
  get_protocal ({commit},id) {
    return http({url:api.authenticateProto,params:{iAgentId:id},method:'post'}).then(res => {
      // console.log('认证协议数据', res.data);
      if (res.data.Status === '1') {
        commit('SET_PROTOCAL', res.data.Data);
        return res.data.Data;
      }
    })
  },
  get_authenticate_state ({commit}) {//获取实名状态
    return http.post(api.autonymState).then(res => {
      if (res.data.Status === '1') {
        var value = res.data.Data.NTure === 1 ? true : false;
        commit('CHANGE_AUTHENTICATE_STATE', value);
      }
      return res.data;
    })
  },
  get_card_list ({commit}) {//获取用户银行卡数据
    return http.post(api.userBankList).then(res => {
      // console.log('用户银行卡数据', res.data);
      if (res.data.Status === '1') {
        // console.log('请求银行卡数据');
        commit('SAVE_CARD_LIST', res.data.Data);
        return res.data.Data;
      } else {
        commit('DELETE_CARD_LIST');
      }
    })
  },
  get_contact ({commit},id) {//联系客服
    return http({url:api.contact,params:{iAgentId:id},method:"post"}).then(res => {
      // console.log('联系客服', res.data);
      if (res.data.Status === '1') {
        commit('SAVE_CONTACT', res.data.Data);
        return res.data.Data;
      }
    })
  },
  get_message_type ({commit}) {//消息列表
    return http.post(api.messageType).then(res => {
      let state = true;
      if (res.data.Status === '1') {
        for (let i = 0; i < res.data.Data.length; i++) {
          if (res.data.Data[i].isread === 0) {
            state = false;
            commit('CHANGE_MESSAGE_READ', true);
          }
        }
        if (state) {
          commit('CHANGE_MESSAGE_READ', false);
        }
        return res.data.Data;
      } else {
        return [];
      }
      return [];
    })
  },
  get_message_detail ({commit}, id) {//消息详情
    return http({url: api.messageList, params: {TeypId: id}, method: 'post'}).then(res => {
      // console.log('消息详情列表', res);
      if (res.data.Status === '1') {
        return res.data.Data.sort(function(a, b) {
          let aStr = a.creime.replace(/\-/g, '/');
          let bStr = b.creime.replace(/\-/g, '/');
          aStr = new Date(aStr);
          bStr = new Date(bStr);
          return bStr - aStr;
        });
      } else {
        return [];
      }
      return []
    })
  },
  clear_message ({commit}, id) {//清空消息列表
    return http({url: api.clearMessage, params: {TeypId: id}, method: 'post'}).then(res => {
      return res.data;
    })
  },
  set_expirationTime({commit}){//设置买入卖出合约撤单时间
    http.post(api.getTime).then(res=>{
      commit('GET_EXPIRATIONTIME', res.data.Data);
    })
  },
  get_againInfo({commit}){//根据域名获取网址代理信息
    var obj={//默认数据
      id:'',
      name:'盈创中心',
      img:'',
      icon:'static/images/yczx.ico'
    }
    return http.post(api.firstInit,{realmName: location.origin + '/'}).then(res=>{
      if(res.data.Status==1){
        var result = res.data.Data;
        if(result.Id!=0){//代理
          obj={
            id:result.Id,
            name:result.Name,
            img:result.Logo,
            icon:result.ICO
          }
        }else{//平台
          obj.id=result.Id;
          obj.img=result.Logo;
        }
        document.querySelector('link[rel="Bookmark"]').setAttribute('href', obj.icon);
        document.querySelector('link[rel="icon"]').setAttribute('href', obj.icon);
        document.querySelector('link[rel="shortcut icon"]').setAttribute('href', obj.icon);
        document.querySelector('title').innerHTML=obj.name;
        window.localStorage.setItem("againInfo",JSON.stringify(obj));
      }
      return res.data;
    })
  },
}
