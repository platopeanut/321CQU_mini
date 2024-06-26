const class_info_api = require('./class_info_api')

Page({

    data: {
        way_list: ['搜课程', '搜老师'],
        hint_list: ['请输入课程名称', '请输入老师名称'],
        curr_way: null,
        curr_hint: null,
        user_input: '',
        no_result_state: false,
        first_open_state: true,
        lesson_list: [],
        teacher_dict: {},
    },

    onShow: function () {
        let that = this
        let curr_way = wx.getStorageSync('class_info_curr_way')
        let curr_hint = that.data.hint_list[0]
        if (curr_way === '') curr_way = '搜课程'
        if (curr_way === '搜老师') curr_hint = that.data.hint_list[1]
        this.setData({
            curr_way: curr_way,
            curr_hint: curr_hint
        })
    },

    selectClassItem: function (e) {
        let curr_item = e.currentTarget.dataset.item
        wx.navigateTo({
            url: './detail/detail?Cid=' + curr_item.Cid
                + '&Cname=' + curr_item.Cname
                + '&isNew=' + (curr_item.isNew ? true : false)
        })
    },

    selectTeacherItem: function (e) {
        let name = e.currentTarget.dataset.index
        let teacher_dict = this.data.teacher_dict
        teacher_dict[name]['state'] = !teacher_dict[name]['state']
        this.setData({
            teacher_dict: teacher_dict
        })
    },

    selectWay: function (res) {
        let curr_way = res.target.dataset.id
        let curr_hint
        for (let i = 0; i < this.data.way_list.length; i++) {
            if (this.data.way_list[i] === curr_way) {
                curr_hint = this.data.hint_list[i]
                break
            }
        }
        wx.setStorageSync('class_info_curr_way', curr_way)
        this.setData({
            curr_way: curr_way,
            curr_hint: curr_hint
        })
    },

    queryInfo: function (e) {
        this.setData({
            user_input: e.detail.value
        })
    },

    validate: function () {
        let StuInfo = wx.getStorageSync('StuInfo')
        let stu_id = StuInfo['stu_id']
        let uid = StuInfo['uid']
        let uid_pwd = StuInfo['uid_pwd']
        if (!(stu_id && uid && uid_pwd)) {
            wx.showToast({
                title: '请绑定学号，统一身份账号及密码',
                icon: 'none'
            })
            return false
        }
        if (this.data.user_input === '') {
            wx.showToast({
                title: '输入不能为空',
                icon: 'none'
            })
            return false
        }
        return true
    },

    query: function () {
        if (!this.validate()) return;
        let that = this;
        this.setData({ first_open_state: false });
        if (this.data.curr_way === '搜课程') {
            class_info_api.queryClassInfoByClassName(this.data.user_input).then(res => {
                if (res.Courses.length !== 0) {
                    let lesson_list = []
                    for (const item of res.Courses) {
                        lesson_list.push({
                            Cid: item[0],
                            Cname: item[1]
                        })
                    }
                    that.setData({
                        no_result_state: false,
                        lesson_list: lesson_list,
                    })
                } else {
                    that.setData({
                        lesson_list: [],
                        teacher_dict: {},
                        no_result_state: true,
                    })
                }
            })
        }
        else if (this.data.curr_way === '搜老师') {
            class_info_api.queryClassInfoByTeacherName(this.data.user_input).then(res => {
                if (res.Courses.length !== 0) {
                    let teacher_dict = {}
                    for (const item of res.Courses) {
                        if (teacher_dict[item[0]]) {
                            teacher_dict[item[0]]['class_list'].push({
                                Cid: item[1],
                                Cname: item[2],
                            })
                        } else {
                            teacher_dict[item[0]] = {}
                            teacher_dict[item[0]]['state'] = false
                            teacher_dict[item[0]]['class_list'] = [{
                                Cid: item[1],
                                Cname: item[2],
                            }]
                        }
                    }
                    that.setData({
                        teacher_dict: teacher_dict,
                        no_result_state: false,
                    })
                }
                else {
                    that.setData({
                        lesson_list: [],
                        teacher_dict: {},
                        no_result_state: true,
                    })
                }
            })
        }
        else {
            wx.showToast({
                title: '查询方式错误',
                icon: 'none'
            })
        }
    },

    queryNew: function () {
        if (!this.validate()) return;
        let that = this;
        this.setData({ first_open_state: false });
        if (this.data.curr_way === '搜课程') {
            class_info_api.queryClassInfo(this.data.user_input, null).then(courses => {
                if (courses.length > 0) {
                    let lesson_list = []
                    for (const item of courses) {
                        lesson_list.push({
                            Cid: item.code,
                            Cname: item.name,
                            isNew: true
                        })
                    }
                    that.setData({
                        no_result_state: false,
                        lesson_list: lesson_list,
                    })
                }
                else {
                    that.setData({
                        lesson_list: [],
                        teacher_dict: {},
                        no_result_state: true,
                    })
                }
            })
        }
        else if (this.data.curr_way === '搜老师') {
            class_info_api.queryClassInfo(null, this.data.user_input).then(courses => {
                if (courses.length > 0) {
                    let teacher_dict = {}
                    for (const item of courses) {
                        if (teacher_dict[item['instructor']]) {
                            teacher_dict[item['instructor']]['class_list'].push({
                                Cid: item.code,
                                Cname: item.name,
                                isNew: true
                            })
                        } else {
                            teacher_dict[item['instructor']] = {}
                            teacher_dict[item['instructor']]['state'] = false
                            teacher_dict[item['instructor']]['class_list'] = [{
                                Cid: item.code,
                                Cname: item.name,
                                isNew: true
                            }]
                        }
                    }
                    that.setData({
                        teacher_dict: teacher_dict,
                        no_result_state: false,
                    })
                }
                else {
                    that.setData({
                        lesson_list: [],
                        teacher_dict: {},
                        no_result_state: true,
                    })
                }
            })
        }
        else {
            wx.showToast({
                title: '查询方式错误',
                icon: 'none'
            })
        }
    }
})