const util = require("../../../../utils/util")

Page({

    data: {
        message: "",
        stu_id: wx.getStorageSync('stu_id'),
    },

    bindInput(e) {
        this.setData({
            message: e.detail.value
        })
    },

    sendFeedback() {
        if (this.data.stu_id == "" || this.data.stu_id == undefined) {
            wx.showToast({
              title: '请先绑定信息',
              icon: 'error'
            })
            return
        }
        let global = this
        if (this.data.message != '') {
            // 发送反馈信息
            util.sendFeedback(this.data.stu_id, this.data.message).then(res => {
                if (util.parseFromStr(res.data) == "1") {
                    wx.showToast({
                        title: '感谢您的反馈',
                        icon: 'none'
                    })
                } else {
                    wx.showToast({
                      title: '反馈失败',
                      icon: 'none'
                    })
                }
                // 一秒后自动返回上一级
                setTimeout(() => {
                    wx.navigateBack({
                        delta:1
                    })
                }, 1000)
            })
        } else {
            wx.showToast({
                title: '反馈不能为空',
                icon: 'error'
            })
        }
    }

})