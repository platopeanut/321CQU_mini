const util = require('../../utils/util')

Page({

    data: {
        today_info: '',
        curriculum_info: '',
        gridCol: 2,
        iconList: [
            {
                title: '志愿者时长',
                path: 'volunteer',
                color: 'pink',
                icon: 'newsfill'
            },
            {
                title: '反馈',
                path: 'feedback',
                color: 'green',
                icon: 'comment'
            },
            {
                title: '任务管理',
                path: 'task',
                color: 'blue',
                icon: 'deliver'
            },
            {
                title: '课表',
                path: 'curriculum',
                color: 'orange',
                icon: 'calendar'
            },
            {
                title: '成绩查询',
                path: 'grade',
                color: 'cyan',
                icon: 'search'
            },
            {
                title: '考试',
                path: 'exam',
                color: 'olive',
                icon: 'time'
            },
            {
                title: '查课',
                path: 'class_info',
                color: 'purple',
                icon: 'list'
            },
            {
                title: '支持我们',
                path: 'sponsor',
                color: 'brown',
                icon: 'sponsor'
            },
        ],
    },

    onShow: function () {
        let index_info = util.get_index_info()
        let today_info = index_info.today_info
        let curriculum_info = index_info.curriculum_info
        this.setData({
            today_info: `${today_info.year}年${today_info.month}月${today_info.day}日 第${today_info.week}周 ${"星期" + "日一二三四五六".split(/(?!\b)/)[today_info.today]}`,
            curriculum_info: curriculum_info?curriculum_info:'今日无课'
        })
    },

    onShareAppMessage: function () {

    },

    router: function (e) {
        let path = e.currentTarget.dataset.path
        wx.navigateTo({
            url: '../center/' + path + '/' + path,
            fail: function(res) {
                wx.showToast({
                    title: '跳转失败',
                    icon: 'none'
                })
            }
        })
    },

    onLoad: function() {
        wx.getStorage({
            key: 'has_used',
            fail: function(res) {
                wx.showModal({
                    title: "使用说明",
                    content: "1. 仅适用于重庆大学学生进行志愿者时长查询\n2.所有用户相关数据均在本地存储，我们未通过小程序收集用户个人数据\n3.有什么问题请在反馈中及时反馈"
                })
                wx.setStorage({
                    key: 'has_used',
                    value: true
                })
            }
        })
    },
})