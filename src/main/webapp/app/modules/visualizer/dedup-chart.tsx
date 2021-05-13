import React, {useState} from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official';
import Heatmap from 'highcharts/modules/heatmap.js';
import {Button, Dropdown, Label, Segment} from "semantic-ui-react";
import {AggregateFunctionType} from "app/shared/model/enumerations/aggregate-function-type.model";
import { IDedupStats } from 'app/shared/model/rect-dedup-stats.model';
import _ from 'lodash';

Heatmap(Highcharts);

export interface IDedupChartProps {
  dedupStats: IDedupStats
}


export const DedupChart = (props: IDedupChartProps) => {
  const {dedupStats} = props;
  let percentOfDups = 0;
  if(dedupStats != null) percentOfDups =  dedupStats.percentOfDups;
  const [chartType, setChartType] = useState('column');

  const options = {
    chart: {
      type: 'bar',
      height: '250px',
      marginTop: 10,
      paddingTop: 0,
      marginBottom: 50,
      plotBorderWidth: 1
    },
    xAxis: {
      title: {
        text: "Category"
      },
      categories: ["Duplicates", "Non-Duplicates"]
    },
    yAxis: {
      title: {
        text: "Duplicates (%)"
      },
      reversed: false,
      max: 100
    },
    colorAxis: {
      min: 0,
      minColor: '#FFFFFF',
      maxColor: '#2185d0'
    },
    legend: {
      enabled: false
    },
    title: null,
    series: [{
      data: [
        {y: percentOfDups* 100},
        {y: (1 - percentOfDups) * 100}
      ]
    }]

  };

  return <Segment id='chart-container' raised textAlign='center'>
    <HighchartsReact
      highcharts={Highcharts}
      allowChartUpdate={true}
      immutable={true}
      options = {options}
    />
  </Segment>
};


export default DedupChart;
