Page({
    data: {
        task_map: {},
        isEmpty: true,
        modalShow: false, 
        curr_index: "",
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
        setTimeout(() => {
            wx.hideLoading()
        }, 300)
    },

    // 对每一项的操作
    onTouchItem(e) {
        let curr_index = e.currentTarget.dataset.index
        this.setData({
            modalShow: true,
            curr_index: curr_index
        })
    },
    deleteSure() {
        // globalData删除
        delete getApp().globalData.task_map[this.data.curr_index]
        // 本地更新
        this.onShow()
        this.setData({
            modalShow: false,
            curr_index: ""
        })
    },
    deleteCancel() {
        this.setData({
            modalShow: false,
            curr_index: ""
        })
    },
})