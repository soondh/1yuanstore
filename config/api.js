const baseUrl = "http://122.51.51.11:8001/";
//const baseUrl = "https://yiyuan.store/"
//const ApiRootUrl = 'http://118.31.12.176:8001/';

module.exports = {
  indexPic: baseUrl + 'mall/indexPic', //首页宣传图
  IndexUrl: baseUrl + 'mall/banner', //首页banner数据接口
  CategoryList: baseUrl + 'mall/category', //商品种类
  CategoryInfo: baseUrl + 'mall/category/goods', //特定种类下的商品列表
  GoodsDetail: baseUrl + 'mall/goods', //商品详情
  CartAdd: baseUrl + "mall/cart", //添加购物车
  CartList: baseUrl + "mall/cart", //购物车列表
  CartSelected: baseUrl + "mall/cart", //购物车项目选中&取消
  CartSelectedAll: baseUrl + 'mall/cart', //购物车全选
  CartUpdate: baseUrl + "mall/cart", //修改购物车信息
  CartDelete: baseUrl + "mall/cart", //删除购物车

  AddressList: baseUrl + "mall/arealist", //获取地址列表
  AddressSavedList: baseUrl + "mall/address", //获取收获地址列表
  AddressInfo: baseUrl + "mall/address", //获取地址详情
  AddressSaved: baseUrl + "mall/address", //保存收货地址
  AddressUpdate: baseUrl + "mall/address", //修改收货地址
  AddressDelete: baseUrl + "mall/address", //删除收货地址

  OrderInfo: baseUrl + "mall/order", //获取订单详情
  OrderGenerate: baseUrl + "mall/order", //生成订单
  OrderAddressUpdate: baseUrl + "mall/order", //修改订单收货地址

  AuthLoginByWeixin: baseUrl + 'mall/login', //微信登陆

  //OrderSubmit: ApiRootUrl + 'order/submit', // 提交订单
  //PayPrepayId: ApiRootUrl + 'pay/prepay', //获取微信统一下单prepay_id

  //OrderList: ApiRootUrl + 'order/list',  //订单列表
  //OrderDetail: ApiRootUrl + 'order/detail',  //订单详情
  //OrderCancel: ApiRootUrl + 'order/cancel',  //取消订单
  //OrderExpress: ApiRootUrl + 'order/express', //物流详情

};