const util = require("../../../../utils/util");
Page({

    data: {
        id: '',
        info: [
            {name: '四六级', url: 'https://m.xdf.cn/opt/?state=72532'},
            {name: '考研', url: 'https://m.xdf.cn/opt/?state=72510'},
            {name: '第二外语', url: 'https://jinshuju.net/f/sg98C4'},
            {name: '留学', url: 'https://jinshuju.net/f/d5hStQ'}
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
        wx.setClipboardData({
            data: item.url,
            success: () => {
                wx.showToast({
                    title: '链接已复制，请使用浏览器访问',
                    icon: 'none'
                })
            }
        })
    }

})