const square_api = require('../square_api')
const square_util = require('../square_util')
const util = require('../../../../utils/util')
const api = require('../../../../utils/api')
Page({
    data: {
        VerifyState: false,
        content: '',
        title: '',
        type: '',
        type_name: '',
        stu_id: '',
        mode: 0,    // 0为新建模式，1为修改模式
        pid: '',    // 仅mode=1时生效,
        imgList: [],
    },

    onLoad: function (e) {
        if (wx.getStorageSync('Verify')['IsExamining']) {
            this.setData({
                VerifyState: true
            })
            wx.showToast({
                title: '普通账户无权访问',
                icon: 'none'
            })
        }
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
            square_api.getPostDetail(parseInt(e.pid)).then(res => {
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
                if (that.data.mode === 0 || that.data.mode === 1) {
                    // 上传图片到腾讯云
                    let upload_task = []
                    let filenames = []
                    for (const path of that.data.imgList) {
                        let filename = `${new Date().getTime()}`
                        filenames.push(filename)
                        upload_task.push(api.COSUpload(filename, path))
                    }
                    Promise.all(upload_task).then(values => {
                        console.log(values)
                        console.log(filenames)
                        if (that.data.mode === 0) {
                            square_api.sendPost(that.data.type, that.data.title, that.data.content, that.data.stu_id, filenames, isAnonymous).then(() => {
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
                            square_api.modifyPost(that.data.title, that.data.content, parseInt(that.data.pid), that.data.stu_id, filenames, isAnonymous).then(() => {
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
                        util.changeParentPageOpt({
                            option: 0
                        })
                        wx.switchTab({
                            url: '../square'
                        })
                    })
                }
            }
        })
    },

    chooseImage: function () {
        let that = this
        wx.chooseMedia({
            count: 4,
            mediaType: ['image'],
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            camera: 'back',
            success: (res) => {
                let paths = []
                for (const item of res.tempFiles) {
                    paths.push(item.tempFilePath)
                }
                if (that.data.imgList.length !== 0) {
                    this.setData({
                        imgList: this.data.imgList.concat(paths)
                    })
                } else {
                    this.setData({
                        imgList: paths
                    })
                }
            }
        });
    },
    viewImage: function(e) {
        wx.previewImage({
            urls: this.data.imgList,
            current: e.currentTarget.dataset.url
        });
    },
    delImg: function(e) {
        this.data.imgList.splice(e.currentTarget.dataset.index, 1);
        this.setData({
            imgList: this.data.imgList
        })
    },
})