const api = require('../../../utils/api')
const util = require('../../../utils/util')

Page({

    data: {
        fees_info: null,
        card_fee: 0
    },

    updateData: function () {
        let that = this
        let StuInfo = wx.getStorageSync('StuInfo')
        let uid = StuInfo['uid']
        let uid_pwd = StuInfo['uid_pwd']
        let stu_id= StuInfo['stu_id']
        let identity= StuInfo['identity']
        let room = StuInfo['room']

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

        if (room === '' || room['campus'] === '选择校区' || !room['campus'] || room['building'] === '选择楼栋' || !room['building'] || room['room_id'] === '' || !room['room_id']) {
            wx.showToast({
                title: '请完善宿舍信息',
                icon: 'none'
            })
            
        }
        let is_hu_xi = room['campus'].startsWith("虎溪")
        let room_code
        if(is_hu_xi){
            room_code = util.get_dormitory_code(room)
        }
        else room_code = util.get_dormitory_code_inABC(room)
    
        console.log(room_code)
        console.log(is_hu_xi)

        wx.showLoading()
        api.get_fees(uid, uid_pwd, is_hu_xi, room_code).then(res => {
            wx.hideLoading()
            if (res.statusCode === 200) {
                if (res.data.Statue === 1) {
                    wx.setStorageSync('fees_info', res.data.FeesInfo)
                  
                    that.setData({
                        fees_info: res.data.FeesInfo
                    })
                    wx.showToast({
                        title: '水电费查询成功',
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
     
//一卡通
            
        wx.showLoading()
        api.getSchoolCardInfo(uid, uid_pwd).then(res => {
            wx.hideLoading()
            if (res.statusCode === 200) {
                if (res.data.Statue === 1) {
                    wx.setStorageSync('card_fee', res.data.Amount)
                    that.setData({
                        card_fee: res.data.Amount
                    })
                    wx.showToast({
                        title: '一卡通查询成功',
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
        let fees_info = wx.getStorageSync('fees_info')
        let card_fee = wx.getStorageSync('card_fee')
        console.log(card_fee)
        console.log(fees_info)
        this.setData({
            fees_info: fees_info,
            card_fee: card_fee
        })
        console.log(fees_info)
        if (fees_info === '' || card_fee === '') {
            wx.showToast({
                title: '下拉刷新更新数据',
                icon: 'none'
            })
        }
    },

    onPullDownRefresh: function() {
        this.updateData()
        wx.stopPullDownRefresh()
    },
})