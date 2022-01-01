const app = getApp();
const api = require("../../../utils/api")
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    ColorList: app.globalData.ColorList,
    content_list: [],
  },
  onShow: function () {
    let that = this
    api.getAboutUs().then(res => {
      if (res.data.Statue == 1) {
        that.setData({
          content_list: res.data.Content
        })
      } else {
        wx.showToast({
          title: '加载失败',
          icon: 'none'
        })
      }
    })
  },
  pageBack() {
    wx.navigateBack({
      delta: 1
    });
  }
});
