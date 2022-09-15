const curriculum_util = require('../center/curriculum/curriculum_util')
const api = require('../../utils/api')
const util = require("../../utils/util")
// const shi_ci = require("../../lib/jinrishici")

Page({

    data: {
        class_info: null,
        loading_lock: true,
        gridCol: 2,
        swiperList: [],
        // otherList: [],
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
        picture_url: 'https://picture.zhulegend.com',
        IndexImgPath: '',
        TEST_DATA: '',
    },

    onShow: function () {
        // 加载首页课程信息
        this.LoadCurriculumInfo()
        this.setData({loading_lock: false})
        console.log(wx.getStorageSync('HomePage'))
        let StuInfo = wx.getStorageSync('StuInfo')
        console.log(StuInfo)
        this.setData({
            TEST_DATA: JSON.stringify(StuInfo)
        })
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
        const fs = wx.getFileSystemManager()
        this.setData({
            swiperList: HomePage['Pictures'],
            IndexImgPath: fs.readFileSync(HomePage['IndexImgPath'], 'base64')
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
                            'Url': that.data.picture_url + item.Url,
                            'ContentUrl': item.JumpType === 'md'? that.data.url + item.ContentUrl : item.ContentUrl,
                            'Local': false,     // pic是否本地化
                            'LocalContent': false,   // pic对应的content是否本地化
                            'JumpType': item.JumpType,
                            'Id': cnt
                        })
                        cnt ++
                    }
                    wx.setStorageSync('HomePage', HomePage)
                    // 获取首页背景图
                    util.saveFile(util.IndexImgUrl).then(res => {
                        HomePage['IndexImgPath'] = res.path
                        that.setData({
                            IndexImgPath: res.path
                        })
                    }).finally(()=>{
                        wx.setStorageSync('HomePage', HomePage)
                        that.loadSwiperList()
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
        if (!index_info) return
        let today_info;
        if (index_info.display_week !== index_info.week)
            today_info = `第${index_info.display_week}:${index_info.week}周 星期${index_info.today}`
        else today_info = `第${index_info.week}周 星期${index_info.today}`
        let class_info = {
            'today_info': today_info,
            'classes': [],
            'index': curriculum_util.getLessonIndex({
                hour: new Date().getHours(),
                minute: new Date().getMinutes()
            })
        }
        if (class_info['index'] === -1) class_info['index'] = index_info.classes.length;
        let flag = true
        for (let i = class_info['index']; i < index_info.classes.length; i++) {
            if (index_info.classes[i]) {
                flag = false
                break
            }
        }
        if (flag) class_info['index'] = index_info.classes.length;
        flag = true
        for (let i = 0; i < index_info.classes.length; i++) {
            if (index_info.classes[i]) {
                let time_li = curriculum_util.getTimeFromIndex(i)
                let item = {
                    'StartTime': time_li[0],
                    'EndTime': time_li[1],
                    'CourseName': index_info.classes[i][0]['CourseName']
                };
                if (!index_info.classes[i][0]['Self'])
                    item['RoomName'] = index_info.classes[i][0]['RoomName']
                class_info['classes'].push(item)

                if (flag && i >= class_info['index']) {
                    class_info['index'] = class_info['classes'].length - 1
                    flag = false
                }
            }
        }
        if (class_info['index'] === index_info.classes.length) {
            class_info['classes'].push("\n今日无课")
            class_info['index'] = class_info['classes'].length - 1
        }
        // merge
        let merge_classes = []
        for (let i = 0; i < class_info['classes'].length; i++) {
            if (merge_classes.length === 0 || merge_classes[merge_classes.length-1]['CourseName'] !== class_info['classes'][i]['CourseName'])
                merge_classes.push(class_info['classes'][i])
            else if (merge_classes[merge_classes.length-1]['CourseName'] === class_info['classes'][i]['CourseName']) {
                merge_classes[merge_classes.length-1]['EndTime'] = class_info['classes'][i]['EndTime']
            }
            if (i === class_info['index']) {
                class_info['index'] = merge_classes.length - 1
            }
        }
        class_info['classes'] = merge_classes
        this.setData({ class_info: class_info })
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
            if (item.url) urls.push(item.Url)
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
                title: "321CQU v2.5.1",
                content: "更新内容：\n1. 2022级本科生课表适配（前往课表配置界面开启）\n2. 首页课表支持左右滑动\n3. 课表界面支持左右滑动\n4. 修复信息绑定部分问题"
            })
            wx.setStorageSync('AppUse', true)
        }
        // 加载首页轮播图片
        this.LoadSwiperImg()
        // api.sentenceADay()
        // shi_ci.load(result => {
        //     let poetry = {
        //         'content': result.data['content'],
        //         'author': result.data['origin']['author'],
        //         'dynasty': result.data['origin']['dynasty'],
        //         'title': result.data['origin']['title']
        //     }
        //     let otherList = that.data.otherList
        //     otherList[0] = poetry
        //     that.setData({
        //         otherList: otherList
        //     })
        // })
    },
})