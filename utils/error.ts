import { AxiosRequestConfig, AxiosResponse } from '../src/types'
export class AxiosError extends Error {
    isAxiosError: boolean
    config: AxiosRequestConfig
    code?: string
    request?: any
    response?: AxiosResponse

    constructor(
        message: string,
        config: AxiosRequestConfig,
        code?: string,
        request?: any,
        response?: AxiosResponse
    ) {
        super(message)
        this.config = config
        this.code = code
        this.request = request
        this.response = response
        this.isAxiosError = true
        // set the prototype to the instance of the class
        Object.setPrototypeOf(this, AxiosError.prototype)
    }
}

export function createError(
    message: string,
    config: AxiosRequestConfig,
    code?: string,
    request?: any,
    response?: AxiosResponse
): AxiosError {
    return new AxiosError(message, config, code, request, response)
}
