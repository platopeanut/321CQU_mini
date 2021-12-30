const api = require('../../../utils/api')

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
        api.sendVolunteer(stu_id, email, fid_list).then(res => {
            if(res.statusCode !== 200) {
                task_map[task_id]['status'] = -1
                task_map[task_id]['content'] = "网络错误"
            } else {
                if (res.data.Statue == 1) {
                    task_map[task_id]['status'] = 1
                    task_map[task_id]['content'] = "已发送至邮箱"
                } else {
                    // 失败
                    task_map[task_id]['status'] = -1
                    task_map[task_id]['content'] = "发送失败"
                }
            }
        })
    },
    formSubmit(e) {
        let global = this
        let stu_name = e.detail.value.stu_name
        let stu_id = e.detail.value.stu_id
        // let email = e.detail.value.email

        // 保存到页面
        this.setData({
            stu_name: stu_name,
            stu_id: stu_id,
            // email: email
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
            api.getStuName(stu_id).then(res => {
                wx.hideLoading()
                if (res.statusCode !== 200) {
                    wx.showToast({
                      title: '网络错误',
                      icon: 'error'
                    })
                } else {
                    if(res.data.Statue == 0) {
                        wx.showToast({
                            title: '暂无记录',
                            icon: 'error'
                        })
                        return
                    }
                    let std_name = res.data.Sname
                    if (std_name === stu_name) {
                        wx.showLoading({
                          title: '查询中',
                        })
                        // 获取志愿时长记录
                        api.getVolunteerRecord(stu_id).then(res => {
                            if (res.Statue == 0) {
                                wx.showToast({
                                  title: '查询志愿记录失败',
                                  icon: 'none'
                                })
                                return
                            }
                            global.loadAllRecords(res.data.AllActivity)
                            // 获取总志愿时长
                            api.getVolunteerTime(stu_id).then(res => {
                                if (res.Statue == 0) {
                                    wx.showToast({
                                      title: '查询志愿总时长失败',
                                      icon: 'none'
                                    })
                                    return
                                }
                                global.setData({
                                    time_sum: res.TotalDuration
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
        });
    }
})