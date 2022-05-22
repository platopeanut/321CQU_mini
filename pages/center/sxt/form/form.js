const sxt_api = require('../sxt_api')

Page({

    data: {
        Type: '',
        Data: {
            '考研': {
                Single: [{
                    key: '是否需要考研书籍(免费)(单选)',
                    value: ['是', '否']
                }],
                Multi: [{
                    key: '需要咨询的问题(免费)(多选)',
                    value: [
                        '考研择校择专业',
                        '跨专业考研指南',
                        '考研初期备考计划',
                        '全年复习备考计划',
                        '其他个性化问题咨询'
                    ]
                }]
            },
            '留学': {
                Single: [
                    {
                        key: '请选择您要咨询的总监',
                        value: [
                            '澳新总监(何柳希老师)',
                            '英国总监(邱婷老师)',
                            '加拿大总监(姜昀昊老师)',
                            '欧亚总监(王黎老师)',
                            '美国研究生总监(颜璨老师)'
                        ]
                    },
                    {
                        key: '是否为第一次咨询我们',
                        value: ['是', '否']
                    }
                ],
                Multi: []
            },
            '四六级': {
                Single: [],
                Multi: [
                    {
                        key: '四六级需求(多选)',
                        value: [
                            '四六级免费学习资料',
                            '四六级真题(免费)',
                            '线上直播课程',
                            '线下全程学习课程'
                        ]
                    }
                ],
            },
            '第二外语': {
                Single: [{
                    key: '你感兴趣的语种',
                    value: [
                        '日语','韩语','德语','法语','意大利语','西班牙语','俄罗斯语','其他'
                    ]
                }],
                Multi: []
            }
        }
    },

    onLoad: function (e) {
        this.setData({
            Type: e.name
        })
    },

    getForm: function (e) {
        console.log(e.detail.value)
        let info = e.detail.value
        const check_list = ['姓名', '手机', '专业', '预约咨询时间']
        for (let key of check_list) {
            if (key in info && info[key] === '') {
                wx.showToast({
                    title: key+'不能为空',
                    icon: 'none'
                })
                return
            }
        }
        for (const key in info) {
            if (info[key] instanceof Array) info[key] = info[key].toString()
        }
        console.log(info)
        wx.showModal({
            'content': '您所填写的信息会被提供给新东方',
            success: result => {
                if (result.confirm) sxt_api.submitForm(info)
                else {
                    wx.showToast({
                        title: '已取消提交',
                        icon: 'none'
                    })
                }
            }
        })

    }


})