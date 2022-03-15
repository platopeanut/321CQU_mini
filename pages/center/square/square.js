const api = require('../../../utils/api')

Page({

    data: {
        category_list: ['拼车', '课程', '失物招领'],
        curr_category: 0,
        stu_id: wx.getStorageSync('StuInfo')['stu_id'],
    },

    selectTerm: function (e) {
        this.setData({
            curr_category: e.currentTarget.dataset.id
        })
    },

    onShow() {
        if (this.data.stu_id === '') {
            wx.showToast({
                title: '请先绑定统一身份认证',
                icon: 'none'
            })
            return
        }
        api.getPostList().then(res => {
            console.log(res)
        })
    },

    sendTest() {
        api.sendPost('失物招领', '测试标题', 'lalalalalal', this.data.stu_id).then(res => {
            console.log(res)
        })
    }
})