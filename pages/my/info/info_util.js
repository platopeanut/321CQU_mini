const util = require('../../../utils/util')
const info_api = require('./info_api')


function getDormitory (zone= '选择校区') {
    if (zone === '选择校区') return ['选择楼栋']
    else return util.dormitory[zone]
}

function getCampusList() {
    return ['选择校区', 'A区','B区','C区','虎溪梅园', '虎溪竹园', '虎溪松园', '虎溪兰园', '虎溪菊园']
}

function packDormitoryInfo(room) {
    // room: {campus: "选择校区", building: "选择楼栋", room_id: ""}
    if (!room) return ''
    let campus = room['campus']
    let building = room['building']
    let room_id = room['room_id']
    if (!campus || campus === '选择校区') campus = ''
    if (!building || building === '选择楼栋') building = ''
    if (!room_id || room_id === '') room_id = ''
    return campus + ';' + building + ';' + room_id
}

function unpackDormitoryInfo(dormitory) {
    let info = dormitory.split(';')
    if (info[0] === '') info[0] = '选择校区'
    if (info[1] === '') info[1] = '选择楼栋'
    return {
        campus: info[0],
        building: info[1],
        room_id: info[2]
    }
}

// 自动填充用户信息
function autoFillUserInfo() {
    let StuInfo = {}
    wx.login({
        success: res => {
            info_api.pullUserInfo(res.code).then(res => {
                console.log(res)
                StuInfo['stu_id'] = res.Sid
                StuInfo['uid'] = res.Auth
                StuInfo['uid_pwd'] = res.Password
                StuInfo['authority'] = res.Authority
                StuInfo['identity'] = res.Type
                StuInfo['email'] = res.Email
                StuInfo['room'] = unpackDormitoryInfo(res.Dormitory)
                StuInfo['nickname'] = res.UserName
                console.log(StuInfo)
                wx.setStorageSync('AutoFill', true)
                wx.setStorageSync('StuInfo', StuInfo)
            }, err => {
                console.log(err, res.code)
                wx.setStorageSync('AutoFill', false)
                wx.setStorageSync('StuInfo', '')
                if (err.ErrorCode !== 3) {
                    wx.showToast({
                        title: `[${err.ErrorCode}]${err.ErrorInfo}`,
                        icon: 'none'
                    })
                }
            })
        },
        fail: () => {
            wx.showToast({
                title: '登陆失败',
                icon: 'none'
            })
        }
    })
}


module.exports = {
    getDormitory,
    getCampusList,
    packDormitoryInfo,
    unpackDormitoryInfo,
    autoFillUserInfo,
}