import React, {useState} from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official';
import CustomEvents from 'highcharts-custom-events';
import {Header, Icon, Label, Segment} from 'semantic-ui-react'
import './visualizer.scss';
import {IDataset} from "app/shared/model/dataset.model";
import {unselectDuplicateCluster} from "app/modules/visualizer/visualizer.reducer";

export interface IDedupChartClusterProps {
  duplicateCluster: any,
  clusterIndex: number,
  dataset: IDataset,
  unselectDuplicateCluster: typeof unselectDuplicateCluster
}

const createSimilarityData = (similarityMeasures, columns) => {
  const data = [];
  for (let i = 0; i < columns.length; i++) {
    const col = columns[i];
    data.push({y: i in similarityMeasures ? similarityMeasures[i] : 0.0})
  }
  return data;
}

const createColumnValueData = (columnValues) => {
  const data = [];
  for (const colVal in columnValues) {
    if (colVal in columnValues)
      data.push({name: colVal, y: columnValues[colVal]});
  }
  return data;
}

export const DedupChartCluster = (props: IDedupChartClusterProps) => {
  const {duplicateCluster, clusterIndex, dataset} = props;
  let similarityMeasures = null;
  let data = {};
  let columnData = {};
  const [chart, setChart] = useState('clusterSimilarities');
  const [col, setCol] = useState(null);

  similarityMeasures = duplicateCluster[4];
  data = createSimilarityData(similarityMeasures, dataset.headers);
  columnData = col != null && createColumnValueData(duplicateCluster[5][col]);

  const changeChart = (column) => {
    setChart("clusterCol");
    setCol(column);
  }

  const options = {
    chart: {
      type: 'bar',
      height: '330px',
      marginTop: 10,
      paddingTop: 0,
      marginBottom: 50,
      paddingBottom: 40,
      plotBorderWidth: 1

    },
    xAxis: {
      categories: dataset.headers,
      title: {
        text: null
      },
      labels: {
        rotation: -45,
        useHTML: true,
        style: {
          fontSize: '8px',
          fontFamily: 'Verdana, sans-serif',
          cursor: 'pointer'
        },
        events: {
          click(e) {
            changeChart(this.pos);
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
      paddingBottom: 20,
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
        colors: ["rgba(124, 181, 236, 0.8)", "rgba(181 ,124, 236, 0.8)"]
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

  return <Segment.Group raised padded>
    <Segment textAlign='left'>
      <Label attached='top' size='large'>Cluster #{clusterIndex} <Icon name='close' size="mini"
                                                                       style={{float: "right"}}
                                                                       onClick={() => props.unselectDuplicateCluster()}/></Label>
      {chart === "clusterSimilarities" &&
      <div>
        <Header as='h5' className="dedup-cluster-subtitle" dividing>Distance Measures</Header>
        <HighchartsReact
          highcharts={CustomEvents(Highcharts)}
          allowChartUpdate={true}
          immutable={true}
          options={options}
        />
      </div>}
      {chart === "clusterCol" &&
      <div style={{border: "solid lightgrey 2px", background: "white"}}>
        <Header as='h5' className="dedup-cluster-subtitle" dividing><i>{dataset.headers[col]}</i> value
          distribution</Header>
        <div onClick={() => setChart("clusterSimilarities")} className="x-button">x</div>
        <HighchartsReact
          highcharts={CustomEvents(Highcharts)}
          allowChartUpdate={true}
          immutable={true}
          options={colOptions}
        />
      </div>}
    </Segment>
    <Segment textAlign='left' style={{border: "none"}}>
      <Header as='h5' className="dedup-cluster-subtitle" dividing>Details</Header>
      <div className="cluster-details">
        {dataset.headers && dataset.headers.map((colName, colIndex) => {
          let val = duplicateCluster[3][colIndex];
          if (val == null) val = "";
          return (
            <div className={`dup-item ${val.includes("|") ? "active" : ""}`}
                 key={`dup-item-${clusterIndex}-${colIndex} ${val.includes("|") ? "active" : ""}`}>
                    <span>
                    <b>{colName}: </b>{val}
                    </span>
              <br></br>
            </div>
          )
        })}
      </div>
    </Segment>
  </Segment.Group>
};


export default DedupChartCluster;
