const api = require('../../../utils/api')
const util = require('../../../utils/util')
Page({
    data: {
        StuInfo: {},
        identity: '',
        room: {
            'campus': '选择校区',
            'building': '选择楼栋',
            'room_id': ''
        },

        dormitory: [],
        dormitory_index: [],
    },

    onShow: function() {
        let StuInfo = wx.getStorageSync('StuInfo')
        if (StuInfo !== '') {
            this.setData({
                StuInfo: StuInfo
            })
        }
        if (StuInfo['identity']) {
            this.setData({
                identity: StuInfo['identity']
            })
        }
        if (StuInfo['room']) {
            this.setData({
                room: StuInfo['room']
            })
        }
        this.setData({
            dormitory: [util.get_campus_list(), util.get_dormitory()],
            dormitory_index: [0,0],
        })
    },
    bindMultiPickerChange: function (e) {
        let room = {
            'campus': this.data.dormitory[0][e.detail.value[0]],
            'building': this.data.dormitory[1][e.detail.value[1]],
            'room_id': ''
        }
        this.setData({
            room: room
        })
    },
    bindMultiPickerColumnChange: function (e) {
        if (e.detail.column === 0) {
            let zone = this.data.dormitory[0][e.detail.value]
            let li = util.get_dormitory(zone)
            this.setData({
                dormitory: [util.get_campus_list(), li],
                dormitory_index: [e.detail.value, 0]
            })
        }
    },
    saveUid(e) {
        let that = this
        let uid = e.detail.value.uid
        let uid_pwd = e.detail.value.uid_pwd
        let identity = this.data.identity?this.data.identity:'本科生'
        if (uid === '' || uid_pwd === '') {
            wx.showToast({
                title: '统一身份认证账号及密码必填',
                icon: 'none'
            })
            return
        }
        let StuInfo = {}
        if (identity === '本科生') {
            api.loginUG(uid, uid_pwd).then(res => {
                StuInfo['uid'] = uid
                StuInfo['uid_pwd'] = uid_pwd
                StuInfo['stu_id'] = res.Sid
                StuInfo['stu_name'] = res.Name
                StuInfo['identity'] = '本科生'
                that.setData({
                    StuInfo: StuInfo
                })
                wx.setStorageSync('StuInfo', StuInfo)
                wx.showToast({
                    title: '绑定成功',
                    icon: 'none'
                })
            })
        }
        else if (identity === '研究生') {
            api.loginPG(uid, uid_pwd).then(res => {
                StuInfo['uid'] = uid
                StuInfo['uid_pwd'] = uid_pwd
                StuInfo['identity'] = '研究生'
                that.setData({
                    StuInfo: StuInfo
                })
                wx.setStorageSync('StuInfo', StuInfo)
                wx.showToast({
                    title: '绑定成功',
                    icon: 'none'
                })
            })
        } else {
            wx.showToast({
                title: '身份错误',
                icon: 'none'
            })
        }
    },
    saveInfo(e) {
        let that = this
        let StuInfo = this.data.StuInfo
        let stu_name = StuInfo['stu_name']
        let stu_id = StuInfo['stu_id']
        if (stu_id === "" || stu_name === "") {
            wx.showToast({
                title: '请先登录统一身份认证',
                icon: 'none'
            })
            return
        }
        let email = e.detail.value.email
        let nickname = e.detail.value.nickname
        let room_id = e.detail.value.room_id
        // email
        StuInfo['email'] = email
        // 宿舍
        let room = this.data.room
        room['room_id'] = room_id
        StuInfo['room'] = room

        //页面加载
        wx.setStorageSync('StuInfo', StuInfo)
        that.setData({
            StuInfo: StuInfo,
            room: room,
        })

        // 设置昵称
        if (nickname !== "") {
            this.setNickname(stu_id, nickname)
        } else {
          wx.showToast({
            title: '绑定成功',
            icon: 'success'
          })
        }
    },
    identityChoice: function (e) {
        this.setData({
            identity: e.detail.value
        })
    },
    setNickname(stu_id, nickname) {
        let that = this
        let StuInfo = wx.getStorageSync('StuInfo')
        let avatarUrl = wx.getStorageSync('UserInfo').avatarUrl
        // avatarUrl不存在则需要重新授权
        if (avatarUrl === '') {
            wx.showToast({
                title: '需要重新授权',
                icon: 'none',
            })
            return
        }
        api.setNickname(stu_id, nickname, avatarUrl).then(res => {
            StuInfo['nickname'] = nickname
            StuInfo['authority'] = res.Authority
            wx.setStorageSync('StuInfo', StuInfo)
            that.setData({
                StuInfo: StuInfo
            })
            wx.showToast({
                title: '绑定成功',
                icon: 'none'
            })
        })
    }
})