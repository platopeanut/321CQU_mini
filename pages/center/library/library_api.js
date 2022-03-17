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


module.exports = {
    getBorrowInfo,
    renewBook,
}