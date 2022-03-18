const class_info_api = require('../class_info_api')

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

    compute_level: function (item, year) {
        let distributed = []
        let level_list = [95, 85, 75, 65, 50]
        let average
        let max = ''
        let min = ''
        let _all = 0
        let _num = 0
        for (let i = level_list.length - 1; i >= 0; i--) {
            distributed.push(item[i + 3])
            _all += item[i + 3] * level_list[i]
            _num += item[i + 3]
        }
        for (let i = 0; i < distributed.length; i++) {
            distributed[i] /= _num
            distributed[i] *= 100
            distributed[i] = distributed[i].toFixed(0)
        }
        average = (_all / item[2]).toFixed(2)
        // 区分两级制和五级制
        if (item[3] === 0 && item[5] === 0 && item[6] === 0) {
            // 两级制
            if (item[4] === 0 && item[7] !== 0) {
                max = min = '不合格'
            } else if (item[4] !== 0 && item[7] === 0) {
                max = min = '合格'
            } else if (item[4] !== 0 && item[7] !== 0) {
                max = '合格'
                min = '不合格'
            }
        } else {
            // 五级制
            let text_list = ['优', '良', '中', '及格', '不及格']
            for (let i = 0; i < 5; i++) {
                if (item[i + 3] > 0) {
                    max = text_list[i]
                    break
                }
            }
            for (let i = 4; i >= 0; i--) {
                if (item[i + 3] > 0) {
                    min = text_list[i]
                    break
                }
            }
        }
        return {
            year: year,
            average: average,
            num: item[2],
            max: max,
            min: min,
            distributed: distributed
        }
    },


    query: function () {
        let that = this
        class_info_api.queryClassDetail(this.data.class_id).then(res => {
            let CourseScore = res.CourseScore
            let IsHierarchy = res.IsHierarchy
            console.log(res)
            let teacher_dict = {}
            for (const year in CourseScore) {
                // 分数制
                if (IsHierarchy[year] === 0) {
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
                else if (IsHierarchy[year] === 1) {
                    // 等级制
                    for (const item of CourseScore[year]) {
                        if (item[0] === '') continue
                        let result = that.compute_level(item, year)
                        if (teacher_dict[item[0]]) {
                            teacher_dict[item[0]]['info'].push(result)
                        } else {
                            teacher_dict[item[0]] = {}
                            teacher_dict[item[0]]['state'] = false
                            teacher_dict[item[0]]['info'] = [result]
                        }
                    }
                }
                else {
                    wx.showToast({
                        title: 'Hierarchy Error!',
                        icon: 'none'
                    })
                }
            }
            console.log(teacher_dict)
            that.setData({
                teacher_dict: teacher_dict
            })
        })
    },

    onLoad(e) {
        this.setData({
            class_name: e.Cname,
            class_id: e.Cid
        })
        this.query()
    }
})