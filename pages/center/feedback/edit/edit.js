const api = require("../../../../utils/api")

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
            api.sendFeedback(this.data.stu_id, this.data.message).then(res => {
                if (res.data.Statue == 1) {
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