const curriculum_util = require('../center/curriculum/curriculum_util')
const api = require('../../utils/api')
const util = require("../../utils/util");

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
                path: 'vacant_classroom',
                color: 'red',
                icon: 'location'
            },
        ],
        url: 'https://www.zhulegend.com',
        IndexImgPath: '',
    },

    onShow: function () {
        // 加载首页课程信息
        this.LoadCurriculumInfo()
    },
    loadSwiperList: function (HomePage) {
        // let swiperList = [{url: false}]
        let swiperList = []
        for (const url of HomePage['LocalPaths']) {
            swiperList.push({url: url})
        }
        this.setData({
            swiperList: swiperList,
            IndexImgPath: HomePage['IndexImgPath']
        })
    },
    LoadSwiperImg: function () {
        let that = this
        let HomePage = wx.getStorageSync('HomePage')
        // 每天检查一次是否发生更新,或者初始化
        if (!HomePage || new Date().toDateString() !== HomePage['LastCheck']) {
            api.getHomepageImgDate().then(res=>{
                if (!HomePage || HomePage['LastUpdate'] !== res.LastUpdate) {
                    HomePage = {}
                    HomePage['LastUpdate'] = res.LastUpdate
                    HomePage['PictureUrls'] = []
                    for (const pictureUrl of res.PictureUrls) {
                        HomePage['PictureUrls'].push(that.data.url + pictureUrl)
                    }
                    HomePage['LocalPaths'] = []
                    util.saveBatchImg(HomePage['PictureUrls']).then(values => {
                        HomePage['LocalPaths'] = values
                        wx.setStorageSync('HomePage', HomePage)
                        that.loadSwiperList(HomePage)
                    })
                    // 获取首页背景图
                    util.saveImg(util.IndexImgUrl).then(res => {
                        HomePage['IndexImgPath'] = res
                        wx.setStorageSync('HomePage', HomePage)
                        that.setData({
                            IndexImgPath: res
                        })
                    })
                }
            })
        }
        // 加载swiper
        if (HomePage && HomePage['LocalPaths']) {
            this.loadSwiperList(HomePage)
        }
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

    jumpToPicDetail: function (e) {
        console.log(e.currentTarget.dataset.item)
        wx.navigateTo({
            url: './ad/ad'
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
                title: "321CQU v2.1",
                content: "1.增加老校区空教室查询；2.修复课表合并问题；3.广场消息支持markdown语法，目前点击详情需要点击空白界面；4.图片采取本地缓存；小程序有许多隐藏功能，具体请查看我的/使用教程"
            })
            wx.setStorageSync('AppUse', true)
        }
        // 加载首页轮播图片
        this.LoadSwiperImg()
    },
})