export default{
  authenticated: false,
  protocal: [],//存储已签订和未签订的协议状态
  autonym: {
    name: '',//实名认证的姓名
    id: '',//实名认证身份证号
  },
  bindState: false, //是否绑定银行卡
  authenticateState: false, //是否实名认证
  auProtocal: [], //认证协议
  screenshot: '',//截图凭证
  uploadScreen: '',
  // 汇款金额
  remittance: '',
  // 汇款备注
  remittanceRemark: '',
  //汇款服务费
  fee: 0,
  cardList: [],//用户银行卡列表
  defaultCard: null,//默认绑定的银行卡,
  notices: [],//公告列表
  latestNotice: [], //最新三条公告
  urgentNotice: [], //紧急公告
  cards: [], //银行卡
  widthdraw: '',//提现金额
  rechargeDate: { //充值记录 起止日期
    start: '',
    startDate: '',
    end: '',
    endDate: ''
  },
  withdrawDate: {//提现记录 起止日期
    start: '',
    startDate: '',
    end: '',
    endDate: ''
  },
  delegateDate: {//历史委托 起止日期
    start: '',
    startDate: '',
    end: '',
    endDate: ''
  },
  transactionDate: {//历史成交 起止日期
    start: '',
    startDate: '',
    end: '',
    endDate: ''
  },
  accountDate: {//资金流水 起止日期
    start: '',
    startDate: '',
    end: '',
    endDate: ''
  },
  stopDate: {//止盈止损 起止日期
    start: '',
    startDate: '',
    end: '',
    endDate: ''
  },
  overdueDate: {//过期合约 起止日期
    start: '',
    startDate: '',
    end: '',
    endDate: ''
  },
  settlementDate: {//平仓结算 起止日期
    start: '',
    startDate: '',
    end: '',
    endDate: ''
  },
  register: {}, //注册信息
  contact: {}, //联系客服信息,
  guess: 0, //是否猜过涨跌
  addBankInfo: null, //添加银行卡信息
  messageRead: false, //false 没有新消息 true有新消息
  expirationTime:'',//买入卖出过期时间
}
