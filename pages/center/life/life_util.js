const util = require('../../../utils/util')

// 虎溪校区查寝室水电费规范码
function getDormitoryCode(room) {
    let code = util.dormitory_code[room['campus']]
    code += util.dormitory[room['campus']].indexOf(room['building'])
    code += room['room_id']
    return code
}
// 老校区查寝室水电费规范码
function getDormitoryCodeInABC(room){
    let code = util.dormitory_code[room['campus']]
    // n —— 宿舍号
    if( code === 'A'){
        let n = util.dormitory[room['campus']].indexOf(room['building'])
        if( n > 12 ){
            if( n-12 === 1) code += 'A'
            else if( n-12 ===2) code += 'C'
            else code += 'D'
        }
        else code += n
    }
    else code += util.dormitory[room['campus']].indexOf(room['building'])
    code += 'S'
    //"-"改为'F'
    let num = room['room_id']
    for (let i = 0; i < num.length; i++) {
        if (num[i] === '-')  code += 'F'
        else code += num[i]
    }
    return code
}


module.exports = {
    getDormitoryCode,
    getDormitoryCodeInABC,
}