Component({
    options: {
      addGlobalClass: true,
    },
    data: {
      elements: [{
          title: '志愿者时长',
          name: 'volunteer',
          color: 'pink',
          icon: 'newsfill'
        },
        {
          title: '反馈',
          name: 'feedback',
          color: 'green',
          icon: 'comment'
        },
        {
          title: '任务管理',
          name: 'task',
          color: 'blue',
          icon: 'deliver'
        },
        {
          title: '课表',
          name: 'curriculum',
          color: 'orange',
          icon: 'deliver'
        },
        {
          title: '成绩查询',
          name: 'grade',
          color: 'mauve',
          icon: 'search'
        },
        {
          title: '考试',
          name: 'exam',
          color: 'olive',
          icon: 'time'
        },
        {
          title: '评教',
          name: '敬请期待',
          color: 'grey',
          icon: 'font'
        },
        {
          title: '一卡通',
          name: '敬请期待',
          color: 'grey',
          icon: 'icon'
        },
      ],
    },
    methods: {
      onLoad: function() {
        wx.getStorage({
          key: 'has_used',
          fail: function(res) {
            wx.showModal({
              title: "使用说明",
              content: "1. 仅适用于重庆大学学生进行志愿者时长查询\n2.所有用户相关数据均在本地存储，我们未通过小程序收集用户个人数据\n3.有什么问题请在反馈中及时反馈"
            }),
            wx.setStorage({
              key: 'has_used',
              value: true
            })
          }
        })
      },
    }
  })

  