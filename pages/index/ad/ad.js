const app = getApp()
const util = require('../../../utils/util')

Page({

    data: {
        article: {},
        type: 'markdown',
    },

    onLoad: function (e) {
        let HomePage = wx.getStorageSync('HomePage')
        let item = HomePage['Pictures'].find(value => {return value.Id.toString() === e.Id.toString()})
        if (!item.LocalContent) this.localizedContent(e.Id)
        else this.loadContent(item.ContentUrl)
    },

    // 渲染
    loadContent: function (url) {
        const fs = wx.getFileSystemManager()
        let content = fs.readFileSync(url, 'utf-8')
        let result = app.towxml(content, this.data.type, {
            // base:'http://jwc.cqu.edu.cn/images/',				// 相对资源的base路径
            // theme:'dark',					                    // 主题，默认`light`
            events:{					                            // 为元素绑定的事件方法
                tap:(e)=>{
                    console.log('tap',e.currentTarget.dataset)
                }
            }
        })
        // 更新解析数据
        this.setData({
            article: result,
        })
    },

    // 本地化存储并渲染
    localizedContent: function (id) {
        let that = this
        let HomePage = wx.getStorageSync('HomePage')
        let item = HomePage['Pictures'].find(value => {return value.Id.toString() === id.toString()})
        util.saveFile(item.ContentUrl).then(res => {
            item.ContentUrl = res.path
            item.LocalContent = true
            wx.setStorageSync('HomePage', HomePage)
            that.loadContent(res.path)
        })
    }
})