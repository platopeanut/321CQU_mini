// pages/center/feedback/edit/edit.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        message: "",
        stuInfo: {},
        userInfo: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            userInfo: wx.getStorageSync("userInfo")
        })
        // wx.getStorage({
        //     key: 'userInfo',
        //     success: function(res) {
        //       global.setData({
        //         userInfo: res.data
        //       })
        //       console.log(res.data)
        //     }
        // })
        // wx.getStorage({
        // key: 'stuInfo',
        // success: function(res) {
        //     global.setData({
        //     stuInfo: res.data
        //     })
        // }
        // })
        this.setData({
        userInfo: wx.getStorageSync("userInfo")
        })
      
        this.setData({
            stuInfo: wx.getStorageSync("stuInfo")
        })
        console.log(this.data.userInfo)
    },

    bindInput(e) {
        this.setData({
            message: e.detail.value
        })
    },

    sendFeedback() {
        if (this.data.stuInfo.stu_id == undefined || this.data.userInfo.avatarUrl == undefined) {
            wx.showToast({
              title: '请先绑定信息',
              icon: 'error'
            })
            return
        }
        let global = this
       if (this.data.message != '') {
            wx.cloud.database().collection("Comment").add({
                data: {
                    avatar: global.data.userInfo.avatarUrl,
                    stu_id: global.data.stuInfo.stu_id,
                    nickname: global.data.stuInfo.nickname,
                    time: wx.cloud.database().serverDate(),
                    message: global.data.message,
                    view: 0,
                    agree: 0
                },
                success(res) {
                    wx.showToast({
                        title: '反馈成功，谢谢您的宝贵意见！',
                        icon: 'success'
                    });
                },
                fail(res) {
                    wx.showToast({
                        title: '反馈失败，请联系管理员',
                        icon: 'error'
                    })
                }
            })
       } else {
           wx.showToast({
             title: '反馈不能为空',
             icon: 'error'
           })
       }
    }

})