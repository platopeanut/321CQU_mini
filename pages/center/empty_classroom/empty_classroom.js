const empty_classroom_util = require('./empty_classroom_util')
const empty_classroom_api = require('./empty_classroom_api')
const util = require('../../../utils/util')
const curriculum_util = require('../../center/curriculum/curriculum_util') 


Page({


  data: {

    TabTimeCur: 0,   //左侧竖直栏当前时间段
    MainTimeCur: 0,  //右边显示的主模块时间段
    CampusCur:0, //当前校区   现在默认虎溪   索引为0
    BuildingCur:1, //当前教学楼    现在默认虎溪一教   索引为1
    dateCur:0, //当前星期几 默认现在时间
    VerticalNavTop: 0,




    //用户选择
    curr_year: -1,
    curr_month: -1,
    curr_week: -1,
    //标准时间
    year: -1,
    month: -1,  // 月份
    week: -1,   // 当前第几周
    today: -1,  // 周二就是2

    campus_list:[
      "虎溪","A区","B区"
    ],
    building_list_huxi:[
      "所有","一教","综合楼","艺术楼"
    ],
    building_list_A:[
      "所有","主教","二教","五教","八教","理科楼","综合楼"
    ],
    building_list_B:[
      "所有","综合楼","B固"
    ],
    
    time_list: [
      {
        time : "8:30~9:15",
        room_list:["无"]
      },
      {
        time : "9:25~10:10",
        room_list:["无"]
      },
      {
        time : "10:30~11:15",
        room_list:["无"]
      },
      {
        time : "11:25~12:10",
        room_list:["无"]
      },
      {
        time : "13:30~14:15",
        room_list:["无"]
      },
      {
        time : "14:25~15:10",
        room_list:["无"]
      },
      {
        time : "15:20~16:05",
        room_list:["无"]
      },
      {
        time : "16:25~17:10",
        room_list:["无"]
      },
      {
        time : "17:20~18:05",
        room_list:["无"]
      },
      {
        time : "19:00~19:45",
        room_list:["无"]
      },
      {
        time : "19:55~20:40",
        room_list:["无"]
      },
      {
        time : "20:50~21:35",
        room_list:["无"]
      },
      {
        time : "21:45~22:30",
        room_list:["无"]
      }
    ],

    week_list:[],

    
    classroom_info:{
       campus:'',
       building:'',
       data:'',
    },
    load: true
  },


 onLoad: function(){
  this.setData({
    curr_year: new Date().getFullYear(),
    year: new Date().getFullYear(),
    curr_month: new Date().getMonth(),
    month: new Date().getMonth(),
    today: new Date().getDay(),       
    dateCur: new Date().getDay()-1,
    week_list: curriculum_util.getCurrWeekList(),
})
   let curr_week = curriculum_util.getCurrWeekIndex()
     if (curr_week === -1) {
         wx.showToast({
             title: '请先刷新课表',
             icon: 'none'
         })
         return
     } else {
         this.setData({
             curr_week: curr_week,
             week: curr_week
         })
     }
  this.updatelist()
  wx.showToast({
    title: '目前只支持虎溪一教的空教室查询,更换时间请下拉刷新',
    icon:'none',
    duration: 5000
  })

 },


    updatelist: function(){
  let StuInfo = wx.getStorageSync('StuInfo')
  let uid = StuInfo['uid']
  let uid_pwd = StuInfo['uid_pwd']

  let week = this.data.curr_week.toString()
  let weekday = this.data.dateCur+1    //datacur是索引，从零开始，而today与weekday则是周一就是一
  console.log(week,weekday)

  let time_list = this.data.time_list

  if(this.data.CampusCur === 0 && this.data.BuildingCur === 1){
    empty_classroom_api.getClassroomInfo(uid, uid_pwd, week, weekday).then(res=>{
      for (let index = 0; index < this.data.time_list.length; index++) {
          let i = (index+1).toString()
          time_list[index]["room_list"] = res.VacantRoomList[i] 
      }
      console.log(res)  
      this.setData({
        time_list:time_list
      })
    })
    wx.showToast({
      title: '所选时间空教室查询完成',
      icon:'none'
    })
  }
  else
  {
    for (let index = 0; index < this.data.time_list.length; index++) {
     
      // let i = (index+1).toString()
      // time_list[index]["room_list"] =  res.VacantRoomList[i]
      // this.setData({
      //   time_list:time_list
      // })
      wx.showToast({
        title: '亲，功能暂且未开放哟！',
        icon:'none'
      })
  }
  }
  
 },

    onPullDownRefresh: function() {
        wx.stopPullDownRefresh()
        if (this.data.curr_week === -1) {
            wx.showToast({
                title: '请先刷新课表',
                icon: 'none'
            })
            return
        }
        this.updatelist()

    },



  // -1 为指定日期上一周， 1 为指定日期下一周
  getNeighborDayList(date, flag) {
    let result = curriculum_util.getNeighborDayList(date, flag)
    let week_list = result['week_list']
    this.setData({
        month: result['month'],
        year: result['year']
    })
    return week_list
},

  nextWeek() {
    let that = this
    if (that.data.today === 0) that.data.today = 7
    let date = new Date(this.data.year, this.data.month, this.data.week_list[that.data.today - 1][1])
    this.setData({
        week: that.data.week+1,
        week_list: that.getNeighborDayList(date, 1),
    })
},

  preWeek() {
    let that = this
    if (that.data.today === 0) that.data.today = 7
    let date = new Date(this.data.year, this.data.month, this.data.week_list[that.data.today - 1][1])
    this.setData({
        week: that.data.week-1,
        week_list: that.getNeighborDayList(date, -1),
    })
},


  
  //通过data-id给bindtap所触发的函数传递数据（参数）

  time_Select(e) {
    this.setData({
      TabTimeCur: e.currentTarget.dataset.id,
      MainTimeCur: e.currentTarget.dataset.id,
      VerticalNavTop: (e.currentTarget.dataset.id - 1) * 50
    })
  },
  campus_Select(e){
      this.setData({
        CampusCur: e.currentTarget.dataset.id
      })
  },
  building_Select(e){
    this.setData({
      BuildingCur: e.currentTarget.dataset.id
    })
  },
  date_Select(e){
    this.setData({
      dateCur: e.currentTarget.dataset.id
    })
  },


  VerticalMain(e) {
    let that = this;
    let time_list = this.data.time_list;
    let tabHeight = 0;
    if (this.data.load) {
      for (let i = 0; i < time_list.length; i++) {
        let view = wx.createSelectorQuery().select("#main-" + time_list[i].id);
        view.fields({
          size: true
        }, data => {
          time_list[i].top = tabHeight;
          tabHeight = tabHeight + data.height;
          time_list[i].bottom = tabHeight;     
        }).exec();
      }
      that.setData({
        load: false,
        time_list: time_list
      })
    }
    let scrollTop = e.detail.scrollTop + 20;
    for (let i = 0; i < time_list.length; i++) {
      if (scrollTop > time_list[i].top && scrollTop < time_list[i].bottom) {
        that.setData({
          VerticalNavTop: (time_list[i].id - 1) * 50,
          TabCur: time_list[i].id
        })
        return false
      }
    }
  }
})