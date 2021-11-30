// pages/center/feedback/feedback.js
const feedback_db = wx.cloud.database().collection("Feedback");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        message : "",
        action : false,
        feedback_data: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let global = this;
        feedback_db.orderBy('time', 'asc').get({
            success(res) {
                global.setData({
                    feedback_data: res.data
                })
                console.log(res.data)
            }
        })
    },
    getTime() {
        let date = new Date();
        let text = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
        text += ` ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        return text;
    },
    addFeedback: function() {
        let global = this;
        wx.showModal({
            title: '反馈信息',
            placeholderText: "请输入反馈信息",
            editable: true,
            success (res) {
              if (res.confirm) {
                global.setData({
                    message: res.content,
                    action : true
                })
                if (global.data.message !== "") {
                    feedback_db.add({
                        data:{
                            time: global.getTime(),
                            message: global.data.message
                        },
                        success(res) {
                            wx.showToast({
                                title: '反馈成功，谢谢您的宝贵意见！',
                                icon: 'success'
                            });
                            feedback_db.get({
                                success(res) {
                                    global.setData({
                                        feedback_data: res.data
                                    })
                                }
                            })
                        },
                        fail(res) {
                            wx.showToast({
                                title: '反馈失败，请联系管理员',
                                icon: 'error'
                                })
                        }
                    })
              }}
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

        let global = this;
        feedback_db.get({
            success(res) {
                global.setData({
                    feedback_data: res.data
                })
            }
        })
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        
    }
})