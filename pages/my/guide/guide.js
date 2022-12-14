const app = getApp()
const guide_api = require('./guide_api')
const util = require('../../../utils/util')

Page({

    data: {
        article: ''
    },

    onLoad: function () {
        let that = this
        guide_api.getTutorials().then(res => {
            let result = app.towxml(res.Content, 'markdown', {
                // base:'http://jwc.cqu.edu.cn/images/',				// 相对资源的base路径
                // theme:'dark',					// 主题，默认`light`
                events:{					// 为元素绑定的事件方法
                    tap:(e)=>{
                        let data = e.currentTarget.dataset.data
                        util.bindMDEvent(data)
                        // wx.setClipboardData({
                        //     data: util.findUrlFromMd([e.currentTarget.dataset.data])
                        // })
                    }
                }
            })
            that.setData({
                article: result
            })
        })
    }
})