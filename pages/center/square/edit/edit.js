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
        util.changeParentPageOpt({
            option: 1
        })
        if (e.content) {
            this.setData({
                mode: 1
            })
        }
        let type_name = square_util.getNameByType(e.type)
        this.setData({
            type: e.type,
            type_name: type_name,
            title: e.title,
            content: e.content,
            pid: e.pid
        })
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

    sendPost: function (e) {
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
        if (this.data.mode === 0) {
            console.log(this.data.content)
            square_api.sendPost(this.data.type, this.data.title, this.data.content, this.data.stu_id).then(res => {
                wx.showToast({
                    title: '新建成功',
                    icon: 'none'
                })
            }).finally(() => {
                that.setData({
                    title : '',
                    content: '',
                })
            })
        } else if (this.data.mode === 1) {
            square_api.modifyPost(this.data.title, this.data.content, this.data.pid, this.data.stu_id).then(res => {
                wx.showToast({
                    title: '修改成功',
                    icon: 'none'
                })
            }).finally(() => {
                that.setData({
                    title : '',
                    content: '',
                })
            })
        }
        if (this.data.mode === 0 || this.data.mode === 1) {
            util.changeParentPageOpt({
                option: 0
            })
        }
    },
})