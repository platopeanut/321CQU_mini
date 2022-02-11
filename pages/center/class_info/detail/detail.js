Page({

    data: {
        class_name: '高等数学1',
        class_id: 'MATH10012',
        list: [
            {
            title: '[0,60)',
            name: 'red',
            color: '#e54d42'
            },
            {
                title: '[60,70)',
                name: 'orange',
                color: '#f37b1d'
            },
            {
                title: '[70,80)',
                name: 'olive',
                color: '#8dc63f'
            },
            {
                title: '[80,90)',
                name: 'cyan',
                color: '#1cbbb4'
            },
            {
                title: '[90,100]',
                name: 'blue',
                color: '#0081ff'
            }
        ],
        teacher_list: [
            {
                name: '张万雄',
                info: [
                    {
                        year: '2020'
                    },
                    {
                        year: '2021'
                    }
                ]
            },
            {
                name: '温罗生',
                info: [
                    {
                        year: '2019'
                    },
                    {
                        year: '2018'
                    }
                ]
            }
        ],
        teacher_state_list: [false, false]
    },

    selectItem: function (e) {
        let teacher_state_list = this.data.teacher_state_list
        let index = e.currentTarget.dataset.index
        teacher_state_list[index] = !teacher_state_list[index]
        this.setData({
            teacher_state_list: teacher_state_list
        })
        console.log(this.data.teacher_state_list)
    },

    onShareAppMessage: function () {

    }
})