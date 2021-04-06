import { createLogger } from 'bunyan'

export let logger = null;

if( !logger ){
  logger = createLogger({
    level: 'info',
    name: 'dashboard'
  })
}