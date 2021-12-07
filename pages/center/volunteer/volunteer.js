// pages/center/volunteer/volunteer.js
const student_db = wx.cloud.database().collection('Student')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        stu_name: "",
        stu_id: "",
        result: [],
        time_sum: 0
    },


    getAllRecords(stu_id) {
        // volunteer_db.where({
        //     Sid: stu_id
        //     }).get({
        //     success: function(res) {
        //         global.setData({
        //             result: res.data
        //         })
        //         console.log(global.getTimeSum())
        //         global.setData({
        //             time_sum: global.getTimeSum()
        //         })

        //     }
        //     })
        let global = this
        wx.cloud.callFunction({
            name: "getVolunteer",
            data: {
                where: {
                    Sid: stu_id
                }
            },
            success: function(res) {
                let data = res.result.data
                let total = data.length
                let batch_size = 20
                let left = 0
                let right = batch_size
                global.data.result = []
                while (right <= total) {
                    global.setData({
                        result: global.data.result.concat(data.slice(left, right))
                    })
                    left += batch_size
                    right += batch_size
                }
                global.setData({
                    result: global.data.result.concat(data.slice(left, total))
                })
                global.setData({
                    time_sum: global.getTimeSum()
                })
            },
            fail(res) {
                wx.showToast({
                    title: '网络错误',
                    icon: 'error'
                })
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let global = this;
        wx.getStorage({
            key: 'stuInfo',
            success (res) {
                global.setData({
                    stu_name: res.data.stu_name
                })
            }
          })
        wx.getStorage({
            key: 'stuInfo',
            success (res) {
                global.setData({
                    stu_id: res.data.stu_id
                })
            }
        })
    },

    getTimeSum() {
        let sum = 0
        this.data.result.forEach((value)=>{
            sum += value.Duration;
        })
        return sum;
    },
    formSubmit(e) {
        let global = this;
        let stu_name = e.detail.value.stu_name;
        let stu_id = e.detail.value.stu_id;
        if (stu_id == '' || stu_name == '') {
            wx.showToast({
              title: '请填写完整！',
              icon: 'error'
            })
        } else {
            // 如果stu_id能转换成数字，那就进行转换
            if (!isNaN(stu_id)) stu_id = parseInt(stu_id)
            // 对接云存储
            // 校验身份
            // 研究生不用校验
            if (!(stu_id <= 100000000)) {
                global.getAllRecords(stu_id)
                return
            }
            student_db.where({
                Sid: stu_id
              }).get({
                success: function(res) {
                    if (res.data.length === 0) {
                        wx.showToast({
                          title: '信息没有录入',
                          icon: 'error'
                        })
                    }
                    else if (res.data[0].Sname === stu_name){
                        global.getAllRecords(stu_id)
                    } 
                    else {
                    wx.showToast({
                        title: '个人信息不正确',
                        icon: 'error'
                    })
                    }
                },
            })
        }
    },
    formReset(e) {
        this.setData({
            result: [],
            time_sum: 0
        });
    }
    
})