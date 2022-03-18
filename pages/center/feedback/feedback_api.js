const api = require('../../../utils/api')

// 获取反馈信息
function getFeedback(limit) {
    let header = {
        url: '/feedback/get',
        data: {
            'Limit': limit
        }
    }
    return new Promise((resolve,reject) => {
        api.request(header, resolve, reject)
    })
}

// 发送反馈信息
function sendFeedback(stu_id, message) {
    let header = {
        url: '/feedback/send',
        data: {
            'Sid': stu_id,
            'Content': message,
        }
    }
    return new Promise((resolve,reject) => {
        api.request(header, resolve, reject)
    })
}

// 获取反馈评论
function getFeedbackComment(FBid) {
    let header = {
        url: '/feedback/get_comment',
        data: {
            'FBid': FBid,
        }
    }
    return new Promise((resolve,reject) => {
        api.request(header, resolve, reject)
    })
}

// 发表反馈评论
function sendFeedbackComment(Sid, Content, FBid) {
    let header = {
        url: '/feedback/send_comment',
        data: {
            'FBid': FBid,
            'Sid': Sid,
            'Content': Content,
        }
    }
    return new Promise((resolve,reject) => {
        api.request(header, resolve, reject)
    })
}

module.exports = {
    getFeedback,
    sendFeedback,
    getFeedbackComment,
    sendFeedbackComment,
}
