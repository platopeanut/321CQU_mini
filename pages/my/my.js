// index.js

// 获取应用实例
const app = getApp()
const student_db = wx.cloud.database().collection('Student')

Page({
  data: {
    // 是否显示新用户界面
    first_login: false,
    display: false,
    stu_name: "",
    stu_id: "",
    stu_email: "",
    userInfo: {},
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
  hideModal(e) {
    this.setData({
      display: false
    })
  },
  onLoad() {
    let global = this;
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
    wx.getStorage({
      key: 'stu_name',
      success (res) {
          global.setData({
              stu_name: res.data
          })
      }
      })
    wx.getStorage({
        key: 'stu_id',
        success (res) {
            global.setData({
                stu_id: res.data
            })
        }
    })
    wx.getStorage({
      key: 'stu_email',
      success (res) {
          global.setData({
              stu_email: res.data
          })
      }
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
      stu_name: "",
      stu_id: "",
      stu_email: "",
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
    let stu_name = e.detail.value.stu_name;
    let stu_id = e.detail.value.stu_id;
    // 如果stu_id能转换成数字，那就进行转换
    if (!isNaN(stu_id)) stu_id = parseInt(stu_id)
    let stu_email = e.detail.value.stu_email;
    // 学号姓名校验
    // 研究生不用校验
    if (!(stu_id <= 100000000)) {
      wx.setStorage({
        key:"stu_name",
        data: stu_name
      })
      wx.setStorage({
        key:"stu_id",
        data: stu_id
      })
      wx.setStorage({
        key:"stu_email",
        data: stu_email
      })
      wx.showToast({
        title: '保存成功',
        icon: 'success'
      })
      return
    }
    student_db.where({
      Sid: stu_id
    }).get({
      success: function(res) {
        if (res.data.length === 0) {
          wx.showToast({
            title: '信息没有录入',
            icon: 'error'
          })
        }
        else if (res.data[0].Sname === stu_name) {
          wx.setStorage({
            key:"stu_name",
            data: stu_name
          })
          wx.setStorage({
            key:"stu_id",
            data: stu_id
          })
          wx.setStorage({
            key:"stu_email",
            data: stu_email
          })
          wx.showToast({
            title: '绑定成功',
            icon: 'success'
          })
        } else {
          wx.showToast({
            title: '个人信息不正确',
            icon: 'error'
          })
        }
      }
    })
  }
})
