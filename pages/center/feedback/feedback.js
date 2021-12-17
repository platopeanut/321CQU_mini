let page = Page({

    data: {
        message : "",
        action : false,
        feedback_data: [],
    },

    // 获取评论总数
    getAllComments() {
        let global = this
        // 请求服务器
    },


    onLoad: function (options) {
        wx.showToast({title: '加载中', icon: 'loading', duration: 10000});
        this.getAllComments();
        wx.hideToast();
    },
    addFeedback: function() {
        wx.navigateTo({
          url: './edit/edit',
        })        
    },
    
    // 下拉刷新
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