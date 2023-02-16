const api = require('../../utils/api')
const info_util = require("./info/info_util")

Page({

    data: {
        UserInfo: wx.getStorageSync('UserInfo'),
        AdCount: wx.getStorageSync('AdCount'),
        StuInfo: '',
    },

    onShow: function () {
        this.setData({ StuInfo: wx.getStorageSync('StuInfo') })
        // 自动填充用户信息
        // info_util.autoFillUserInfo()
    },

    onChooseAvatar(e) {
        const { avatarUrl } = e.detail
        let UserInfo = wx.getStorageSync('UserInfo') || {}
        UserInfo['avatarUrl'] = avatarUrl
        this.setData({ UserInfo: UserInfo })
        wx.setStorageSync('UserInfo', UserInfo)
    },

    // 获取广告观看次数
    updateAdTimes: function () {
        let that = this
        wx.login({
            success: res => {
                api.adTimes(res.code).then(res => {
                    that.setData({
                        AdCount: res['Times']
                    })
                    wx.setStorageSync('AdCount', that.data.AdCount)
                })
            },
            fail: () => {
                wx.showToast({
                    title: '登陆失败',
                    icon: 'none'
                })
            }
        })
    },

    // 跳转到绑定信息界面
    jumpToEditInfo() {
        wx.showModal({
            title: '用户信息隐私说明',
            content: '学号、姓名、统一认证账号、密码均为本地存储，有特殊功能需要存储于服务器时会单独通知，请放心使用。详细隐私协议可见321CQU小程序隐私保护指引',
            success (res) {
                if (res.confirm) {
                    wx.navigateTo({ url: './info/info' })
                }
            }
        })
    },

    jumpToGuide() {
        wx.navigateTo({ url: './guide/guide' })
    },

    jumpToAbout() {
        wx.navigateTo({ url: './about/about' })
    },

    // 清除缓存
    clearCache() {
        this.setData({
            UserInfo: '',
            AdCount: '',
        })
        wx.clearStorage({
            success: () => {
                wx.showToast({
                    title: '清除成功',
                    icon: 'none'
                })
            },
            fail: () => {
                wx.showToast({
                    title: '清除失败',
                    icon: 'none'
                })
            }
        })
    },
})
