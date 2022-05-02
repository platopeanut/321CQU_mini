const app = getApp()

Page({

    data: {
        isLoading: true,					// 判断是否尚在加载中
        article: {},
        type: 'markdown'
    },

    onLoad: function () {
        let that = this
        wx.request({
            url: 'https://www.vvadd.com/wxml_demo/demo.txt?v=2',
            success: res => {
                console.log(res.data)
                res.data = '<audio autoplay="false" loop="true" name="此时此刻" author="许巍" poster="https://www.vvadd.com/wxml_demo/music.jpg"  src="http://music.163.com/song/media/outer/url?id=539324.mp3"></audio>'
                // res.data = '<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=66272&auto=1&height=66"></iframe>'

                let result = app.towxml(res.data, that.data.type, {
                    // base:'http://jwc.cqu.edu.cn/images/',				// 相对资源的base路径
                    // theme:'dark',					// 主题，默认`light`
                    events:{					// 为元素绑定的事件方法
                        tap:(e)=>{
                            console.log('tap',e)
                        }
                    }
                })
                // 更新解析数据
                this.setData({
                    article:result,
                    isLoading: false
                });
            }
        })
    }
})