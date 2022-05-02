const api = require('../../../utils/api')


// 获取关于界面
function getTutorials() {
    let header = {
        url: '/about/get_tutorials',
        data: {}
    }
    return new Promise((resolve,reject) => {
        api.request(header, resolve, reject)
    })
}


module.exports = {
    getTutorials
}