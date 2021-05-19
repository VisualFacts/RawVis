import React, {useState} from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official';
import Piechart from 'highcharts/modules/heatmap.js';
import _ from 'lodash';
import { IDedupStats } from 'app/shared/model/rect-dedup-stats.model';


export interface IDedupChartSimilaritiesProps {
  dedupStats: IDedupStats,
  columns: any,
}


export const DedupChartSimilarities = (props: IDedupChartSimilaritiesProps) => {
  const {dedupStats, columns} = props;
  let similarityMeasures = null;
  if(dedupStats != null) similarityMeasures =  dedupStats.similarityMeasures;
  console.log(similarityMeasures);
  const [chart, setChart] = useState('dedup');

  const options = {
    chart: {
      type: 'bar',
      height: '330px',
      marginTop: 10,
      paddingTop: 0,
      marginBottom: 50,
      paddingBottom:20,
      plotBorderWidth: 1
      
    },
    xAxis: {
      categories: columns,
      title: {
          text: null
      },
      labels: {
        rotation: -45,
        style: {
            fontSize: '8px',
            fontFamily: 'Verdana, sans-serif'
        }
      }
   },
   yAxis: {
    max: 1,
  },
    plotOptions: {
      bar: {
        dataLabels: {
            enabled: false
        }
      }
    },
    legend: {
      enabled: false
    },
    title: "Similarity Measure",
    series: [{
      name: "Similarity Measure",
      data: [
        { y: 0.5},
        { y: 0.4},
        { y: 1},
        { y: 0},
        { y: 0},
        { y: 0.1},
        { y: 0.344},
        { y: 0.1},
        { y: 0.24},
        { y: 0.7},
        { y: 0.8},
        { y: 0.9},
        { y: 1},
        { y: 1},
        { y: 1},
        { y: 0},
        { y: 0},
        { y: 0.2},
        { y: 0.15},
        { y: 0.35},
      ],
      
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


export default DedupChartSimilarities;
