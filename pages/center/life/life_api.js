const api = require('../../../utils/api')

// 查询水电费
function getFees(uid, uid_pwd, is_hu_xi, room_code) {
    let header = {
        url: '/school_info/get_fees',
        data: {
            'UserName': uid,
            'Password': uid_pwd,
            'IsHuXi': is_hu_xi,
            'Room': room_code
        }
    }
    return new Promise((resolve,reject) => {
        api.request(header, resolve, reject)
    })
}

//查询一卡通相关信息：
function getSchoolCardInfo(uid, uid_pwd){
    let header = {
        url: '/school_info/get_card',
        data: {
            'UserName': uid,
            'Password': uid_pwd,
        }
    }
    return new Promise((resolve,reject) => {
        api.request(header, resolve, reject)
    })
}


module.exports = {
    getSchoolCardInfo,
    getFees,
}