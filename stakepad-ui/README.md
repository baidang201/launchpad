# Stakepad-UI 前端

### Prepare
```sh
yarn install        # install dependencies

yarn build:pbjs     # build protobuf API static module
yarn build:pbts     # build protobuf API typings

yarn typegen:defs   # build polkadot augmented types
yarn typegen:meta   # build polkadot augmented API typings
```

### Environment variables
```sh
API_ENDPOINT=https://stakepad-api-test.phala.network/1/     # protobuf API endpoint
```

### Build for production
```sh
yarn build
```

### Run development server
```sh
yarn dev
```
