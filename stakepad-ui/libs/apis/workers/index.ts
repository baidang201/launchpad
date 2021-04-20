export interface FindWorkerFilters {
    commissionRateLessThan20: boolean
    mining: boolean
    stakePending: boolean
}

export { findWorkersByStash } from './findWorkersByStash'
export {
    getAnnualizedReturnRateHistoryByStash,
    getCommissionRateHistoryByStash,
    getRewardHistoryByStash,
    getStakeHistoryByStash,
    getWorkerByStash
} from './getWorkerByStash'
