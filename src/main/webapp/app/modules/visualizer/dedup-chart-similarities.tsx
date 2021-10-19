import React, {useState} from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import CustomEvents from "highcharts-custom-events";
import _ from 'lodash';
import { IDedupStats } from 'app/shared/model/rect-dedup-stats.model';
import { Button, Header, Image, Modal } from 'semantic-ui-react'
import './visualizer.scss';
import {IDataset} from "app/shared/model/dataset.model";

export interface IDedupChartSimilaritiesProps {
  dedupStats: IDedupStats,
  dataset: IDataset,
}


const createSimilarityData = (similarityMeasures, columns) => {
  const data = [];
  const cols = [];
  for (let i = 0; i < columns.length; i++) {
      if (similarityMeasures[i] > 0){
        cols.push(columns[i])
        data.push({y : similarityMeasures[i]})
    }
  }
  return [data, cols];
}

const createColumnValueData = (columnValues) => {
  const data = [];
  for (const colVal in columnValues) {
    if (colVal in columnValues)
      data.push({name: colVal, y: columnValues[colVal]});
  }
  return data;
}


export const DedupChartSimilarities = (props: IDedupChartSimilaritiesProps) => {
  const {dedupStats, dataset} = props;
  let similarityMeasures = null;
  let similarities = [];
  let similarityData = {};
  let similariyColumns = [];
  let columnData = {};
  const [chart, setChart] = useState('similarities');
  const [colId, setColId] = useState('');
  if(dedupStats != null) {
    similarityMeasures =  dedupStats.similarityMeasures;
    similarities = createSimilarityData(similarityMeasures, dataset.headers);
    similarityData = similarities[0];
    similariyColumns = similarities[1];
    columnData = createColumnValueData(dedupStats.columnValues[colId]);
  }


  const changeChart = (id) => {
    // const start = '<span class="text-center">';
    // const end = '</span>';
    // colId = colId.replace(start, "").replace(end, "");
    setChart("col");
    setColId(id);
  }

  const options = {
    chart: {
      type: 'bar',
      height: '330px',
      marginTop: 10,
      paddingTop: 0,
      marginBottom: 50,
      paddingBottom:40,
      plotBorderWidth: 1,
      scrollablePlotArea: {
        minHeight: 800,
        scrollPositionY: 0
    }

    },
    
    xAxis: {
      categories: similariyColumns,
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
            const val = this.value.replace( /(<([^>]+)>)/ig, '')
            const id = dataset.headers.indexOf(val)
            changeChart(id);
          }
        },
        formatter() {
          return `<span class="text-center">${this.value}</span>`
        }
      },
   },
   yAxis: {
    max: 1,
    title: {
      text: "Attribute Similarities",
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
    title: "Similarities",
    series: [{
      name: "Similarity",
      data: similarityData
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
    {chart==="similarities" && < HighchartsReact
      highcharts={CustomEvents(Highcharts)}
      allowChartUpdate={true}
      immutable={true}
      options = {options}
    />}
    {chart==="col"  &&
    <div style={{border:"solid lightgrey 2px"}}>
    <div className="column-value-chart-title">{dataset.headers[colId]} value distribution</div>
    <div onClick={() => setChart("similarities")} className="x-button2">x</div>
    <HighchartsReact
      highcharts={CustomEvents(Highcharts)}
      allowChartUpdate={true}
      immutable={true}
      options = {colOptions}
    />
    </div>}
    </div>
};



export default DedupChartSimilarities;
