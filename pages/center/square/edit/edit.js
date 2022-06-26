const square_api = require('../square_api')
const square_util = require('../square_util')
const util = require('../../../../utils/util')
Page({
    data: {
        content: '',
        title: '',
        type: '',
        type_name: '',
        stu_id: '',
        mode: 0,    // 0为新建模式，1为修改模式
        pid: '',    // 仅mode=1时生效
    },

    onLoad: function (e) {
        console.log(e)
        let that = this
        util.changeParentPageOpt({
            option: 1
        })
        if (e.pid) {
            this.setData({
                mode: 1
            })
            // type_name: type_name,
            //     title: e.title,
            //     content: e.content,
            square_api.getPostDetail(e.pid).then(res => {
                that.setData({
                    title: res.PostDetail.Title,
                    content: res.PostDetail.Content,
                })
                let type_name = square_util.getNameByType(res.PostDetail.Type)
                that.setData({
                    type: res.PostDetail.Type,
                    pid: e.pid,
                    type_name: type_name
                })
                // console.log(that.data)
            })
        } else {
            let type_name = square_util.getNameByType(e.type)
            this.setData({
                type: e.type,
                pid: e.pid,
                type_name: type_name
            })
        }
        let StuInfo = wx.getStorageSync('StuInfo')
        if (StuInfo === '' || !StuInfo['stu_id']) {
            wx.showToast({
                title: '请完善统一身份信息',
                icon: 'none'
            })
            return
        }
        this.setData({
            stu_id: StuInfo['stu_id']
        })
    },

    bindInputContent: function (e) {
        this.setData({
            content: e.detail.value
        })
    },
    bindInputTitle: function (e) {
        this.setData({
            title: e.detail.value
        })
    },
    sendPost: function () {
        let that = this
        if (this.data.stu_id === '') {
            wx.showToast({
                title: '请完善统一身份信息',
                icon: 'none'
            })
            return
        }
        if (this.data.content === '') {
            wx.showToast({
                title: '内容不能为空',
                icon: 'none'
            })
            return
        }
        wx.showActionSheet({
            itemList: ['发送', '匿名发送'],
            success: result => {
                let isAnonymous = result.tapIndex !== 0
                if (that.data.mode === 0) {
                    square_api.sendPost(that.data.type, that.data.title, that.data.content, that.data.stu_id, isAnonymous).then(() => {
                        wx.showToast({
                            title: '新建成功',
                            icon: 'none'
                        })
                        that.setData({
                            title : '',
                            content: '',
                        })
                    })
                }
                else if (that.data.mode === 1) {
                    square_api.modifyPost(that.data.title, that.data.content, that.data.pid, that.data.stu_id, isAnonymous).then(() => {
                        wx.showToast({
                            title: '修改成功',
                            icon: 'none'
                        })
                        that.setData({
                            title : '',
                            content: '',
                        })
                    })
                }
                if (that.data.mode === 0 || that.data.mode === 1) {
                    util.changeParentPageOpt({
                        option: 0
                    })
                }
            }
        })
    },
})