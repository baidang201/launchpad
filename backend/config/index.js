export const db = {
  mongodb: process.env.MONGODB || "mongodb://mongo:mongo@localhost/launchpad?authSource=admin"
}

export const node = {
  WS_ENDPOINT: process.env.WS_ENDPOINT || 'wss://poc3a.phala.network/ws',
  HTTP_PORT: process.env.HTTP_PORT ? parseInt(process.env.HTTP_PORT) : 3000
}

export const api = {
  prefix: '/api',
  version: '/v1'
}