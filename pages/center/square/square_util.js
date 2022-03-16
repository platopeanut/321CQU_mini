const categories = [
    {
        title: '全部',
        icon: 'apps',
        color: 'red',
        type: 'all'
    },
    // {
    //     title: '拼车',
    //     icon: 'ticket',
    //     color: 'red',
    //     type: 'PC'
    // },
    {
        title: '课程',
        icon: 'form',
        color: 'blue',
        type: 'KC'
    },
    {
        title: '失物招领',
        icon: 'attention',
        color: 'orange',
        type: 'SW'
    },
    {
        title: '数学',
        color: 'cyan',
        icon: 'write',
        type: 'MATH',
    },
    {
        title: '反馈',
        color: 'green',
        icon: 'comment',
        type: 'FK',
    },
]
const type_list = ['all', 'KC', 'SW', 'MATH', 'FK']
const Type2Name = {
    // 'PC': '拼车',
    'KC': '课程',
    'SW': '失物',
    'MATH': '数学',
    'FK': '反馈',
}
const Name2Type = {
    // '拼车': 'PC',
    '课程': 'KC',
    '失物': 'SW',
    '数学': 'MATH',
    '反馈': 'FK',
}

function getIndexByType(type) {
    for (let i = 0; i < type_list.length; i++) {
        if (type_list[i] === type) return i
    }
    return -1
}

function getNameByType(type) {
    return Type2Name[type]
}

function getTypeByName(name) {
    return Name2Type[name]
}

module.exports = {
    categories,
    type_list,
    getNameByType,
    getTypeByName,
    getIndexByType,
}