//Component Object
Component({
    properties: {
        myProperty:{
            type:String,
            value:'',
            observer: function(){}
            
    },
      
    },
    data: {
        showLoginDialog: true

    },
    methods: {
        onWechatLogin(e){
            console.log(e)
            if (e.detail.errMsg !== 'getUserInfo:ok') {
              if (e.detail.errMsg === 'getUserInfo:fail auth deny') {
                return false
              }
              wx.showToast({
                title: '微信登录失败',
              })
              return false
            }
            util.login().then((res) => {
              console.log(res)
              console.log(e.detail)
              return util.request(api.AuthLoginByWeixin, {
                code: res,
                //userInfo: e.detail
              }, 'POST');
            }).then((res) => {
              console.log(res)
              if (res.cd !== 0) {
                wx.showToast({
                  title: '微信登录失败',
                })
                return false;
              }
              // 设置用户信息
              app.globalData.userInfo = e.detail.userInfo;
              //app.globalData.userInfo = res.data.userInfo;
              app.globalData.token = res.data.token;
              app.globalData.userId = res.data.userId;
              wx.setStorageSync('userInfo', e.detail.userInfo);
              //wx.setStorageSync('userInfo', JSON.stringify(res.data.userInfo));
              wx.setStorageSync('token', res.data.token);
              wx.setStorageSync('userId',res.data.userId)
              console.log(wx.getStorageSync('userInfo'))
            }).catch((err) => {
              console.log(err)
            })
        },
        onCloseLoginDialog () {
          this.setData({
            showLoginDialog: false
          })
        },

        onShowLogingDilog () {
          this.setData({
            showLoginDialog: true
          })
        }

    },
    created: function(){

    },
    attached: function(){

    },
    ready: function(){

    },
    moved: function(){

    },
    detached: function(){

    },
});