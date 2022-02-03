Page({

    data: {
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
                title: '排名',
                path: 'rank',
                color: 'purple',
                icon: 'rankfill'
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