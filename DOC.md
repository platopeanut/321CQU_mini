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

## Name Promise
> 小程序命名规范

- 函数名称
  - 采用驼峰命名法
  - 第一个单词首字母小写，其余单词首字母大写
  - 例如：`getUserInfo`
- 变量名称
  - 字母全部小写，单词之间使用下划线分隔
  - 例如：`stu_name`
- 缓存名称
  - 首字母大写的驼峰命名法
  - 例如：`SchoolInfo`
- this命名
  - 当`this`发生冲突时，将`Page`对象的`this`命名为`that`
  - ~~~javascript
    let that = this
    ~~~

## Cache Promise
> 小程序本地缓存规范

- 所有缓存使用同步缓存
  ~~~javascript
  // 写入缓存
  wx.setStorageSync('key', value)
  // 读取缓存
  value = wx.getStorageSync('key')
  ~~~
> 目前小程序缓存架构较为混乱，等我以后重新调整，下面暂时只列出一些必要的缓存

### 关键缓存
- StuInfo：学生信息
  - stu_name：学生姓名
  - stu_id：学生学号
  - uid：统一身份账号
  - uid_pwd：统一身份密码
  - identity：学生身份（取值为`本科生`/`研究生`）
  - email：邮箱
  - nickname：昵称
  - authority：管理员权限
  - room：宿舍信息
    - campus
    - building
    - room_id


## Request Promise
> 小程序网络请求规范

- 所有网络请求需写在`utils/api.js`中

### request template
> 网络请求模板

- 所有网络请求通过POST传输
- 网络请求时必须指定Key

~~~javascript
function api_name(api_parameters) {
  let header = {
    url: 'api_path',
    data: {
      'api_parameters': api_parameters
    }
  }
  return new Promise((resolve,reject) => {
    request(header, resolve, reject)
  })
}

// 同时需要在module.exports中导出该函数
module.exports = {
    api_name
}
~~~

### response template
> 网络响应模板

- 所有网络请求使用异步请求
- 相应数据保存在`res.data`中

~~~javascript
api.api_name(api_parameters).then(res => {
    // TODO
}, err => {
    // handle error
}).finally({
    // finally do
})

~~~
