const api = require('../../../utils/api')

// 查询当前借阅，历史借阅信息
// is_curr true为当前，false为历史
function getBorrowInfo(uid, uid_pwd, is_curr) {
    let header = {
        url: '/library/get_borrow_list',
        data: {
            'UserName': uid,
            'Password': uid_pwd,
            'IsCurr': is_curr
        }
    }
    return new Promise((resolve,reject) => {
        api.request(header, resolve, reject)
    })
}

// 续借书籍
function renewBook(uid, uid_pwd, book_id) {
    let header = {
        url: '/library/renew_book',
        data: {
            'UserName': uid,
            'Password': uid_pwd,
            'BookId': book_id
        }
    }
    return new Promise((resolve,reject) => {
        api.request(header, resolve, reject)
    })
}

// 查询书籍
function searchBook(uid, uid_pwd, keyword, page, only_huxi) {
    let header = {
        url: '/library/search_book',
        data: {
            'UserName': uid,
            'Password': uid_pwd,
            'Keyword': keyword,
            'Page': page,
            'OnlyHuxi': only_huxi
        }
    }
    return new Promise((resolve,reject) => {
        api.request(header, resolve, reject, true, true, '2.0')
    })
}

// 查询书籍状态
function queryBookState(uid, uid_pwd, book_id) {
    let header = {
        url: '/library/get_book_pos',
        data: {
            'UserName': uid,
            'Password': uid_pwd,
            'BookId': book_id
        }
    }
    return new Promise((resolve,reject) => {
        api.request(header, resolve, reject, true, true, '2.0')
    })
}

// 查询书籍信息
function queryBookInfo(uid, uid_pwd, book_id) {
    let header = {
        url: '/library/get_book_detail',
        data: {
            'UserName': uid,
            'Password': uid_pwd,
            'BookId': book_id
        }
    }
    return new Promise((resolve,reject) => {
        api.request(header, resolve, reject, true, true, '2.0')
    })
}


module.exports = {
    getBorrowInfo,
    renewBook,
    searchBook,
    queryBookState,
    queryBookInfo,
}