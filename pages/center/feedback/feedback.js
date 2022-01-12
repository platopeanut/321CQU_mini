const api = require("../../../utils/api")
let page = Page({

    data: {
        message : "",
        action : false,
        feedback_data: [],
        limit_index: 0,
        limit_end: false,
        anonymous: getApp().globalData.anonymous
    },

    // 获取评论总数，每次获取20条，已到达末尾则返回false
    getComments() {
      wx.showLoading()
      let that = this
      let batch_size = 20
      let limit_index = this.data.limit_index
      // 请求服务器
      api.getFeedback(`${limit_index},${batch_size}`).then(res => {
        if (res.statusCode === 200) {
          if (res.data.Statue === 0) {
            wx.showToast({
              title: '获取失败',
              icon: 'error'
            })
            return
          }
          // console.log(`${limit_index},${batch_size}`)
          // console.log(res.data.FeedbackList)
          for (let i = 0; i < res.data.FeedbackList.length; i++) {
            const element = res.data.FeedbackList[i];
          }
          let feedback_list = res.data.FeedbackList
          // 本地显示
          that.setData({
            feedback_data: this.data.feedback_data.concat(feedback_list)
          })
          // index自增
          that.setData({
            limit_index: that.data.limit_index + batch_size
          })
          // 末尾设置标志位
          if (feedback_list.length < batch_size) {
            that.setData({
              limit_end: true
            })
          }
        } else {
          wx.showToast({
            title: '网络错误',
            icon: 'error'
          })
        }
        wx.hideLoading()
      })
    },
    onLoad: function () {
      this.setData({
        limit_index: 0,
        feedback_data: [],
        limit_end: false,
      })
      this.getComments()
    },
    
    
    // 下拉刷新
    onPullDownRefresh: function() {
      this.onLoad()
      wx.stopPullDownRefresh()
    },
    // 触底刷新
    onReachBottom: function() {
      if (!this.data.limit_end) {
        this.getComments()
      } else {
        wx.showToast({
          title: '没有更多了',
          icon: 'none'
        })
      }
    },

    // 跳转到添加反馈界面
    addFeedback: function() {
      wx.navigateTo({
        url: './edit/edit',
      })        
    },
    
    // 跳转到具体反馈界面
    jumpToDetail(e) {
        let item = e.currentTarget.dataset.item
        if (item.UserImg == null) item.UserImg = this.data.anonymous
        wx.navigateTo({
          url: './detail/detail',
          events: {
            // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
            acceptDataFromOpenedPage: function(data) {
              console.log('hi')
            },
          },
          success: function(res) {
            // 通过eventChannel向被打开页面传送数据
            res.eventChannel.emit('acceptDataFromOpenerPage', {
                data: item
            })
          }
        })
    }
})