const categories = [
    {
        title: '全部',
        icon: 'apps',
        color: 'red',
        type: 'all'
    },
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
        title: '音乐',
        color: 'pink',
        icon: 'musicfill',
        type: 'YL',
    },
    {
        title: '反馈',
        color: 'green',
        icon: 'comment',
        type: 'FK',
    },
]

const type_list = [];
const Type2Name = {};
const Name2Type = {};
(function(){
    for (const category of categories) {
        type_list.push(category.type)
        Type2Name[category.type] = category.title
        Name2Type[category.title] = category.type
    }
})()

function getIndexByType(type) {
    for (let i = 0; i < type_list.length; i++) {
        if (type_list[i] === type) return i
    }
    return -1
}

function getNameByType(type) {
    return Type2Name[type]
}

// function getTypeByName(name) {
//     return Name2Type[name]
// }

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
    getIndexByType,
    getColorByType,
}