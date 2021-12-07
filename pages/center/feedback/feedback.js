// pages/center/feedback/feedback.js
const db = wx.cloud.database()
const feedback_db = wx.cloud.database().collection("Feedback")
let page = Page({

    /**
     * 页面的初始数据
     */
    data: {
        message : "",
        action : false,
        feedback_data: [],
    },

    // 获取评论总数
    getAllComments() {
        let global = this
        wx.cloud.callFunction({
            name: "getAllItems",
            data: {
                collection: "Comment"
            },
            success: function(res) {
                let data = res.result.data.reverse()
                let total = data.length
                let batch_size = 20
                let left = 0
                let right = batch_size
                global.data.feedback_data = []
                while (right <= total) {
                    global.setData({
                        feedback_data: global.data.feedback_data.concat(data.slice(left, right))
                    })
                    left += batch_size
                    right += batch_size
                }
                global.setData({
                    feedback_data: global.data.feedback_data.concat(data.slice(left, total))
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
        wx.showToast({title: '加载中', icon: 'loading', duration: 10000});
        this.getAllComments();
        wx.hideToast();
    },
    addFeedback: function() {
        wx.navigateTo({
          url: './edit/edit',
        })
        // let global = this;
        // wx.showModal({
        //     title: '反馈信息',
        //     placeholderText: "请输入反馈信息",
        //     editable: true,
        //     success (res) {
        //       if (res.confirm) {
        //         global.setData({
        //             message: res.content,
        //             action : true
        //         })
        //         if (global.data.message !== "") {
        //             feedback_db.add({
        //                 data:{
        //                     time: db.serverDate(),
        //                     message: global.data.message
        //                 },
        //                 success(res) {
        //                     wx.showToast({
        //                         title: '反馈成功，谢谢您的宝贵意见！',
        //                         icon: 'success'
        //                     });
        //                     wx.showToast({title: '加载中', icon: 'loading', duration: 10000});
        //                     global.getAllComments();
        //                     wx.hideToast();
        //                 },
        //                 fail(res) {
        //                     wx.showToast({
        //                         title: '反馈失败，请联系管理员',
        //                         icon: 'error'
        //                         })
        //                 }
        //             })
        //       }}
        //     }
        //   })
        
    },
    
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        wx.showToast({title: '加载中', icon: 'loading', duration: 10000});
        this.getAllComments();
        wx.hideToast();
    },

    jumpToDetail(e) {
        let item = e.currentTarget.dataset.item;
        wx.navigateTo({
            url: './detail/detail',
            events: {
              // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
              acceptDataFromOpenedPage: function(data) {
                console.log(data)
              },
            },
            success: function(res) {
              // 通过eventChannel向被打开页面传送数据
              res.eventChannel.emit('acceptDataFromOpenerPage', { data: [item] })
            }
          })
    }
})