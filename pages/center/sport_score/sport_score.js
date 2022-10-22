const sport_score_api = require('sport_score_api')

Page({

    data: {
        relatedLinks: [
            'http://tzcs.cqu.edu.cn/student/findPassword.jsp',
            'http://tzcs.cqu.edu.cn/servlet/adminservlet'
        ],
        baseInfo: {},
        scores: [],
    },

    onShow: function () {
        this.updateData()
    },

    copyLink: function (e) {
        let that = this
        wx.setClipboardData({
            data: that.data.relatedLinks[e.currentTarget.dataset.index]
        })
    },

    setBaseInfo: function (rawScores) {
        if (rawScores.length === 0) return
        let baseInfo = {
            '学号': rawScores[0]['Username'],
            '序号': rawScores[0]['StuNo'],
            '性别': rawScores[0]['Sex']
        }
        this.setData({
            baseInfo: baseInfo,
        })
    },

    switchDetailInfo: function (e) {
        let that = this
        let StuInfo = wx.getStorageSync('StuInfo')
        let stu_id = StuInfo['stu_id']
        let sport_pwd = StuInfo['sport_pwd']
        let scores = this.data.scores
        let index = e.currentTarget.dataset.index
        // lazy loading
        if (!scores[index]['detail']) {
            sport_score_api.getSportScoreDetail(
                stu_id,
                sport_pwd,
                scores[index]['StuNo'],
                scores[index]['AcademicYear'],
                scores[index]['Term'],
                scores[index]['Grade'],
                scores[index]['Sex']
            ).then(res => {
                console.log(res)
                scores[index]['detail'] = res['Scores']
                scores[index]['state'] = !scores[index]['state']
                that.setData({
                    scores: scores
                })
                // [{Name, Result, Score, Level}]
            })
        }
        else {
            scores[index]['state'] = !scores[index]['state']
            that.setData({
                scores: scores
            })
        }
        console.log(this.data.scores[0]['detail'])
    },

    updateData: function () {
        let that = this
        let StuInfo = wx.getStorageSync('StuInfo')
        let stu_id = StuInfo['stu_id']
        let sport_pwd = StuInfo['sport_pwd']
        if (!(stu_id && sport_pwd)) {
            wx.showToast({
                title: '请先完善学号和体测密码信息',
                icon: 'none'
            })
            return
        }
        sport_score_api.getSportScoreList(stu_id, sport_pwd).then(res => {
            for (const item of res['Scores']) {
                item['state'] = false
            }
            that.setData({ scores: res['Scores'] })
            that.setBaseInfo(res['Scores'])
            console.log(that.data.scores)
        })
    },

    onPullDownRefresh: function () {
        wx.stopPullDownRefresh()
        this.updateData()
    }
})