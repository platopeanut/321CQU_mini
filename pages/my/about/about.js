const api = require("../../../utils/api")

Page({
    data: {
        content_list: [],
    },

    onShow: function () {
        let that = this
        api.getAboutUs().then(res => {
            that.setData({
              content_list: res.Content
            })
        })
    }
});
