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
        title: '树洞',
        color: 'cyan',
        icon: 'post',
        type: 'SD',
    },
    {
        title: '反馈',
        color: 'green',
        icon: 'comment',
        type: 'FK',
    },
]
const type_list = ['all', 'KC', 'SW', 'SD', 'FK']
const Type2Name = {
    // 'PC': '拼车',
    'KC': '课程',
    'SW': '失物',
    'SD': '树洞',
    'FK': '反馈',
}
const Name2Type = {
    // '拼车': 'PC',
    '课程': 'KC',
    '失物': 'SW',
    '树洞': 'SD',
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

function getColorByType(type) {
    for (const category of categories) {
        if (type === category.type) return category.color
    }
    return null
}

module.exports = {
    categories,
    type_list,
    getNameByType,
    getTypeByName,
    getIndexByType,
    getColorByType,
}