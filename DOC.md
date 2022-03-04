# 321CQU mini Document

> 321CQU微信小程序端文档
> 
> @Author: Peanut
> 
> @Update Time: 2022-03-04

## Structure

- lib: 小程序UI库（ColorUI）
- pages: 小程序页面
- res: 小程序所需资源目录(Image)
- utils
  - api.js: 小程序网络请求（与后端交互）API
  - util.js: 小程序常用工具，辅助函数
  - test.js: 单元测试文件

## Pages Structure

- index：首页
- center：应用中心
  - class_info：查课
    - detail：具体课程信息
  - curriculum：课表
  - exam：考试安排
  - feedback：反馈
    - detail：具体反馈信息
    - edit：反馈编辑
  - grade：成绩，排名查询
  - life：生活服务（水电费查询，一卡通查询及其消费记录）
  - sponsor：支持我们
  - task：任务管理（志愿文件下载，小程序订阅）
  - volunteer：志愿时长查询
- my：用户
  - about：关于我们
  - info：用户信息


## Style Promise
> 小程序风格样式规范

- 主题颜色
- 常用颜色
- 提示风格

## Cache Promise
> 小程序本地缓存规范

- my.js
  - ad_count: 用户观看广告次数 number
  - userInfo
  - has_bind
- info.js
  - room
  - stu_name
  - stu_id
  - email
  - uid
  - uid_pwd
  - identity
  - nickname
- class_info.js
  - class_info_curr_way
- 


## Request Promise
> 小程序网络请求规范

### template
> 网络请求模板