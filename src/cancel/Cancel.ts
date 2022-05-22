export default class Cancel {
    message: string

    constructor(message?: string) {
        this.message = message as string
    }
}

export function isCancel(value: any): boolean {
    return value instanceof Cancel
}
