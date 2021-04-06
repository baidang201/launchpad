import React from 'react';
import ReactECharts from 'echarts-for-react';
import {getDay} from '../../utils/date.js'

function StakeChat() {
  return <ReactECharts
    option={getOption()}
    notMerge={true}
    lazyUpdate={true}
  />
}

const xdata=[];
for(var i=0;i<30;i++){
    xdata.push(getDay(i));
}

const sdata=[];
for(var i=0;i<30;i++){
    if(i%2==0){
        sdata.push(10);
    }else{
        sdata.push(20);
    }
}

const option = {
    title: {
      text: '矿机抵押量/矿机自己抵押量/全局平均抵押量'
    },
    grid:{
        width:'50%',
        height:'50%',
    },
    tooltip : {
        trigger: 'axis',
    },
    xAxis: {
        type: 'category',
        data: xdata,
        axisLabel:{
            showMaxLabel:true,
        }
        
    },
    yAxis: {
        type: 'value'
    },
    series: [{
        data: sdata,
        type: 'line',
        smooth: true
    }]
};

function getOption() {
  return option;
}

export default StakeChat