let base = process.env.NODE_ENV === 'development' ? '/one' : 'http://100testapi.zhj688.com';
let elseUrl = process.env.NODE_ENV === 'development' ? '/else' : 'http://100testfile.zhj688.com';
let mobile = base + '/mobile';

// 行情
let price = process.env.NODE_ENV === 'development' ?'http://192.168.1.202:6001':'http://100testmarket.zhj688.com';
let market = price +'/mobile';

// 行情接口列举
// 首页
// MobileStockTime/GetAllListModel',//首页行情数据
// 认购认沽页面
// MobileStockTime/GetStocksRedisModel //认购认沽
// 行情页面
// MobileStockTime/GetStocksRedisModel //行情接口
// MobileStockTime/GetQryQuotationListModel',//获取50etf行情
// 单个合约详情页面
// MobileStockTime/GetTimeSharingModel', //买入合约代码详细信息
// 交易页面
// MobileStockTime/GetStocksHoldModel', //交易持仓现价

// let indexStock = "";// MobileStockTime/GetAllListModel',//首页行情数据
// let allcontract = "";// MobileStockTime/GetStocksRedisModel //认购认沽 行情接口 
// let etfDetails = "";// MobileStockTime/GetQryQuotationListModel',//获取50etf行情
// let codeDetail = "";// MobileStockTime/GetTimeSharingModel', //买入合约代码详细信息
// let stockCurrent = "";// MobileStockTime/GetStocksHoldModel', //交易持仓现价

export default{
  base: base,
  upload: elseUrl + '/api/file/upload',//上传图片
    // allcontract:mobile+'/MobileStockTime/GetStocksModel',//获取所有合约
  etfDetails:market+'/MobileStockTime/GetQryQuotationListModel',//获取50etf行情
  allcontract:market+'/MobileStockTime/GetStocksRedisModel',//认购详情
  stockCurrent: market + '/MobileStockTime/GetStocksHoldModel', //交易持仓现价
  codeDetail: market + '/MobileStockTime/GetTimeSharingModel', //买入合约代码详细信息
  
  login: mobile + '/MobileUser/LoginByMobile',//登录
  changeTel: mobile + '/MobileUser/VerificationMobile', // 图形验证是否更换手机号
  changeTelReal: mobile + '/MobileUser/ModifyMobile', //更换手机号
  saveAutonym: mobile + '/MobileUser/SaveRealStusName', // 保存实名状态
  register: mobile + '/MobileUser/MobileRegister',//注册
  articleType: mobile + '/MobileContentNewsType/GetList',//首页资讯栏目
  articleList: mobile + '/MobileContentNewsInfo/GetListByClassId',//对应类目下的资讯列表
  article: mobile + '/MobileContentNewsInfo/GetListById',//资讯详情
  adList: mobile + '/MobileContentAdInfo/GetList',//轮播图
  noticeList: mobile + '/MobileContentNotice/GetList', //公告列表
  markNotice: mobile + '/MobileContentNotice/Read', //标记公告为已读
  help: mobile + '/MobileContentHelpType/GetList', //我的页帮助中心
  helpList: mobile + '/MobileContentHelpInfo/GetListByClassId', //我的页帮助中心问答
  search: mobile + '/MobileStock/GetStockList', //搜索合约数据
  registerProtocal: mobile + '/MobileContentAgreement/GetRegisterList', //注册协议
  autonymState: mobile + '/MobileUser/RealStusName',//实名状态
  authenticateProto: mobile + '/MobileContentAgreement/GetAuthenticationList', //认证协议
  userBankList: mobile + '/MobileUserBank/GetBanklist', //用户银行卡列表
  userBankInfo: mobile + '/MobileUserBank/GetBankById', //用户银行卡详情
  userBankDel: mobile + '/MobileUserBank/DelBankById',//用户解除绑定
  setDefaultBank: mobile + '/MobileUserBank/SaveBankdefault', //选中默认银行卡
  regions: mobile + '/MobileArea/GetAist', //地区
  vertifyBank: mobile + '/MobileUserBank/VerificationAddBankInfo', //添加银行卡第一步时 验证银行卡号是否存在数据库
  bankList: mobile + '/MobileUserBank/BankNameInfo', //添加银行卡 的银行卡列表
  addBank: mobile + '/MobileUserBank/AddBankInfo',//添加银行卡,
  withMoney: mobile + '/MobileUser/GetUserBalance', //可提现余额
  withdraw: mobile + '/MobileUser/ApplicationCashWithdrawal', //提现
  withdrawInfo: mobile + '/MobileUser/GetCashWithdrawalInfo', //提现申请提交信息
  recharge: mobile + '/MobileUser/SaveRechargeInfo', //银行汇款充值
  rechargeBank: mobile + '/MobileUser/GetRechargeBankInfo', //银行汇款账号
  rechargeInfo: mobile + '/MobileUser/GetRechargeInfo',//银行汇款提交信息
  contact: mobile + '/MobileUser/GetCustomerInfo', //联系客服
  buy: mobile + '/MobileTrans/Buy',//买入
  sell: mobile + '/MobileTrans/Sell',//卖出
  ud: mobile + '/MobileUd/GetModelist',//猜涨跌 涨跌数据
  topName: mobile + '/MobileUd/GetTopUserLists',//涨跌用户榜单
  udRecords: mobile + '/MobileUd/GetUserSourceList',//用户猜涨跌记录
  udAction: mobile + '/MobileUd/SaveTopUserLists', //用户猜涨跌动作
  recordList: mobile + '/MobileUser/GetRechargeList',//充值记录
  recordDetail: mobile + '/MobileUser/GetRechargeById', //充值详情
  withList: mobile + '/MobileUser/GetCashWithdrawal',//提现记录
  withDetail: mobile + '/MobileUser/GetCashWithdrawalById', //提现详情
  stockHold: mobile + '/MobileTransRecord/StockHoldSpitInfo', //交易合并持仓
  separateHold: mobile + '/MobileTransRecord/StockHoldInfo', //分笔持仓
  closeOut: mobile + '/MobileTrans/TotalSell', //一键平仓
  revoke: mobile + '/MobileTrans/CancelTicket', //撤单
  fee: mobile + '/MobileUser/Getvaluetransaction',//交易服务费
  dSell: mobile + '/MobileTrans/OneSell',//分笔持仓卖出
  authenInfo: mobile + '/MobileUserBank/GetName', //实名信息
  stopData: mobile + '/MobileTransRecord/StopProfitLoss', //交易止盈止损数据
  flow: mobile + '/MobileTransRecord/MoneyFlow', //资金流水
  flowType: base + '/api/Tool/GetMobileUserTransactionType', //流水类型
  flowDetails: mobile + '/MobileTransRecord/DetailsFundX',//流水详情
  withFee: mobile + '/MobileUser/GetWithdrawalconInfo', //提现服务费配置
  repealWith: mobile + '/MobileUser/GetRevokeCashWithdrawalById', //撤销提现
  changeCurrentTel: mobile + '/MobileUser/VerificationCurrentMobile', //更换手机号 验证当前手机号
  messageList: mobile + '/MobileUser/UserMessagelist', //消息列表
  tourNotice: mobile + '/MobileContentNotice/GuestGetList', //游客身份公告
  messageType: mobile + '/MobileUser/UserMessageType', //消息类型
  clearMessage: mobile + '/MobileUser/DeleteUserMessage', //清空消息
  settlement: mobile + '/MobileTransRecord/SellSettlement',//平仓结算
  settlementDetail: mobile + '/MobileTransRecord/SellSettlementInfo', //平仓结算详情
  overdue: mobile + '/MobileTransRecord/OverdueTicket', //过期合约
  withProblem: mobile + '/MobileContentHelpInfo/GetCashWithdrawalHelpInfo', //提现常见问题
  rechargeProblem: mobile + '/MobileContentHelpInfo/GetRechargeHelpInfo', //充值常见问题
  contractNotice: mobile + '/MobileStock/GetUserStockList', //合约到期提醒
  platLogin: mobile + '/MobileUser/PlatformLoginByMobile', //平台登录
  verificationimage:mobile+'/MobileUser/CreateCheckCodeImage',//获取图片验证
  verificationPhone:mobile+'/MobileSysSmsInfo/GetMessaging',//获取短信验证码
  registerMsg: mobile + '/MobileSysSmsInfo/GetSmsMsg',//获取短信验证码
  verificationRegister1:mobile+'/MobileUser/VerificationRegister',//验证注册1
  verificationMsgLogin:mobile+'/MobileUser/TuLoginByMobile',//短信登录验证图形验证码
  verificationMsgLogin2:mobile+'/MobileUser/SmsLoginByMobile',//短信登陆验证短信验证码
  verificationForget1:mobile+'/MobileUser/VerificationForgetPassword',//忘记密码验证图形验证码验证
  verificationForget2:mobile+'/MobileUser/DuanVerificationForgetPassword',//忘记密码短信验证码验证
  resetPwd:mobile+'/MobileUser/ForgetPassword',//找回忘记密码
  mineInfo:mobile+'/MobileUser/GetMyHomeInfo',//我的信息
  stockTime:mobile+'/MobileStockTime/GetStockModel',//获取年月合约类别

  contractDetail:mobile+'/MobileStockTime/GetTimeSharingModel',//合约详情
  contractDetailSecod:mobile+'/MobileStockTime/GetALLModel',//合约详情固定数据
  // lineData:mobile+'/MobileStockTime/GetModelist',//折线图数据
  lineRedis:base+'/api/Redis/GetRedis',//折线图数据
  dayK:mobile+'/MobileStockTime/GetDayModelist',//k线图
  transactionInit:mobile+'/MobileUser/Getvaluetransaction',//交易初始数据
  profitLoss:mobile+'/MobileUser/GetProfitLoss',//获取止盈止损
  editLoss:mobile+'/MobileUser/EditLoss',//修改止损
  editProfit:mobile+'/MobileUser/EditProfit',//修改止盈

  buy:mobile+'/MobileTrans/Buy',//买入
  sell:mobile+'/MobileTrans/Sell',//卖出
  oneCross:mobile+'/MobileStockTime/GetOneKeyBuyModel',//一键跨式查合约
  oneCrossBuy:mobile+'/MobileTrans/OneBuy',//一键跨式购买
  commday:mobile+'/MobileTransRecord/TodayEntrust',//当日委托
  historyCommDay:mobile+'/MobileTransRecord/HistoryEntrust',//历史委托
  transactionDay:mobile+'/MobileTransRecord/TodayFinish',//当日成交
  historyTransaction:mobile+'/MobileTransRecord/HistoryFinish',//历史成交
  indexStock:mobile+'/MobileStockTime/GetAllListModel',//首页行情数据
  quicklyHand:mobile+'/MobileStockTime/GetOneKeyBuyBackModel',//快捷反手
  divideSell:mobile+'/MobileUser/GetSaleConfig',//分笔持仓卖出查询
  getRevoke:mobile+'/MobileTransRecord/TodayCancelApply',//查询撤单订单
  allSell:mobile+'/MobileTrans/MobileSale',//卖出统一接口
  getPosition:mobile+'/MobileUser/GetSaleData',//平仓查询接口
  setTargetOrStop:mobile+'/MobileTransRecord/SetTargetOrStop',//持仓设置止盈止损
  askCancel:mobile+'/MobileTrans/CheckAutoCancel',//询问是否撤单
  verificationLocalPhone:mobile+'/MobileUser/VerifiChartMobile',//更改手机号码和重置密码验证手机号和图形答案
  getTime:mobile+'/MobileTransRecord/GetCancelTime',//买入卖出委托撤单时间
  getViedio:mobile+'/MobileUserFaceRecognition/GetVerifyToken',//视频认证
  getViedioStatus:mobile+'/MobileUserFaceRecognition/GetStatus',//获取认证状态
  getRealyName:mobile+'/MobileUser/UserInfo',//获取实名信息（需等待人工审核通过页面）
  updateRealyStatus:mobile+'/MobileUser/UserRealNameStatus',//更改实名状态
  firstInit:mobile+'/MobileAgents/AgentInfo',//获取网站代理信息
  getPayType:base+'/api/Tool/GetFxpay',//获取支付类型
  zfbPay:mobile+'/PayEasy/PayUrl',//支付宝支付
  getFee:base+'/api/SystemPayconfig/GetSysPayConfigByName',//获取支付类型支付手续费
  zfbEnd:mobile+'/PayEasy/GetOrderInfo',//支付宝充值结果
  getRealyInfo:mobile+'/MobileUserFaceRecognition/GetMaterials',//获取人脸识别返回信息
  getServerTime:base+'/Api/SystemSet/GetSysDate',//获取服务器时间
  getLunBo:mobile+'/MobileAdInfo/MobileADinfoShow',//获取轮播图（新）
  authenticateCardName:mobile+'/MobileUser/CheckUserID',// 身份信息方式认证
}

