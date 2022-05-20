const curriculum_util = require('../curriculum_util')
const curriculum_api = require('../curriculum_api')

/**
 *  TODO: 自动获取考试信息显得尤为重要！
 */

Page({
    data: {
        StuInfo: null,
        SelfSchedule: [],
        Priority: [],
        edit_mode: false,
        curr_schedule: null,
        ImportExams: false,
    },
    onShow: function() {
        let StuInfo = wx.getStorageSync('StuInfo')
        let Curriculum = wx.getStorageSync('Curriculum')
        let SelfSchedule = Curriculum['SelfSchedule']
        console.log(SelfSchedule)
        let Priority = Curriculum['Priority']
        let ImportExams = Curriculum['ImportExams']
        if (!SelfSchedule) SelfSchedule = []
        if (!Priority) Priority = []
        if (!ImportExams) ImportExams = false
        this.setData({
            StuInfo: StuInfo,
            SelfSchedule: SelfSchedule,
            Priority: Priority,
            ImportExams: ImportExams
        })
        if (ImportExams) this.addImportExams()
    },
    selectImportExams: function (e) {
        console.log(e.detail.value)
        let Curriculum = wx.getStorageSync('Curriculum')
        if (!Curriculum) {
            wx.showToast({
                title: '请先刷新课表',
                icon: 'none'
            })
            setInterval(()=>{
                this.setData({
                    ImportExams: false
                })
            }, 500)
            return
        }
        Curriculum['ImportExams'] = e.detail.value
        wx.setStorageSync('Curriculum', Curriculum)
    },
    addImportExams: function () {
        let exams = wx.getStorageSync('ExamSchedule')
        if (!exams) {
            wx.showToast({
                title: '请先获取考试安排信息(后面改为自动模式)',
                icon: 'none'
            })
            return
        }
        console.log(exams)
        // TODO
        let Curriculum = wx.getStorageSync('Curriculum')
        let SelfSchedule = Curriculum['SelfSchedule']
        if (!SelfSchedule) SelfSchedule = []
        console.log(Curriculum)
        let StartDate = Curriculum['Curr']['TermInfo'].StartDate
        for (const exam of exams) {
            let newSchedule = {
                Self: true,
                WeekDayFormat: ['日','一','二','三','四','五','六'][new Date(exam.ExamDate).getDay()],
                Content: `${exam.StartTime}-${exam.EndTime},座位号:${exam.SeatNum}`,
                CourseCode: exam.CourseCode,
                CourseName: '[考试]\n' + exam.RoomName + '\n' + exam.CourseName,
            }
            newSchedule['TeachingWeekFormat'] = curriculum_util.getCurrWeek(StartDate, exam.ExamDate).toString()
            let StartTime = exam.StartTime.split(':')
            let EndTime = exam.EndTime.split(':')
            newSchedule['PeriodFormat'] = `${curriculum_util.getLessonIndex({
                hour: StartTime[0],
                minute: StartTime[1]
            })}-${curriculum_util.getLessonIndex({
                hour: EndTime[0],
                minute: EndTime[1]
            })}`
            SelfSchedule.push(newSchedule)
        }
        Curriculum['SelfSchedule'] = SelfSchedule
        wx.setStorageSync('Curriculum', Curriculum)
        console.log(SelfSchedule)
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
        if (!this.data.StuInfo['stu_id']) {
            wx.showToast({
                title: '请完善统一身份信息',
                icon: 'none'
            })
            return
        }
        this.setData({
            edit_mode: true
        })
    },
    backup2Cloud: function () {
        if (!this.data.StuInfo['stu_id']) {
            wx.showToast({
                title: '请完善统一身份信息',
                icon: 'none'
            })
            return
        }
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
                curriculum_api.pushSelfSchedule(res.code, events).then(() => {
                    wx.showToast({
                        title: '备份成功',
                        icon: 'none'
                    })
                })
            },
            fail: () => {
                wx.showToast({
                    title: '登陆失败,请重新授权后重试',
                    icon: 'none'
                })
            }
        })
    },
    sync2Local: function () {
        if (!this.data.StuInfo['stu_id']) {
            wx.showToast({
                title: '请完善统一身份信息',
                icon: 'none'
            })
            return
        }
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
            fail: () => {
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
        // 支持中文逗号
        TeachingWeekFormat = TeachingWeekFormat.replaceAll('，', ',')
        PeriodFormat = PeriodFormat.replaceAll('，', ',')

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
        for (let item of curriculum_util.parseFormat(TeachingWeekFormat)) {
            if (!(item >= 1 && item <= 30)) {
                wx.showToast({
                    title: '周次取值为1-30',
                    icon: 'none'
                })
                return
            }
        }
        for (let item of curriculum_util.parseFormat(PeriodFormat)) {
            if (!(item >=1 && item <= 13)) {
                wx.showToast({
                    title: '时段取值为1-13',
                    icon: 'none'
                })
                return
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
    formCancel: function () {
        this.setData({
            edit_mode: false
        })
    },
})