const feedback_api = require("../feedback_api")
Page({

    data: {
        message: "",
        stu_id: wx.getStorageSync('StuInfo')['stu_id'],
        length: 0
    },

    bindInput(e) {
        this.setData({
            message: e.detail.value,
            length: e.detail.value.length
        })
    },

    sendFeedback() {
        if (!this.data.stu_id) {
            wx.showToast({
              title: '请先绑定信息',
              icon: 'error'
            })
            return
        }
        let that = this
        if (this.data.message !== '') {
            // 发送反馈信息
            feedback_api.sendFeedback(this.data.stu_id, this.data.message).then(() => {
                wx.showToast({
                    title: '感谢您的反馈',
                    icon: 'none'
                })
                that.setData({
                    message: ""
                })
            }).finally(() => {
                // 0.5秒后自动返回上一级
                setTimeout(() => {
                    wx.navigateBack({
                        delta:1
                    })
                }, 500)
            })
        } else {
            wx.showToast({
                title: '反馈不能为空',
                icon: 'error'
            })
        }
    }

})