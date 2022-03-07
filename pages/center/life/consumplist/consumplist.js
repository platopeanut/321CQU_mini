const api = require('../../../../utils/api')
const util = require('../../../../utils/util')

Page({

    data: {
        card_fee : wx.getStorageSync('card_fee'),
        bill_list : [],
    },

    updateData: function () {
        let that = this
        let uid = wx.getStorageSync('uid')
        let uid_pwd = wx.getStorageSync('uid_pwd')
        let stu_id= wx.getStorageSync('stu_id')
        let identity= wx.getStorageSync('identity')
        console.log("loading")
        if (identity === '') {
            wx.showToast({
                title: '请先绑定学号，统一身份信息',
                icon: 'none'
            })
            return
        }
        if (identity === '本科生') {
            if (stu_id === '' || uid === '' || uid_pwd === '') {
                wx.showToast({
                    title: '请先绑定学号，统一身份认证账号及密码',
                    icon: 'none'
                })
                return
            }
        } else if (identity === '研究生') {
            if (uid === '' || uid_pwd === '') {
                wx.showToast({
                    title: '请先绑定统一身份认证账号及密码',
                    icon: 'none'
                })
                return
            }
        }

//一卡通信息
        wx.showLoading()
        api.getSchoolCardInfo(uid, uid_pwd).then(res => {
            wx.hideLoading()
            if (res.statusCode === 200) {
                if (res.data.Statue === 1) {
                    wx.setStorageSync('card_fee', res.data.Amount)
                    let bills = res.data.Bills
                    for (let i = 0; i < bills.length; i++) {
                        bills[i]['Time'] = bills[i]['Time'].substring(5,16)
                        console.log(bills[i]['Time'])
                    }
                    console.log(bills)
                    that.setData({
                        card_fee: res.data.Amount,
                        bill_list: bills,
                     
                    })
                    
                    wx.setStorageSync('bill_list',that.data.bill_list)
                    wx.showToast({
                        title: '账单通查询成功',
                        icon: 'none'
                    })
                } else {
                    util.showError(res)
                }
            } else {
                wx.showToast({
                    title: `网络错误[${res.statusCode}]`,
                    icon: 'error'
                })
            }
        })
    },


    onShow: function () {
        let card_fee = wx.getStorageSync('card_fee')
        let bill_list = wx.getStorageSync('bill_list')
        if (card_fee === '' || bill_list === '') {
            wx.showToast({
                title: '下拉刷新更新数据',
                icon: 'none'
            })
        }
        this.setData({
            card_fee: card_fee,
            bill_list: bill_list,
        })
    },

    onPullDownRefresh: function() {
        this.updateData()
        wx.stopPullDownRefresh()
    },
})