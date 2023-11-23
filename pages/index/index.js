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
                title: '订阅',
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
            {
                title: '体测查询',
                path: 'sport_score',
                color: 'brown',
                icon: 'footprint'
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
        let HomePage = wx.getStorageSync('HomePage');
        const items = HomePage['items'].filter(value => !value['local']);
        util.saveBatchFile(items).then(values => {
            for (let value of values) {
                items[value.id]['url'] = value.path;
                items[value.id]['local'] = true;
            }
            wx.setStorageSync('HomePage', HomePage)
        })
        const fs = wx.getFileSystemManager()
        this.setData({
            swiperList: HomePage['items'],
            IndexImgPath: fs.readFileSync(HomePage['IndexImgPath'], 'base64')
        })
    },
    LoadSwiperImg: async function () {

        function getItemID(it) {
            return it['img_pos'] + it['img_url'];
        }

        let that = this;
        const newItems = (await api.getHomepageImgData())['homepages'];
        const newIDs = new Set(newItems.map(it => getItemID(it)));

        let HomePage = wx.getStorageSync('HomePage');
        if (!HomePage) HomePage = { items: [] };

        // 过滤掉过时的item
        HomePage['items'] = HomePage['items'].filter(it => newIDs.has(getItemID(it)));
        // 补充新增的item
        const currIDs = new Set(HomePage['items'].map(it => getItemID(it)));
        for (const item of newItems) {
            if (currIDs.has(getItemID(item)))
                continue;
            item['url'] = item['img_url'];
            if (item['img_pos'] == 'LOCAL') {
                item['url'] = 'https://media.321cqu.com' + item['url'];
            }
            item['local'] = false;
            HomePage['items'].push(item);
        };
        // 获取首页背景图
        if (!HomePage['IndexImgPath']) {
            const res = await util.saveFile(util.IndexImgUrl);
            HomePage['IndexImgPath'] = res.path;
        }
        that.setData({ IndexImgPath: HomePage['IndexImgPath'] });
        wx.setStorageSync('HomePage', HomePage);
        console.log(HomePage);
        that.loadSwiperList();
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
                    'CourseName': index_info.classes[i][0]['CourseName'],
                    'PeriodFormat': index_info.classes[i][0]['PeriodFormat'],
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
        let item = e.currentTarget.dataset.item;
        const params = JSON.parse(item['jump_param']);
        if (item['jump_type'] === 'MD') {
            console.log(this.data.url + params.url);
            wx.navigateTo({
                url: './ad/ad?url=' + (params.pos === 'local' ? 'https://media.321cqu.com' + params.url : params.url)
            })
        }
        else if (item['jump_type'] === 'WECHAT_MINI_PROGRAM') {
            wx.navigateToMiniProgram({
                appId: params.appid
            });
        }
        // else if (item.JumpType === 'mk') {
        //     let mk_name = item.ContentUrl.slice(0, -3)
        //     wx.navigateTo({
        //         url: `../center/${mk_name}/${mk_name}`
        //     })
        // }
    },

    previewImg: function () {
        let urls = []
        for (let item of this.data.swiperList) {
            if (item['Url']) urls.push(item['Url'])
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
                title: "321CQU v" + util.CurrentVersion,
                content: util.CurrentVersionInfo
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
    // 转发给朋友
    onShareAppMessage: function () {
        return {
            title: '321CQU',
            path: '/pages/index/index'
        }
    },
    // 分享到朋友圈
    onShareTimeline: function () {
        return this.onShareAppMessage()
    }
})