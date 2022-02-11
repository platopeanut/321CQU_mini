Page({

    data: {
        way_list: ['搜课程', '搜老师'],
        hint_list: ['请输入课程名称', '请输入老师名称'],
        curr_way: null,
        curr_hint: null,
        user_input: '',
        no_result_state: false
    },

    onShow: function () {
        let that = this
        this.setData({
            curr_way: that.data.way_list[0],
            curr_hint: that.data.hint_list[0]
        })
    },

    selectWay: function (res) {
        let curr_way = res.target.dataset.id
        let curr_hint
        for (let i = 0; i < this.data.way_list.length; i++) {
            if (this.data.way_list[i] === curr_way) {
                curr_hint = this.data.hint_list[i]
                break
            }
        }
        this.setData({
            curr_way: curr_way,
            curr_hint: curr_hint
        })
    },

    queryInfo: function (e) {
        this.setData({
            user_input: e.detail.value
        })
    },

    query: function () {
        this.setData({
            no_result_state: true
        })
        wx.navigateTo({
            url: './detail/detail'
        })
    },

    onShareAppMessage: function () {

    }
})