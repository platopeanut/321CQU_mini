const square_api = require('./square_api')
const square_util = require('./square_util')

Page({

    data: {
        gridCol: 5,
        categories: square_util.categories,
        curr_type: 'all',
        stu_id: null,
        authority: null,
        post_list: {},
        post_index_list: null,
        post_flag_list: null,   // 1 --> 第一次刷新 --> 0 --> 没有更多 --> -1
    },

    onShow: function () {
        let StuInfo = wx.getStorageSync('StuInfo')
        let stu_id = StuInfo['stu_id']
        let authority = StuInfo['authority']
        this.setData({
            stu_id: stu_id,
            authority: authority
        })
        if (!(this.data.stu_id && this.data.authority)) {
            wx.showToast({
                title: '请绑定统一身份，昵称信息',
                icon: 'none'
            })
            return
        }
        let length = square_util.type_list.length
        let post_index_list = new Array(length)
        for (let i = 0; i < post_index_list.length; i++) {
            post_index_list[i] = 0
        }
        let post_flag_list = new Array(length)
        for (let i = 0; i < post_flag_list.length; i++) {
            post_flag_list[i] = 1
        }
        this.setData({
            post_index_list: post_index_list,
            post_flag_list: post_flag_list,
            post_list: {},
        })
        console.log(this.data)
        this.updateData(0, 10, false)
    },

    selectPart: function (res) {
        this.setData({
            curr_type: res.currentTarget.dataset.type
        })
        if (this.data.post_flag_list[square_util.getIndexByType(this.data.curr_type)] === 1) {
            this.updateData(0, 10, false)
            console.log('init update ' + this.data.curr_type)
        }
    },

    jumpToAddPost: function () {
        let that = this
        wx.navigateTo({
            url: './edit/edit?type=' + that.data.curr_type,
        })
    },

    jumpToDetail: function (e) {
        let item = e.currentTarget.dataset.item
        wx.navigateTo({
            url: './detail/detail?pid=' + item.Pid
        })
    },

    longPressOperation: function (e) {
        wx.vibrateShort()
        let that = this
        let item = e.currentTarget.dataset.item
        if (this.data.stu_id === item.Author) {
            wx.showActionSheet({
                itemList: ['修改', '删除'],
                success: res => {
                    if (res.tapIndex === 0) {
                        // 修改
                        wx.navigateTo({
                            url: './edit/edit?type=' + item.type + '&pid=' + item.Pid + '&title=' + item.Title + '&content=' + item.Content,
                        })
                    } else if (res.tapIndex === 1) {
                        // 删除
                        square_api.deletePost(item.Pid, that.data.stu_id).then(res => {
                            wx.showToast({
                                title: '删除成功',
                                icon: 'none'
                            })
                        })
                        that.onShow()
                    }
                }
            })
        }
        else if (this.data.authority === 'super' || this.data.authority === item.Type) {
            wx.showActionSheet({
                itemList: ['删除'],
                success: res => {
                    if (res.tapIndex === 0) {
                        // 删除
                        square_api.deletePost(item.Pid, that.data.stu_id).then(res => {
                            wx.showToast({
                                title: '删除成功',
                                icon: 'none'
                            })
                        })
                        that.onShow()
                    }
                }
            })
        }
    },

    updateData: function (start, batch=10, loading=true) {
        let that = this
        let post_list = this.data.post_list
        square_api.getPostList(`${start},${batch}`, that.data.curr_type, loading).then(res => {
            console.log(res)
            if (!post_list[that.data.curr_type]) post_list[that.data.curr_type] = []
            for (let i = 0; i < res.PostList.length; i++) {
                if (res.PostList[i]['Content'].length >= 45) {
                    res.PostList[i]['Content'] = res.PostList[i]['Content'].slice(0, 45) + '...'
                }
                res.PostList[i]['Type'] = square_util.getNameByType(res.PostList[i]['Type'])
                post_list[that.data.curr_type].push(res.PostList[i])
            }

            let post_flag_list = that.data.post_flag_list
            post_flag_list[square_util.getIndexByType(that.data.curr_type)] = 0

            let post_index_list = that.data.post_index_list
            let size = res.PostList.length
            if (size < batch) {
                post_flag_list[square_util.getIndexByType(that.data.curr_type)] = -1
            }
            post_index_list[square_util.getIndexByType(that.data.curr_type)] += size

            that.setData({
                post_list: post_list,
                post_flag_list: post_flag_list,
                post_index_list: post_index_list
            })
            console.log(that.data)
        })
    },

    onPullDownRefresh() {
        if (!(this.data.stu_id && this.data.authority)) {
            wx.stopPullDownRefresh()
            wx.showToast({
                title: '请绑定统一身份，昵称信息',
                icon: 'none'
            })
            return
        }
        let post_list = this.data.post_list
        post_list[this.data.curr_type] = []
        let post_index_list = this.data.post_index_list
        post_index_list[square_util.getIndexByType(this.data.curr_type)] = 0
        this.setData({
            post_list: post_list,
            post_index_list: post_index_list
        })
        this.updateData(0)
        wx.stopPullDownRefresh()
    },

    onReachBottom: function() {
        console.log('bottom')
        let post_index_list = this.data.post_index_list
        let post_flag_list = this.data.post_flag_list
        let index = square_util.getIndexByType(this.data.curr_type)
        if (post_flag_list[index] === -1) {
            wx.showToast({
                title: '没有更多啦',
                icon: 'none'
            })
            return
        }
        this.updateData(post_index_list[index])
    },
})