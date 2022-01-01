Page({
    data: {
        month: -1,  // 月份
        week_list: null,    // 顶部
        table: null,    // 主体课表
        week: -1,   // 第几周
        today: 3,   // 今天周几
        showMode: 0, // 显示模式，0为每周，1为整个学期
        startYear: 2022,    // 开始学年
        termIndex: '一',    // 第几学期
        scrollHeight: 0,
    },
    getDayList() {
        return [13,14,15,16,17,18,19]
    },
    getTable() {
        let table = new Array(12)
        for (let i = 0; i < table.length; i++) {
            table[i] = new Array(7)
        }
        for (let i = 0; i < 12; i++) {
            for (let j = 0; j < 7; j++) {
                table[i][j] = ""
            }
        }
        return table
    },
    onReady: function() {
        let that = this
        wx.getSystemInfo({
            success: function(res) {
              that.setData({
                  scrollHeight: res.windowHeight * (750 / res.windowWidth)
              })
            }
          })
    },
    onLoad: function() {
        console.log(this.data.scrollHeight)
        let week_list = [['周一'],['周二'],['周三'],['周四'],['周五'],['周六'],['周日']]
        let day_list = this.getDayList()
        for (let i = 0; i < week_list.length; i++) {
            week_list[i].push(day_list[i])
        }
        let table = this.getTable()
        this.setData({
            month: 12,
            week_list: week_list,
            table: table,
            week: 13,
        })
    },

    switchModelTo1() {
        this.setData({
            showMode: 1
        })
    },
    switchModelTo0() {
        this.setData({
            showMode: 0
        })
    },
    onShow: function() {
        wx.showToast({
          title: '敬请期待',
          icon: 'none'
        })
    }
})