const api = require('../../../utils/api')
// 在页面中定义激励视频广告
let videoAd = null

Page({

    adShow: function() {
        wx.showLoading()
        // 在页面onLoad回调事件中创建激励视频广告实例
        if (wx.createRewardedVideoAd) {
            videoAd = wx.createRewardedVideoAd({
                adUnitId: 'adunit-f65c555df75701e8'
            })
            videoAd.onLoad(() => {
                wx.hideLoading()
            })
            videoAd.onError(() => {
                wx.hideLoading()
                wx.showToast({
                    title: '加载错误',
                    icon: 'none'
                })
            })
            videoAd.onClose(res => {
                wx.hideLoading()
                if (res && res.isEnded) {
                    // 正常播放结束，可以下发奖励
                    wx.login({
                        success: res => {
                            api.adLook(res.code).then(() => {
                                wx.showToast({
                                    title: '观看成功',
                                    icon: 'none'
                                })
                            }).finally(() => {
                                setTimeout(()=>{
                                    wx.navigateBack({ delta: 1 })
                                }, 1000)
                            })
                        },
                        fail: function() {
                            wx.hideLoading()
                            wx.showToast({
                                title: '登陆失败',
                                icon: 'error'
                            })
                            setTimeout(()=>{
                                wx.navigateBack({ delta: 1 })
                            }, 1000)
                        }
                    })
                } else {
                    // 播放中途退出，不下发游戏奖励
                    wx.showToast({
                        title: '播放中途退出',
                        icon: 'none'
                    })
                    setTimeout(()=>{
                        wx.navigateBack({ delta: 1 })
                    }, 1000)
                }
            })
        }
        // 用户触发广告后，显示激励视频广告
        if (videoAd) {
            videoAd.show().catch(() => {
                // 失败重试
                videoAd.load()
                    .then(() => videoAd.show())
                    .catch(() => {
                        wx.showToast({
                            title: '激励视频广告显示失败',
                            icon: 'none'
                        })
                        // console.log('激励视频 广告显示失败')
                    })
            })
        }
    },
    onLoad: function () {
        let that = this
        if (!wx.getStorageSync('AdRecord')) {
            wx.showModal({
                title: '支持我们',
                content: '因为服务器和域名都需要费用，我们在开发小程序时也付出了大量的精力，因此在这里提供了一个可选的观看视频广告的模块，并在服务器记录观看次数，后续我们可能（但不保证）会依照观看次数给一定服务（但肯定不会有只有看了广告才能用的功能），感谢您的支持！',
                cancelText:'确定',
                confirmText:'不再提示',
                success(res) {
                    if(res.confirm){
                        wx.setStorageSync('AdRecord', true)
                    }
                    that.adShow()
                }
            })
        } else {
            this.adShow()
        }
    },
})