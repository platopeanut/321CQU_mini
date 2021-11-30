// pages/center/volunteer/volunteer.js
const volunteer_db = wx.cloud.database().collection("Volunteer");
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

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let global = this;
        wx.getStorage({
            key: 'stu_name',
            success (res) {
                console.log(res.data)
                global.setData({
                    stu_name: res.data
                })
            }
          })
        wx.getStorage({
            key: 'stu_id',
            success (res) {
                console.log(res.data)
                global.setData({
                    stu_id: res.data
                })
            }
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

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
                volunteer_db.where({
                    Sid: stu_id
                    }).get({
                    success: function(res) {
                        global.setData({
                            result: res.data
                        })
                        console.log(global.getTimeSum())
                        global.setData({
                            time_sum: global.getTimeSum()
                        })
                    }
                    })
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
                    volunteer_db.where({
                        Sid: stu_id
                        }).get({
                        success: function(res) {
                            global.setData({
                                result: res.data
                            })
                            console.log(global.getTimeSum())
                            global.setData({
                                time_sum: global.getTimeSum()
                            })
        
                        }
                        })
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