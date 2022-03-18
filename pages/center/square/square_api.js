const api = require('../../../utils/api')

/**
 *  信息广场
 */
// 获取帖子列表
function getPostList(limit, type='all') {
    let header = {
        url: '/forum/get_post_list',
        data: {
            'Type': type,
            'Limit': limit
        }
    }
    return new Promise((resolve,reject) => {
        api.request(header, resolve, reject)
    })
}
// 获取帖子详情
function getPostDetail(pid) {
    let header = {
        url: '/forum/get_post_detail',
        data: {
            'Pid': pid
        }
    }
    return new Promise((resolve,reject) => {
        api.request(header, resolve, reject)
    })
}
// 发送帖子
function sendPost(type, title, content, author) {
    if (title === undefined) title = ''
    let header = {
        url: '/forum/send_post',
        data: {
            'Title': title,
            'Content': content,
            'Type': type,
            'Author': author
        }
    }
    return new Promise((resolve,reject) => {
        api.request(header, resolve, reject)
    })
}
// 更新帖子
function modifyPost(title, content, pid, sid) {
    let header = {
        url: '/forum/update_post',
        data: {
            'Title': title,
            'Content': content,
            'IsDelete': false,
            'Pid': pid,
            'Sid': sid,
        }
    }
    return new Promise((resolve,reject) => {
        api.request(header, resolve, reject)
    })
}
// 删除帖子
function deletePost(pid, sid) {
    let header = {
        url: '/forum/update_post',
        data: {
            'Title': '',
            'Content': '',
            'IsDelete': true,
            'Pid': pid,
            'Sid': sid,
        }
    }
    return new Promise((resolve,reject) => {
        api.request(header, resolve, reject)
    })
}
// 获取评论
function getReply(pid, limit=null) {
    let header = {
        url: '/forum/get_reply',
        data: {
            'Pid': pid,
            'Limit': limit
        }
    }
    return new Promise((resolve,reject) => {
        api.request(header, resolve, reject)
    })
}
// 发送评论
function sendReply(pid, stu_id, content) {
    let header = {
        url: '/forum/send_reply',
        data: {
            'Content': content,
            'Pid': pid,
            'Author': stu_id,
        }
    }
    return new Promise((resolve,reject) => {
        api.request(header, resolve, reject)
    })
}
// 删除评论
function deleteReply(rid, stu_id) {
    let header = {
        url: '/forum/delete_reply',
        data: {
            'Rid': rid,
            'Sid': stu_id,
        }
    }
    return new Promise((resolve,reject) => {
        api.request(header, resolve, reject)
    })
}


module.exports = {
    getPostList,
    getPostDetail,
    sendPost,
    modifyPost,
    deletePost,
    getReply,
    sendReply,
    deleteReply,
}