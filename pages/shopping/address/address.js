var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();

Page({
  data: {
    orderId: 0,
    addressList: [],
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    that.setData({
      orderId: options.orderId
    });

    this.getAddressList();
  },
  onReady: function () {
    // 页面渲染完成
  },
  //编辑地址或者新建地址后返回，用的navigateback，所以需要刷新页面，其他情况在onload已经刷新过数据，不需要再次刷新
  onShow: function () {
    // 页面显示
    if (wx.getStorageSync("addressEdit")){
      this.getAddressList();
      wx.setStorageSync("addressEdit",false)
    } else {
      
    }

  },

  //获取用户收货地址列表
  getAddressList (){
    let that = this;
    util.request(api.AddressSavedList).then(function (res) {
      console.log(res)
      if (res.cd === 0) {
        console.log(res)
        //地址列表排序，默认地址排最前面
        if(res.data.length > 0){
        that.setData({
          addressList: res.data.sort(that.compareDefault("isDefault"))
        });
      } else {
        that.setData({
          addressList: []
        });
      }
    }
    });
  },

  addressAdd (event) {
    wx.navigateTo({
      //新建收货地址，传入的地址id为0
      url: '/pages/ucenter/addressAdd/addressAdd?id=0' + '&style='
    })
  },

  addressUpdate (event) {
    console.log(event)
    wx.navigateTo({
      //新建收货地址，传入地址id
      url: '/pages/ucenter/addressAdd/addressAdd?id=' + event.currentTarget.dataset.address.id + '&style=true'
    })
  },

  //地址列表排序，默认地址排第一个
  compareDefault: function(isDefault) {
    return function(a,b) {
      var value1 = a.isDefault;
      var value2 = b.isDefault;
      return value2-value1;
    }
  },

  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },

  selectAddress(event){
    var that = this
    var newAddressId = event.currentTarget.dataset.address.id
    console.log(that.data.orderId)
    util.request(api.OrderAddressUpdate,{
      orderId: that.data.orderId,
      addressId: newAddressId
    },'PUT').then(function (res){
      console.log(res)
    });

    try {
      wx.setStorageSync('addressSelected', event.currentTarget.dataset.address.id);
    } catch (e) {

    }

    //选择该收货地址
    wx.navigateBack();

    /*
    wx.redirectTo({
      url: '/pages/shopping/checkout/checkout'
    })
    */
  },
})