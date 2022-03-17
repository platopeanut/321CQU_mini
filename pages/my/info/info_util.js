const util = require('../../../utils/util')


function getDormitory (zone= '选择校区') {
    if (zone === '选择校区') return ['选择楼栋']
    else return util.dormitory[zone]
}

function getCampusList() {
    return ['选择校区', 'A区','B区','C区','虎溪梅园', '虎溪竹园', '虎溪松园', '虎溪兰园']
}

module.exports = {
    getDormitory,
    getCampusList,
}