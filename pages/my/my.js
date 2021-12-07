// index.js

// 获取应用实例
const app = getApp()
const student_db = wx.cloud.database().collection('Student')
const stuInfo_db = wx.cloud.database().collection('StuInfo')
Page({
  data: {
    // 是否显示新用户界面
    first_login: false,
    display: false,
    userInfo: {},
    stuInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: true,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName') // 如需尝试获取用户信息可改为false
  },
  showModal(e) {
    this.setData({
      display: true
    })
  },
  reauthorize() {
    this.setData({
      first_login: true
    })
  },
  hideModal(e) {
    this.setData({
      display: false
    })
  },
  onLoad() {
    let global = this
    wx.getStorage({
      key: 'first_login',
      fail: function(res) {
          wx.setStorage({
            key: "first_login",
            value: false
          })
          global.setData({
            first_login: true
          })
        }
    })
    this.setData({
      userInfo: wx.getStorageSync("userInfo")
    })

    this.setData({
      stuInfo: wx.getStorageSync("stuInfo")
    })
  },
  
  getUserProfile(e) {
    wx.getUserProfile({
      desc: '完善用户信息资料', 
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        //缓存用户信息
        wx.setStorageSync("userInfo",res.userInfo)
        // wx.setStorage({
        //   key: 'userInfo',
        //   data: res.userInfo
        // })
      }
    })
    
  },
  getUserInfo(e) {
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  clearCache(e) {
    this.setData({
      display: false,
      stuInfo: {},
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
  saveInfo(e) {
    let global = this;
    wx.getStorage({
      key: 'has_used',
      success: function(res) {
        global.doSaveInfo(e)
      },
      fail: function(res) {
        wx.setStorage({
          key:"has_used",
          data: true
        })
        // 新用户使用教程
        global.setData({
          display: true
        })
        global.doSaveInfo(e)
      }
    })
    
  },
  doSaveInfo(e) {
    let global = this;
    let stu_name = e.detail.value.stu_name
    let stu_id = e.detail.value.stu_id
    // stu_id与stu_name必填
    if (stu_name == '' || stu_id == '') {
      wx.showToast({
        title: '学号姓名必填',
        icon: 'error'
      })
      return
    }
    let stu_email = e.detail.value.stu_email
    let nickname = e.detail.value.nickname
    // //上传数据库
    // stuInfo_db.add({
    //   data: {
    //     sid: stu_id,
    //     sname: stu_name,
    //     email: stu_email,
    //     nickname: nickname
    //   },
    //   success: function() {
    //     wx.showToast({
    //       title: '录入成功',
    //       icon: 'success'
    //     })
    //   },
    //   fail: function() {
    //     wx.showToast({
    //       title: '录入失败',
    //       icon: 'error'
    //     })
    //   }
    // })
    wx.setStorageSync("stuInfo",{
      stu_id: stu_id,
      stu_name: stu_name,
      email: stu_email,
      nickname: nickname
    })
    //页面加载
    global.setData({
      stuInfo: {
        stu_id: stu_id,
        stu_name: stu_name,
        email: stu_email,
        nickname: nickname
      }
    })
    wx.showToast({
      title: '绑定成功',
      icon: 'success'
    })
  }
})
