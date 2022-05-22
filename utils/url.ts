import { isDate, isPlainObject, encode, isURLSearchParams } from './util'

export function buildURL(
    url: string,
    params?: any,
    paramsSerializer?: (params: any) => string
): string {
    if (!params) {
        return url
    }
    let serializedParams

    if (paramsSerializer) {
        serializedParams = paramsSerializer(params)
    } else if (isURLSearchParams(params)) {
        serializedParams = params.toString()
    } else {
        const parts: string[] = []
        Object.keys(params).forEach(key => {
            let val = params[key]
            if (val === null || typeof val === 'undefined') {
                return
            }
            let values = []
            if (Array.isArray(val)) {
                values = val
                key += '[]'
            } else {
                values = [val]
            }
            values.forEach(val => {
                if (isDate(val)) {
                    val = val.toISOString()
                } else if (isPlainObject(val)) {
                    val = JSON.stringify(val)
                }
                parts.push(`${encode(key)}=${encode(val)}`)
            })
        })
        serializedParams = parts.join('&')
    }

    if (serializedParams) {
        const markIndex = url.indexOf('#')
        if (markIndex !== -1) {
            url = url.slice(0, markIndex)
        }
        url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
    } else {
        url = url.slice(0, -1)
    }

    return url
}

export function isAbsoluteURL(url: string): boolean {
    return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
}

export function combineURL(baseURL: string, relativeURL?: string): string {
    return relativeURL
        ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
        : baseURL
}

export function isUrlSameOrigin(requestUrl: string): boolean {
    const parsedOrigin = resolveUrl(requestUrl)
    return (
        parsedOrigin.protocol === currentOrigin.protocol && parsedOrigin.host === currentOrigin.host
    )
}

const urlParsingNode = document.createElement('a')
const currentOrigin = resolveUrl(window.location.href)

interface URLOrigin {
    protocol: string
    host: string
    [propName: string]: string
}

function resolveUrl(url: string): URLOrigin {
    urlParsingNode.setAttribute('href', url)
    return {
        href: urlParsingNode.href,
        protocol: urlParsingNode.protocol,
        host: urlParsingNode.host,
        search: urlParsingNode.search,
        hash: urlParsingNode.hash,
        hostname: urlParsingNode.hostname,
        port: urlParsingNode.port,
        pathname: urlParsingNode.pathname
    }
}
