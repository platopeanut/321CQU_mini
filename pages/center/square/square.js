const square_api = require('./square_api')
const square_util = require('./square_util')
const {ac} = require("../../../lib/towxml/parse/parse2/entities/maps/entities");
const app = getApp()

Page({
    data: {
        Tab: ['活动', '消息', '我的'],
        TabCur: 1,
        categories: square_util.categories,
        curr_type: 'all',
        stu_id: null,
        authority: null,
        post_list: {},
        post_index_list: null,
        post_flag_list: null,   // 1 --> 第一次刷新 --> 0 --> 没有更多 --> -1
        option: 0,

        ActivityList: [],
        ActivityPage: 0,
        ActivityInit: true,
    },
    tabSelect: function (e) {
        let index = e.currentTarget.dataset.id
        if (index === 0 && this.data.ActivityInit) {
            this.getActivities()
            this.setData({
                ActivityInit: false
            })
        }
        this.setData({
            TabCur: index
        })
    },
    onShow: function () {
        if (this.data.option === 0) {
            let StuInfo = wx.getStorageSync('StuInfo')
            let stu_id = StuInfo['stu_id']
            let authority = StuInfo['authority']
            this.setData({
                stu_id: stu_id,
                authority: authority
            })
            if (!(this.data.stu_id && this.data.authority)) {
                wx.showToast({
                    title: '请绑定统一身份，昵称信息',
                    icon: 'none'
                })
                return
            }
            let length = square_util.type_list.length
            let post_index_list = new Array(length)
            for (let i = 0; i < post_index_list.length; i++) {
                post_index_list[i] = 0
            }
            let post_flag_list = new Array(length)
            for (let i = 0; i < post_flag_list.length; i++) {
                post_flag_list[i] = 1
            }
            this.setData({
                post_index_list: post_index_list,
                post_flag_list: post_flag_list,
                post_list: {},
            })
            this.updateData(0, 10, false)
        }
    },
    selectPart: function (res) {
        this.setData({
            curr_type: res.currentTarget.dataset.type
        })
        if (this.data.post_flag_list[square_util.getIndexByType(this.data.curr_type)] === 1) {
            this.updateData(0, 10, false)
        }
    },
    jumpToAddPost: function () {
        let that = this
        wx.navigateTo({
            url: './edit/edit?type=' + that.data.curr_type,
        })
    },
    jumpToDetail: function (e, direct=false) {
        let item = direct ? e : e.currentTarget.dataset.item
        wx.navigateTo({
            url: './detail/detail?pid=' + item.Pid
        })
    },
    longPressOperation: function (e) {
        wx.vibrateShort()
        let that = this
        let item = e.currentTarget.dataset.item
        if (this.data.stu_id === item.Author) {
            wx.showActionSheet({
                itemList: ['修改', '删除'],
                success: res => {
                    if (res.tapIndex === 0) {
                        // 修改
                        wx.navigateTo({
                            url: './edit/edit?pid=' + item.Pid,
                        })
                    } else if (res.tapIndex === 1) {
                        // 删除
                        square_api.deletePost(item.Pid, that.data.stu_id).then(() => {
                            wx.showToast({
                                title: '删除成功',
                                icon: 'none'
                            })
                        })
                        that.onShow()
                    }
                }
            })
        }
        else if (this.data.authority === 'super' || this.data.authority === item.Type) {
            wx.showActionSheet({
                itemList: ['删除'],
                success: res => {
                    if (res.tapIndex === 0) {
                        // 删除
                        square_api.deletePost(item.Pid, that.data.stu_id).then(() => {
                            wx.showToast({
                                title: '删除成功',
                                icon: 'none'
                            })
                        })
                        that.onShow()
                    }
                }
            })
        }
    },
    updateData: function (start, batch=10, loading=true) {
        let that = this
        let post_list = this.data.post_list
        square_api.getPostList(`${start},${batch}`, that.data.curr_type, loading).then(res => {
            //////////test
            // if (that.data.curr_type === 'TP') {
            //     res.PostList = [
            //         {
            //             'Content': '你支持321CQU吗',
            //             'Type': 'TP',
            //             'Vote': [
            //                 {
            //                     title: '支持',
            //                     color: 'red',
            //                     value: '64%',
            //                     num: 64
            //                 },
            //                 {
            //                     title: '反对',
            //                     color: 'blue',
            //                     value: '36%',
            //                     num: 36
            //                 }
            //             ]
            //         }
            //     ]
            // }
            //////////
            if (!post_list[that.data.curr_type]) post_list[that.data.curr_type] = []
            for (let i = 0; i < res.PostList.length; i++) {
                if (res.PostList[i]['Content'].length >= 45) {
                    res.PostList[i]['Content'] = res.PostList[i]['Content'].slice(0, 45) + '...'
                }
                res.PostList[i]['Content'] = app.towxml(res.PostList[i]['Content'], 'markdown', {
                    // base:'http://jwc.cqu.edu.cn/images/',				// 相对资源的base路径
                    // theme:'dark',					// 主题，默认`light`
                    // events:{					// 为元素绑定的事件方法
                    //     tap:(e)=>{
                    //         console.log(e)
                    //         // that.jumpToDetail(Object.assign({}, res.PostList[i]), true)
                    //     }
                    // }
                })
                // console.log(res.PostList[i])
                res.PostList[i]['Color'] = square_util.getColorByType(res.PostList[i]['Type'])
                res.PostList[i]['Type'] = square_util.getNameByType(res.PostList[i]['Type'])
                post_list[that.data.curr_type].push(res.PostList[i])
            }

            let post_flag_list = that.data.post_flag_list
            post_flag_list[square_util.getIndexByType(that.data.curr_type)] = 0

            let post_index_list = that.data.post_index_list
            let size = res.PostList.length
            if (size < batch) {
                post_flag_list[square_util.getIndexByType(that.data.curr_type)] = -1
            }
            post_index_list[square_util.getIndexByType(that.data.curr_type)] += size

            that.setData({
                post_list: post_list,
                post_flag_list: post_flag_list,
                post_index_list: post_index_list
            })
        })
    },
    onPullDownRefresh() {
        wx.stopPullDownRefresh()
        let that = this
        if (!(this.data.stu_id && this.data.authority)) {
            wx.stopPullDownRefresh()
            wx.showToast({
                title: '请绑定统一身份，昵称信息',
                icon: 'none'
            })
            return
        }
        if (this.data.TabCur === 1) {
            let post_list = this.data.post_list
            post_list[this.data.curr_type] = []
            let post_index_list = this.data.post_index_list
            post_index_list[square_util.getIndexByType(this.data.curr_type)] = 0
            this.setData({
                post_list: post_list,
                post_index_list: post_index_list
            })
            this.updateData(0)
        }
        if (this.data.TabCur === 0) {
            this.setData({
                ActivityList: [],
                ActivityPage: 0,
            })
            that.getActivities()
        }
    },
    onReachBottom: function() {
        if (this.data.TabCur === 0) {
            this.getActivities()
        }
        if (this.data.TabCur === 1) {
            let post_index_list = this.data.post_index_list
            let post_flag_list = this.data.post_flag_list
            let index = square_util.getIndexByType(this.data.curr_type)
            if (post_flag_list[index] === -1) {
                wx.showToast({
                    title: '没有更多啦',
                    icon: 'none'
                })
                return
            }
            this.updateData(post_index_list[index])
        }
    },
    getActivities: function () {
        let that = this
        square_api.getActivities(that.data.ActivityPage).then(res => {
            console.log(res)
            let ActivityList = that.data.ActivityList
            let now_time = new Date().getTime()
            let undefined_time = '0000-00-00'
            for (let item of res.Announcements) {
                item['State'] = '进行中'
                if (item.StartDate !== undefined_time && new Date(item.StartDate).getTime() > now_time) item['State'] = '未开始'
                if (item.EndDate !== undefined_time && new Date(item.EndDate).getTime() < now_time) item['State'] = '已结束'
                ActivityList.push(item)
            }
            that.setData({
                ActivityList: ActivityList,
                ActivityPage: that.data.ActivityPage + 1
            })
        })
    },
    selectActivity: function (e) {
        let activity = this.data.ActivityList[e.currentTarget.dataset.index]
        wx.navigateTo({
            url: './activity_detail/activity_detail?Aid=' + activity.Aid
                + '&Url=' + activity.Url
                + '&Name=' + activity.Name
                + '&Title=' + activity.Title
                + '&UpdateDate=' + activity.UpdateDate
                + '&StartDate=' + activity.StartDate
                + '&EndDate=' + activity.EndDate
                + '&State=' + activity.State
        })
    }
})