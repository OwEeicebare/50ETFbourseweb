
import Vue from 'vue'
import Router from 'vue-router'

// 首页
const Index = resolve => require(['@/components/pages/index.vue'],resolve)
//首页指数详情
const Exponent = resolve => require(['@/components/pages/exponent.vue'], resolve)
// 行情页
const Market = resolve => require(['@/components/pages/market.vue'],resolve)
// 交易页
const Deal = resolve => require(['@/components/pages/deal.vue'],resolve)
// 我的页
const Mine = resolve => require(['@/components/pages/mine.vue'],resolve)
// 交易详情页
const MarketDetails = resolve => require(['@/components/pages/market_details.vue'],resolve)
// 猜涨跌
const Guess = resolve => require(['@/components/pages/guess.vue'],resolve)
// 账号密码登录
const Login = resolve => require(['@/components/pages/login.vue'],resolve)
// 短信验证码登录
const MsgLogin = resolve => require(['@/components/pages/msg_login.vue'],resolve)
// 注册
const Register = resolve => require(['@/components/pages/register.vue'],resolve)
// 重置密码
const ResetPass = resolve => require(['@/components/pages/reset_pass.vue'],resolve)
// 验证码
const VertifyCode = resolve => require(['@/components/pages/vertify_code.vue'],resolve)
// 资讯详情
const ArticleDetails = resolve => require(['@/components/pages/article_details.vue'],resolve)
// 公告
const Notice = resolve => require(['@/components/pages/notice.vue'],resolve)
// 公告详情
const NoticeDetails = resolve => require(['@/components/pages/notice_details.vue'],resolve)
// 消息
const Message = resolve => require(['@/components/pages/message.vue'],resolve)
// 我的设置
const MySet = resolve => require(['@/components/pages/set.vue'],resolve)
// 实名认证
const Authentication = resolve => require(['@/components/pages/authentication.vue'],resolve)
// 协议
const Protocal = resolve => require(['@/components/pages/protocal.vue'],resolve)
// 实名认证--录制视频
const AuthenticationVideo = resolve => require(['@/components/pages/authentication_video.vue'],resolve)
// 修改手机号 验证新手机号
const NewPhone = resolve => require(['@/components/pages/new_phone.vue'],resolve)
// 修改成功
const ModifySuccess = resolve => require(['@/components/pages/modify_success.vue'],resolve)
// 验证成功
const AuthenticateSuccess = resolve => require(['@/components/pages/authenticate_success.vue'],resolve)
// 银行卡
const BankCard = resolve => require(['@/components/pages/bank_card.vue'],resolve)
// 银行卡详情 绑定
const Card = resolve => require(['@/components/pages/card.vue'],resolve)
// 添加银行卡
const AddCard = resolve => require(['@/components/pages/add_card.vue'],resolve)
// 预留手机号验证
const CardVertify = resolve => require(['@/components/pages/card_vertify.vue'],resolve)
// 联系客服
const Contact = resolve => require(['@/components/pages/contact.vue'],resolve)
// 消息详情
const MessageDetails = resolve => require(['@/components/pages/message_details.vue'],resolve)
// 充值
const Recharge = resolve => require(['@/components/pages/recharge.vue'],resolve)
// 银行汇款
const TransferAccounts = resolve => require(['@/components/pages/transfer_accounts.vue'],resolve)
// 常见问题
const Questions = resolve => require(['@/components/pages/questions.vue'],resolve)
// 转账信息
const TransferInfo = resolve => require(['@/components/pages/transfer_info.vue'],resolve)
// 提交银行转账信息成功
const TransferSuccess = resolve => require(['@/components/pages/transfer_success.vue'],resolve)
// 充值记录
const RechargeRecords = resolve => require(['@/components/pages/recharge_records.vue'],resolve)
// 充值记录详情
const RechargeDetails = resolve => require(['@/components/pages/recharge_details.vue'],resolve)
// 提现记录
const WithdrawRecords = resolve => require(['@/components/pages/withdraw_records.vue'],resolve)
// 提现记录详情
const WithdrawDetails = resolve => require(['@/components/pages/withdraw_details.vue'],resolve)
// 提现申请成功
const WithdrawSuccess = resolve => require(['@/components/pages/withdraw_success.vue'],resolve)
// 提现
const Withdraw = resolve => require(['@/components/pages/withdraw.vue'],resolve)
// 帮助中心
const Help = resolve => require(['@/components/pages/help.vue'],resolve)
// 验证当前手机号
const CurrentPhone = resolve => require(['@/components/pages/current_phone.vue'],resolve)
// 止损止盈
const SetStop = resolve => require(['@/components/pages/set_stop.vue'],resolve)
// 止损止盈设置
const SetDrop = resolve => require(['@/components/pages/set_drop.vue'],resolve)

// 买入 入口交易页
const Buy = resolve => require(['@/components/pages/buy.vue'],resolve)
// 卖出 入口交易页
const Sell = resolve => require(['@/components/pages/sell.vue'],resolve)
// 一键平仓
const CloseOut = resolve => require(['@/components/pages/close_out.vue'],resolve)
// 一键平仓卖出委托
const CloseSell = resolve => require(['@/components/pages/close_sell.vue'],resolve)
// 委托成功
const OrderSuccess = resolve => require(['@/components/pages/order_success.vue'],resolve)
// 卖出委托成功
const SellOrder = resolve => require(['@/components/pages/sell_order.vue'],resolve)
// 撤单
const Revoke = resolve => require(['@/components/pages/revoke.vue'],resolve)
// 查询 Query
const Query = resolve => require(['@/components/pages/query.vue'],resolve)
// 当日委托
const Delegate = resolve => require(['@/components/pages/delegate.vue'],resolve)
// 历史委托
const HistoryDelegate = resolve => require(['@/components/pages/history_delegate.vue'],resolve)
//  当日成交
const Transaction = resolve => require(['@/components/pages/transaction.vue'],resolve)
// 历史成交 HistoryTransaction
const HistoryTransaction = resolve => require(['@/components/pages/history_transaction.vue'],resolve)
// 平仓结算
const Settlement = resolve => require(['@/components/pages/settlement.vue'],resolve)
// 平仓结算详情
const SettlementDetails = resolve => require(['@/components/pages/settlement_details.vue'],resolve)
// 资金流水
const JournalAccount = resolve => require(['@/components/pages/journal_account.vue'],resolve)
// 资金流水详情
const JournalDetails = resolve => require(['@/components/pages/journal_details.vue'],resolve)
// 查询无数据
const NoData = resolve => require(['@/components/pages/query_nodata.vue'],resolve)
// 查询止盈止损
const QueryStop = resolve => require(['@/components/pages/query_stop.vue'],resolve)
// 过期合约 Overdue
const Overdue = resolve => require(['@/components/pages/overdue.vue'],resolve)
//日历选择器
const Calendar = resolve => require(['@/components/pages/calendar.vue'],resolve)

const BuyDetails = resolve => require(['@/components/pages/buy_details.vue'],resolve)//行情买入卖出一级页面
const OneCrossRgou = resolve => require(['@/components/pages/one_cross_rgou.vue'],resolve)//一键跨式认购
const QuickBackhand = resolve => require(['@/components/pages/quick_backhand.vue'],resolve)//快捷反手买入
const SearchContract = resolve => require(['@/components/pages/search_contract.vue'],resolve)//搜索合约
const RggDetails = resolve => require(['@/components/pages/rgg_details.vue'],resolve)//认购认沽详情页
const CrossSearch = resolve => require(['@/components/pages/cross_search.vue'],resolve)//跨式合约搜索
const oneCrossSubmit = resolve => require(['@/components/pages/one_cross_submit.vue'],resolve)//跨式合约搜索
const returnLink = resolve => require(['@/components/pages/return_link.vue'],resolve)
const changePhone = resolve => require(['@/components/pages/change_phone.vue'],resolve)//更换手机号码进入的第一个页面
const againAuthentication = resolve => require(['@/components/pages/againauthentication.vue'],resolve)//实名中身份信息页面
const zfbTransferInfo = resolve => require(['@/components/pages/zfb_transferInfo.vue'],resolve)//支付宝转账填写金额
const zfbTransferSuccess = resolve => require(['@/components/pages/zfb_transferSuccess.vue'],resolve)//支付宝转账填写金额
// const indexMarketDetails = resolve => require(['@/components/pages/index_market_details.vue'],resolve)//首页行情指数
const Face = resolve => require(['@/components/pages/face.vue'],resolve)//人脸识别页面
const authenticationSelect = resolve => require(['@/components/pages/authentication_select.vue'],resolve)//人脸识别方式选择页面
const authenticatecar = resolve => require(['@/components/pages/authenticatecar.vue'],resolve)//未认证身份证验证页面
const authenticateCarName = resolve => require(['@/components/pages/authenticate_carName.vue'],resolve)//未认证身份证验证页面

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/market',
      name: 'Market',
      component: Market
    },
    {
      path: '/deal',
      name: 'Deal',
      component: Deal
    },
    {
      path: '/mine',
      name: 'Mine',
      component: Mine
    },
    {
      path: '/market-details',
      name: 'MarketDetails',
      component: MarketDetails
    },
    {
      path: '/exponent',
      name: 'Exponent',
      component: Exponent
    },
    {
      path: '/guess',
      name: 'Guess',
      component: Guess
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/msg-login',
      name: 'MsgLogin',
      component: MsgLogin
    },
    {
      path: '/article-details',
      name: 'ArticleDetails',
      component: ArticleDetails
    },
    {
      path: '/notice',
      name: 'Notice',
      component: Notice
    },
    {
      path: '/notice-details',
      name: 'NoticeDetails',
      component: NoticeDetails
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/reset-pass',
      name: 'ResetPass',
      component: ResetPass
    },
    {
      path: '/vertify-code',
      name: 'VertifyCode',
      component: VertifyCode
    },
    {
      path: '/message',
      name: 'Message',
      component: Message
    },
    {
      path: '/set',
      name: 'MySet',
      component: MySet
    },
    {
      path: '/authentication',
      name: 'Authentication',
      component: Authentication
    },
    {
      path: '/authentication-video',
      name: 'AuthenticationVideo',
      meta: {
        requireAuth: true,
      },
      component: AuthenticationVideo
    },
    {
      path: '/protocal',
      name: 'Protocal',
      component: Protocal
    },
    {
      path: '/new-phone',
      name: 'NewPhone',
      component: NewPhone
    },
    {
      path: '/modify-success',
      name: 'ModifySuccess',
      component: ModifySuccess
    },
    {
      path: '/authenticate-success',
      name: 'AuthenticateSuccess',
      component: AuthenticateSuccess
    },
    {
      path: '/bank-card',
      name: 'BankCard',
      component: BankCard
    },
    {
      path: '/card',
      name: 'Card',
      component: Card
    },
    {
      path: '/add-card',
      name: 'AddCard',
      component: AddCard
    },
    {
      path: '/card-vertify',
      name: 'CardVertify',
      component: CardVertify
    },
    {
      path: '/contact',
      name: 'Contact',
      component: Contact
    },
    {
      path: '/message-details',
      name: 'MessageDetails',
      component: MessageDetails
    },
    {
      path: '/recharge',
      name: 'Recharge',
      component: Recharge
    },
    {
      path: '/transfer-accounts',
      name: 'TransferAccounts',
      component: TransferAccounts
    },
    {
      path: '/questions',
      name: 'Questions',
      component: Questions
    },
    {
      path: '/transfer-info',
      name: 'TransferInfo',
      component: TransferInfo
    },
    {
      path: '/transfer-success',
      name: 'TransferSuccess',
      component: TransferSuccess
    },
    {
      path: '/recharge-records',
      name: 'RechargeRecords',
      component: RechargeRecords
    },
    {
      path: '/recharge-details',
      name: 'RechargeDetails',
      component: RechargeDetails
    },
    {
      path: '/withdraw-records',
      name: 'WithdrawRecords',
      component: WithdrawRecords
    },
    {
      path: '/withdraw-details',
      name: 'WithdrawDetails',
      component: WithdrawDetails
    },
    {
      path: '/withdraw-success',
      name: 'WithdrawSuccess',
      component: WithdrawSuccess
    },
    {
      path: '/withdraw',
      name: 'Withdraw',
      component: Withdraw
    },
    {
      path: '/help',
      name: 'Help',
      component: Help
    },
    {
      path: '/current-phone',
      name: 'CurrentPhone',
      component: CurrentPhone
    },
    {
      path: '/set-stop',
      name: 'SetStop',
      component: SetStop
    },
    {
      path: '/set-drop',
      name: 'SetDrop',
      component: SetDrop
    },
    {
      path: '/buy',
      name: 'Buy',
      component: Buy
    },
    {
      path: '/sell',
      name: 'Sell',
      component: Sell
    },
    {
      path: '/close-out',
      name: 'CloseOut',
      component: CloseOut
    },
    {
      path: '/close-sell',
      name: 'CloseSell',
      component: CloseSell
    },
    {
      path: '/order-success',
      name: 'OrderSuccess',
      component: OrderSuccess
    },
    {
      path: '/sell-order',
      name: 'SellOrder',
      component: SellOrder
    },
    {
      path: '/revoke',
      name: 'Revoke',
      component: Revoke
    },
    {
      path: '/query',
      name: 'Query',
      component: Query
    },
    {
      path: '/delegate',
      name: 'Delegate',
      component: Delegate
    },
    {
      path: '/history-delegate',
      name: 'HistoryDelegate',
      component: HistoryDelegate
    },
    {
      path: '/transaction',
      name: 'Transaction',
      component: Transaction
    },
    {
      path: '/history-transaction',
      name: 'HistoryTransaction',
      component: HistoryTransaction
    },
    {
      path: '/settlement',
      name: 'Settlement',
      component: Settlement
    },
    {
      path: '/settlement-details',
      name: 'SettlementDetails',
      component: SettlementDetails
    },
    {
      path: '/journal-account',
      name: 'JournalAccount',
      component: JournalAccount
    },
    {
      path: '/journal-details',
      name: 'JournalDetails',
      component: JournalDetails
    },
    {
      path: '/no-data',
      name: 'NoData',
      component: NoData
    },
    {
      path: '/query-stop',
      name: 'QueryStop',
      component: QueryStop
    },
    {
      path: '/overdue',
      name: 'Overdue',
      component: Overdue
    },
    {
      path: '/buy_details',
      name: 'BuyDetails',
      component: BuyDetails
    },
    {
      path: '/one_cross_rgou',
      name: 'OneCrossRgou',
      component: OneCrossRgou
    },
    {
      path: '/quick_backhand',
      name: 'QuickBackhand',
      component: QuickBackhand
    },
    {
      path: '/search_contract',
      name: 'SearchContract',
      component: SearchContract
    },
    {
      path: '/rgg_details',
      name: 'RggDetails',
      component: RggDetails
    },
    {
      path: '/calendar',
      name: 'Calendar',
      component: Calendar
    },
    {
      path: '/cross_search',
      name: 'CrossSearch',
      component: CrossSearch
    },{
      path:'/one_cross_submit',
      name:'oneCrossSubmit',
      component:oneCrossSubmit
    },
    {
      path:'/return_link',
      name:'returnLink',
      component:returnLink
    },
    {
      path:'/change_phone',
      name:'changePhone',
      component:changePhone
    },
    {
      path:'/againauthentication',
      name:'againAuthentication',
      component:againAuthentication
    },
    {
      path:'/zfb-transferInfo',
      name:'zfbTransferInfo',
      component:zfbTransferInfo
    },
    {
      path:'/zfb-transferSuccess',
      name:'zfbTransferSuccess',
      component:zfbTransferSuccess
    },
    // {
    //   path:'/indexmarketdetails',
    //   name:'indexMarketDetails',
    //   component:indexMarketDetails
    // },
    {
      path:'/face',
      name:'Face',
      component:Face
    },{
      path:'/authenticationSelect',
      name:'authenticationSelect',
      component:authenticationSelect
    },{
      path:'/authenticatecar',
      name:'authenticatecar',
      component:authenticatecar
    },{
      path:'/authenticateCarName',
      name:'authenticateCarName',
      component:authenticateCarName
    }
  ]
})
