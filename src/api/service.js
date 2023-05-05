import axios from 'axios'
import { Loading } from 'element-ui'
import { get } from 'lodash'

const Cancel = axios.CancelToken
const httpPending = []

function removeHttpPending(config) {
  for (const p in httpPending) {
    if (httpPending[p].u === config.url + '&' + config.method) { // 当当前请求在数组中存在时执行函数体
      if (config.url.indexOf('/biz/enabled_temp_list') === -1) httpPending[p].f() // 执行取消操作
      httpPending.splice(p, 1)
    }
  }
}

/**
 * @description 创建请求实例
 */
function createService() {
  // 创建一个 axios 实例
  const service = axios.create()
  let loading = null
  // 请求拦截
  service.interceptors.request.use((config) => {
    // 在这里添加loading
    // 配置token
    config.headers.Authorization = 'bearer ' + sessionStorage.getItem('token') || ''
    loading = Loading.service({
      lock: true,
      text: '拼命加载中......',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.2)'
    })
    removeHttpPending(config)
    config.cancelToken = new Cancel(c => {
      httpPending.push({ u: config.url + '&' + config.method, f: c })
    })
    return config
  }, err => Promise.reject(err))

  // 响应拦截
  service.interceptors.response.use(
    response => {
      if (loading) {
        loading.close()
      }
      removeHttpPending(response.config)
      // dataAxios 是 axios 返回数据中的 data
      const dataAxios = response
      // 这个状态码是和后端约定的
      const { code } = dataAxios
      // 根据 code 进行判断
      if (code === undefined) {
        // 如果没有 code 代表这不是项目后端开发的接口 比如可能是 D2Admin 请求最新版本
        return dataAxios
      } else {
        // 有 code 代表这是一个后端接口 可以进行进一步的判断
        switch (code) {
          case '0':
            // [ 示例 ] code === 0 代表有错误
            return dataAxios.data
          case '1':
            // [ 示例 ] code === 1 代表没有错误
            return dataAxios.data
          case 'xxx':
            // errorCreate(`[ code: xxx ] ${dataAxios.msg}: ${response.config.url}`)
            break
          default:
            // 不是正确的 code
            // errorCreate(`${dataAxios.msg}: ${response.config.url}`)
            break
        }
      }
    },
    error => {
      const status = get(error, 'response.status')
      const errorDescription = get(error, 'response.data') && get(error, 'response.data').error_description
      switch (status) {
        case 400:
          if (!errorDescription) {
            if (!error.message) {
              error.message = '请求错误'
            }
          } else {
            error.message = errorDescription
          }
          break
        case 401: error.message = '未授权，请登录'; break
        case 403: error.message = '拒绝访问'; break
        case 404: error.message = `请求地址出错: ${error.response.config.url}`; break
        case 408: error.message = '请求超时'; break
        case 500: error.message = '操作失败，请联系管理员'; break
        case 501: error.message = '操作失败，请联系管理员'; break
        case 502: error.message = '操作失败，请联系管理员'; break
        case 503: error.message = '操作失败，请联系管理员'; break
        case 504: error.message = '操作失败，请联系管理员'; break
        case 505: error.message = '操作失败，请联系管理员'; break
        case undefined: error.message = '重复请求取消'; break
        // case 500: error.message = '系统内部错误，请联系管理员'; break
        // case 501: error.message = '服务未实现'; break
        // case 502: error.message = '网关错误'; break
        // case 503: error.message = '服务不可用'; break
        // case 504: error.message = '网关超时'; break
        // case 505: error.message = 'HTTP版本不受支持'; break
        default: break
      }
      if (loading) {
        loading.close()
      }
      if (error.message === '重复请求取消') {
        return
      }

      return Promise.reject(error)
    }
  )
  return service
}

/**
 * @description 创建请求方法
 * @param {Object} service axios 实例
 */
function createRequestFunction(service) {
  return function (config) {
    const configDefault = {
      headers: {
        Authorization: 'bearer ' + sessionStorage.getItem('token') || '',
        'Content-Type': 'application/json;charset=utf-8'
      },
      timeout: 1000000,
      // baseURL: process.env.VUE_APP_API,
      data: {}
    }
    return service(Object.assign(configDefault, config))
  }
}

// 用于真实网络请求的实例和请求方法
export const service = createService()
export const request = createRequestFunction(service)



