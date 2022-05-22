const library_api = require('./library_api')
const {it} = require("../../../lib/towxml/parse/parse2/entities/maps/entities");

Page({

    data: {
        curr_mode: 1,
        mode_list: ['图书借阅', '书籍查询', '我的收藏'],
        borrow_mode_flag: false,    // 是否访问过图书借阅界面
        curr_borrow_list: [],
        history_borrow_list: [],
        uid: '',
        uid_pwd: '',
        input: '',
        searchList: [],
        markBooks: [],
        page_num: 1,
        modal_state: false,     // 是否显示模态框
        curr_select_book: {},   // 当前选中书籍
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
    },

    selectMode: function (e) {
        let mode = e.currentTarget.dataset.index
        if (mode === 0 && !this.data.borrow_mode_flag) {
            this.setData({
                borrow_mode_flag: true
            })
            this.queryBorrowInfo()
        } else if (mode === 2) {
            let Library = wx.getStorageSync('Library')
            if (Library && Library['MarkBooks']) this.setData({
                markBooks: Library['MarkBooks']
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
        this.setData({
            input: e.detail.value
        })
    },

    findBook: function () {
        this.searchBook(true);
    },

    searchBook: function (isInit=false) {
        let that = this
        if (this.data.input === '') {
            wx.showToast({
                title: '输入不能为空',
                icon: 'none'
            })
            return
        }
        let uid = this.data.uid
        let uid_pwd = this.data.uid_pwd
        if (!(uid && uid_pwd)) {
            wx.showToast({
                title: '请完善统一身份信息',
                icon: 'none'
            })
            return
        }
        let page_num = this.data.page_num
        let searchList = this.data.searchList
        if (isInit) {
            page_num = 1
            searchList = []
        }
        library_api.searchBook(uid, uid_pwd, this.data.input, page_num, false).then(res => {
            if (res.SearchSet.length === 0) {
                wx.showToast({
                    title: '暂无更多图书信息',
                    icon: 'none'
                })
                return
            }
            for (let item of res.SearchSet) {
                searchList.push(item)
            }
            page_num ++
            that.setData({
                searchList: searchList,
                page_num: page_num,
            })
        })
    },

    selectBook: function (e) {
        let that = this
        let item = e.currentTarget.dataset.item
        console.log(item)
        let opt = that.getMarkBookIdList().includes(item.BookId) ? '取消收藏': '收藏'
        wx.showActionSheet({
            itemList: ['详细介绍', opt, '分享'],
            success: res => {
                if (res.tapIndex === 0) {
                    that.setData({
                        modal_state: true,
                        curr_select_book: item
                    })
                } else if (res.tapIndex === 1) {
                    if (opt === '收藏') that.markBook(item)
                    else that.unmarkBook(item.BookId)
                } else if (res.tapIndex === 2) {
                    wx.showToast({
                        title: '分享待实现',
                        icon: 'none'
                    })
                }
            }
        })
    },

    getMarkBookIdList: function () {
        let Library = wx.getStorageSync('Library')
        if (!Library || !Library['MarkBooks']) return []
        let id_list = []
        Library['MarkBooks'].forEach(item => { id_list.push(item.BookId) })
        return id_list
    },

    markBook: function (item) {
        let Library = wx.getStorageSync('Library')
        if (!Library || !Library['MarkBooks']) {
            Library = { 'MarkBooks': [] }
        }
        Library['MarkBooks'].push(item)
        wx.setStorageSync('Library', Library)
        this.setData({
            markBooks: Library['markBooks']
        })
        wx.showToast({
            title: '收藏成功',
            icon: 'none'
        })
    },

    unmarkBook: function (bookId) {
        let Library = wx.getStorageSync('Library')
        if (!Library || !Library['MarkBooks']) return
        Library['MarkBooks'] = Library['MarkBooks'].filter(item => {
             return item.BookId !== bookId
        })
        wx.setStorageSync('Library', Library)
        this.setData({
            markBooks: Library['MarkBooks']
        })
        wx.showToast({
            title: '取消成功',
            icon: 'none'
        })
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
            // wx.showToast({
            //     title: '当前借阅查询成功',
            //     icon: 'none'
            // })
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
                title: '查询成功',
                icon: 'none'
            })
        })
    },

    longPressOperation: function (e) {
        let that = this
        wx.vibrateShort({
            type: 'heavy'
        })
        let book_id = e.currentTarget.dataset.id
        wx.showActionSheet({
            itemList: ['续借'],
            success: res => {
                if (res.tapIndex === 0) {
                    library_api.renewBook(that.data.uid, that.data.uid_pwd, book_id).then(res => {
                        wx.showToast({
                            title: '续借成功',
                            icon: 'none'
                        })
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
        if (this.data.curr_mode === 0) this.queryBorrowInfo()
        else if (this.data.curr_mode === 2) {
            // TODO: 更新每本图书的Pos状态
            this.updateBookState(uid, uid_pwd)
        }
    },

    updateBookState: function (uid, uid_pwd) {
        let Library = wx.getStorageSync('Library')
        if (!Library || !Library['MarkBooks']) return
        let books = Library['MarkBooks']
        for (let book of books) {
            library_api.queryBookState(uid, uid_pwd, book.BookId).then(res => {
                console.log(res)
            })
        }
    },

    onReachBottom: function () {
        if (this.data.curr_mode === 1) this.searchBook()
    },

    hideModal: function () {
        this.setData({
            modal_state: false
        })
    },
})
