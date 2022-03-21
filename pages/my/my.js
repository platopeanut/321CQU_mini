const api = require('../../utils/api')
const util = require('../../utils/util')
Page({

    data: {
        mode: false,
        UserInfo: wx.getStorageSync('UserInfo'),
        AdCount: wx.getStorageSync('AdCount'),
        StuInfo: '',
    },

    onShow: function () {
        this.setData({
            StuInfo: wx.getStorageSync('StuInfo')
        })
    },


    // 获取广告观看次数
    updateAdTimes: function () {
        let that = this
        wx.login({
            success: res => {
                api.adTimes(res.code).then(res => {
                    that.setData({
                        AdCount: res.Times
                    })
                    wx.setStorageSync('AdCount', that.data.AdCount)
                })
            },
            fail: err => {
                wx.showToast({
                    title: '登陆失败',
                    icon: 'none'
                })
            }
        })
    },

    // 重新授权
    reauthorize() {
        this.setData({
            UserInfo: ''
        })
    },

    // 获取用户信息
    getUserProfile(e) {
        wx.getUserProfile({
            desc: '完善用户信息资料',
            success: (res) => {
                this.setData({
                    UserInfo: res.userInfo,
                })
                //缓存用户信息
                wx.setStorageSync("UserInfo",res.userInfo)
            }
        })
    },

    // 跳转到绑定信息界面
    jumpToEditInfo() {
        this.setData({
            mode: true
        })
    },
    hideModalCancel(e) {
        this.setData({
            mode: false
        })
    },
    hideModalSure(e) {
        this.setData({
            mode: false
        })
        wx.navigateTo({
            url: './info/info'
        })
    },

    // 清除缓存
    clearCache(e) {
        this.setData({
            UserInfo: '',
            AdCount: '',
        })
        wx.clearStorage({
            success: (res) => {
                wx.showToast({
                    title: '清除成功',
                    icon: 'none'
                })
            },
            fail: (res) => {
                wx.showToast({
                    title: '清除失败',
                    icon: 'none'
                })
            }
        })
    },
})
