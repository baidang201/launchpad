# stakepad接口测试文档

\
Mac or ubuntu18.04



# 环境
Mac

```javascript
brew install curl
brew install protobuf
```

ubuntu18.04
```javascript
apt  install protobuf-compiler
```

cd  xxx/stakepad/



# 实时矿工列表接口

# 

input

```javascript
echo 'worker_request:{page:1,page_size:5,filter_runing:false,filter_stake_enough:false,filter_commission_less_then:true,sort_field_name:"commission",filter_stash_accounts:[]}'  \
 |  protoc --encode launchpadpackage.CommonRequest  ./proto/message.proto  \
 |  curl -s --request POST  \
--header "Content-Type: application/protobuf" \
--data-binary @- http://localhost:3000  \
| protoc --decode launchpadpackage.WorkerResponse ./proto/message.proto
```


return

```javascript
status {
}
result {
  total: 445
  workers {
    stash_account: "41oo2dvyZKssX44aqJZw7zE2k93cqL4M5ufQ4A5wdfSnF23c"
    controller_account: "43ZeLeF6az3Zu3G4DbYBgW3AXKRquftSjncDyeeeZPmkfJVq"
    payout: "43ZeLeF6az3Zu3G4DbYBgW3AXKRquftSjncDyeeeZPmkfJVq"
    online_status: true
    accumulated_stake: "0"
    profit_last_month: "361875"
    worker_stake: "0"
    user_stake: "0"
    commission: 20
    task_score: 589
    machine_score: 480
    apy: 1
    diff_to_min_stake: 1620
    stake_to_min_apy: 1
  }
  workers {
    stash_account: "44c1uuesshrfAsNceCR1U8q5x31LVL3F2ZoZnZsXz27MUQT5"
    controller_account: "41Ud1FgNChGXiWnb8tL866hcatpcgQyKzsrmm27ucviDCdUq"
    payout: "44c1uuesshrfAsNceCR1U8q5x31LVL3F2ZoZnZsXz27MUQT5"
    online_status: true
    stake_enough: true
    accumulated_stake: "20000"
    profit_last_month: "361875"
    worker_stake: "20000"
    user_stake: "0"
    stake_account_num: 1
    commission: 19
    task_score: 766
    machine_score: 640
    apy: 1
    stake_to_min_apy: 1
  }
  workers {
    stash_account: "44AWvsvajuPAgkrwdetZHKjX3Mri3QKpnb19bq3GuMF1cA7c"
    controller_account: "42cHJbufLrH2QUVNUSxjChE11w1g1wokpJQfDBjtWZ3quoxi"
    payout: "44AWvsvajuPAgkrwdetZHKjX3Mri3QKpnb19bq3GuMF1cA7c"
    online_status: true
    stake_enough: true
    accumulated_stake: "120000"
    profit_last_month: "361875"
    worker_stake: "120000"
    user_stake: "0"
    stake_account_num: 1
    commission: 17
    task_score: 766
    machine_score: 640
    apy: 1
    stake_to_min_apy: 1
  }
  workers {
    stash_account: "451XqvJ1uFtzQRps7xc8We8fQx4eQtpuD6uTVFt4qRVVxKMC"
    controller_account: "43ZwMaZbyqX7c8xWGfPBUNTBt6KrB9AYFx2P6VyTczRvtETV"
    payout: "451XqvJ1uFtzQRps7xc8We8fQx4eQtpuD6uTVFt4qRVVxKMC"
    accumulated_stake: "0"
    profit_last_month: "361875"
    worker_stake: "0"
    user_stake: "0"
    commission: 15
    apy: 1
    diff_to_min_stake: 1620
    stake_to_min_apy: 1
  }
  workers {
    stash_account: "42w95yBGw4VHgAS763F7gUe2jMWVnfEXk81zJGxGeyWJAQeP"
    controller_account: "44vCo4JmRJ4ufW6d9iKSud7Dq2zTx4SV6DniALE2sXVYv7Yz"
    payout: "42w95yBGw4VHgAS763F7gUe2jMWVnfEXk81zJGxGeyWJAQeP"
    online_status: true
    accumulated_stake: "21000"
    profit_last_month: "361875"
    worker_stake: "0"
    user_stake: "21000"
    stake_account_num: 1
    commission: 15
    task_score: 766
    machine_score: 640
    apy: 1
    diff_to_min_stake: 1620
    stake_to_min_apy: 1
  }
}
```


# globalStatisticsRequest全局参数接口

input


```javascript
echo 'global_statistics_request: {}'  \
 |  protoc --encode launchpadpackage.CommonRequest  ./proto/message.proto  \
 |  curl -s --request POST  \
--header "Content-Type: application/protobuf" \
--data-binary @- http://localhost:3000  \
| protoc --decode launchpadpackage.GlobalStatisticsResponse ./proto/message.proto
```


return

```javascript
status {
}
result {
  round: 2472
  round_cycle_time: 3600
  online_worker_num: 2568
  worker_num: 3621
  stake_sum: "73528588"
  stake_supply_rate: 0.514185905
  avg_stake: "20306.155205744268"
  reward_last_round: "0"
}
```


\

# reward/penalty 统计接口

## avgReward


```javascript
echo 'avg_reward_request: {}'  \
 |  protoc --encode launchpadpackage.CommonRequest  ./proto/message.proto  \
 |  curl -s --request POST  \
--header "Content-Type: application/protobuf" \
--data-binary @- http://localhost:3000  \
| protoc --decode launchpadpackage.AvgRewardResponse ./proto/message.proto
```


return

```javascript
status {
}
result {
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "0"
  avg_reward: "278"
}
```


\
## rewardpenalty单个矿工惩罚奖励统计接口

input

```javascript
echo 'reward_penalty_request: {stash_account: "41rqEQk9YWqVt3RHAyDquCauZJyatUDEDDtMTcNfvYP1MTB6"}'  \
 |  protoc --encode launchpadpackage.CommonRequest  ./proto/message.proto  \
 |  curl -s --request POST  \
--header "Content-Type: application/protobuf" \
--data-binary @- http://localhost:3000  \
| protoc --decode launchpadpackage.RewardPenaltyResponse ./proto/message.proto
```


return

```javascript
status {
}
result {
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "0"
  reward: "125"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
  penalty: "0"
}
```

# 

# stake统计接口

## avgstake


input

```javascript
echo 'avg_stake_request: {}'  \
 |  protoc --encode launchpadpackage.CommonRequest  ./proto/message.proto  \
 |  curl -s --request POST  \
--header "Content-Type: application/protobuf" \
--data-binary @- http://localhost:3000  \
| protoc --decode launchpadpackage.AvgStakeResponse ./proto/message.proto
```


return

```javascript
status {
}
result {
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "0"
  avg_stake: "11655"
}
```

# stake信息


## stakeinfo单个矿工抵押统计接口

input

```javascript
echo 'stake_info_request: {stash_account: "41rqEQk9YWqVt3RHAyDquCauZJyatUDEDDtMTcNfvYP1MTB6"}'  \
 |  protoc --encode launchpadpackage.CommonRequest  ./proto/message.proto  \
 |  curl -s --request POST  \
--header "Content-Type: application/protobuf" \
--data-binary @- http://localhost:3000  \
| protoc --decode launchpadpackage.StakeInfoResponse ./proto/message.proto
```


return

```javascript
status {
}
result {
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "0"
  accumulated_stake: "120000"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "0"
  worker_stake: "120000"
}
```

# 


# apy年化接口

input

```javascript
echo 'apy_request: {stash_account: "41rqEQk9YWqVt3RHAyDquCauZJyatUDEDDtMTcNfvYP1MTB6"}'  \
 |  protoc --encode launchpadpackage.CommonRequest  ./proto/message.proto  \
 |  curl -s --request POST  \
--header "Content-Type: application/protobuf" \
--data-binary @- http://localhost:3000  \
| protoc --decode launchpadpackage.ApyResponse ./proto/message.proto
```


return

```javascript
status {
}
result {
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 0
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
  apy: 12.3
}
```

# commission分润率

input

```javascript
echo 'commission_request: {stash_account: "41rqEQk9YWqVt3RHAyDquCauZJyatUDEDDtMTcNfvYP1MTB6"}'  \
 |  protoc --encode launchpadpackage.CommonRequest  ./proto/message.proto  \
 |  curl -s --request POST  \
--header "Content-Type: application/protobuf" \
--data-binary @- http://localhost:3000  \
| protoc --decode launchpadpackage.CommissionResponse ./proto/message.proto
```


return

```javascript
status {
}
result {
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 0
  commission: 21.3
  commission: 21.3
  commission: 21.3
  commission: 21.3
  commission: 21.3
  commission: 21.3
  commission: 21.3
  commission: 21.3
  commission: 21.3
  commission: 21.3
  commission: 21.3
  commission: 21.3
  commission: 21.3
  commission: 21.3
  commission: 21.3
  commission: 21.3
  commission: 21.3
  commission: 21.3
  commission: 21.3
  commission: 21.3
  commission: 21.3
  commission: 21.3
  commission: 21.3
  commission: 21.3
  commission: 21.3
  commission: 21.3
  commission: 21.3
  commission: 21.3
  commission: 21.3
  commission: 100
  commission: 100
  commission: 100
  commission: 100
  commission: 100
  commission: 100
  commission: 100
  commission: 100
  commission: 100
  commission: 100
  commission: 100
  commission: 100
  commission: 100
  commission: 100
  commission: 100
  commission: 100
  commission: 100
  commission: 100
  commission: 100
  commission: 100
  commission: 100
  commission: 100
  commission: 100
  commission: 100
  commission: 100
  commission: 100
  commission: 100
  commission: 100
  commission: 100
  commission: 100
  commission: 100
  commission: 100
  commission: 100
  commission: 100
  commission: 100
  commission: 100
  commission: 100
  commission: 100
  commission: 100
  commission: 100
  commission: 100
  commission: 100
  commission: 100
  commission: 100
  commission: 100
  commission: 100
  commission: 100
  commission: 100
  commission: 100
  commission: 100
  commission: 100
  commission: 100
  commission: 100
  commission: 100
  commission: 100
  commission: 100
  commission: 100
  commission: 100
  commission: 100
  commission: 100
  commission: 100
  commission: 100
  commission: 100
  commission: 100
  commission: 100
  commission: 100
  commission: 100
  commission: 100
  commission: 100
}
```

# 