const sxt_api = require("../sxt_api")

Page({

    data: {
        id: '',
        info: [
            {name: '考研', url: 'https://m.xdf.cn/opt/?state=72510'},
            {name: '留学', url: 'https://jinshuju.net/f/d5hStQ'},
            {name: '四六级', url: 'https://m.xdf.cn/opt/?state=72532'},
            {name: '第二外语', url: 'https://jinshuju.net/f/sg98C4'},
        ]
    },

    onLoad: function (e) {
        console.log(e)
        this.setData({
            id: e.id
        })
        console.log(this.data)
    },

    getUrl: function (e) {
        let item = e.currentTarget.dataset.item
        // console.log(item)
        wx.setClipboardData({
            data: item.url,
            success (res) {
                wx.showToast({
                    title: '链接已复制，请使用浏览器打开',
                    icon: 'none'
                })
            }
        })
        // wx.navigateTo({
        //     url: '../form/form?name=' + item.name
        // })
    }

})