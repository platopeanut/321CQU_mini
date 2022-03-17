const curriculum_util = require('../curriculum_util')
const curriculum_api = require('../curriculum_api')

Page({

    data: {
        SelfSchedule: [],
        Priority: [],
        edit_mode: false,
        curr_schedule: null,
    },

    onShow: function() {
        let Curriculum = wx.getStorageSync('Curriculum')
        let SelfSchedule = Curriculum['SelfSchedule']
        let Priority = Curriculum['Priority']
        if (!SelfSchedule) SelfSchedule = []
        if (!Priority) Priority = []
        this.setData({
            SelfSchedule: SelfSchedule,
            Priority: Priority
        })
    },

    selectScheduleItem: function (e) {
        let that = this
        let index = e.currentTarget.dataset.index
        let item = e.currentTarget.dataset.item
        wx.showActionSheet({
            itemList: ['修改', '删除'],
            success: function (e) {
                if (e.tapIndex === 1) {
                    // 删除
                    let SelfSchedule = that.data.SelfSchedule
                    SelfSchedule.splice(index, 1)
                    let Curriculum = wx.getStorageSync('Curriculum')
                    Curriculum['SelfSchedule'] = SelfSchedule
                    wx.setStorageSync('Curriculum', Curriculum)
                    that.setData({
                        SelfSchedule: SelfSchedule
                    })
                    wx.showToast({
                        title: '删除成功',
                        icon: 'none'
                    })
                } else if (e.tapIndex === 0) {
                    //修改
                    let SelfSchedule = that.data.SelfSchedule
                    SelfSchedule.splice(index, 1)
                    let Curriculum = wx.getStorageSync('Curriculum')
                    Curriculum['SelfSchedule'] = SelfSchedule
                    wx.setStorageSync('Curriculum', Curriculum)
                    that.setData({
                        SelfSchedule: SelfSchedule,
                        edit_mode: true,
                        curr_schedule: item
                    })
                }
            }
        })
    },

    addNewItem: function () {
        this.setData({
            edit_mode: true
        })
    },
    backup2Cloud: function () {
        let Curriculum = wx.getStorageSync('Curriculum')
        let SelfSchedule = Curriculum['SelfSchedule']
        if (!SelfSchedule) SelfSchedule = []
        let events = []
        for (const item of SelfSchedule) {
            events.push({
                'CEcode': item.CourseCode,
                'CEname': item.CourseName,
                'PeriodFormat': item.PeriodFormat,
                'TeachingWeekFormat': item.TeachingWeekFormat,
                'WeekdayFormat': item.WeekDayFormat,
                'Content': item.Content
            })
        }
        wx.login({
            success: res => {
                curriculum_api.pushSelfSchedule(res.code, events).then(res => {
                    wx.showToast({
                        title: '备份成功',
                        icon: 'none'
                    })
                })
            },
            fail: err => {
                wx.showToast({
                    title: '登陆失败,请重新授权后重试',
                    icon: 'none'
                })
            }
        })
    },
    sync2Local: function () {
        wx.login({
            success: res => {
                curriculum_api.pullSelfSchedule(res.code).then(res => {
                    console.log(res.Events)
                    let SelfSchedule = []
                    for (const item of res.Events) {
                        SelfSchedule.push({
                            Self: true,
                            CourseCode: item.CEcode,
                            CourseName: item.CEname,
                            PeriodFormat: item.PeriodFormat,
                            TeachingWeekFormat: item.TeachingWeekFormat,
                            WeekDayFormat: item.WeekdayFormat,
                            Content: item.Content
                        })
                    }
                    let Curriculum = wx.getStorageSync('Curriculum')
                    Curriculum['SelfSchedule'] = SelfSchedule
                    wx.setStorageSync('Curriculum', Curriculum)
                    console.log(SelfSchedule)
                    this.setData({
                        SelfSchedule: SelfSchedule
                    })
                    wx.showToast({
                        title: '同步成功',
                        icon: 'none'
                    })
                })
            },
            fail: err => {
                wx.showToast({
                    title: '登陆失败,请重新授权后重试',
                    icon: 'none'
                })
            }
        })
    },
    handleUserOperations: function () {
      let that = this
      wx.showActionSheet({
          itemList: ['新建', '备份到云', '同步到本地'],
          success: function (e) {
              if (e.tapIndex === 0) {
                  that.addNewItem()
              } else if (e.tapIndex === 1) {
                  that.backup2Cloud()
              } else if (e.tapIndex === 2) {
                  that.sync2Local()
              }
          }
      })
    },
    formSubmit: function (e) {
        let CourseName = e.detail.value.CourseName
        let TeachingWeekFormat = e.detail.value.TeachingWeekFormat
        let WeekDayFormat = e.detail.value.WeekDayFormat
        let PeriodFormat = e.detail.value.PeriodFormat
        let Content = e.detail.value.Content
        if (CourseName === '' || TeachingWeekFormat === '' || WeekDayFormat === '' || PeriodFormat === '') {
            wx.showToast({
                title: '名称，周次，星期，时段不能为空',
                icon: 'none'
            })
            return
        }
        // 合法性校验
        if (CourseName.length > 25) {
            wx.showToast({
                title: '名称不能超过25个字',
                icon: 'none'
            })
            return
        }
        if (Content.length > 50) {
            wx.showToast({
                title: '说明文字不能超过五十字',
                icon: 'none'
            })
            return
        }
        const week_list = ['一', '二', '三', '四', '五', '六', '日']
        let checkWeekDayFormat = false
        for (const item of week_list) {
            if (item === WeekDayFormat) {
                checkWeekDayFormat = true
                break
            }
        }
        if (!checkWeekDayFormat) {
            wx.showToast({
                title: '星期不符合规范',
                icon: 'none'
            })
            return
        }
        for (const item of curriculum_util.parseFormat(TeachingWeekFormat)) {
            if (!(item >= 1 && item <= 30)) {
                wx.showToast({
                    title: '周次取值为1-30\n注意符号需为英文',
                    icon: 'none'
                })
                return
            }
        }
        for (const item of curriculum_util.parseFormat(PeriodFormat)) {
            if (!(item >=1 && item <= 13)) {
                wx.showToast({
                    title: '时段取值为1-13\n注意符号需为英文',
                    icon: 'none'
                })
            }
        }


        let SelfSchedule = this.data.SelfSchedule
        let newSchedule = {
            Self:true,
            CourseCode: CourseName,
            CourseName: CourseName,
            PeriodFormat: PeriodFormat,
            TeachingWeekFormat: TeachingWeekFormat,
            WeekDayFormat: WeekDayFormat,
            Content: Content
        }
        SelfSchedule.push(newSchedule)
        let Curriculum = wx.getStorageSync('Curriculum')
        Curriculum['SelfSchedule'] = SelfSchedule
        wx.setStorageSync('Curriculum', Curriculum)
        this.setData({
            SelfSchedule: SelfSchedule
        })
        this.setData({
            edit_mode: false,
        })
        wx.showToast({
            title: '创建成功',
            icon: 'none'
        })
    },
    formCancel: function (e) {
        this.setData({
            edit_mode: false
        })
    },
})