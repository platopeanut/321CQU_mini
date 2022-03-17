const life_api = require('./life_api')
const life_util = require('./life_util')

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
            room_code = life_util.getDormitoryCode(room)
        }
        else room_code = life_util.getDormitoryCodeInABC(room)
    
        console.log(room_code)
        console.log(is_hu_xi)

        life_api.getFees(uid, uid_pwd, is_hu_xi, room_code).then(res => {
            wx.setStorageSync('fees_info', res.FeesInfo)
            that.setData({
                fees_info: res.FeesInfo
            })
            wx.showToast({
                title: '水电费查询成功',
                icon: 'none'
            })
            return life_api.getSchoolCardInfo(uid, uid_pwd)
        }).then(res => {
            //一卡通
            wx.setStorageSync('card_fee', res.Amount)
            that.setData({
                card_fee: res.Amount
            })
            wx.showToast({
                title: '一卡通查询成功',
                icon: 'none'
            })
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