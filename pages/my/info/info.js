const api = require('../../../utils/api')
const util = require('../../../utils/util')
Page({
    data: {
        stuInfo: {
            stu_name: wx.getStorageSync('stu_name'),
            stu_id: wx.getStorageSync('stu_id'),
            email: wx.getStorageSync('email'),
            nickname: wx.getStorageSync('nickname'),
            uid: wx.getStorageSync('uid'),
            uid_pwd: wx.getStorageSync('uid_pwd'),
            identity: wx.getStorageSync('identity'), // 研究生还是本科生
            _dormitory: [],
            dormitory_index: [],
            room: null,
        },
    },

    onShow: function() {
        let room = wx.getStorageSync('room')
        if (room === '') room = {
            'campus': '选择校区',
            'building': '选择楼栋',
            'room_id': ''
        }
        this.setData({
            _dormitory: [util.get_campus_list(), util.get_dormitory()],
            dormitory_index: [0,0],
            room: room
        })
    },
    bindMultiPickerChange: function (e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        let room = {
            'campus': this.data._dormitory[0][e.detail.value[0]],
            'building': this.data._dormitory[1][e.detail.value[1]],
            'room_id': ''
        }
        this.setData({
            room: room
        })
    },
    bindMultiPickerColumnChange: function (e) {
        if (e.detail.column === 0) {
            let zone = this.data._dormitory[0][e.detail.value]
            let li = util.get_dormitory(zone)
            this.setData({
                _dormitory: [util.get_campus_list(), li],
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
        if (identity === '本科生') {
            api.loginUG(uid, uid_pwd).then(res => {
                console.log(res)
                wx.setStorageSync('uid', uid)
                wx.setStorageSync('uid_pwd', uid_pwd)
                wx.setStorageSync('stu_id', res.Sid)
                wx.setStorageSync('stu_name', res.Name)
                wx.setStorageSync('identity', '本科生')
                that.setData({
                    uid: uid,
                    uid_pwd: uid_pwd,
                })
                wx.showToast({
                    title: '绑定成功',
                    icon: 'none'
                })
            })
        }
        else if (identity === '研究生') {
            api.loginPG(uid, uid_pwd).then(res => {
                wx.setStorageSync('uid', uid)
                wx.setStorageSync('uid_pwd', uid_pwd)
                wx.setStorageSync('identity', '研究生')
                that.setData({
                    uid: uid,
                    uid_pwd: uid_pwd,
                })
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
        let that = this;
        let stu_name = wx.getStorageSync('stu_name')
        let stu_id = wx.getStorageSync('stu_id')
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

        // 宿舍
        let room = this.data.room
        room['room_id'] = room_id
        wx.setStorageSync('room', room)
        this.setData({
            room: room
        })

        // 设置昵称
        if (nickname !== "") {
            // 设置昵称
            this.setNickname(stu_id, nickname)
        } else {
          wx.showToast({
            title: '绑定成功',
            icon: 'success'
          })
        }
        wx.setStorageSync('email', email)
        //页面加载
        that.setData({
          stuInfo: {
            stu_id: stu_id,
            stu_name: stu_name,
            email: email,
            nickname: nickname,
            uid: wx.getStorageSync('uid'),
            uid_pwd: wx.getStorageSync('uid_pwd'),
          }
        })
    },
    identity_choice: function (e) {
        this.setData({
            identity: e.detail.value
        })
    },
    setNickname(stu_id, nickname) {
        let global = this
        let avatarUrl = wx.getStorageSync('userInfo').avatarUrl
        // avatarUrl不存在则需要重新授权
        if (avatarUrl === "" || avatarUrl === undefined) {
            wx.showToast({
            title: '需要重新授权',
            icon: 'error',
            })
            return
        }
        wx.showLoading()
        api.setNickname(stu_id, nickname, avatarUrl).then(res => {
            wx.hideLoading()
            if (res.statusCode === 200) {
                if (res.data.Statue === 1) {
                    wx.setStorageSync('nickname', nickname)
                    wx.showToast({
                    title: '绑定成功',
                    icon: 'success'
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
    }
})