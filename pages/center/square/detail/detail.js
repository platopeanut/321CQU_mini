// pages/center/square/detail/detail.js
Page({

    data: {

    },

    onShow: function () {
        let that = this
        const eventChannel = this.getOpenerEventChannel()
        eventChannel.on('acceptDataFromOpenerPage', function(data) {
            that.setData({
                feedback_data: data.data,
                FBid: data.data.FBid
            })
            // 获取评论
            that.update()
            // 浏览次数加一
            // let curr = data.data[0].view
            // curr ++
            // comment_db.doc(data.data[0]._id).update({
            //     data: {
            //         // 表示指示数据库将字段自增 10
            //         view: curr
            //     }
            // })
        })
    }

})