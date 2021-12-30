Page({
    data: {
        month: -1,  // 月份
        week_list: null,    // 顶部
        table: null,    // 主体课表
        week: -1,   // 第几周
        today: 3,   // 今天周几
        showMode: 0, // 显示模式，0为每周，1为整个学期
        startYear: 2021,    // 开始学年
        termIndex: '二',    // 第几学期
        scrollHeight: 0,
    },
    getDayList() {
        return [20,21,22,23,24,25,26]
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
        // table[11][2] = "Hello"
        // table[1][2] = "数据结构与算法数据结构与算法"
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
            week: 17,
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

})