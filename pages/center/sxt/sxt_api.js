const util = require("../../../utils/util")

function submitForm(info) {
    wx.showLoading()
    info['Key'] = 'CQUz5321'
    wx.request({
        url: 'https://www.zhulegend.com/321CQUWebsite/xdf/send_form',
        method: 'POST',
        data: info,
        success: res => {
            wx.hideLoading()
            if (res.statusCode === 200) {
                if (res.data.Statue === 1) {
                    wx.showToast({
                        title: '提交成功',
                        icon: 'none'
                    })
                } else {
                    util.showError(res)
                }
            } else {
                wx.showToast({
                    title: '网络错误' + res.statusCode,
                    icon: 'none'
                })
            }
        },
        fail: () => {
            wx.hideLoading()
            wx.showToast({
                title: '网络错误',
                icon: 'none'
            })
        }
    })
}

module.exports = {
    submitForm,
}