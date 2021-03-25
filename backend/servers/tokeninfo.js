const url = 'https://fxhapi.feixiaohao.com/public/v1/ticker?code=phala';

import rp  from 'request-promise';

let cacheObject = null;
let cacheTime = 0;

export async function getTokenInfo() {
  if (!cacheObject) {
    const r = await refreshCache();
  }
  const now = new Date().getTime();
  if ((now - cacheTime) >  60 * 60 * 1000) {
      refreshCache().catch(console.log);
  }
  const obj = cacheObject || {available_supply: 0};
  return obj;
}


async function refreshCache() {
    console.log('refreshCache');
    const options = {
        uri: url,
        qs: {
        },
        headers: {
            'User-Agent': 'Request-Promise'
        },
        json: true // Automatically parses the JSON string in the response
    };

    const repos = await rp(options)
    if (repos && repos.length) {
        const result = repos[0];
        const obj = getObjectFromFeixiaohaoData(result);
        cacheObject = obj;
        cacheTime = new Date().getTime();
        console.log("refrest cache:" + JSON.stringify(obj));
        return true;
    }
    return false;
}

function getObjectFromFeixiaohaoData(result) {
    const obj = {
        available_supply: result.available_supply,
    }
    return obj;
}