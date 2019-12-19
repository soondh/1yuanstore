var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
const pay = require('../../../services/pay.js');

var app = getApp();

Page({
  data: {
    orderId: '',
    addressId: 0,
    checkedGoodsList: [],
    checkedAddress: {},
    goodsTotalPrice: 0.00, //shangpinzongjia
    freightPrice: 0.00,    //kuaidifei
    couponPrice: 0.00,     //youhuijiage
    orderTotalPrice: 0.00,  //dingdanzongjia
    actualPrice: 0.00,     //shijizhifuzongjia
    address: {},
  },
  onLoad: function (options) {
    console.log(options)
    var that = this;
    that.setData({
      orderId: options.orderId
    });

    // 页面初始化 options为页面跳转所带来的参数
    this.getOrderInfo()

  },

  //根据id获取详情
  getOrderInfo: function () {
    var that = this

    util.request(api.OrderInfo,{
      statuId: 1,
      uuid: that.data.orderId
    },'GET').then(function (res){
      console.log(res)
      if(res.cd == 0){
        that.setData({
          checkedGoodsList:res.data[0].goodsList,
          addressId: res.data[0].addressId,
          freightPrice: res.data[0].freight,
          goodsTotalPrice: res.data[0].originAmount,
          actualPrice: res.data[0].totalAmount
        });

        if (that.data.addressId != 0){
        util.request(api.AddressInfo,{
          addressId: that.data.addressId
        },'GET').then(function (res){
          if(res.cd == 0){
            that.setData({
              checkedAddress: res.data[0]
            });
          }
        });
      }
      }

      wx.hideLoading();
    });
  },

  getCheckoutInfo: function () {
    var that = this;
  
    console.log(that.data.checkedGoodsList)

    util.request(api.OrderInfo).then(function (res) {
      console.log(res)
      if (res.cd === 0) {
        console.log(res.data);
        that.setData({
          checkedGoodsList: res.data.checkedGoodsList,
          checkedAddress: res.data.checkedAddress,
          actualPrice: res.data.actualPrice,
          checkedCoupon: res.data.checkedCoupon,
          couponList: res.data.couponList,
          couponPrice: res.data.couponPrice,
          freightPrice: res.data.freightPrice,
          goodsTotalPrice: res.data.goodsTotalPrice,
          orderTotalPrice: res.data.orderTotalPrice
        });
      }
      wx.hideLoading();
    });
  },
  selectAddress() {
    var that = this;
    var orderId = that.data.orderId;
    wx.navigateTo({
      url: '/pages/behavior/address/address?orderId=' + orderId,
    })
  },

  addAddress() {
    var that = this
    wx.navigateTo({
      url: '/pages/behavior/address/address?orderId=' + that.data.orderId,
    })
  },
  onReady: function () {
    // 页面渲染完成

  },
  onShow: function () {
    // 页面显示
    let that = this;
    wx.showLoading({
      title: '加载中...',
    })

    var newaddressId = wx.getStorageSync('addressSelected');
    if(newaddressId){
      if(newaddressId != that.data.addressId){
        that.getOrderInfo();
      } else {
        wx.hideLoading();
      }
    } else {
      wx.hideLoading();
    }

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },
  submit: function () {
    if (this.data.addressId <= 0) {
      util.showErrorToast('oops');
      return false;
    }
  },

  //地址列表排序，默认地址排第一个
  compareDefault: function(isDefault) {
    return function(a,b) {
      var value1 = a.isDefault;
      var value2 = b.isDefault;
      return value2-value1;
    }
  },

})