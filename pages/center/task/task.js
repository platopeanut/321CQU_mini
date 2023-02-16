const task_api = require('./task_api')

Page({
    data: {
        // page_list: ['任务', '订阅'],
        page_list: ['任务'],
        curr_page: '任务',
        task_map: {},
        isEmpty: true,
        modalShow: false, 
        curr_index: "",
        subscribe_list: [],
        tmplIds: [
            'QI0OxAxPk65czf4PSv94Wku8OkO0FIB9Rq0GipY2zS4',
            // '3NUUHtF4lmAUyL8knfaca_KRIpkblB50rFOMrNCRMAk'
        ]
    },


    update: function() {
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
                console.log('状态', res.subscriptionsSetting[that.data.grade_id])
                if (res.subscriptionsSetting[that.data.grade_id] === 'accept'
                    || res.subscriptionsSetting[that.data.grade_id] === 'acceptWithForcePush') {
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
    // subscribeItem: function(res) {
    //     let StuInfo = wx.getStorageSync('StuInfo')
    //     let stu_id = StuInfo['stu_id']
    //     let uid = StuInfo['uid']
    //     let uid_pwd = StuInfo['uid_pwd']
    //     if (!(stu_id && uid && uid_pwd)) {
    //         wx.showToast({
    //           title: '请完善统一身份信息',
    //           icon: 'none'
    //         })
    //         return
    //     }
    //     let curr_item = res.target.dataset.id
    //     let that = this
    //     if (curr_item === 'grade') {
    //         let id = that.data.grade_id
    //         wx.requestSubscribeMessage({
    //             tmplIds: [id,],
    //             success: function(res) {
    //                 console.log('订阅', res)
    //                 if (res[id] === 'accept') {
    //                     wx.login({
    //                         success: function(res) {
    //                             // 订阅
    //                             task_api.subscribe(res.code, stu_id, uid, uid_pwd).then(() => {
    //                                 that.update()
    //                                 wx.showToast({
    //                                     title: '订阅成功',
    //                                     icon: 'none'
    //                                 })
    //                             }, () => {
    //                                 wx.showToast({
    //                                     title: '订阅失败',
    //                                     icon: 'none',
    //                                 })
    //                             })
    //                         },
    //                         fail: () => {
    //                             wx.showToast({
    //                               title: '登陆失败',
    //                               icon: 'none'
    //                             })
    //                         }
    //                     })
    //                 } else {
    //                     wx.showToast({
    //                       title: '订阅失败',
    //                       icon: 'error'
    //                     })
    //                 }
    //             },
    //             fail: () => {
    //                 console.log('失败')
    //                 wx.showToast({
    //                     title: '订阅失败',
    //                     icon: 'error'
    //                 })
    //             }
    //         })
    //     }
    // },

    onShow: function() {
        this.update()
        let task_map = getApp().globalData.task_map
        this.setData({
            task_map: task_map,
            isEmpty: JSON.stringify(task_map) === '{}'
        })
    },
    // 下拉刷新
    onPullDownRefresh: function() {
        wx.stopPullDownRefresh()
        this.onShow()
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

    onTapSubscribe: function (res) {
        console.log(res)
        wx.requestSubscribeMessage({
            tmplIds: this.data.tmplIds,
            success (res) {
                console.log(res)
            }
        })
    }
})