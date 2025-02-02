var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

Page({
  data:{
    orderList: [],
    currentpage: 1,
    pageSize: 10
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数

    this.getOrderList();
  },
  getOrderList(){
    let that = this;
    util.request(api.OrderInfo,{
      'statuId':1,
      'page':that.data.currentpage,
      'pageSize':that.data.pageSize
    },'GET').then(function (res) {
      if (res.cd === 0) {
        that.setData({
          orderList: that.data.orderList.concat(res.data)
        });
      }
    });
  },
  payOrder(){
    wx.redirectTo({
      url: '/pages/pay/pay',
    })
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },

  onReachBottom: function() {
    var pageNum = this.data.currentpage;
    
    this.setData({
      currentpage: pageNum + 1 //设置下一页
    })

    this.getOrderList();
  },

})