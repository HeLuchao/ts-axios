import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'

import { parseHeaders } from '../../utils/headers'

import { createError } from '../../utils/error'

import { isUrlSameOrigin } from '../../utils/url'

import cookie from '../../utils/cookie'

import { isFormData } from '../../utils/util'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
    return new Promise((resolve, reject) => {
        const {
            url,
            method = 'get',
            data = null,
            headers = {},
            responseType,
            timeout,
            cancelToken,
            withCredentials,
            xsrfCookieName,
            xsrfHeaderName,
            onDownloadProgress,
            onUploadProgress,
            auth,
            validateStatus
        } = config

        const request = new XMLHttpRequest()

        request.open(method.toUpperCase(), url, true)

        // config
        configureRequest()

        // events
        addEvents()

        processHeaders()

        processCancel()

        request.send(data)

        function configureRequest(): void {
            if (responseType) {
                request.responseType = responseType
            }

            if (timeout) {
                request.timeout = timeout
            }

            if (withCredentials) {
                request.withCredentials = withCredentials
            }
        }

        function addEvents() {
            request.onreadystatechange = function handleLoad() {
                if (request.readyState !== 4) {
                    return
                }

                if (request.status === 0) {
                    return
                }

                const responseHeaders = parseHeaders(request.getAllResponseHeaders())
                const responseData =
                    responseType !== 'text' ? request.response : request.responseText
                const response: AxiosResponse = {
                    data: responseData,
                    status: request.status,
                    statusText: request.statusText,
                    headers: responseHeaders,
                    config,
                    request
                }
                handleResponse(response)
            }
            request.onerror = function handleError() {
                reject(createError('Network Error', config, null as any, request))
            }

            request.ontimeout = function handleTimeout() {
                reject(
                    createError(
                        `Timeout of ${timeout} ms exceeded`,
                        config,
                        'ECONNABORTED',
                        request
                    )
                )
            }

            if (onDownloadProgress) {
                request.onprogress = onDownloadProgress
            }

            if (onUploadProgress) {
                request.upload.onprogress = onUploadProgress
            }
        }

        function processHeaders(): void {
            if (isFormData(data)) {
                delete headers['Content-Type']
            }

            if (withCredentials || (isUrlSameOrigin(url) && xsrfCookieName)) {
                const xsrfVal = cookie.read(xsrfCookieName as string)
                if (xsrfHeaderName && xsrfVal) {
                    headers[xsrfHeaderName] = xsrfVal
                }
            }

            if (auth) {
                headers['Authorization'] = 'Basic ' + btoa(auth.username + ':' + auth.password)
            }

            Object.keys(headers).forEach(name => {
                if (data === null && name.toLowerCase() === 'content-type') {
                    delete headers[name]
                } else {
                    request.setRequestHeader(name, headers[name])
                }
            })
        }

        function processCancel(): void {
            if (cancelToken) {
                cancelToken.promise.then(reason => {
                    request.abort()
                    reject(reason)
                })
            }
        }

        function handleResponse(response: AxiosResponse): void {
            if (!validateStatus || validateStatus(response.status)) {
                resolve(response)
            } else {
                reject(
                    createError(
                        `Request failed with status code ${response.status}`,
                        config,
                        null as any,
                        request,
                        response
                    )
                )
            }
        }
    })
}
