const api = require('../../../../utils/api')
const util = require('../../../../utils/util')

Page({

    data: {
        list: [
            {
                title: '[0,60)',
                name: 'red',
                color: '#e54d42'
            },
            {
                title: '[60,70)',
                name: 'orange',
                color: '#f37b1d'
            },
            {
                title: '[70,80)',
                name: 'olive',
                color: '#8dc63f'
            },
            {
                title: '[80,90)',
                name: 'cyan',
                color: '#1cbbb4'
            },
            {
                title: '[90,100]',
                name: 'blue',
                color: '#0081ff'
            }
        ],
        class_name: '',
        class_id: '',
        teacher_dict: {},
    },

    selectItem: function (e) {
        let index = e.currentTarget.dataset.index
        let teacher_dict = this.data.teacher_dict
        teacher_dict[index]['state'] = !teacher_dict[index]['state']
        this.setData({
            teacher_dict: teacher_dict
        })
    },

    query: function () {
        let that = this
        wx.showLoading()
        api.query_class_detail(this.data.class_id).then(res => {
            wx.hideLoading()
            if (res.statusCode === 200) {
                if (res.data.Statue === 1) {
                    let CourseScore = res.data.CourseScore
                    console.log(CourseScore)
                    let teacher_dict = {}
                    for (const year in CourseScore) {
                        for (const item of CourseScore[year]) {
                            if (item[0] === '') continue
                            let distributed = []
                            let _all = 0
                            for (let i = item.length - 1; i >= 6; i--) {
                                distributed.push(item[i])
                                _all += item[i]
                            }
                            for (let i = 0; i < distributed.length; i++) {
                                distributed[i] /= _all
                                distributed[i] *= 100
                                distributed[i] = distributed[i].toFixed(0)
                            }
                            if (teacher_dict[item[0]]) {
                                teacher_dict[item[0]]['info'].push({
                                    year: year,
                                    average: item[2]?item[2].toFixed(2):'null',
                                    num: item[3],
                                    max: item[4],
                                    min: item[5],
                                    distributed: distributed
                                    //     Average(Course.Term)	float	课程平均成绩
                                    // Num(Course.Term)	int	已知成绩人数
                                    // Max(Course.Term)	String	最优成绩
                                    // Min(Course.Term)
                                })
                            } else {
                                teacher_dict[item[0]] = {}
                                teacher_dict[item[0]]['state'] = false
                                teacher_dict[item[0]]['info'] = [{
                                    year: year,
                                    average: item[2]?item[2].toFixed(2):'null',
                                    num: item[3],
                                    max: item[4],
                                    min: item[5],
                                    distributed: distributed
                                }]
                            }
                        }
                    }
                    console.log(teacher_dict)
                    that.setData({
                        teacher_dict: teacher_dict
                    })
                } else {
                    util.showError(res)
                }
            } else {
                wx.showToast({
                    title: '网络错误' + res.statusCode,
                    icon: 'none'
                })
            }
        })
    },

    onLoad(e) {
        this.setData({
            class_name: e.Cname,
            class_id: e.Cid
        })
        this.query()
    },
    onShareAppMessage: function () {

    }
})