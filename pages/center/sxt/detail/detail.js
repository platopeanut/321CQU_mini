const sxt_api = require("../sxt_api")

Page({

    data: {
        id: '',
        info: [
            {name: '考研', url: 'https://m.xdf.cn/opt/?state=72510', qrcode:'https://qr.api.cli.im/newqr/create?data=https%253A%252F%252Fm.xdf.cn%252Fopt%252F%253Fstate%253D72510&level=H&transparent=false&bgcolor=%23ffffff&forecolor=%23000000&blockpixel=12&marginblock=1&logourl=&logoshape=no&size=500&kid=cliim&key=0d63780aea3eca51ccb58a512f7feb36'},
            {name: '留学', url: 'https://jinshuju.net/f/d5hStQ', qrcode: 'https://qr.api.cli.im/newqr/create?data=https%253A%252F%252Fjinshuju.net%252Ff%252Fd5hStQ&level=H&transparent=false&bgcolor=%23ffffff&forecolor=%23000000&blockpixel=12&marginblock=1&logourl=&logoshape=no&size=500&kid=cliim&key=2b9803a9a7f854b435bd5fa2548a753e'},
            {name: '四六级', url: 'https://m.xdf.cn/opt/?state=72532', qrcode: 'https://qr.api.cli.im/newqr/create?data=https%253A%252F%252Fm.xdf.cn%252Fopt%252F%253Fstate%253D72532&level=H&transparent=false&bgcolor=%23ffffff&forecolor=%23000000&blockpixel=12&marginblock=1&logourl=&logoshape=no&size=500&kid=cliim&key=be65ed50b0e9990a86309c1952fb428f'},
            {name: '第二外语', url: 'https://jinshuju.net/f/sg98C4', qrcode: 'https://qr.api.cli.im/newqr/create?data=https%253A%252F%252Fjinshuju.net%252Ff%252Fsg98C4&level=H&transparent=false&bgcolor=%23ffffff&forecolor=%23000000&blockpixel=12&marginblock=1&logourl=&logoshape=no&size=500&kid=cliim&key=02e26b3828714f6d001eb85b772bbe89'},
        ],
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
    },

    getContact: function (e) {
        wx.setClipboardData({
            data: e.currentTarget.dataset.value.toString(),
            success () {
                wx.showToast({
                    title: '已复制',
                    icon: 'none'
                })
            },
        })
    },

    previewImg: function (e) {
        let urls = [e.currentTarget.dataset.src]
        wx.previewImage({
            // current: '',
            urls: urls
        })
    }
})