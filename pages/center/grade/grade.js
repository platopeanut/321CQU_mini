const api = require('../../../utils/api')
const util = require('../../../utils/util')

Page({
    data: {
        uid: wx.getStorageSync('uid'),
        uid_pwd: wx.getStorageSync('uid_pwd'),
        stu_id: wx.getStorageSync('stu_id'),
        grade_list: [],
        term_list: [],
        curr_term: '',
        point_info: [],
        avg_point: 0,
        modalState: false,
        curr_mode: false,   // true为统计模式，false为普通模式
        more_state: false,
        identity: wx.getStorageSync('identity')
    },
    selectTerm: function(res) {
        this.setData({
            curr_term: res.target.dataset.id
        })
    },
    updateData: function() {
        let that = this
        this.setData({
            uid: wx.getStorageSync('uid'),
            uid_pwd: wx.getStorageSync('uid_pwd'),
            stu_id: wx.getStorageSync('stu_id'),
            identity: wx.getStorageSync('identity'),
        })
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

        wx.showLoading()
        if (this.data.identity === '本科生') {
            wx.login({
                success: function(res) {
                    api.getGrade(that.data.stu_id, that.data.uid, that.data.uid_pwd, res.code).then(res => {
                        wx.hideLoading()
                        if (res.statusCode === 200) {
                            if (res.data.Statue === 1) {
                                let grade_list = res.data.ScoreLog
                                let term_list = Object.keys(res.data.ScoreLog)
                                let gid = 0
                                for (const term_name of term_list) {
                                    for (let i = 0; i < grade_list[term_name].length; i++) {
                                        // 过滤四六级和未评教,缓登
                                        if (grade_list[term_name][i].CourseCredit===-1||!grade_list[term_name][i].EffectiveScoreShow || grade_list[term_name][i].CourseName === '大学英语(国家四级)' || grade_list[term_name][i].CourseName === '大学英语(国家六级)')
                                            continue
                                        grade_list[term_name][i]['select'] = true  // 每一项成绩用户是否选择，默认不选择
                                        grade_list[term_name][i]['gid'] = gid   // 每一项成绩id号
                                        gid ++

                                    }
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
                            } else {
                                util.showError(res)
                            }
                        } else {
                            wx.showToast({
                                title: `网络错误[${res.statusCode}]`,
                                icon: 'error'
                            })
                        }
                    })
                },
                fail: function() {
                    wx.hideLoading()
                    wx.showToast({
                        title: '登陆失败',
                        icon: 'error'
                    })
                }
            })
        } else if (this.data.identity === '研究生') {
            api.getPGGrade(this.data.uid, this.data.uid_pwd).then(res => {
                wx.hideLoading()
                if (res.statusCode === 200) {
                    if (res.data.Statue === 1) {
                        let _grade_list = res.data.ScoreLog
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
                    } else {
                        util.showError(res)
                    }
                } else {
                    wx.showToast({
                        title: `网络错误${res.statusCode}`,
                        icon: 'none'
                    })
                }
            })
        } else {
            wx.hideLoading()
            wx.showToast({
                title: '身份错误',
                icon: 'none'
            })
        }
    },
    onShow: function () {
        let grade_info = wx.getStorageSync('grade_info')
        this.setData({
            grade_list: grade_info.grade_list,
            term_list: grade_info.term_list,
            curr_term: grade_info.curr_term
        })
        if (grade_info === '') {
            wx.showToast({
            title: '没有记录可以尝试下拉刷新',
            icon: 'none'
            })
        }
    },
    onPullDownRefresh: function() {
        this.updateData()
        wx.stopPullDownRefresh()
    },
    score_analysis: function () {
        let that = this
        if (this.data.curr_mode) {
            this.setData({
                modalState: true
            })
            let grade_list = this.data.grade_list
            let term_list = this.data.term_list
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
                    let curr_point = util.score2point(item.EffectiveScoreShow)
                    if (!curr_credit || !curr_point) continue
                    credit += parseFloat(curr_credit)
                    point += parseFloat(curr_credit) * curr_point
                }
                point /= credit
                point = point.toFixed(4)
                point_list.push(point)
                credit_list.push(credit)
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
        wx.showToast({
            title: '功能待完善',
            icon: 'none'
        })
        // if (item.StudyNature !== '初修') continue
    },

    select_grade_item: function(e) {
        if (this.data.curr_mode) {
            let curr_item = e.currentTarget.dataset.item
            // 缓登，分数异常，四六级无法被选中
            if (curr_item.CourseCredit===-1||!curr_item.EffectiveScoreShow ||curr_item.CourseName === '大学英语(国家四级)' || curr_item.CourseName === '大学英语(国家六级)') return
            let grade_list = this.data.grade_list
            for (const term of this.data.term_list) {
                for (let i = 0; i < grade_list[term].length; i++) {
                    if (grade_list[term][i].gid === curr_item.gid) {
                        grade_list[term][i].select = !grade_list[term][i].select
                        break
                    }
                }
            }
            this.setData({
                grade_list: grade_list
            })
        }
    },
    first_select: function(e) {
        console.log(e)
    },

    second_select: function(e) {
        console.log(e)
    }
})