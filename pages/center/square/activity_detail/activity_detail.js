const square_api = require('../square_api')
const util = require('../../../../utils/util')
const app = getApp()

Page({

    data: {
        article: '',
        activity: {},
    },

    onLoad(e) {
        console.log(e)
        let activity = {
            Aid: e.Aid,
            Title: e.Title,
            Name: e.Name,
            StartDate: e.StartDate,
            EndDate: e.EndDate,
            UpdateDate: e.UpdateDate,
            Url: e.Url,
            State: e.State
        }
        this.setData({
            activity: activity
        })
        let that = this
        square_api.getActivityInfo(parseInt(e.Aid)).then(res => {
            let result = app.towxml(res.Markdown, 'markdown', {
                // base:'http://jwc.cqu.edu.cn/images/',				// 相对资源的base路径
                // theme:'dark',					                    // 主题，默认`light`
                events:{					                            // 为元素绑定的事件方法
                    tap:(e)=>{
                        let data = e.currentTarget.dataset.data
                        // console.log('tap',e.currentTarget.dataset.data)
                        util.bindMDEvent(data)
                    }
                }
            })
            // 更新解析数据
            that.setData({
                article: result,
            })
        })
    },
})