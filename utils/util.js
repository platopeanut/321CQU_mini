// noinspection JSNonASCIINames,NonAsciiCharacters
const CurrentVersion = '2.7.2'
const CurrentVersionInfo = "更新内容：\n1. 恢复体测查询\n2. 接入新课程数据库"
const log = require('./log')
const dormitory = {
    'A区': ['选择楼栋','一舍学生宿舍','二舍学生宿舍','三舍学生宿舍','四舍学生宿舍','五舍学生宿舍','六舍学生宿舍','七舍学生宿舍','八舍学生宿舍','九舍学生宿舍','十舍学生宿舍','十一舍学生宿舍','十二舍学生宿舍','A栋宿舍','C栋宿舍','D栋宿舍'],
    'B区': ['选择楼栋','一舍学生宿舍','二舍学生宿舍','三舍学生宿舍','四舍学生宿舍','五舍学生宿舍','六舍学生宿舍','七舍学生宿舍','八舍学生宿舍','九舍学生宿舍','十舍学生宿舍','十一舍学生宿舍','十二舍学生宿舍'],
    'C区': ['选择楼栋','一号学生宿舍','二号学生宿舍','三号学生宿舍','四号学生宿舍','五号学生宿舍'],
    '虎溪梅园': ['选择楼栋','一幢','二幢','三幢','四幢','五幢','六幢','七幢'],
    '虎溪竹园': ['选择楼栋','一幢','二幢','三幢','四幢','五幢','六幢'],
    '虎溪松园': ['选择楼栋','一幢','二幢','三幢','四幢','五幢','六幢','七幢'],
    '虎溪兰园': ['选择楼栋','一幢','二幢','三幢','四幢','五幢','六幢','七幢', '八幢'],
    '虎溪菊园': ['选择楼栋','A幢','B幢'],
}
// noinspection NonAsciiCharacters,JSNonASCIINames
const dormitory_code = {
    'A区': 'A',
    'B区': 'B',
    'C区': 'C',
    '虎溪梅园': 'A',
    '虎溪竹园': 'B',
    '虎溪松园': 'C',
    '虎溪兰园': 'D',
    '虎溪菊园': 'EA',
}

function showError(res, prefix='') {
    log.error(`showError::[${prefix}][error:${res.data.ErrorCode}] ${res.data.ErrorInfo}`)
    wx.showToast({
        title: `[${prefix}][error:${res.data.ErrorCode}] ${res.data.ErrorInfo}`,
        icon: 'none'
    })
}

const IndexImgUrl = 'https://picture.zhulegend.com/media/background.jpg'
const COS_URL = 'https://321cqu-1302184418.cos.ap-chongqing.myqcloud.com'
const PIC_URL = 'https://picture.zhulegend.com'
// 获取当前日期
function getDate() {
    let timestamp = Date.parse(new Date());
    let date = new Date(timestamp);
    //获取年份  
    let Y =date.getFullYear();
    //获取月份  
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    //获取当日日期 
    let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate(); 
    return {
        year: Y,
        month: M,
        day: D
    }
}
// 获取当前时间
function getTime() {
    let date = new Date()
    return {
        hour: date.getHours(),
        minute: date.getMinutes(),
        second: date.getSeconds()
    }
}
// 比较两个日期的先后传入date1，date2，返回-1，0，1表示date1-date2
function compareDate(date1, date2) {
    if (date1.year > date2.year) return 1
    else if (date1.year < date2.year) return -1
    else {
        if (date1.month > date2.month) return 1
        else if (date1.month < date2.month) return -1
        else {
            if (date1.day > date2.day) return 1
            else if (date1.day < date2.day) return -1
            else return 0
        }
    }
}
// 比较两个时间先后 -1 0 1,时，分
function compareTime(time1, time2) {
    if (time1.hour > time2.hour) return 1
    else if (time1.hour < time2.hour) return -1
    else {
        if (time1.minute > time2.minute) return 1
        else if (time1.minute < time2.minute) return -1
        else return 0
    }
}
// 解析日期
function parseDate(str, sep='-') {
    let date = str.split(sep)
    return {
        year: parseInt(date[0]),
        month: parseInt(date[1]),
        day: parseInt(date[2])
    }
}
// 解析时间
function parseTime(str, sep=':') {
    let time = str.split(sep)
    return {
        hour: parseInt(time[0]),
        minute: parseInt(time[1])
    }
}
// 计算两个日期之间的天数
/**
 * 计算两个日期之间的天数
 *  date1  开始日期 yyyy-MM-dd
 *  date2  结束日期 yyyy-MM-dd
 *  如果日期相同 返回一天 开始日期大于结束日期，返回0
 */
function daysDistance(date1,date2){
    let startDate = Date.parse(date1);
    let endDate = Date.parse(date2);
    if (startDate > endDate){
        return 1;
    }
    if (startDate === endDate){
        return 0;
    }
    return  (endDate - startDate) / (24 * 60 * 60 * 1000);
}
function daysDistance2(date1,date2){
    let startDate = Date.parse(date1);
    let endDate = Date.parse(date2);
    return  (endDate - startDate) / (24 * 60 * 60 * 1000);
}


// 解析字符串到对象
function parseFromStr(str) {
    return JSON.parse(str)
}

function shuffle(arr){
    let l = arr.length
    let index, temp
    while(l>0){
        index = Math.floor(Math.random()*l)
        temp = arr[l-1]
        arr[l-1] = arr[index]
        arr[index] = temp
        l--
    }
    return arr
}

function saveFile(url, id=null) {
    return new Promise((resolve, reject) => {
        const fs = wx.getFileSystemManager()
        wx.downloadFile({
            url: url,
            success: res => {
                if (res.statusCode === 200) {
                    fs.saveFile({
                        tempFilePath: res.tempFilePath,
                        success: res => {
                            resolve({
                                path: res.savedFilePath,
                                id: id
                            })
                        },
                        fail: res => {
                            log.error(`saveFile::downloadFile::err=${res.errMsg}&id=${id}`)
                            reject({
                                err: res.errMsg,
                                id: id
                            })
                        }
                    })
                }
            }
        })
    })
}

function saveBatchFile(pictures) {
    let tasks = []
    for (let i = 0; i < pictures.length; i++) {
        tasks.push(saveFile(pictures[i]['url'], i))
    }
    return Promise.all(tasks)
}

// 保存图片至相册
function saveImgToAlbum(e) {
    wx.downloadFile({
        url: e.target.dataset.url,
        success: function (res) {
            if (res.statusCode === 200) {
                wx.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath,
                    success(res) {
                        wx.showToast({
                            title: '保存成功',
                            icon: 'none'
                        })
                    },
                    fail(res) {
                        log.error(`saveImgToAlbum::downloadFile::err=${res}`)
                        wx.showToast({
                            title: '保存失败',
                            icon: 'none'
                        })
                    }
                })
            } else {
                wx.showToast({
                    title: '网络错误' + res.statusCode,
                    icon: 'none'
                })
            }
        }
    })
}

// 查询md中的超链接
function findUrlFromMd(items) {
    if (!items) return ''
    let urls = ''
    for (let item of items) {
        if (item.tag === 'img')
            urls += item.attrs.src + '\n'
        else if (item.tag === 'navigator')
            urls += item.attrs.href + '\n'
        urls += findUrlFromMd(item.children)
    }
    return urls
}


// function parseFormat2Lesson(str) {
//     let list = str.split('-')
//     if (list.length === 1) return [list[0], 1]
//     return [parseInt(list[0]), parseInt(list[1]) - parseInt(list[0]) + 1]
// }

function changeParentPageOpt(opt) {
    let pages = getCurrentPages()
    pages[pages.length - 2].setData(opt)
}

function str2buf(str) {
    let size = str.length
    let buffer = new ArrayBuffer(size || 0)
    let arr = new Uint8Array(buffer)
    for (let i = 0; i < arr.length; i++) {
        arr[i] = str[i]
    }
    return buffer
}

function bindMDEvent(data) {
    if (data['tag'] === 'img' && data['attrs']['src']) {
        wx.previewImage({
            urls: [data['attrs']['src']]
        })
    }
    if (data['tag'] === 'navigator' && data['attrs']['href']) {
        wx.setClipboardData({
            data: data['attrs']['href'],
            success: () => {
                wx.showToast({
                    title: '链接已复制到剪切板',
                    icon: 'none'
                })
            }
        })
    }
}


module.exports = {
    CurrentVersion,
    CurrentVersionInfo,
    COS_URL,
    PIC_URL,
    bindMDEvent,
    IndexImgUrl,
    dormitory,
    dormitory_code,
    getDate,
    parseFromStr,
    compareDate,
    parseDate,
    getTime,
    compareTime,
    parseTime,
    daysDistance,
    daysDistance2,
    showError,
    shuffle,
    saveFile,
    saveBatchFile,
    changeParentPageOpt,
    findUrlFromMd,
    str2buf,
}