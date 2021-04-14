//node --experimental-json-modules apitest.js
import {getWorkers,getGlobalStatistics,
  getAvgStakeHistory, getWorkerStakeHistory,
  getAvgRewardHistory, getWorkerRewardHistory,
  getApyHistory,getCommissionHistory, getNotice} from '../utils/api.js'
import {logger} from '../utils/log.js'

{
  const rt = await getWorkers(1, 10, true, false, false, "commission", [])
  logger.info('resObj', rt)
}
{
  const rt = await getGlobalStatistics()
  logger.info('resObj', rt)
}
{
  const rt = await getAvgStakeHistory()
  logger.info('resObj', rt)
}
{
  const rt = await getWorkerStakeHistory("42SrMJERV2P2aDcLbDdUdRNaPGzQZU8hNUuJDgMitUGqFp5q")
  logger.info('resObj', rt)
}
{
  const rt = await getAvgRewardHistory()
  logger.info('resObj', rt)
}
{
  const rt = await getWorkerRewardHistory("42SrMJERV2P2aDcLbDdUdRNaPGzQZU8hNUuJDgMitUGqFp5q")
  logger.info('resObj', rt)
}
{
  const rt = await getApyHistory("42SrMJERV2P2aDcLbDdUdRNaPGzQZU8hNUuJDgMitUGqFp5q")
  logger.info('resObj', rt)
}
{
  const rt = await getCommissionHistory("42SrMJERV2P2aDcLbDdUdRNaPGzQZU8hNUuJDgMitUGqFp5q")
  logger.info('resObj', rt)
}
{
  const rt = await getNotice()
  logger.info('resObj', rt)
}