const about_api = require("./about_api")
const app = getApp()

Page({
    data: {
        article: ''
    },

    onShow: function () {
        let that = this
        about_api.getAboutUs().then(res => {
            let result = app.towxml(res.Content, 'markdown', {
                // base:'http://jwc.cqu.edu.cn/images/',				// 相对资源的base路径
                // theme:'dark',					// 主题，默认`light`
                // events:{					// 为元素绑定的事件方法
                //     tap:(e)=>{
                //         console.log('tap',e)
                //     }
                // }
            })
            that.setData({
                article: result
            })
        })
    }
});
