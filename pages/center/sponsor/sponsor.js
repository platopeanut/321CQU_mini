const api = require('../../../utils/api')
const util = require("../../../utils/util")
// 在页面中定义激励视频广告
let videoAd = null

Page({

    data: {
        ad_record: wx.getStorageSync('ad_record')
    },
    adShow: function() {
        // 在页面onLoad回调事件中创建激励视频广告实例
        if (wx.createRewardedVideoAd) {
            videoAd = wx.createRewardedVideoAd({
                adUnitId: 'adunit-f65c555df75701e8'
            })
            videoAd.onLoad(() => {})
            videoAd.onError((err) => {})
            videoAd.onClose(res => {
                if (res && res.isEnded) {
                    // 正常播放结束，可以下发游戏奖励
                    wx.login({
                        success: function(res) {
                            api.ad_advertise(res.code).then(res => {
                                if (res.statusCode === 200) {
                                    if (res.data.Statue===1) {
                                        wx.showToast({
                                            title: '观看成功',
                                            icon: 'none'
                                        })
                                    } else {
                                        util.showError(res)
                                    }
                                } else {
                                    wx.showToast({
                                        title: `网络错误[${res.statusCode}]`,
                                        icon: 'none'
                                    })
                                }
                            })
                        },
                        fail: function() {
                            wx.hideLoading()
                            wx.showToast({
                                title: '登陆失败',
                                icon: 'error'
                            })
                        }
                    })
                } else {
                    // 播放中途退出，不下发游戏奖励
                    wx.showToast({
                        title: '播放中途退出，不下发奖励',
                        icon: 'none'
                    })
                }
            })
        }
        // 用户触发广告后，显示激励视频广告
        if (videoAd) {
            videoAd.show().catch(() => {
                // 失败重试
                videoAd.load()
                    .then(() => videoAd.show())
                    .catch(err => {
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
        if (!this.data.ad_record) {
            wx.showToast({
                title: '观看广告，获得一定奖励，观看次数可在我的/已观看广告次数页面中查看',
                icon: 'none'
            })
            wx.setStorageSync('ad_record', true)
        }
        this.adShow()
    },

    onShareAppMessage: function () {

    }
})