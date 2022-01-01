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
    },

    update: function() {
        if (wx.getStorageSync('subscribe_list') == '') {
            this.setData({
                subscribe_list: [
                    {
                        title: 'grade',
                        content: '成绩更新通知提醒',
                        isSubscribed: false
                    }
                ],
            })
        } else {
            this.setData({
                subscribe_list: [
                    {
                        title: 'grade',
                        content: '成绩更新通知提醒',
                        isSubscribed: wx.getStorageSync('subscribe_list')['grade']==''?false:true
                    }
                ],
            })
        }
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
        console.log(`${stu_id}, ${uid}, ${uid_pwd}`)
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
            let id = '3NUUHtF4lmAUyL8knfaca_KRIpkblB50rFOMrNCRMAk'
            wx.requestSubscribeMessage({
              tmplIds: [id,],
              success: function(res) {
                if (res[id] == 'accept') {
                    wx.login({
                        success: function(res) {
                            // 订阅
                            api.subscribe(res.code, stu_id, uid, uid_pwd).then(res => {
                                if (res.data.Statue == 1) {
                                    // 缓存
                                    let subscribe_list = wx.getStorageSync('subscribe_list')
                                    if (subscribe_list == '') subscribe_list = {}
                                    subscribe_list['grade'] = true
                                    wx.setStorageSync('subscribe_list', subscribe_list)
                                    that.update()
                                    wx.showToast({
                                    title: '订阅成功',
                                    icon: 'success'
                                    })
                                } else {
                                    wx.showToast({
                                      title: '订阅失败',
                                      icon: 'error',
                                    })
                                }
                            })
                            
                        }, 
                        fail: function(res) {
                            wx.showToast({
                              title: '订阅失败',
                              icon: 'error'
                            })
                        }
                    })
                } else {
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