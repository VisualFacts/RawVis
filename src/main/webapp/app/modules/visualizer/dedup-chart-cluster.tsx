import React, {useState} from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official';
import CustomEvents from "highcharts-custom-events";
import _ from 'lodash';
import { IDedupClusterStats } from 'app/shared/model/rect-dedup-cluster-stats.model';
import { Label } from 'semantic-ui-react'
import './visualizer.scss';

export interface IDedupChartClusterProps {
  dedupClusterStats: IDedupClusterStats,
  columns: any,
}

const createSimilarityData = (similarityMeasures, columns) => {
  const data = [];
  for(let i = 0; i< columns.length; i++){
    const col = columns[i];
    data.push({y: col in similarityMeasures ? similarityMeasures[col] : 0.0})
  }
  return data;
}

const createColumnValueData = (columnValues) => {
  const data = [];
  for(const colVal in columnValues){
    data.push({name: colVal, y : columnValues[colVal]});
  }
  console.log(data);
  return data;
}

export const DedupChartCluster = (props: IDedupChartClusterProps) => {
  const {dedupClusterStats, columns} = props;
  let showNormalChart = true;
  let similarityMeasures = null;
  let data = {};
  let columnData = {};
  let clusterId;
  const [chart, setChart] = useState('clusterSimilarities');
  const [col, setCol] = useState('');

  if(dedupClusterStats != null) {
    similarityMeasures =  dedupClusterStats.clusterColumnSimilarity;
    data = createSimilarityData(similarityMeasures, columns);
    columnData = createColumnValueData(dedupClusterStats.clusterColumnValues[col]);
    clusterId = dedupClusterStats.clusterId;
  }
  
  
  //const [columnData, setColumnData] = useState([]);

  
  const changeChart = (col) => {
    const start = '<span class="text-center">';
    const end = '</span>';
    col = col.replace(start, "").replace(end, "");
    setChart("clusterCol");
    setCol(col);
  }

  const options = {
    chart: {
      type: 'bar',
      height: '330px',
      marginTop: 10,
      paddingTop: 0,
      marginBottom: 50,
      paddingBottom:40,
      plotBorderWidth: 1
      
    },
    xAxis: {
      categories: columns,
      title: {
          text: null
      },
      labels: {
        rotation: -45,
        useHTML: true,
        style: {
            fontSize: '8px',
            fontFamily: 'Verdana, sans-serif',
            cursor:'pointer'
        },
        events: {
          click() {
            changeChart(this.value);
          }
        },
        formatter: function () {
          return `<span class="text-center">${this.value}</span>`
        }
      },
   },
   yAxis: {
    max: 1,
    title: {
      text: "Average Pairwise Distance",
      x: -20
    },
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
    title: "Distance Measure",
    series: [{
      name: "Distance Measure",
      data
    }]
  };

  const colOptions = {
    chart: {
      type: 'pie',
      height: '300px',
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
          colors:["rgba(124, 181, 236, 0.8)", "rgba(181 ,124, 236, 0.8)"]
      }
    },
    legend: {
      enabled: false
    },
    title: null,
    series: [{
      name: "count",
      data: columnData
    }]
  };

  return <div>
    <Label attached='top' size='large'>Cluster #{clusterId} Statistics</Label>
  
    {chart==="clusterSimilarities" &&
      <div style={{border:"solid lightgrey 2px",background:"white"}}>
      <div className="column-value-chart-title">Distance Measures</div>
      < HighchartsReact
      highcharts={CustomEvents(Highcharts)}
      allowChartUpdate={true}
      immutable={true}
      options = {options}
     
    />
     </div>}
    {chart==="clusterCol"  &&  
    <div style={{border:"solid lightgrey 2px",background:"white"}}>
    <div className="column-value-chart-title">{col} value distribution</div>
    <div onClick={() => setChart("clusterSimilarities")} className="x-button">x</div>
    <HighchartsReact
      highcharts={CustomEvents(Highcharts)}
      allowChartUpdate={true}
      immutable={true}
      options = {colOptions}
    />
    </div>}
    </div>
};



export default DedupChartCluster;
