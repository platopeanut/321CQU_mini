const life_api = require('../life_api')

Page({

    data: {
        card_fee : wx.getStorageSync('card_fee'),
        bill_list : [],
    },

    updateData: function () {
        let that = this
        let StuInfo = wx.getStorageSync('StuInfo')
        let uid = StuInfo['uid']
        let uid_pwd = StuInfo['uid_pwd']
        let stu_id= StuInfo['stu_id']
        let identity= StuInfo['identity']
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
        life_api.getSchoolCardInfo(uid, uid_pwd).then(res => {
            wx.setStorageSync('card_fee', res.Amount)
            let bills = res.Bills
            for (let i = 0; i < bills.length; i++) {
                bills[i]['Time'] = bills[i]['Time'].substring(5,16)
                console.log(bills[i]['Time'])
            }
            console.log(bills)
            that.setData({
                card_fee: res.Amount,
                bill_list: bills,

            })
            wx.setStorageSync('bill_list',that.data.bill_list)
            wx.showToast({
                title: '账单通查询成功',
                icon: 'none'
            })
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