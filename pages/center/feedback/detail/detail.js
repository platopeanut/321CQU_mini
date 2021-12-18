Page({

    data: {
        feedback_data: [],
        isAgree : false
    },

    onLoad: function (options) {
        let global = this
        const eventChannel = this.getOpenerEventChannel()
        eventChannel.on('acceptDataFromOpenerPage', function(data) {
            global.setData({
                feedback_data: data.data
            })
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
    },
    // addAgree() {
    //     let curr = this.data.feedback_data[0].agree
    //     curr ++
    //     comment_db.doc(this.data.feedback_data[0]._id).update({
    //         data: {
    //             // 表示指示数据库将字段自增 10
    //             agree: curr
    //         }
    //     })
    //     this.setData({
    //         isAgree: true
    //     })
    //     wx.showToast({
    //       title: '点赞成功',
    //       icon: 'success'
    //     })
    // },
})