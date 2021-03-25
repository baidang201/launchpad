# stakepad

# 后端
cd backend

## 环境要求 nodejs15
nvm install v15
nvm use v15

## 安装依赖包
npm install 

## 启动mongodb服务
docker-compose -f ./mongo.yaml up -d

## 启动接口服务
npm run start

## 启动扫描区块服务
npm run scandev

## （可选）运行测试用客户端代码
npm i node-fetch && node --experimental-json-modules  ./client.js 


# 前段
cd launchpad-ui


# 更新proto后重新编译为json文件
cd backend
node ./buildProtoJson.js