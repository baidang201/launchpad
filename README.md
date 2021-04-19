# stakepad monolithic repository

## Backend 后端
```sh
cd backend
```

### 环境要求 nodejs15
```sh
nvm install v15
nvm use v15
```

### 安装依赖包
```sh
npm install 
```

### 启动mongodb服务
```sh
docker-compose -f ./mongo.yaml up -d
```

### 启动接口服务
```sh
npm run start
```

### 启动扫描区块服务
```sh
npm run scandev
```

### （可选）运行测试用客户端代码
```sh
npm i node-fetch && node --experimental-json-modules  ./client.js 
```


## Stakepad-UI 前端

### Prepare
```sh
yarn install        # install dependencies

yarn build:pbjs     # build protobuf API static module
yarn build:pbts     # build protobuf API typings
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
