const api = require('../../../../utils/api')
const square_util = require('../square_util')

Page({

    data: {

        item: null,
        comment_list: [],
    },

    onLoad: function (e) {
        this.updateData(e.pid)
    },

    updateData: function (pid) {
        let that = this
        api.getPostDetail(pid).then(res => {
            res.PostDetail['Type'] = square_util.getNameByType(res.PostDetail['Type'])
            that.setData({
                item: res.PostDetail
            })
        })
    },

    onPullDownRefresh: function () {
        this.updateData()
        wx.stopPullDownRefresh()
    }

})