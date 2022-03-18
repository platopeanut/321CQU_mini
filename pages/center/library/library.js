const library_api = require('./library_api')

Page({

    data: {
        curr_mode: 0,
        mode_list: ['图书借阅', '书籍查询'],
        curr_borrow_list: [],
        history_borrow_list: [],
        uid: '',
        uid_pwd: '',
    },

    onLoad: function () {
        let StuInfo = wx.getStorageSync('StuInfo')
        let uid = StuInfo['uid']
        let uid_pwd = StuInfo['uid_pwd']
        if (!(uid && uid_pwd)) {
            wx.showToast({
                title: '请完善统一身份信息',
                icon: 'none'
            })
            return
        }
        this.setData({
            uid: uid,
            uid_pwd: uid_pwd
        })
        this.queryBorrowInfo()
    },

    selectMode: function (e) {
        let mode = e.currentTarget.dataset.index
        if (mode === 1) {
            wx.showToast({
                title: '敬请期待',
                icon: 'none'
            })
        }
        this.setData({
            curr_mode: mode
        })
    },

    selectBorrowBook: function (e) {
        let index = e.currentTarget.dataset.index
        let mode = e.currentTarget.dataset.mode
        if (mode === 0) {
            let curr_borrow_list = this.data.curr_borrow_list
            curr_borrow_list[index]['state'] = !curr_borrow_list[index]['state']
            this.setData({
                curr_borrow_list: curr_borrow_list
            })
        } else if (mode === 1) {
            let history_borrow_list =this.data.history_borrow_list
            history_borrow_list[index]['state'] = !history_borrow_list[index]['state']
            this.setData({
                history_borrow_list: history_borrow_list
            })
        }
    },

    getBookInput: function (e) {
        console.log(e)
    },

    findBook: function () {

    },

    queryBorrowInfo: function () {
        let that = this
        // 获取当前
        library_api.getBorrowInfo(that.data.uid, that.data.uid_pwd, true).then(res => {
            for (const book of res.BookList) {
                book['state'] = false
            }
            that.setData({
                curr_borrow_list: res.BookList
            })
            wx.showToast({
                title: '当前借阅查询成功',
                icon: 'none'
            })
            return library_api.getBorrowInfo(that.data.uid, that.data.uid_pwd, false)
        }).then(res => {
            // 获取历史
            for (const book of res.BookList) {
                book['state'] = false
            }
            that.setData({
                history_borrow_list: res.BookList
            })
            wx.showToast({
                title: '历史借阅查询成功',
                icon: 'none'
            })
        })
    },

    longPressOperation: function (e) {
        let that = this
        wx.vibrateShort()
        let book_id = e.currentTarget.dataset.id
        wx.showActionSheet({
            itemList: ['续借'],
            success: res => {
                if (res.tapIndex === 0) {
                    library_api.renewBook(that.data.uid, that.data.uid_pwd, book_id).then(res => {
                        console.log(e)
                    })
                }
            }
        })

    },

    onPullDownRefresh: function () {
        wx.stopPullDownRefresh()
        let StuInfo = wx.getStorageSync('StuInfo')
        let uid = StuInfo['uid']
        let uid_pwd = StuInfo['uid_pwd']
        if (!(uid && uid_pwd)) {
            wx.showToast({
                title: '请完善统一身份信息',
                icon: 'none'
            })
            return
        }
        this.queryBorrowInfo()
    }

})
