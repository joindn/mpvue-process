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
自定义header
const res = await this.request('api2', 'GET', {}, false, headers)
本请求会自动封装如下header
{'Content-Type': 'application/json', 'Authorization': 'Token ' + getStore('token')}
```
###### 缓存
```
this.setStore('key',value,1*24*60*60) // 缓存一天,默认2天
this.getStore('key')
```

###### 变通解决slot传值问题
```
基础库 2.2.3以上
原理:通过页面中转
全局混入了slotpasm方法
在父组件中调用
const obj = {slotkey: 'celldata', slotval: this.celldata}
this.$emit('slotpasm', obj)
在页面中监听slotpasm方法
<ListView @slotpasm="slotpasm">
          <CellWork v-for="cell in celldata" 
                    :key="cell.id" 
                    @click.stop="clickCell(cell.id)"
                    :celldata="cell">
          </CellWork>
</ListView>
子组件中celldata即可获取到值
```