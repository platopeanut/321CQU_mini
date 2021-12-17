const util = require('../../../utils/util')

Page({
    data: {
        stu_name: wx.getStorageSync('stu_name'),
        stu_id: wx.getStorageSync('stu_id'),
        email: wx.getStorageSync('email'),
        result: [], 
        time_sum: 0,
        can_send: false,
        need_fid_list: [],
        way: 'self',
    },
    onShow() {
        this.setData({
            stu_name: wx.getStorageSync('stu_name'),
            stu_id: wx.getStorageSync('stu_id'),
            email: wx.getStorageSync('email'),
        })
    },
    getEmail(res) {
        this.setData({
            email: res.detail.value
        })
    },
    onLoad: function (options) {
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
        console.log(e.detail.value)
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
        if (email == '' || email == undefined) {
            wx.showToast({
              title: '请填写邮箱',
              icon: 'error'
            })
            this.setData({
                can_send: false
            })
            return
        }
        // 发送请求
        let fid_list = ''
        if (this.data.way === 'all') {
            fid_list = '0'
        } else if (this.data.need_fid_list.length === 0) {
            wx.showToast({
              title: '请选择文件',
              icon: 'error'
            })
            this.setData({
                can_send: false
            })
            return
        } else {
            for (let i = 0; i < this.data.need_fid_list.length; i++) {
                fid_list += this.data.need_fid_list[i] + ',';
            }
        }
        wx.showLoading({
          title: '稍等~',
        })
        util.sendVolunteer(stu_id, email, fid_list).then(res => {
            if(res.statusCode !== 200) {
                wx.showToast({
                  title: '请求异常',
                  icon: 'error'
                })
            } else {
                console.log(res)        
                this.setData({
                    can_send: false
                })
                wx.hideLoading()
                wx.showToast({
                  title: '请注意查收',
                  icon: 'success'
                })
            }
        })
    },
    formSubmit(e) {
        let global = this
        let stu_name = e.detail.value.stu_name
        let stu_id = e.detail.value.stu_id
        let email = e.detail.value.email

        // 保存到页面
        this.setData({
            stu_name: stu_name,
            stu_id: stu_id,
            email: email
        })

        // id和name不能为空
        if (stu_id == '' || stu_name == '') {
            wx.showToast({
              title: '请填写完整！',
              icon: 'error'
            })
        } else {
            // 向服务器校验身份信息
            wx.showLoading({
              title: '校验信息',
            })
            util.getStuName(stu_id).then(res => {
                wx.hideLoading()
                if (res.statusCode !== 200) {
                    wx.showToast({
                      title: '暂无记录',
                      icon: 'error'
                    })
                } else {
                    let std_name = util.parseFromStr(res.data)[1]
                    if (std_name === stu_name) {
                        wx.showLoading({
                          title: '查询中',
                        })
                        // 获取志愿时长记录
                        util.getVolunteerRecord(stu_id).then(res => {
                            global.loadAllRecords(util.parseFromStr(res.data))
                            // 获取总志愿时长
                            util.getVolunteerTime(stu_id).then(res => {
                                global.setData({
                                    time_sum: util.parseFromStr(res.data)[1]
                                })
                                wx.hideLoading()
                            })
                        })
                        
                    } else {
                        wx.showToast({
                          title: '信息有误',
                          icon: 'error'
                        })
                    }
                }
            })
        }
    },
    formReset(e) {
        this.setData({
            result: [],
            time_sum: 0,
            stu_name: '',
            stu_id: '',
            email: ''
        });
    }
})