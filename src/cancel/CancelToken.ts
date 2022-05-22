import { CancelExecutor, CancelTokenSource, Canceler } from '../types'
import Cancel from './Cancel'

export default class CancelToken {
    promise: Promise<Cancel>
    reason?: Cancel

    constructor(executor: CancelExecutor) {
        let resolvePromise: (reason: Cancel) => void
        this.promise = new Promise<Cancel>((resolve, reject) => {
            resolvePromise = resolve
        })
        executor(message => {
            if (this.reason) {
                return
            }
            this.reason = new Cancel(message)
            resolvePromise(this.reason)
        })
    }

    throwIfRequested() {
        if (this.reason) {
            throw this.reason
        }
    }

    static source(): CancelTokenSource {
        let cancel!: Canceler
        const token = new CancelToken(message => {
            cancel = message
        })
        return {
            token,
            cancel
        }
    }
}
