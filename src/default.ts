import { AxiosRequestConfig } from './types'
import xhr from './core/xhr'
import qs from 'qs'
import { transformRequest, transformResponse } from '../utils/data'
import { processHeaders } from '../utils/headers'

const defaults: AxiosRequestConfig = {
    method: 'get',
    url: '',
    baseURL: '',
    headers: {
        common: {
            Accept: 'application/json, text/plain, */*'
        }
    },
    timeout: 0,
    transformRequest: [
        function(data: any, headers: any): any {
            processHeaders(headers, data)
            return transformRequest(data)
        }
    ],
    transformResponse: [
        function(data: any): any {
            return transformResponse(data)
        }
    ],
    params: {},
    paramsSerializer: function(params: any): string {
        return qs.stringify(params)
    },
    data: {},
    withCredentials: false,
    auth: undefined,
    validateStatus: function(status: number): boolean {
        return status >= 200 && status < 300
    },
    adapter: function(config: AxiosRequestConfig): any {
        return xhr(config)
    },
    responseType: 'json',
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
    onDownloadProgress: function(e: ProgressEvent): void {},
    onUploadProgress: function(e: ProgressEvent): void {},
    maxContentLength: -1,
    maxBodyLength: -1,
    maxRedirects: 5,
    httpAgent: undefined,
    httpsAgent: undefined,
    proxy: undefined,
    socketPath: null,
    responseEncoding: null
}

const methodsNoData = ['delete', 'get', 'head', 'options']

methodsNoData.forEach(method => {
    defaults.headers[method] = {}
})

const methodsWithData = ['post', 'put', 'patch']

methodsWithData.forEach(method => {
    defaults.headers[method] = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
})

export default defaults
