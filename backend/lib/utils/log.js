import { createLogger } from 'bunyan'

export const logger = createLogger({
  level: 'info',
  name: 'dashboard'
})