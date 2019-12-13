var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

Page({
  data: {
    orderId: 0,
    orderInfo: {},
    orderGoods: [],
    handleOption: {},
    orderTime:''
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      orderId: options.id
    });
    console.log(this.data.orderId)
    this.getOrderDetail();
  },
  getOrderDetail() {
    let that = this;
    util.request(api.OrderInfo, {
      uuid: that.data.orderId
    }).then(function (res) {
      if (res.cd == 0) {
        console.log(res)
        that.setData({
          orderInfo: res.data[0],
          orderGoods: res.data[0].goodsList,
          handleOption: res.data.handleOption
        });
        var time = util.formatTime(that.data.orderInfo.createTime,'Y/M/D h:m:s');
        console.log(time)
        that.setData({
          orderTime:time
        });
        //that.payTimer();
      }
    });
  },
  payTimer() {
    let that = this;
    let orderInfo = that.data.orderInfo;

    setInterval(() => {
      orderInfo.add_time -= 1;
      that.setData({
        orderInfo: orderInfo,
      });
    }, 1000);
  },
  payOrder() {
    let that = this;
    util.request(api.PayPrepayId, {
      orderId: that.data.orderId || 15
    }).then(function (res) {
      if (res.errno === 0) {
        const payParam = res.data;
        wx.requestPayment({
          'timeStamp': payParam.timeStamp,
          'nonceStr': payParam.nonceStr,
          'package': payParam.package,
          'signType': payParam.signType,
          'paySign': payParam.paySign,
          'success': function (res) {
            //console.log(res)
          },
          'fail': function (res) {
            //console.log(res)
          }
        });
      }
    });

  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },

  cancelOrder:function (){
    var that =  this
    var orderId = that.data.orderId

    wx.showModal({
      title: '取消订单',
      content: '确认取消该订单吗',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: (result) => {
        if(result.confirm){
          util.request(api.OrderDelete + "?id=" + orderId, '', 'DELETE').then(function (res) {
            if (res.cd === 0) {
              console.log(res)
            }
          });
        }
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  }
})