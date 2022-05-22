import { AxiosRequestConfig } from '../types'
import { isPlainObject, deepMerge } from '../../utils/util'

const stratData = Object.create(null)

function defaultStart(val1: any, val2: any): any {
    return typeof val2 === 'undefined' ? val2 : val1
}

function fromVal2(val1: any, val2: any): any {
    if (typeof val2 !== 'undefined') {
        return val2
    }
}

function deepMergeStrat(val1: any, val2: any): any {
    if (isPlainObject(val2)) {
        return deepMerge(val1, val2)
    } else if (typeof val2 !== 'undefined') {
        return val2
    } else if (isPlainObject(val1)) {
        return deepMerge(val1)
    } else if (typeof val1 !== 'undefined') {
        return val1
    }
}

const stratKeysFromVal2 = ['url', 'params', 'data']

stratKeysFromVal2.forEach(key => {
    stratData[key] = fromVal2
})

const stratKeysDeepMerge = ['headers', 'auth']

stratKeysDeepMerge.forEach(key => {
    stratData[key] = deepMergeStrat
})

export default function mergeConfig(
    config1: AxiosRequestConfig,
    config2?: AxiosRequestConfig
): AxiosRequestConfig {
    if (!config2) {
        config2 = ({} as unknown) as AxiosRequestConfig
    }
    const config = Object.create(null)
    for (let key in config2) {
        mergeFields(key)
    }

    for (let key in config1) {
        if (config2 && !config2[key]) {
            mergeFields(key)
        }
    }

    function mergeFields(key: string): void {
        const strat = stratData[key] || defaultStart
        config[key] = strat(config1[key], config2![key])
    }

    return config
}
