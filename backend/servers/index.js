import pQueue from 'p-queue'
import { ApiPromise, WsProvider } from '@polkadot/api'
import Demical from 'decimal.js'
import types from './typedefs.json'
import BN from 'bn.js'

import { Status } from './models/status'
import { RealtimeRoundInfo } from './models/realtimeRoundInfo'


const { default: Queue } = pQueue

const ONE_THOUSAND = new BN('1000', 10)
const ZERO = new BN('0')
const LAST_BLOCK = 1304000
const LAST_ROUND = 2181
const DEFAULT_OUTPUT = 'null'

const queue = new Queue({
  timeout: 30000,
  throwOnTimeout: true,
  concurrency: 1
})

let jsonOutput = DEFAULT_OUTPUT
let lastBlockHeader
let _status = null

const main = async () => {
  console.log("###hello, world!!");
}

const init = async()=> {
  _status = await Status.findOne({});
  if (!_status) {
      _status = new Status({
          head_block_number: 0,
          time: null,
          head_block_id: "",
          last_irreversible_block_num: 0,

          last_scan_number: 0,
          last_scan_time: null
      });
      await _status.save();
  }
  //console.log("status:" + JSON.stringify(this.status));
}

main().catch((error) => {
  console.error(error);
  process.exit(-1);
})

