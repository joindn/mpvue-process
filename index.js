const setStore = (key, value, exp = 2 * 24 * 60 * 60) => {
  let timestamp = (new Date()).getTime() + exp * 1000
  if (mpvuePlatform === 'my') {
    mpvue.setStorageSync({
      key,
      data: value
    })
    mpvue.setStorageSync({
      key: `${key}_exp`,
      data: timestamp
    })
  } else {
    mpvue.setStorageSync(key, value)
    mpvue.setStorageSync(`${key}_exp`, timestamp)
  }
}

const getStore = key => {
  let value, exp
  let timestamp = (new Date()).getTime()
  if (mpvuePlatform === 'my') {
    exp = mpvue.getStorageSync(`${key}_exp`).data
    value = mpvue.getStorageSync(key).data
  } else {
    exp = mpvue.getStorageSync(`${key}_exp`)
    value = mpvue.getStorageSync(key)
  }
  if (exp > timestamp && value) {
    return value
  } else {
    return ''
  }
}

const isAuthed = () => {
  if (getStore('token')) {
    return true
  } else {
    return false
  }
}

export default {
install(Vue, options) {
  Vue.prototype.setStore = setStore
  Vue.prototype.getStore = getStore
  Vue.prototype.request = (url, method = 'GET', data = {}, isLoad = false, header = {}) => {
    return new Promise((resolve, reject) => {
      if (isLoad) {
        mpvue.showLoading({title: '玩命加载中...'})
      }
      mpvue.request({
        url: options.baseUrl + url,
        method,
        data,
        header: Object.assign({}, {'Content-Type': 'application/json', 'Authorization': 'Token ' + getStore('token')}, header),
        success: function (res) {
          if (res.statusCode === 200) {
            resolve(res.data)
          } else {
            mpvue.showToast({
              title: '发生未知错误!',
              icon: 'none'
            })
            reject(res.data)
          }
        },
        fail: function () {
          mpvue.showToast({
            title: '获取数据失败!',
            icon: 'none'
          })
        },
        complete: function () {
          if (isLoad) {
            mpvue.hideLoading()
          }
        }
      })
    })
  }
  Vue.prototype.navigateTo = obj => {
    let path = obj.url.split('?')[0].replace('..', '/pages')
    const isAuthPage = options.pageAuth.indexOf(path)
    if (isAuthPage === -1 || getStore('token')) {
      mpvue.navigateTo(obj)
    } else {
      mpvue.navigateTo({url: options.loginPage})
    }
  }

  Vue.mixin({
    onShow() {
      Vue.prototype.isAuthed = isAuthed()
    },
    methods: {
      slotpasm (obj) {
        this[obj.slotkey] = obj.slotval
      }
    }
  })

}
}