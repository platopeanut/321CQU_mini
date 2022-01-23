const api = require('../../../utils/api')
const util = require('../../../utils/util')
Page({
    data: {
        stuInfo: {
            stu_name: wx.getStorageSync('stu_name'),
            stu_id: wx.getStorageSync('stu_id'),
            email: wx.getStorageSync('email'),
            nickname: wx.getStorageSync('nickname'),
            uid: wx.getStorageSync('uid'),
            uid_pwd: wx.getStorageSync('uid_pwd'),
            identity: wx.getStorageSync('identity'), // 研究生还是本科生
        },
    },

    saveInfo(e) {
        let global = this;
        let stu_name = e.detail.value.stu_name
        let stu_id = e.detail.value.stu_id
        let email = e.detail.value.email
        let nickname = e.detail.value.nickname

        // 设置昵称
        if (nickname !== "") {
          // 学号姓名不能为空
          if (stu_id === "" || stu_name === "") {
            wx.showToast({
              title: '学号姓名必填',
              icon: 'error'
            })
          } else {
            // 设置昵称
            this.setNickname(stu_id, nickname)
          }
        } else {
          wx.showToast({
            title: '绑定成功',
            icon: 'success'
          })
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
            nickname: nickname,
            uid: wx.getStorageSync('uid'),
            uid_pwd: wx.getStorageSync('uid_pwd'),
          }
        })
    },
    
    saveUid(e) {
      let uid = e.detail.value.uid
      let uid_pwd = e.detail.value.uid_pwd
      let stu_id = this.data.stuInfo.stu_id
      let identity = this.data.identity?this.data.identity:'本科生'
      let that = this
      if (identity === '本科生') {
          if (uid === '' || uid_pwd === '' || stu_id === '') {
              wx.showToast({
                  title: '学号，统一身份认证账号及密码必填',
                  icon: 'none'
              })
              return
          }
      } else if (identity === '研究生') {
          if (uid === '' || uid_pwd === '') {
              wx.showToast({
                  title: '统一身份认证账号及密码必填',
                  icon: 'none'
              })
              return
          }
      }

      wx.showLoading()
      if (identity === '本科生') {
          wx.login({
              success: function(res) {
                  api.checkUidInfo(stu_id, uid, uid_pwd, res.code).then(res => {
                      wx.hideLoading()
                      if (res.statusCode === 200) {
                          if (res.data.Statue === 1) {
                              wx.setStorageSync('uid', uid)
                              wx.setStorageSync('uid_pwd', uid_pwd)
                              wx.setStorageSync('identity', '本科生')
                              that.setData({
                                  uid: uid,
                                  uid_pwd: uid_pwd,
                              })
                              wx.showToast({
                                  title: '绑定成功',
                                  icon: 'success'
                              })
                          } else {
                              util.showError(res)
                          }
                      } else {
                          wx.showToast({
                              title: `网络错误[${res.statusCode}]`,
                              icon: 'error'
                          })
                      }
                  })
              },
              fail: function() {
                  wx.hideLoading()
                  wx.showToast({
                      title: '登陆失败',
                      icon: 'error'
                  })
              }
          })
      } else if (identity === '研究生') {
          api.checkPGUidInfo(uid, uid_pwd).then(res => {
              wx.hideLoading()
              if (res.statusCode === 200) {
                  if (res.data.Statue === 1) {
                      wx.setStorageSync('uid', uid)
                      wx.setStorageSync('uid_pwd', uid_pwd)
                      wx.setStorageSync('identity', '研究生')
                      that.setData({
                          uid: uid,
                          uid_pwd: uid_pwd,
                      })
                      wx.showToast({
                          title: '绑定成功',
                          icon: 'success'
                      })
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
      } else {
          wx.hideLoading()
          wx.showToast({
              title: '身份错误',
              icon: 'none'
          })
      }
    },
    identity_choice: function (e) {
        this.setData({
            identity: e.detail.value
        })
    },
    setNickname(stu_id, nickname) {
        let global = this
        let avatarUrl = wx.getStorageSync('userInfo').avatarUrl
        // avatarUrl不存在则需要重新授权
        if (avatarUrl === "" || avatarUrl === undefined) {
            wx.showToast({
            title: '需要重新授权',
            icon: 'error',
            })
            return
        }
        wx.showLoading()
        api.setNickname(stu_id, nickname, avatarUrl).then(res => {
            wx.hideLoading()
            if (res.statusCode === 200) {
                if (res.data.Statue === 1) {
                    wx.setStorageSync('nickname', nickname)
                    wx.showToast({
                    title: '绑定成功',
                    icon: 'success'
                    })
                } else {
                    util.showError(res)
                }
            } else {
                wx.showToast({
                    title: `网络错误[${res.statusCode}]`,
                    icon: 'error'
                })
            }
        })
        
    }
})