import { useMemberStore } from '@/stores'

const baseURL = 'http://localhost:8081'
// 添加拦截器
const httpInterceptor = {
  // 拦截时触发
  invoke(options: UniApp.RequestOptions) {
    // 非http请求，开头需要拼接地址
    if (!options.url.startsWith('http')) {
      options.url = baseURL + options.url
    }
    // 请求超时，默认60s
    options.timeout = 1000000
    // 添加小程序端请求头标识
    options.header = {
      ...options.header,
      'source-client': 'miniapp',
    }
    // 添加token请求头标识
    const memberStore = useMemberStore()
    const token = memberStore.profile?.token
    if (token) {
      options.header.Authorization = token
    }
  },
}
uni.addInterceptor('request', httpInterceptor)
uni.addInterceptor('uploadFile', httpInterceptor)

interface Data<T> {
  code: string
  msg: string
  result: T
}

export const http = <T>(options: UniApp.RequestOptions) => {
  return new Promise<Data<T>>((resolve, reject) => {
    uni.request({
      ...options,
      success(res) {
        // 响应码200xx ，请求成功
        if (res.statusCode >= 200 && res.statusCode < 300) {
          const data = res.data as Data<T>
          if (data.code === '0') {
            resolve(data)
          } else {
            // 处理业务错误
            uni.showToast({
              title: data.msg || '请求错误',
              icon: 'none',
            })
            reject(data)
          }
        } else if (res.statusCode === 401) {
          uni.showToast({
            title: '请登录',
            icon: 'none',
          })
          // 用户未登录，清理用户信息，跳转登录界面
          const memberStore = useMemberStore()
          memberStore.clearProfile()
          uni.navigateTo({ url: '/pages/login/login' })
        } else {
          // 其他错误信息，根据后端的数据返回进行提示
          uni.showToast({
            title: '请求错误',
            icon: 'none',
          })
          reject(res)
        }
      },
      // 响应失败
      fail(err) {
        uni.showToast({
          title: '网络错误',
          icon: 'none',
        })
        reject(err)
      },
    })
  })
}
