const curriculum_util = require('../center/curriculum/curriculum_util')
const api = require('../../utils/api')
const util = require("../../utils/util")

Page({

    data: {
        today_info: '',
        curriculum_info: '',
        gridCol: 2,
        // swiperList: [{url:false}],
        swiperList: [],
        iconList: [
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
                title: '升学通',
                path: 'sxt',
                color: 'green',
                icon: 'medal'
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
            {
                title: '志愿者时长',
                path: 'volunteer',
                color: 'pink',
                icon: 'newsfill'
            },
        ],
        url: 'https://www.zhulegend.com',
        IndexImgPath: '',
    },

    onShow: function () {
        // 加载首页课程信息
        this.LoadCurriculumInfo()
        console.log(wx.getStorageSync('HomePage'))
    },
    loadSwiperList: function () {
        let HomePage = wx.getStorageSync('HomePage')
        util.saveBatchFile(HomePage['Pictures'].filter(value => {
            return !value.Local
        })).then(values => {
            for (let value of values) {
                HomePage['Pictures'][value.id].Url = value.path
                HomePage['Pictures'][value.id].Local = true
            }
            wx.setStorageSync('HomePage', HomePage)
        })
        this.setData({
            swiperList: HomePage['Pictures'],
            IndexImgPath: HomePage['IndexImgPath']
        })
    },
    LoadSwiperImg: function () {
        let that = this
        let HomePage = wx.getStorageSync('HomePage')
        // 1.当没有缓存（清除缓存或更新后）2.有缓存且时间到了
        if (!HomePage || (new Date().toDateString() !== HomePage['LastCheck'] && new Date().getHours() > 6)) {
            console.log('local check pass')
            if (!HomePage) HomePage = {}
            HomePage['LastCheck'] = new Date().toDateString()
            api.getHomepageImgData().then(res=>{
                if (!HomePage || HomePage['LastUpdate'] !== res.LastUpdate) {
                    console.log('remote check pass')
                    HomePage['LastUpdate'] = res.LastUpdate
                    HomePage['Pictures'] = []
                    let cnt = 0;
                    for (const item of res.Pictures) {
                        HomePage['Pictures'].push({
                            'Url': that.data.url + item.Url,
                            'ContentUrl': item.JumpType === 'md'? that.data.url + item.ContentUrl : item.ContentUrl,
                            'Local': false,     // pic是否本地化
                            'LocalContent': false,   // pic对应的content是否本地化
                            'JumpType': item.JumpType,
                            'Id': cnt
                        })
                        cnt ++
                    }
                    wx.setStorageSync('HomePage', HomePage)
                    that.loadSwiperList()
                    // 获取首页背景图
                    util.saveFile(util.IndexImgUrl).then(res => {
                        HomePage['IndexImgPath'] = res.path
                        that.setData({
                            IndexImgPath: res.path
                        })
                    }).finally(()=>{
                        wx.setStorageSync('HomePage', HomePage)
                    })
                }
                else {
                    wx.setStorageSync('HomePage', HomePage)
                    that.loadSwiperList()
                }
            })
        } else this.loadSwiperList()
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
        let item = e.currentTarget.dataset.item
        if (item.JumpType === 'md') {
            wx.navigateTo({
                url: './ad/ad?Id=' + item.Id
            })
        } else if (item.JumpType === 'mk') {
            let mk_name = item.ContentUrl.slice(0, -3)
            wx.navigateTo({
                url: `../center/${mk_name}/${mk_name}`
            })
        }
    },

    previewImg: function () {
        let urls = []
        for (let item of this.data.swiperList) {
            urls.push(item.Url)
        }
        wx.previewImage({
            // current: '',
            urls: urls
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
            // 清除之前的文件缓存
            wx.getSavedFileList({
                success: result => {
                    result.fileList.forEach(value=>{
                        wx.removeSavedFile({
                            filePath: value.filePath
                        })
                        console.log('remove', value.filePath)
                    })
                }
            })
            wx.showModal({
                title: "321CQU v2.2",
                content: "1. 新增图书查询，图书收藏（暂不支持云端备份）;2.优化考试安排"
            })
            wx.setStorageSync('AppUse', true)
        }
        // 加载首页轮播图片
        this.LoadSwiperImg()
    },
})