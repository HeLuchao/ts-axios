import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import xhr from './xhr'
import { buildURL, isAbsoluteURL, combineURL } from '../../utils/url'
import { flattenHeaders } from '../../utils/util'
import transform from './transform'

export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
    throwIfRequested(config)
    processConfig(config)
    return xhr(config).then(res => {
        return transformResponseData(res)
    })
}

function processConfig(config: AxiosRequestConfig): void {
    config.url = transformURL(config)
    config.data = transform(config.data, config.headers, config.transformRequest)
    config.headers = flattenHeaders(config.headers, config.method!)
}

export function transformURL(config: AxiosRequestConfig): string {
    let { url, params, paramsSerializer, baseURL } = config
    if (baseURL && !isAbsoluteURL(url!)) {
        url = combineURL(baseURL, url)
    }
    return buildURL(url, params, paramsSerializer)
}

function transformResponseData(res: AxiosResponse): AxiosResponse {
    res.data = transform(res.data, res.headers, res.config.transformResponse)
    return res
}

function throwIfRequested(config: AxiosRequestConfig): void {
    if (config.cancelToken) {
        config.cancelToken.throwIfRequested()
    }
}
