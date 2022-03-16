const api = require('../../../../utils/api')

Page({
    data: {
        content: '',
        title: '',
        type: '',
        stu_id: '',
    },

    onLoad: function (e) {
        this.setData({
            type: e.type
        })
        let StuInfo = wx.getStorageSync('StuInfo')
        if (StuInfo === '' || !StuInfo['stu_id']) {
            wx.showToast({
                title: '请完善统一身份信息',
                icon: 'none'
            })
            return
        }
        this.setData({
            stu_id: StuInfo['stu_id']
        })
    },

    bindInputContent: function (e) {
        this.setData({
            content: e.detail.value
        })
    },
    bindInputTitle: function (e) {
        this.setData({
            title: e.detail.value
        })
    },

    sendPost: function (e) {
        let that = this
        if (this.data.stu_id === '') {
            wx.showToast({
                title: '请完善统一身份信息',
                icon: 'none'
            })
            return
        }
        if (this.data.content === '') {
            wx.showToast({
                title: '内容不能为空',
                icon: 'none'
            })
            return
        }
        api.sendPost(this.data.type, this.data.title, this.data.content, this.data.stu_id).then(res => {
            wx.showToast({
                title: '发送成功',
                icon: 'none'
            })
        }).finally(() => {
            that.setData({
                title : '',
                content: '',
            })
        })
    },
})