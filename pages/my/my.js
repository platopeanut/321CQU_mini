const util = require('../../utils/util')

Page({
  data: {
    // 是否显示新用户界面
    has_bind: true,
    userInfo: wx.getStorageSync('userInfo'),
    stuInfo: {
      stu_name: wx.getStorageSync('stu_name'),
      stu_id: wx.getStorageSync('stu_id'),
      email: wx.getStorageSync('email'),
      nickname: wx.getStorageSync('nickname')
    },
  },

  // 用于第一次绑定显示弹窗
  showModal(e) {
    this.setData({
      has_bind: false
    })
  },
  // 用于第一次绑定关闭弹窗
  hideModal(e) {
    this.setData({
      has_bind: true
    })
  },
  // 重新授权
  reauthorize() {
    this.setData({
      userInfo: ""
    })
  },

  onLoad() {
  },
  
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

  clearCache(e) {
    this.setData({
      has_bind: true,
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
    // 初次绑定进行提示
    if (!wx.getStorageSync('has_bind')) {
      wx.setStorageSync('has_bind', true)
      this.showModal()
    }
    let global = this;
    let stu_name = e.detail.value.stu_name
    let stu_id = e.detail.value.stu_id
    let email = e.detail.value.email
    let nickname = e.detail.value.nickname
    // 设置昵称
    if (nickname != "") {
      // 校验身份
      if (stu_id == "" || stu_name == "") {
        wx.showToast({
          title: '学号姓名必填',
          icon: 'error'
        })
        return
      } else {
        util.getStuName(stu_id).then(res => {
          if(util.parseFromStr(res.data)[1] == stu_name) {
            // 设置昵称
            nickname = this.setNickname(stu_id, nickname)
            if (nickname == "") {
              return
            }
          } else {
            wx.showToast({
              title: '信息有误',
              icon: 'error'
            })
            return
          } 
        })
      }
    }
    wx.setStorageSync('stu_name', stu_name)
    wx.setStorageSync('stu_id', stu_id)
    wx.setStorageSync('email', email)
   
    //页面加载
    global.setData({
      stuInfo: {
        stu_id: stu_id,
        stu_name: stu_name,
        email: email,
        nickname: nickname
      }
    })
    wx.showToast({
      title: '绑定成功',
      icon: 'success'
    })
  },

  setNickname(stu_id, nickname) {
    let global = this
    util.setNickname(stu_id, nickname).then(res => {
      if (res.statusCode == 200) {
        if (util.parseFromStr(res.data) == "1") {
          wx.setStorageSync('nickname', nickname)
          return nickname
        } else {
          wx.showToast({
            title: '昵称已存在',
            icon: 'error'
          })
          return ""
        }
      } else {
        wx.showToast({
          title: '网络错误',
          icon: 'error'
        })
        return ""
      }
    })
  }
})
