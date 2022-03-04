const util = require('../../utils/util')

Page({

    data: {
        today_info: '',
        curriculum_info: '',
        gridCol: 2,
        swiperList: [{
            id: 0,
            url: 'http://gbpxzx.cqu.edu.cn/__local/0/18/75/C474505E6FF65D03DD8716A2496_D609F844_4EA8A.jpg'
          }, {
            id: 1,
            url: 'http://gbpxzx.cqu.edu.cn/__local/1/C4/57/47D1111C085D0FA365CADBB7694_2441C4C0_285E2.jpg',
          }],
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
                title: '生活',
                path: 'life',
                color: 'yellow',
                icon: 'baby'
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
            today_info: `第${today_info.week}周 ${"星期" + "日一二三四五六".split(/(?!\b)/)[today_info.today]}`,
            curriculum_info: curriculum_info?curriculum_info:'今日无课'
        })
    },

    onShareAppMessage: function () {

    },
    jumpToCurriculum: function () {
        wx.navigateTo({
            url: '../center/curriculum/curriculum'
        })
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

    saveImg: function (e) {
        wx.downloadFile({
            url: e.target.dataset.url,     //仅为示例，并非真实的资源
            success: function (res) {
                // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
                if (res.statusCode === 200) {
                    wx.saveImageToPhotosAlbum({
                        filePath: res.tempFilePath,
                        success(res) {
                            wx.showToast({
                                title: '已保存',
                                icon: 'none'
                            })
                        },
                        fail(res) {
                            wx.showToast({
                                title: '保存失败',
                                icon: 'none'
                            })
                        }
                    })
                } else {
                    wx.showToast({
                        title: '网络错误',
                        icon: 'none'
                    })
                }
            }
        })
    }
})