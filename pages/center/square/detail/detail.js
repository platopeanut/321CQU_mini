const square_api = require('../square_api')
const square_util = require('../square_util')
const util = require('../../../../utils/util')
const app = getApp()

Page({

    data: {
        anonymous:  app.globalData.anonymous,
        pid: '',
        InputBottom: 0,
        item: null,
        comment_list: [],
        comment: '',
        page: 0,
        page_over: false,
        comment_batch: 10,
        comments_num: 0,
    },

    onLoad: function (e) {
        console.log(e)
        this.setData({
            pid: parseInt(e.pid),
            comments_num: e.num
        })
        util.changeParentPageOpt({
            option: 1
        })
    },
    onShow: function () {
        this.updateData(parseInt(this.data.pid))
    },

    updateData: function (pid) {
        let that = this
        square_api.getPostDetail(pid).then(res => {
            res.PostDetail['Type'] = square_util.getNameByType(res.PostDetail['Type'])
            res.PostDetail['Content'] = app.towxml(res.PostDetail['Content'], 'markdown', {
                // base:'http://jwc.cqu.edu.cn/images/',				// 相对资源的base路径
                // theme:'dark',					// 主题，默认`light`
                // events:{					// 为元素绑定的事件方法
                //     tap:(e)=>{
                //         console.log(e)
                //         // that.jumpToDetail(Object.assign({}, res.PostList[i]), true)
                //     }
                // }
            })
            that.setData({
                item: res.PostDetail
            })
            console.log(res.PostDetail)
            return square_api.getReply(pid.toString(), 0)
        }).then(res => {
            that.setData({
                page: 1,
                page_over: res.Reply.length !== that.data.comment_batch,
                comment_list: res.Reply
            })
            console.log(that.data.comment_list)
        })
    },

    onPullDownRefresh: function () {
        wx.stopPullDownRefresh()
        this.updateData(parseInt(this.data.pid))
    },
    onReachBottom: function () {
        console.log('bottom', this.data.page, this.data.page_over)
        console.log(this.data.comment_list)
        let that = this
        if (this.data.page_over) {
            wx.showToast({
                title: '没有更多啦',
                icon: 'none'
            })
            return
        }
        square_api.getReply(this.data.pid.toString(), this.data.page).then(res => {
            let comment_list = that.data.comment_list
            res.Reply.forEach(value => {
                comment_list.push(value)
            })
            that.setData({
                page: that.data.page + 1,
                page_over: res.Reply.length !== that.data.comment_batch,
                comment_list: comment_list
            })
            console.log(that.data.comment_list)
        })
    },

    InputFocus(e) {
        this.setData({
            InputBottom: e.detail.height
        })
    },
    InputValue(e) {
        this.setData({
            comment: e.detail.value
        })
    },
    InputBlur() {
        this.setData({
            InputBottom: 0
        })
    },

    sendComment: function() {
        let that = this
        if (this.data.comment === '') {
            wx.showToast({
                title: '消息不能为空',
                icon: 'error'
            })
            return
        }
        let Sid = wx.getStorageSync('StuInfo')['stu_id']
        if (!Sid) {
            wx.showToast({
                title: '请完善统一身份信息',
                icon: 'none'
            })
            return
        }
        wx.showActionSheet({
            itemList: ['发送', '匿名发送'],
            success: result => {
                let isAnonymous = result.tapIndex !== 0
                square_api.sendReply(this.data.pid, Sid, this.data.comment, isAnonymous).then(() => {
                    wx.showToast({
                        title: '发送成功',
                        icon: 'none'
                    })
                    that.setData({
                        comment: ''
                    })
                    that.updateData(parseInt(that.data.pid))
                })
            }
        })
    },
    deleteComment: function (e) {
        let curr_item = e.currentTarget.dataset.item
        let that = this
        let StuInfo = wx.getStorageSync('StuInfo')
        let stu_id = StuInfo['stu_id']
        let authority = StuInfo['authority']
        if (stu_id === '' || stu_id === undefined) {
            wx.showToast({
                title: '请完善统一身份信息',
                icon: 'none'
            })
            return
        }
        if (stu_id === this.data.item.Author || authority === 'super' || authority === this.data.item.Type) {
            wx.showActionSheet({
                itemList: ['删除'],
                success: res => {
                    if (res.tapIndex === 0) {
                        square_api.deleteReply(curr_item.Rid, stu_id).then(() => {
                            wx.showToast({
                                title: '删除成功',
                                icon: 'none'
                            })
                            that.updateData(parseInt(that.data.pid))
                        })
                    }
                }
            })
        }
    },

    longPressOperation: function () {
        wx.vibrateShort()
        let that = this
        let item = this.data.item
        let StuInfo = wx.getStorageSync('StuInfo')
        let stu_id = StuInfo['stu_id']
        let authority = StuInfo['authority']
        if (stu_id === item.Author) {
            wx.showActionSheet({
                itemList: ['修改', '删除'],
                success: res => {
                    if (res.tapIndex === 0) {
                        // 修改
                        wx.navigateTo({
                            url: '../edit/edit?pid=' + that.data.pid,
                        })
                    } else if (res.tapIndex === 1) {
                        // 删除
                        square_api.deletePost(that.data.pid, stu_id).then(() => {
                            wx.showToast({
                                title: '删除成功',
                                icon: 'none'
                            })
                            wx.navigateBack({ delta: 1})
                        })
                    }
                    that.changeParentPageOpt(res)
                }
            })
        }
        else if (authority === 'super' || authority === item.Type) {
            wx.showActionSheet({
                itemList: ['删除'],
                success: res => {
                    if (res.tapIndex === 0) {
                        // 删除
                        square_api.deletePost(that.data.pid, stu_id).then(() => {
                            wx.showToast({
                                title: '删除成功',
                                icon: 'none'
                            })
                            wx.navigateBack({ delta: 1})
                        })
                    }
                    that.changeParentPageOpt(res)
                }
            })
        }
    },
    changeParentPageOpt(res) {
        if (res.tapIndex === 0 || res.tapIndex === 1) {
            util.changeParentPageOpt({
                option: 0
            })
        }
    }
})