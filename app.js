// app.js
App({
  onLaunch() {
    // 版本更新检查
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                if (res.confirm) {
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            wx.showModal({
              title: '已经有新版本了鸭~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开鸭~'
            })
          })
        }
      })
    }
    // 云开发环境初始化
    wx.cloud.init({
      env: "cqu321cloud-2gdf3sav27999792"
    })
  },
  globalData: {
    userInfo: null
  }
})
