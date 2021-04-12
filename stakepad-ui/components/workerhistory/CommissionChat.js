import React from 'react';
import ReactECharts from 'echarts-for-react';
import {getDay} from '../../utils/date.js'

function CommissionChat() {
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
      text: '分润'
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

export default CommissionChat