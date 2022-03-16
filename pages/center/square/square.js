const api = require('../../../utils/api')

Page({

    data: {
        gridCol: 4,
        categories: [
            {
                title: '拼车',
                icon: 'ticket',
                color: 'red',
                type: 'PC'
            },
            {
                title: '课程',
                icon: 'form',
                color: 'blue',
                type: 'KC'
            },
            {
                title: '失物招领',
                icon: 'attention',
                color: 'orange',
                type: 'SW'
            },
            {
                title: '反馈',
                color: 'green',
                icon: 'comment',
                type: 'FK',
            },
        ],
        curr_type: 'all',
        stu_id: wx.getStorageSync('StuInfo')['stu_id'],
        post_list: [],
    },

    onShow: function () {
        let that = this
        if (this.data.stu_id === '') {
            wx.showToast({
                title: '请先绑定统一身份认证',
                icon: 'none'
            })
        }
    },

    selectPart: function (res) {
        this.setData({
            curr_type: res.currentTarget.dataset.type
        })
        this.updateData()
    },

    jumpToAddPost: function () {
        let that = this
        wx.navigateTo({
            url: './edit/edit?type=' + that.data.curr_type,
        })
    },

    jumpToDetail: function () {
        let item = e.currentTarget.dataset.item
        if (item.UserImg == null) item.UserImg = this.data.anonymous
        wx.navigateTo({
            url: './detail/detail',
            events: {
                // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
                acceptDataFromOpenedPage: function(data) {
                    console.log('hi')
                },
            },
            success: function(res) {
                // 通过eventChannel向被打开页面传送数据
                res.eventChannel.emit('acceptDataFromOpenerPage', {
                    data: item
                })
            }
        })
    },

    updateData: function () {
        let that = this
        api.getPostList(undefined, that.data.curr_type).then(res => {
            console.log(res)
            that.setData({
                post_list: res.PostList
            })
        })
    },

    onPullDownRefresh() {
        this.updateData()
        wx.stopPullDownRefresh()
    }
})