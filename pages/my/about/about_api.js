const api = require('../../../utils/api')


// 获取关于界面
function getAboutUs() {
    let header = {
        url: '/about/about_us',
        data: {}
    }
    return new Promise((resolve,reject) => {
        api.request(header, resolve, reject)
    })
}


module.exports = {
    getAboutUs,
}