// app.js
App({
  onLaunch() {
    let global = this;
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
                  // 小程序更新
                  updateManager.applyUpdate()
                  // 清除缓存
                  wx.clearStorage({
                    success: (res) => {
                      console.log("缓存清除成功")
                    },
                  })
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
    // ?(暂时不需要)加载用户本地缓存信息
    // TODO
  },
  globalData: {
    task_map: {},
  }
})
