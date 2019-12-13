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
    goodsTotalPrice: 0.00, //商品总价
    freightPrice: 0.00,    //快递费
    couponPrice: 0.00,     //优惠价格
    orderTotalPrice: 0.00,  //订单总价
    actualPrice: 0.00,     //实际需要支付的总价
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
    /*
    //老版本代码，订单信息从购物车本地保存后传入
    try {
      var address = wx.getStorageSync('addressSelected');
      if (address.id) {
        that.setData({
          'checkedAddress': address
        });
      } else {
        //获取用户收货地址列表
        util.request(api.AddressSavedList).then(function (res) {
          console.log(res)
          if (res.cd === 0) {
            //地址列表排序，默认地址排最前面
            console.log(res)
            that.setData({
              checkedAddress: res.data.sort(that.compareDefault("isDefault"))[0]
            });
          }
        });
      }

    } catch (e) {
      // Do something when catch error
    }
*/

  },

  //根据订单id获取订单详情- 地址，商品
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
      url: '/pages/shopping/address/address?orderId=' + orderId,
    })
  },

  addAddress() {
    var that = this
    wx.navigateTo({
      url: '/pages/shopping/address/address?orderId=' + that.data.orderId,
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
    /*
    if(wx.getStorageSync("deleteSelectAddress")){
      that.setData({
        'checkedAddress':{}
      })
    }

    var address = wx.getStorageSync('addressSelected');
      if (address.id) {
        that.setData({
          'checkedAddress': address
        });
      } else {
        //获取用户收货地址列表
        util.request(api.AddressSavedList).then(function (res) {
          console.log(res)
          if (res.cd === 0) {
            //地址列表排序，默认地址排最前面
            console.log(res)
            that.setData({
              checkedAddress: res.data.sort(that.compareDefault("isDefault"))[0]
            });
          }
        });
      }

    this.getCheckoutInfo();
*/
  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },
  submitOrder: function () {
    if (this.data.addressId <= 0) {
      util.showErrorToast('请选择收货地址');
      return false;
    }
    util.request(api.OrderSubmit, { addressId: this.data.addressId, couponId: this.data.couponId }, 'POST').then(res => {
      if (res.errno === 0) {
        const orderId = res.data.orderInfo.id;
        pay.payOrder(parseInt(orderId)).then(res => {
          wx.redirectTo({
            url: '/pages/payResult/payResult?status=1&orderId=' + orderId
          });
        }).catch(res => {
          wx.redirectTo({
            url: '/pages/payResult/payResult?status=0&orderId=' + orderId
          });
        });
      } else {
        util.showErrorToast('下单失败');
      }
    });
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