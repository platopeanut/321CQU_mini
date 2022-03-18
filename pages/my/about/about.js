const about_api = require("./about_api")

Page({
    data: {
        content_list: [],
    },

    onShow: function () {
        let that = this
        about_api.getAboutUs().then(res => {
            that.setData({
              content_list: res.Content
            })
        })
    }
});
