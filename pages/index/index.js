const curriculum_util = require('../center/curriculum/curriculum_util')
const api = require('../../utils/api')

Page({

    data: {
        today_info: '',
        curriculum_info: '',
        gridCol: 2,
        // swiperList: [{url:false}],
        swiperList: [],
        iconList: [
            // {
            //     title: '反馈',
            //     path: 'feedback',
            //     color: 'green',
            //     icon: 'comment'
            // },
            {
                title: '支持我们',
                path: 'sponsor',
                color: 'brown',
                icon: 'sponsor'
            },
            {
                title: '志愿者时长',
                path: 'volunteer',
                color: 'pink',
                icon: 'newsfill'
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
            // {
            //     title: '信息广场',
            //     path: 'square',
            //     color: 'red',
            //     icon: 'wefill'
            // },
            {
                title: '任务管理',
                path: 'task',
                color: 'blue',
                icon: 'deliver'
            },
            {
                title: '图书馆',
                path: 'library',
                color: 'green',
                icon: 'read'
            },
            {
                title: '空教室',
                path: 'empty_classroom',
                color: 'red',
                icon: 'location'
            },
        ],
        url: 'https://www.zhulegend.com',
        // IndexImgUrl: wx.getStorageSync('IndexImgUrl')
        IndexImgUrl: 'https://www.zhulegend.com/media/background.jpg',
    },

    onShow: function () {
        // 加载首页课程信息
        this.LoadCurriculumInfo()
        // 加载首页背景图片
        // let IndexImgUrl = wx.getStorageSync('IndexImgUrl')
        // if (IndexImgUrl === '') {
        //     util.saveImg('https://www.zhulegend.com/media/background.jpg', 'IndexImgUrl')
        // } else {
        //     this.setData({
        //         IndexImgUrl: IndexImgUrl
        //     })
        // }
    },

    LoadSwiperImg: function () {
        let that = this
        let HomePage = wx.getStorageSync('HomePage')
        api.getHomepageImgDate().then(res=>{
            if (HomePage['LastUpdate'] !== res.LastUpdate) {
                HomePage = {}
                HomePage['LastUpdate'] = res.LastUpdate
                HomePage['PictureUrls'] = res.PictureUrls
                wx.setStorageSync('HomePage', HomePage)
            }
            // let swiperList = [{url: false}]
            let swiperList = []
            for (const url of HomePage['PictureUrls']) {
                swiperList.push({url: that.data.url + url})
            }
            this.setData({
                swiperList: swiperList
            })
        })
    },

    LoadCurriculumInfo: function () {
        let index_info = curriculum_util.getIndexInfo()
        let today_info = index_info.today_info
        let curriculum_info = index_info.curriculum_info
        this.setData({
            today_info: `第${today_info.week}周 ${"星期" + "日一二三四五六".split(/(?!\b)/)[today_info.today]}`,
            curriculum_info: curriculum_info?curriculum_info:'今日无课',
        })
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
            fail: function() {
                wx.showToast({
                    title: '跳转失败',
                    icon: 'none'
                })
            }
        })
    },

    onLoad: function() {
        let AppUse = wx.getStorageSync('AppUse')
        if (AppUse === '') {
            wx.showModal({
                title: "使用说明",
                content: "欢迎使用321CQU，您遇到什么问题或有什么建议请及时反馈"
            })
            wx.setStorageSync('AppUse', true)
        }
        // 加载首页轮播图片
        this.LoadSwiperImg()
    },

    // saveImg: function (e) {
    //     wx.downloadFile({
    //         url: e.target.dataset.url,     //仅为示例，并非真实的资源
    //         success: function (res) {
    //             // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
    //             if (res.statusCode === 200) {
    //                 wx.saveImageToPhotosAlbum({
    //                     filePath: res.tempFilePath,
    //                     success(res) {
    //                         wx.showToast({
    //                             title: '已保存',
    //                             icon: 'none'
    //                         })
    //                     },
    //                     fail(res) {
    //                         wx.showToast({
    //                             title: '保存失败',
    //                             icon: 'none'
    //                         })
    //                     }
    //                 })
    //             } else {
    //                 wx.showToast({
    //                     title: '网络错误',
    //                     icon: 'none'
    //                 })
    //             }
    //         }
    //     })
    // }
})