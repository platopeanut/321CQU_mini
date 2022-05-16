Page({

    data: {

    },

    onLoad: function () {

    },

    jumpToDetail: function (e) {
        wx.navigateTo({
            url: './detail/detail?id=' + e.currentTarget.dataset.id
        })
    }
})