const app = getApp()
const util = require('../../../utils/util')

Page({

    data: {
        article: {},
        type: 'markdown',
    },

    onLoad: function (e) {
        // let HomePage = wx.getStorageSync('HomePage')
        // let item = HomePage['Pictures'].find(value => {return value.Id.toString() === e.Id.toString()})
        // if (!item.LocalContent) this.localizedContent(e.Id)
        this.localizedContent(e.url.toString());
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
                    let data = e.currentTarget.dataset.data
                    util.bindMDEvent(data)
                }
            }
        })
        // 更新解析数据
        this.setData({
            article: result,
        })
    },

    // 本地化存储并渲染
    localizedContent: function (url) {
        let that = this
        // let HomePage = wx.getStorageSync('HomePage')
        // let item = HomePage['Pictures'].find(value => {return value.Id.toString() === id.toString()})
        // util.saveFile(item.ContentUrl).then(res => {
        //     item.ContentUrl = res.path
        //     item.LocalContent = true
        //     wx.setStorageSync('HomePage', HomePage)
        //     that.loadContent(res.path)
        // })
        util.saveFile(url).then(res => {
            that.loadContent(res.path);
        });
    }
})