const api = require('../../../utils/api')

Page({
    data: {
        stuInfo: {
            stu_name: wx.getStorageSync('stu_name'),
            stu_id: wx.getStorageSync('stu_id'),
            email: wx.getStorageSync('email'),
            nickname: wx.getStorageSync('nickname'),
            uid: wx.getStorageSync('uid'),
            uid_pwd: wx.getStorageSync('uid_pwd'),
        },
    },

    onShow: function() {
        this.setData({
            stuInfo: {
                stu_name: wx.getStorageSync('stu_name'),
                stu_id: wx.getStorageSync('stu_id'),
                email: wx.getStorageSync('email'),
                nickname: wx.getStorageSync('nickname'),
                uid: wx.getStorageSync('uid'),
                uid_pwd: wx.getStorageSync('uid_pwd'),
            },
        })
    },
    saveInfo(e) {
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
          } else {
            api.getStuName(stu_id).then(res => {
              if (res.data.Statue == 0) {
                wx.showToast({
                  title: '校验失败',
                  icon: 'error'
                })
                return
              }
              if(res.data.Sname == stu_name) {
                // 设置昵称
                this.setNickname(stu_id, nickname)
              } else {
                wx.showToast({
                  title: '信息有误',
                  icon: 'error'
                })
              } 
            })
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
      let that = this
      if (uid == '' || uid_pwd == '' || stu_id == '') {
        wx.showToast({
          title: '学号，统一身份认证账号及密码必填',
          icon: 'none'
        })
        return
      }
      wx.showLoading()
      wx.login({
        success: function(res) {
          console.log(res.code)
          api.checkUidInfo(stu_id, uid, uid_pwd, res.code).then(res => {
            if (res.statusCode == 200) {
              if (res.data.Statue == 1) {
                wx.setStorageSync('uid', uid)
                wx.setStorageSync('uid_pwd', uid_pwd)
                that.setData({
                  uid: uid,
                  uid_pwd: uid_pwd,
                })
                wx.showToast({
                  title: '绑定成功',
                  icon: 'success'
                })
              } else {
                wx.showToast({
                  title: '校验失败',
                  icon: 'error'
                })
              }
            } else {
              wx.showToast({
                title: '网络错误',
                icon: 'error'
              })
            }
            wx.hideLoading()
          })
        },
        fail: function() {
          wx.showToast({
            title: '登陆失败',
            icon: 'error'
          }),
          wx.hideLoading()
        }
      })
    },

    setNickname(stu_id, nickname) {
        let global = this
        let avatarUrl = wx.getStorageSync('userInfo').avatarUrl
        // avatarUrl不存在则需要重新授权
        if (avatarUrl == "" || avatarUrl == undefined) {
            wx.showToast({
            title: '需要重新授权',
            icon: 'error',
            })
            return
        }
        wx.showLoading()
        api.setNickname(stu_id, nickname, avatarUrl).then(res => {
            if (res.statusCode == 200) {
            if (res.data.Statue == 1) {
                wx.setStorageSync('nickname', nickname)
                wx.showToast({
                title: '绑定成功',
                icon: 'success'
                })
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
            wx.hideLoading()
            }
        })
        
    }
})