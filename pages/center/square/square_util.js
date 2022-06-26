const categories = [
    { title: '全部', type: 'all' },
    { title: '课程', type: 'KC' },
    { title: '失物招领', type: 'SW' },
    { title: '树洞', type: 'SD' },
    { title: '音乐', type: 'YL' },
    // { title: '投票', type: 'TP' },
    { title: '反馈', type: 'FK' },
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

module.exports = {
    categories,
    type_list,
    getNameByType,
    getIndexByType,
}