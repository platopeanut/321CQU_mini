Page({

    data: {
        category_list: ['拼车', '课程', '失物招领'],
        curr_category: 0,
    },

    selectTerm: function (e) {
        this.setData({
            curr_category: e.currentTarget.dataset.id
        })
    },

    onShow() {
        wx.showToast({
            title: '敬请期待',
            icon: 'none'
        })
    }
})