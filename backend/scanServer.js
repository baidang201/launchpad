import {init, main}  from "./servers/index.js";

await init();

main().catch((error) => {
  console.error(error);
  process.exit(-1);
})
