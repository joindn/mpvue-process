# mpvue-process

###### 登录验证
```
1. mpvue页面登录判断

配置apiBaseUrl,登录页,需要登录才能查看的页面:
config = {
  baseUrl: 'https://www.xxxxxxx.com/',
  loginPage: '/pages/login/main',
  pageAuth: [
    '/pages/xxxx/main',
    '/pages/yyyy/main'
  ]
}
在main.js中添加
import MpvueProcess from 'mpvue-process'
Vue.use(MpvueProcess, config)
2. 使用
页面级登录判断:
this.navigateTo()替换mpvue.navigateTo()方法,如果页面需要登录则会先跳转到登录页

按钮级登录判断:
if(!this.isAuthed){
    没登录情况
} else{
    登录请求
}

3.登录后保存token
this.setStore('token',xxxxxx)
```
###### 请求封装
```
需要转loading的
const res = await this.request('api1', 'GET', {}, true)
不需要转loading的
const res = await this.request('api2', 'GET', {})

this.request('api3', 'GET', {}).then(resp=>{console.log(resp)})
```