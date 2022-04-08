const square_api = require('../square_api')
const square_util = require('../square_util')

Page({

    data: {
        pid: '',
        InputBottom: 0,
        item: null,
        comment_list: [],
        comment: '',
    },

    onLoad: function (e) {
        this.setData({
            pid: e.pid
        })
        this.updateData(e.pid)
    },

    updateData: function (pid) {
        let that = this
        square_api.getPostDetail(pid).then(res => {
            res.PostDetail['Color'] = square_util.getColorByType(res.PostDetail['Type'])
            res.PostDetail['Type'] = square_util.getNameByType(res.PostDetail['Type'])
            that.setData({
                item: res.PostDetail
            })
            return square_api.getReply(pid)
        }).then(res => {
            that.setData({
                comment_list: res.Reply
            })
        })
    },

    onPullDownRefresh: function () {
        this.updateData(this.data.pid)
        wx.stopPullDownRefresh()
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
        if (Sid === '' || Sid === undefined) {
            wx.showToast({
                title: '请完善统一身份信息',
                icon: 'none'
            })
            return
        }
        square_api.sendReply(this.data.pid, Sid, this.data.comment).then(res => {
            wx.showToast({
                title: '发送成功',
                icon: 'none'
            })
            that.updateData(that.data.pid)
            that.setData({
                comment: ''
            })
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
                        square_api.deleteReply(curr_item.Rid, stu_id).then(res => {
                            wx.showToast({
                                title: '删除成功',
                                icon: 'none'
                            })
                            that.updateData(that.data.pid)
                        })
                    }
                }
            })
        }
    },

    longPressOperation: function (e) {
        wx.vibrateShort()
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
                            url: '../edit/edit?type=' + item.type + '&pid=' + item.Pid + '&title=' + item.Title + '&content=' + item.Content,
                        })
                    } else if (res.tapIndex === 1) {
                        // 删除
                        square_api.deletePost(item.Pid, stu_id).then(res => {
                            wx.showToast({
                                title: '删除成功',
                                icon: 'none'
                            })
                            wx.navigateBack({ delta: 1})
                        })
                    }
                }
            })
        }
        else if (authority === 'super' || authority === item.Type) {
            wx.showActionSheet({
                itemList: ['删除'],
                success: res => {
                    if (res.tapIndex === 0) {
                        // 删除
                        square_api.deletePost(item.Pid, stu_id).then(res => {
                            wx.showToast({
                                title: '删除成功',
                                icon: 'none'
                            })
                            wx.navigateBack({ delta: 1})
                        })

                    }
                }
            })
        }
    }
})