import realtimeServer  from "./servers/index.js";
import BlocksHistoryScan  from "./servers/history.js";

await realtimeServer.init();

const blocksHistoryScan = new BlocksHistoryScan();
await blocksHistoryScan.init();

// realtimeServer.main().catch((error) => {
//   console.error(error);
//   process.exit(-1);
// })

blocksHistoryScan.main().catch((error) => {
  console.error(error);
  process.exit(-1);
})
