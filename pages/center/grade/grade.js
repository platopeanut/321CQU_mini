const grade_api = require('./grade_api')
const grade_util = require('./grade_util')

Page({
    data: {
        uid: '',
        uid_pwd: '',
        stu_id: '',
        identity: '',

        grade_list: [],
        term_list: [],
        curr_term: '',
        point_info: [],
        avg_point: 0,
        modalState: false,
        curr_mode: false,   // true为统计模式，false为普通模式
        more_state: false,
        calculation_rule: wx.getStorageSync('calculation_rule')?wx.getStorageSync('calculation_rule'):'four',
        user_grade_config: wx.getStorageSync('user_grade_config')?wx.getStorageSync('user_grade_config'):{},
        more_analysis_config_first: [],
        more_analysis_config_second: [],
        course_conflict_warning: false,
        course_conflict_warning_course_code: '',
        official_grade: '',
    },

    user_grade_config_process: function () {
        let grade_list = this.data.grade_list
        let user_grade_config =this.data.user_grade_config
        // 用户自定义配置
        for (const term in user_grade_config) {
            for (const curr_item of user_grade_config[term]) {
                for (const item of grade_list[term]) {
                    if (curr_item.CourseCode === item.CourseCode) {
                        item.select = curr_item.select
                    }
                }
            }
        }
        this.setData({
            grade_list: grade_list
        })
    },
    more_analysis_config_process: function (list, index) {
        let target = null
        if (index === 0) target = 'CourseNature'
        else if (index === 1) target = 'StudyNature'
        let grade_list = this.data.grade_list
        for (const key in grade_list) {
            for (const item of grade_list[key]) {
                if (item.CourseCredit===-1||!item.EffectiveScoreShow || item.CourseName === '大学英语(国家四级)' || item.CourseName === '大学英语(国家六级)')
                    continue
                item.select = list.includes(item[target])
            }
        }
        this.setData({
            grade_list: grade_list
        })
    },
    // 选择绩点是四分制计算还是五分制计算
    select_calculation_rule: function (e) {
        this.setData({
            calculation_rule: e.detail.value
        })
        wx.setStorageSync('calculation_rule', this.data.calculation_rule)
    },
    // 选择学期
    selectTerm: function(res) {
        this.setData({
            curr_term: res.target.dataset.id
        })
    },
    // 刷新成绩
    updateData: function() {
        let that = this
        if (this.data.identity === '') {
            wx.showToast({
                title: '请先绑定学号，统一身份信息',
                icon: 'none'
            })
            return
        }
        if (this.data.identity === '本科生') {
            if (this.data.stu_id === '' || this.data.uid === '' || this.data.uid_pwd === '') {
                wx.showToast({
                    title: '请先绑定学号，统一身份认证账号及密码',
                    icon: 'none'
                })
                return
            }
        } else if (this.data.identity === '研究生') {
            if (this.data.uid === '' || this.data.uid_pwd === '') {
                wx.showToast({
                    title: '请先绑定统一身份认证账号及密码',
                    icon: 'none'
                })
                return
            }
        }
        if (this.data.identity === '本科生') {
            // 查询绩点和排名
            grade_api.getGpaAndRank(that.data.uid, that.data.uid_pwd).then(res => {
                wx.setStorageSync('official_grade', res.GpaRanking)
                that.setData({
                    official_grade: res.GpaRanking
                })
                wx.showToast({
                    title: '排名查询成功',
                    icon: 'none'
                })
            })
            wx.login({
                success: function(res) {
                    grade_api.getUGGrade(that.data.stu_id, that.data.uid, that.data.uid_pwd, res.code).then(res => {
                        let grade_list = res.ScoreLog
                        let term_list = Object.keys(res.ScoreLog)
                        let gid = 0
                        for (const term_name of term_list) {
                            for (let i = 0; i < grade_list[term_name].length; i++) {
                                // 过滤四六级和未评教,缓登
                                if (grade_list[term_name][i].CourseCredit===-1||!grade_list[term_name][i].EffectiveScoreShow || grade_list[term_name][i].CourseName === '大学英语(国家四级)' || grade_list[term_name][i].CourseName === '大学英语(国家六级)')
                                    continue
                                grade_list[term_name][i]['select'] = true  // 每一项成绩用户是否选择，默认选择
                                grade_list[term_name][i]['gid'] = gid   // 每一项成绩id号
                                gid ++

                            }
                        }
                        // 默认选中重修，不选对应的初修
                        // ???
                        that.setData({
                            grade_list: grade_list,
                            term_list: term_list
                        })
                        let curr_term = that.data.term_list[0]
                        that.setData({
                            curr_term: curr_term
                        })
                        // 本地缓存
                        let grade_info = {
                            grade_list: that.data.grade_list,
                            term_list: that.data.term_list,
                            curr_term: that.data.curr_term
                        }
                        wx.setStorageSync('grade_info', grade_info)
                        that.user_grade_config_process()
                        wx.showToast({
                            title: '成绩查询成功',
                            icon: 'none'
                        })
                    })
                },
                fail: function() {
                    wx.showToast({
                        title: '登陆失败',
                        icon: 'error'
                    })
                }
            })
        } else if (this.data.identity === '研究生') {
            grade_api.getPGGrade(this.data.uid, this.data.uid_pwd).then(res => {
                let _grade_list = res.ScoreLog
                let grade_list = {}
                let term_list = []
                let gid = 0
                for (const item of _grade_list) {
                    let term_name = `第${item.Year}学年${item.Term}`
                    if (!term_list.includes(term_name)) {
                        term_list.push(term_name)
                        grade_list[term_name] = []
                    }
                    let curr_item = {
                        'CourseName': item.Cname,
                        'CourseCode' : item.Cid,
                        'CourseCredit' : item.Credit,
                        'EffectiveScoreShow': item.Score
                    }
                    // 过滤四六级和未评教,缓登
                    if (item.Credit===-1||!item.Score || item.Cname === '大学英语(国家四级)' || item.Cname === '大学英语(国家六级)') {
                        grade_list[term_name].push(curr_item)
                        continue
                    }
                    curr_item['select'] = true  // 每一项成绩用户是否选择，默认不选择
                    curr_item['gid'] = gid   // 每一项成绩id号
                    gid ++
                    grade_list[term_name].push(curr_item)
                }
                that.setData({
                    grade_list: grade_list,
                    term_list: term_list
                })
                let curr_term = that.data.term_list[0]
                that.setData({
                    curr_term: curr_term
                })
                // 本地缓存
                let grade_info = {
                    grade_list: that.data.grade_list,
                    term_list: that.data.term_list,
                    curr_term: that.data.curr_term
                }
                wx.setStorageSync('grade_info', grade_info)
                that.user_grade_config_process()
                wx.showToast({
                    title: '成绩查询成功',
                    icon: 'none'
                })
            })
        } else {
            wx.showToast({
                title: '身份错误',
                icon: 'none'
            })
        }
    },
    onShow: function () {
        let StuInfo = wx.getStorageSync('StuInfo')
        this.setData({
            uid: StuInfo['uid'],
            uid_pwd: StuInfo['uid_pwd'],
            stu_id: StuInfo['stu_id'],
            identity: StuInfo['identity'],
        })
        let grade_info = wx.getStorageSync('grade_info')
        this.setData({
            grade_list: grade_info.grade_list,
            term_list: grade_info.term_list,
            curr_term: grade_info.curr_term,
            official_grade: wx.getStorageSync('official_grade')
        })
        if (grade_info === '') {
            wx.showToast({
            title: '没有记录可以尝试下拉刷新',
            icon: 'none'
            })
        }
        this.user_grade_config_process()
    },
    onPullDownRefresh: function() {
        this.updateData()
        wx.stopPullDownRefresh()
    },
    score_analysis: function () {
        let that = this
        if (this.data.curr_mode) {
            this.setData({
                modalState: true,
                course_conflict_warning: false,
                course_conflict_warning_course_code: ''
            })
            let grade_list = this.data.grade_list
            let term_list = this.data.term_list
            // 用户自定义配置
            // this.user_grade_config_process()
            wx.setStorageSync('user_grade_config', this.data.user_grade_config)
            let point_list = []
            let credit_list = []
            for (let i = 0; i < term_list.length; i++) {
                let term = term_list[i]
                let point = 0
                let credit = 0
                for (let j = 0; j < grade_list[term].length; j++) {
                    let item = grade_list[term][j]
                    // 过滤项
                    if (!item.select) continue
                    let curr_credit = item.CourseCredit
                    let curr_point = grade_util.score2point(item.EffectiveScoreShow, this.data.calculation_rule)
                    // 考虑重修
                    if (item.StudyNature!==undefined && item.StudyNature === '重修') {
                        if (curr_point >= 1.0) {
                            curr_point = 1.0
                        }
                    }
                    if (!curr_credit || !curr_point) continue
                    credit += parseFloat(curr_credit)
                    point += parseFloat(curr_credit) * curr_point
                }
                point /= credit
                point = point.toFixed(4)
                point_list.push(point)
                credit_list.push(credit)
            }
            // 检测重修课程与对应初修课程是否同时被选中
            if (that.data.identity === '本科生') {
                for (const term of term_list) {
                    for (const item of grade_list[term]) {
                        if (!item.select) continue
                        if (item.StudyNature === '重修') {
                            for (const curr_term of term_list) {
                                for (const curr_item of grade_list[curr_term]) {
                                    if (!curr_item.select) continue
                                    if (curr_item.CourseCode === item.CourseCode && curr_item.StudyNature === '初修') {
                                        that.setData({
                                            course_conflict_warning: true,
                                            course_conflict_warning_course_code: curr_item.CourseCode
                                        })
                                        break
                                    }
                                }
                            }
                        }
                    }
                }
            }


            let avg_point = 0
            let credit_sum = 0
            for (let i = 0; i < point_list.length; i++) {
                avg_point += point_list[i] * credit_list[i]
                credit_sum += credit_list[i]
            }
            avg_point /= credit_sum
            avg_point = avg_point.toFixed(4)
            let point_info = []
            for (let i = 0; i < point_list.length; i++) {
                point_info.push({
                    point: point_list[i],
                    credit: credit_list[i],
                    term: term_list[i]
                })
            }
            this.setData({
                point_info: point_info,
                avg_point: avg_point
            })
            // 缓存
            let grade_info = {
                grade_list: that.data.grade_list,
                term_list: that.data.term_list,
                curr_term: that.data.curr_term
            }
            wx.setStorageSync('grade_info', grade_info)
        } else {
            this.setData({
                curr_mode: true
            })
            wx.showToast({
              title: '进入统计模式',
              icon: 'none'
            })
        }
    },

    hideModal: function () {
        this.setData({
            modalState: false,
            more_state: false,
        })
    },

    exit_analysis: function() {
        this.setData({
            curr_mode: false
        })
        wx.showToast({
          title: '退出统计模式',
          icon: 'none'
        })
    },

    more_analysis: function() {
        this.setData({
            more_state: true
        })
    },

    select_grade_item: function(e) {
        if (this.data.curr_mode) {
            let curr_item = e.currentTarget.dataset.item
            // 缓登，分数异常，四六级无法被选中
            if (curr_item.CourseCredit===-1||!curr_item.EffectiveScoreShow ||curr_item.CourseName === '大学英语(国家四级)' || curr_item.CourseName === '大学英语(国家六级)') return
            // 在user_grade_config中修改
            let user_grade_config = this.data.user_grade_config
            let curr_term = this.data.curr_term
            if (!user_grade_config[curr_term]) {
                user_grade_config[curr_term] = []
            }
            let exist = false
            // console.log(user_grade_config[curr_item])
            for (const item of user_grade_config[curr_term]) {
                if (curr_item.CourseCode === item.CourseCode) {
                    exist = true
                    item.select = !item.select
                    break
                }
            }
            if (!exist) {
                user_grade_config[curr_term].push({
                    CourseCode: curr_item.CourseCode,
                    select: !curr_item.select
                })
            }
            this.setData({
                user_grade_config: user_grade_config
            })
            this.user_grade_config_process()
            // let grade_list = this.data.grade_list
            // for (const term of this.data.term_list) {
            //     for (let i = 0; i < grade_list[term].length; i++) {
            //         if (grade_list[term][i].gid === curr_item.gid) {
            //             grade_list[term][i].select = !grade_list[term][i].select
            //             break
            //         }
            //     }
            // }
            // this.setData({
            //     grade_list: grade_list
            // })
        }
    },
    first_select: function(e) {
        if (this.data.identity === '研究生') {
            wx.showToast({
                title: '该功能对研究生无效',
                icon: 'none'
            })
            return
        }
        this.setData({
            more_analysis_config_first: e.detail.value
        })
        this.more_analysis_config_process(this.data.more_analysis_config_first, 0)
    },

    second_select: function(e) {
        if (this.data.identity === '研究生') {
            wx.showToast({
                title: '该功能对研究生无效',
                icon: 'none'
            })
            return
        }
        this.setData({
            more_analysis_config_second: e.detail.value
        })
        this.more_analysis_config_process(this.data.more_analysis_config_second, 1)
    }
})