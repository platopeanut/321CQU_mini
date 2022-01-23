const api = require('../../utils/api')
const util = require('../../utils/util')
Page({
  data: {
    // 是否显示新用户界面
    has_bind: true,
    userInfo: wx.getStorageSync('userInfo'),
    ad_count: wx.getStorageSync('ad_count'),
  },

  update_ad_times: function () {
    let that = this
    wx.login({
      success: function(res) {
        wx.showLoading()
        api.ad_times(res.code).then(res => {
          wx.hideLoading()
          if (res.statusCode === 200) {
            if (res.data.Statue===1) {
              that.setData({
                ad_count: res.data.Times
              })
              wx.setStorageSync('ad_count', that.data.ad_count)
            } else {
              util.showError(res)
            }
          } else {
            wx.showToast({
              title: `网络错误[${res.statusCode}]`,
              icon: 'none'
            })
          }
        })
      },
      fail: function() {
        wx.showToast({
          title: '登陆失败',
          icon: 'error'
        })
      }
    })
  },

  // 用于第一次绑定显示弹窗
  showModal(e) {
    this.setData({
      has_bind: false
    })
  },
  // 用于第一次绑定关闭弹窗
  hideModal_cancel(e) {
    this.setData({
      has_bind: true
    })    
  },
  hideModal_sure(e) {
    this.setData({
      has_bind: true
    })    
    wx.setStorageSync('has_bind', true)
    wx.navigateTo({
      url: './info/info'
    })
  },
  // 重新授权
  reauthorize() {
    this.setData({
      userInfo: ""
    })
  },
  // 获取用户信息
  getUserProfile(e) {
    wx.getUserProfile({
      desc: '完善用户信息资料', 
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
        })
        //缓存用户信息
        wx.setStorageSync("userInfo",res.userInfo)
      }
    })
  },

  // 跳转到绑定信息界面
  editInfo() {
    this.showModal()
  },

  // 清除缓存
  clearCache(e) {
    this.setData({
      has_bind: true,
    })
    wx.clearStorage({
      success: (res) => {
        wx.showToast({
          title: '清除成功',
          icon: 'success'
        })
      },
      fail: (res) => {
        wx.showToast({
          title: '清除失败',
          icon: 'error'
        })
      }
    })
  },

})
