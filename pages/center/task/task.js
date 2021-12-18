Page({
    data: {
        task_map: {},
        isEmpty: true,
    },
    onShow: function() {
        let task_map = getApp().globalData.task_map
        this.setData({
            task_map: task_map,
            isEmpty: JSON.stringify(task_map) == '{}'
        })
    },
    // 下拉刷新
    onPullDownRefresh: function() {
        wx.showLoading()
        this.onShow()
        wx.hideLoading()
    }
})