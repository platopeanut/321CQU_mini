const volunteer_api = require('./volunteer_api')
Page({
    data: {
        stu_id: '',
        email: '',
        result: [], 
        time_sum: 0,
        can_send: false,
        need_fid_list: [],
        way: 'self',
    },
    onShow() {
        let StuInfo = wx.getStorageSync('StuInfo')
        this.setData({
            stu_id: StuInfo['stu_id'],
            email: StuInfo['email'],
        })
        if (!this.data.stu_id) {
            wx.showToast({
                title: '请完善统一身份认证信息',
                icon: 'none'
            })
        } else {
            this.updateData()
        }
    },

    // 解析志愿记录并存储
    loadAllRecords(data) {
        let tmpResult = []
        for (let i = 0; i < data.length; i++) {
            tmpResult.push({
                'StartDate': data[i][0],
                'EndDate': data[i][1],
                'Aname': data[i][2],
                'Duration': data[i][3],
                'Fid': data[i][4]
            })
        }
        this.setData({
            result: tmpResult
        })
    },
    selectWhich(e) {
        this.setData({
            need_fid_list: e.detail.value
        })
    },
    // 选择订阅方式
    selectWay(e) {
        let way = e.detail.value
        this.setData({
            way: way
        })
    },
    sendToEmail() {
        let stu_id = this.data.stu_id
        let email = this.data.email
        // 邮箱不能为空
        if (!email) {
            wx.showToast({
              title: '请绑定邮箱',
              icon: 'error'
            })
            setTimeout(() => {
                this.setData({
                    can_send: false
                })
            }, 200)
            return
        }
        // 解析fid_list
        let fid_list = ''
        if (this.data.way === 'all') {
            fid_list = '0'
        } else if (this.data.need_fid_list.length === 0) {
            wx.showToast({
              title: '请选择文件',
              icon: 'error'
            })
            setTimeout(() => {
                this.setData({
                    can_send: false
                })
            }, 200)
            return
        } else {
            for (let i = 0; i < this.data.need_fid_list.length; i++) {
                fid_list += this.data.need_fid_list[i] + ',';
            }
        }
        
        // 添加至任务管理
        let task_map = getApp().globalData.task_map
        let task_id = new Date().getTime()
        task_map[task_id] = {
            'icon': 'like',
            'icon_color': 'red',
            'title': '志愿时长',
            'content': '正在处理...',
            'status': 0
        }
        wx.showToast({
            title: '已添加至任务管理',
            icon: 'none'
          })
        setTimeout(() => {
            this.setData({
                can_send: false
            })
        }, 200)
        // 发送请求
        volunteer_api.sendVolunteer(stu_id, email, fid_list).then(res => {
            task_map[task_id]['status'] = 1
            task_map[task_id]['content'] = "已发送至邮箱"
        }, err => {
            task_map[task_id]['status'] = -1
            task_map[task_id]['content'] = `发送失败${err}`
        })
    },

    updateData() {
        let that = this
        let stu_id = this.data.stu_id
        if (!stu_id) {
            wx.showToast({
                title: '请完善统一身份信息！',
                icon: 'none'
            })
            return
        }
        // 获取志愿时长记录
        volunteer_api.getVolunteerRecord(stu_id).then(res => {
            that.loadAllRecords(res.AllActivity)
        })
        // 获取总志愿时长
        volunteer_api.getVolunteerTime(stu_id).then(res => {
            that.setData({
                time_sum: res.TotalDuration
            })
        })
    },
    onPullDownRefresh() {
        if (!this.data.stu_id) {
            wx.showToast({
                title: '请完善统一身份认证信息',
                icon: 'none'
            })
        } else {
            this.updateData()
        }
        wx.stopPullDownRefresh()
    }
})