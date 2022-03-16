const api = require('../../../utils/api')
const square_util = require('./square_util')

Page({

    data: {
        gridCol: 5,
        categories: square_util.categories,
        curr_type: 'all',
        stu_id: wx.getStorageSync('StuInfo')['stu_id'],
        authority: wx.getStorageSync('StuInfo')['authority'],
        post_list: null,
        post_index_list: null,
        post_flag_list: null,
    },

    onLoad: function () {
        if (this.data.stu_id === '') {
            wx.showToast({
                title: '请先绑定统一身份认证',
                icon: 'none'
            })
        }
        this.updateData()
    },

    selectPart: function (res) {
        this.setData({
            curr_type: res.currentTarget.dataset.type
        })
        console.log(this.data.post_list[this.data.curr_type])
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
                        api.deletePost(item.Pid, that.data.stu_id).then(res => {
                            wx.showToast({
                                title: '删除成功',
                                icon: 'none'
                            })
                        })
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
                        api.deletePost(item.Pid, that.data.stu_id).then(res => {
                            wx.showToast({
                                title: '删除成功',
                                icon: 'none'
                            })
                        })
                    }
                }
            })
        }
    },

    updateData: function (limit=null) {
        let that = this
        let post_list = this.data.post_list
        api.getPostList(limit, that.data.curr_type).then(res => {
            console.log(res)
            if (that.data.curr_type === 'all') {
                post_list = {}
                for (const type of square_util.type_list) {
                    post_list[type] = []
                }
                for (const item of res.PostList) {
                    post_list[item.Type].push(item)
                }
            }
            for (let i = 0; i < res.PostList.length; i++) {
                if (res.PostList[i]['Content'].length >= 45) {
                    res.PostList[i]['Content'] = res.PostList[i]['Content'].slice(0, 45) + '...'
                }
                res.PostList[i]['Type'] = square_util.getNameByType(res.PostList[i]['Type'])
            }
            post_list[that.data.curr_type] = res.PostList
            that.setData({
                post_list: post_list
            })
        })
    },

    onPullDownRefresh() {
        this.updateData()
        wx.stopPullDownRefresh()
    },

    onReachBottom: function() {
        // let index = square_util.getIndexByType(this.data.curr_type)
        // if (!this.data.post_flag_list[index]) {
        //     let start = this.data.post_index_list[index]
        //     let end = start + 10
        //     this.updateData(`${start},${end}`)
        // } else {
        //     wx.showToast({
        //         title: '没有更多了',
        //         icon: 'none'
        //     })
        // }
    },
})