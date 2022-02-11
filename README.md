# 321CQU Mini Program

321CQU微信小程序端



## v1.6.0

### 新增
- 课表添加上课时间

### 优化
- 成绩，考试安排界面刷新优化
- 绑定信息界面UI优化

### 待修复
- 自定义配置成绩丢失问题



---

## v1.5.0

### 温馨提示
- 部分功能请重新绑定身份信息后，再刷新使用
### 新增
- 首页课程提醒
### 修复
- 课表周数显示问题
### 优化
- 首页UI调整
- 部分页面UI优化
### 待实现
- 课表自定义添加安排(长按即可添加)
- 查课

---

## v1.4.0

### 待修复

### 待实现

- 添加网络错误statusCode


### 已实现

- 下学期课表预览
- 广告
  - 首页添加**支持我们**
    - 首次点击提示用户
    - 每次看完激励广告在*user/advertise*登记
  - **我的**页面添加**已观看广告次数**
  - 取消关于我们页面广告
- 成绩
  - 五分制绩点计算
  - 绩点计算配置
### 已修复
- 成绩刷新后之前配置被清除
- 成绩界面身份错误提示改为绑定学号，统一身份账号信息
- 绑定昵称，stuVal[api] 接口，不用在绑定时调用
- -1学分显示缓登
- 统计成绩时修改为仅点击课程名称才能触发选择，防止误触
