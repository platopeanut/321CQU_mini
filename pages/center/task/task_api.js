const api = require('../../../utils/api')


// 获取订阅信息
function getSubscribeInfo(id) {
    return api.newRequest("https://api.321cqu.com/v1/notification/fetchSubscribeInfo", {uid: id})
}

// 更新订阅信息
/**
 *
 * @param id
 * @param stu_id
 * @param {number} event
 * @param {boolean }opt
 * @return {Promise<unknown>}
 */
function updateSubscribeInfo(id, stu_id, event, opt) {
    return api.newRequest("https://api.321cqu.com/v1/notification/updateSubscribe", {
        "uid": id,
        "event": event,
        "is_subscribe": opt,
        "extra_data": { "sid": stu_id }
    })
}

module.exports = {
    getSubscribeInfo,
    updateSubscribeInfo,
}

