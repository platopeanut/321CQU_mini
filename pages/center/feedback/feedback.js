const api = require("../../../utils/api")
let page = Page({

    data: {
        message : "",
        action : false,
        feedback_data: [],
        limit_index: 0,
        limit_end: false,
    },

    // 获取评论总数，每次获取20条，已到达末尾则返回false
    getComments() {
      wx.showLoading()
      let that = this
      let batch_size = 20
      let limit_index = this.data.limit_index
      // 请求服务器
      api.getFeedback(`${limit_index},${limit_index + batch_size}`).then(res => {
        if (res.statusCode === 200) {
          if (res.data.Statue === 0) {
            wx.showToast({
              title: '获取失败',
              icon: 'error'
            })
            return
          }
          let list = res.data.FeedbackList
          let feedback_list = []
          for (let i = 0; i < list.length; i++) {
            feedback_list.push({
              'stu_id': list[i][0],
              'nickname': list[i][1],
              'avatar': list[i][2],
              'message': list[i][3],
              'time': list[i][4],
            })
          }
          // 本地显示
          that.setData({
            feedback_data: this.data.feedback_data.concat(feedback_list)
          })
          // index自增
          that.setData({
            limit_index: that.data.limit_index + batch_size
          })
          // 末尾设置标志位
          if (list.length < batch_size) {
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
    onShow: function () {
      this.setData({
        limit_index: 0,
        feedback_data: [],
        limit_end: false,
      })
      this.getComments()
    },
    
    
    // 下拉刷新
    onPullDownRefresh: function() {
      this.onShow()
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