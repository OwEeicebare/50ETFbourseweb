export default {
  //更新公告列表
  UPDATE_NOTICELIST (state, obj) {
    // console.log('排好序的公告', arr);
    state.notices.length = 0;
    state.latestNotice.length = 0;
    state.urgentNotice.length = 0;
    state.notices = obj.data;
    var urgentIndex = [];
    if(obj.data){
      for (let i = 0; i < obj.data.length; i++) {
        if (i < 3) {
          state.latestNotice.push(obj.data[i]);
        }
        if (!obj.data[i].IsRead && obj.data[i].Ct === 2) {
          // console.log('游客身份紧急公告');
          state.urgentNotice.push(obj.data[i]);
          // state.urgentNotice[urgentIndex] = obj.data[i];
          // urgentIndex++;
        }
      }
    }
  },
  // 修改当个id的状态为已读
  UPDATE_SINGLE_NOTICE (state, id) {
    for (let j = 0; j < state.urgentNotice.length; j++) {
      if (id === state.urgentNotice[j].Id) {
        state.urgentNotice.length = 0;
      }
    }
    for (let i = 0;i < state.notices.length; i++) {
      if (id === state.notices[i].Id) {
        state.notices[i].IsRead = true;
      }
    }
  },
  // 获取认证协议
  SET_PROTOCAL (state, data) {
    state.auProtocal = data;
    // 初始化protocal对象
    state.protocal = [];
    for (let i = 0; i < state.auProtocal.length; i++) {
      let term = [];
      let arr = state.auProtocal[i].MhSe.split('。》《。');
      for (let j = 0; j < arr.length; j++) {
        // 同意复选框
        if (arr[j]) {
          term.push({
            value: arr[j],
            term: false
          })
        }
      }
      let obj = {
        id: state.auProtocal[i].Id,
        state: false,//是否签订协议，false为未签订
        term: term
      }
      state.protocal.push(obj);
    }
    // console.log('动态protocal', state.protocal);
  },
  // 修改协议状态
  CHANGE_PROTOCAL_STATE (state, obj) {
    for (let i = 0; i < state.protocal.length; i++) {
      if (obj.id === state.protocal[i].id) {
        state.protocal[i].state = obj.value;
        for (let j = 0; j < state.protocal[i].term.length; j++) {
          state.protocal[i].term[j].state = obj.value;
        }
      }
    }
  },
  // 存储实名认证的姓名和身份证号
  SAVE_AUTONYM (state, obj) {
    state.autonym[obj.type] = obj.value;
  },
  //存储注册信息
  SAVE_REGISTER (state, obj) {
    state.register[obj.type] = obj.value;
  },
  //记录充值审核信息 转账信息
  CHANGE_REMARK (state, obj) {
    state.remittanceRemark = obj.remark;
  },
  //记录充值审核信息 转账金额
  CHANGE_MONEY (state, obj) {
    state.remittance = obj.money;
  },
  //记录充值审核信息 服务费
  CHANGE_FEE (state, obj) {
    state.fee = obj.fee;
  },
  //记录充值审核信息 转账截图路径
  CHANGE_SCREENSHOT (state, value) {
    state.screenshot = value;
  },  
  CHANGE_UPLOADSCREEN (state, value) {
    state.uploadScreen = value;
  },
  //  //记录上传身份证正面
  //  ID_FRONT (state, value) {
  //   state.IDFront = value;
  // },
  //  //记录上传身份证背面
  //  ID_VERSO (state, value) {
  //   state.IDVerso = value;
  // },
  //记录提现金额
  SAVE_WITHDRAW_MONEY (state, value) {
    state.widthdraw = value;
  },
  //登录
  LOGIN (state,obj) {
    localStorage.setItem("login",JSON.stringify(obj));
  },
  //退出
  LOGOUT (state) {
    localStorage.removeItem("login");
    state.authenticateState = false;
    state.bindState = false;
    sessionStorage.clear();
  },
  //修改充值记录的起止日期;
  CHANGE_RECHARGE_DATE (state, obj) {
    state.rechargeDate.start = obj.start;
    state.rechargeDate.end = obj.end;
    state.rechargeDate.startDate = obj.startDate;
    state.rechargeDate.endDate = obj.endDate;
  },
  //修改提现记录的起止日期;
  CHANGE_WITHDRAW_DATE (state, obj) {
    state.withdrawDate.start = obj.start;
    state.withdrawDate.end = obj.end;
    state.withdrawDate.startDate = obj.startDate;
    state.withdrawDate.endDate = obj.endDate;
  },
  //修改历史委托的起止日期;
  CHANGE_DELEGATE_DATE (state, obj) {
    state.delegateDate.start = obj.start;
    state.delegateDate.end = obj.end;
    state.delegateDate.startDate = obj.startDate;
    state.delegateDate.endDate = obj.endDate;
  },
  //修改历史成交的起止日期;
  CHANGE_TRANSACTION_DATE (state, obj) {
    state.transactionDate.start = obj.start;
    state.transactionDate.end = obj.end;
    state.transactionDate.startDate = obj.startDate;
    state.transactionDate.endDate = obj.endDate;
  },
  //修改资金流水的起止日期;
  CHANGE_ACCOUNT_DATE (state, obj) {
    state.accountDate.start = obj.start;
    state.accountDate.end = obj.end;
    state.accountDate.startDate = obj.startDate;
    state.accountDate.endDate = obj.endDate;
  },
  //修改止盈止损的起止日期;
  CHANGE_STOP_DATE (state, obj) {
    state.stopDate.start = obj.start;
    state.stopDate.end = obj.end;
    state.stopDate.startDate = obj.startDate;
    state.stopDate.endDate = obj.endDate;
  },
  //修改过期合约的起止日期;
  CHANGE_OVERDUE_DATE (state, obj) {
    state.overdueDate.start = obj.start;
    state.overdueDate.end = obj.end;
    state.overdueDate.startDate = obj.startDate;
    state.overdueDate.endDate = obj.endDate;
  },
  //修改平仓结算的起止日期;
  CHANGE_SETTLEMENT_DATE (state, obj) {
    state.settlementDate.start = obj.start;
    state.settlementDate.end = obj.end;
    state.settlementDate.startDate = obj.startDate;
    state.settlementDate.endDate = obj.endDate;
  },
  CHANGE_AUTHENTICATE_STATE (state, value) {//修改实名认证状态
    state.authenticateState = value;
  },
  SAVE_CARD_LIST (state, arr) {//保存用户银行卡数据
    state.cardList = arr;
    for (let i = 0; i < state.cardList.length; i++) {
      sessionStorage.setItem('bindState',  true);
      state.bindState = true;
      if (state.cardList[i].sort === 1) {
        state.defaultCard = state.cardList[i];
        // console.log('默认银行卡 请求', state.defaultCard);
        return;
      }
    }
    state.defaultCard = state.cardList[0];
    sessionStorage.removeItem('bindState');
  },
  DELETE_CARD_LIST (state) {
    sessionStorage.removeItem('bindState');
    state.bindState = false;
    state.defaultCard = {};
  },
  SAVE_CONTACT (state, data) {//保存联系客服数据
    state.contact = data;
  },
  CHANGE_GUESS_STATE (state, value) {//修改是否猜涨跌的状态
    state.guess = value;
  },
  SAVE_ADD_BANKINFO (state, obj) {
    state.addBankInfo = obj;
  },
  CHANGE_MESSAGE_READ (state, value) {//是否有新消息
    state.messageRead = value;
  },
  CHANGE_DEFAULT_BANK (state, id) {//更改提现 选中的银行卡
    // console.log('mutation', id);
    for (let i = 0; i < state.cardList.length; i++) {
      if (id === state.cardList[i].Id) {
        state.defaultCard = state.cardList[i];
        return state.defaultCard;
      }
    }
    return state.defaultCard;
  },
  GET_EXPIRATIONTIME(state,value){
    state.expirationTime=value;
  }
}
