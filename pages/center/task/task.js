const api = require('../../../utils/api')
Page({
    data: {
        page_list: ['任务', '订阅'],
        curr_page: '任务',
        task_map: {},
        isEmpty: true,
        modalShow: false, 
        curr_index: "",
        subscribe_list: [],
        subscribeRecord: true,
    },

    hideModal_cancel: function() {
        this.setData({
            subscribeRecord: true,
        })
    },

    hideModal_sure: function() {
        wx.setStorageSync('subscribeRecord', true)
        this.setData({
            subscribeRecord: true,
        })
    },

    update: function() {
        let grade_id = '3NUUHtF4lmAUyL8knfaca_KRIpkblB50rFOMrNCRMAk'
        let subscribe_list = [
            {
                title: 'grade',
                content: '成绩更新通知提醒',
                isSubscribed: false
            },
        ]
        let that = this
        wx.getSetting({
          withSubscriptions: true,
          success: function(res) {
              console.log(res.subscriptionsSetting[grade_id])
              if (res.subscriptionsSetting[grade_id] == 'accept') {
                subscribe_list[0].isSubscribed = true
              }
              that.setData({
                  subscribe_list: subscribe_list
              }) 
          },
          fail: function() {
              wx.showToast({
                title: '加载失败',
                icon: 'error'
              })
          }
        })
    },

    // cancelItem: function(res) {
    //     let subscribe_list = wx.getStorageSync('subscribe_list')
    //     subscribe_list['grade'] = false
    //     wx.setStorageSync('subscribe_list', subscribe_list)
    //     this.update()
    // },
    subscribeItem: function(res) {
        let stu_id = wx.getStorageSync('stu_id')
        let uid = wx.getStorageSync('uid')
        let uid_pwd = wx.getStorageSync('uid_pwd')
        if (stu_id == '' || uid == '' || uid_pwd == '') {
            wx.showToast({
              title: '请完善统一身份认证账号密码，学号信息',
              icon: 'none'
            })
            return
        }
        let curr_item = res.target.dataset.id
        let that = this
        if (curr_item == 'grade') {
            if (wx.getStorageSync('subscribeRecord') == '') {
                this.setData({
                    subscribeRecord: false
                })
                return
            }
            let id = '3NUUHtF4lmAUyL8knfaca_KRIpkblB50rFOMrNCRMAk'
            wx.requestSubscribeMessage({
              tmplIds: [id,],
              success: function(res) {
                wx.showLoading()
                if (res[id] == 'accept') {
                    wx.login({
                        success: function(res) {
                            // 订阅
                            api.subscribe(res.code, stu_id, uid, uid_pwd).then(res => {
                                if (res.data.Statue == 1) {
                                    that.update()
                                    wx.hideLoading()
                                    wx.showToast({
                                    title: '订阅成功',
                                    icon: 'success'
                                    })
                                } else {
                                    wx.hideLoading()
                                    wx.showToast({
                                      title: '订阅失败',
                                      icon: 'error',
                                    })
                                }
                            })
                        }, 
                        fail: function(res) {
                            wx.hideLoading()
                            wx.showToast({
                              title: '订阅失败',
                              icon: 'error'
                            })
                        }
                    })
                } else {
                    wx.hideLoading()
                    wx.showToast({
                      title: '订阅失败',
                      icon: 'error'
                    })
                }
              },
              fail: function(res) {
                wx.showToast({
                    title: '订阅失败',
                    icon: 'error'
                })
              }
            })
        }
    },

    onShow: function() {
        this.update()
        let task_map = getApp().globalData.task_map
        this.setData({
            task_map: task_map,
            isEmpty: JSON.stringify(task_map) == '{}'
        })
    },
    // 下拉刷新
    onPullDownRefresh: function() {
        wx.showLoading()
        this.onShow()
        setTimeout(() => {
            wx.hideLoading()
        }, 300)
        wx.stopPullDownRefresh()
    },

    // 对每一项的操作
    onTouchItem(e) {
        let curr_index = e.currentTarget.dataset.index
        this.setData({
            modalShow: true,
            curr_index: curr_index
        })
    },
    deleteSure() {
        // globalData删除
        delete getApp().globalData.task_map[this.data.curr_index]
        // 本地更新
        this.onShow()
        this.setData({
            modalShow: false,
            curr_index: ""
        })
    },
    deleteCancel() {
        this.setData({
            modalShow: false,
            curr_index: ""
        })
    },

    // 选择功能
    selectPage: function(res) {
        this.setData({
            curr_page: res.currentTarget.dataset.id
        })
    },

})