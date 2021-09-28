import React, {useState} from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official';
import Piechart from 'highcharts/modules/heatmap.js';
import _ from 'lodash';
import { IDedupStats } from 'app/shared/model/rect-dedup-stats.model';

Piechart(Highcharts);

export interface IDedupChartPercentageProps {
  dedupStats: IDedupStats,
  
}


export const DedupChartPercentage = (props: IDedupChartPercentageProps) => {
  const {dedupStats} = props;
  let percentOfDups = 0;
  if(dedupStats != null) percentOfDups =  dedupStats.percentOfDups;

  const [chart, setChart] = useState('dedup');

  const options = {
    chart: {
      type: 'pie',
      height: '330px',
      marginTop: 10,
      paddingTop: 0,
      marginBottom: 50,
      paddingBottom:20,
      plotBorderWidth: 1
      
    },
    plotOptions: {
      pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
              enabled: true,
              format: '<div style="display:inline-block;font-size:6px;"><b>{point.name}</b>: {point.percentage:.1f} %</span>'
          },
          colors:["rgba(204, 57, 70, 0.8)", "rgba(110, 204, 57, 0.8)"]
      }
    },
    legend: {
      enabled: false
    },
    title: null,
    series: [{
      name:"%",
      data: [
        {name: 'Duplicates', y: percentOfDups* 100},
        {name: 'Non-Duplicates', y: (1 - percentOfDups) * 100}
      ]
    }]
  };

  return (
    <HighchartsReact
      highcharts={Highcharts}
      allowChartUpdate={true}
      immutable={true}
      options = {options}
    />
    );
};


export default DedupChartPercentage;
