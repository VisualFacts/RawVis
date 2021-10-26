import React, {useState} from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official';
import CustomEvents from 'highcharts-custom-events';
import {Header, Icon, Label, Segment, Dropdown} from 'semantic-ui-react'
import './visualizer.scss';
import {IDataset} from "app/shared/model/dataset.model";
import {unselectDuplicateCluster, updateDedupColumn} from "app/modules/visualizer/visualizer.reducer";

export interface IDedupChartClusterProps {
  duplicateCluster: any,
  clusterIndex: number,
  dataset: IDataset,
  dedupColumn: number,
  updateDedupColumn: typeof updateDedupColumn,
  unselectDuplicateCluster: typeof unselectDuplicateCluster
}

// const createSimilarityData = (similarityMeasures, columns) => {
//   const data = [];
//   const cols = [];
//   for (let i = 0; i < columns.length; i++) {
//       if (similarityMeasures[i] > 0){
//         cols.push(columns[i])
//         data.push({y : similarityMeasures[i]})
//     }
//   }
//   return [data, cols];
// }

const createColumnValueData = (columnValues) => {
  const data = [];
  for (const colVal in columnValues) {
    if (colVal in columnValues)
      data.push({name: colVal, y: columnValues[colVal]});
  }
  return data;
}

const createChartColumnData = (columns) => {
  const data = [];
  for (let i = 0; i < columns.length; i ++){
    data.push({text: columns[i], value : i});
  }
  return data;
}

export const DedupChartCluster = (props: IDedupChartClusterProps) => {
  const {duplicateCluster, clusterIndex, dataset, dedupColumn} = props;
  // let similarityMeasures = null;
  // let similarities = [];
  // let similarityData = {};
  // let similariyColumns = [];
  let columnData = {};
  let chartColumnData = [];
  // const [chart, setChart] = useState('clusterSimilarities');
  // const [colId, setColId] = useState(0);
  // similarityMeasures = duplicateCluster[4];
  // similarities = createSimilarityData(similarityMeasures, dataset.headers);
  // similarityData = similarities[0];
  // similariyColumns = similarities[1];
  chartColumnData = createChartColumnData(dataset.headers);
  columnData = props.dedupColumn != null && createColumnValueData(duplicateCluster[4][props.dedupColumn]);
  const changeChart = (id) => {
    // setChart("clusterCol");
    // setColId(id);
  }
  const handleDedupColumnChange = (e, value) => {
    props.updateDedupColumn(value);
  }

  // const options = {
  //   chart: {
  //     type: 'bar',
  //     height: '330px',
  //     marginTop: 10,
  //     paddingTop: 0,
  //     marginBottom: 50,
  //     paddingBottom: 40,
  //     plotBorderWidth: 1,
  //     scrollablePlotArea: {
  //       minHeight: 200,
  //       scrollPositionY: 0
  //   }

  //   },
  //   xAxis: {
  //     categories: similariyColumns,
  //     title: {
  //       text: null
  //     },
  //     labels: {
  //       rotation: -45,
  //       useHTML: true,
  //       style: {
  //         fontSize: '8px',
  //         fontFamily: 'Verdana, sans-serif',
  //         cursor: 'pointer'
  //       },
  //       events: {
  //         click(e) {
  //           const val = this.value.replace( /(<([^>]+)>)/ig, '')
  //           const id = dataset.headers.indexOf(val)
  //           changeChart(id);
  //         }
  //       },
  //       formatter() {
  //         return `<span class="text-center">${this.value}</span>`
  //       }
  //     },
  //   },
  //   yAxis: {
  //     max: 1,
  //     title: {
  //       text: "Attribute Similarity",
  //       x: -20
  //     },
  //   },
  //   plotOptions: {
  //     bar: {
  //       dataLabels: {
  //         enabled: false
  //       }
  //     }
  //   },
  //   legend: {
  //     enabled: false
  //   },
  //   title: "Similarities",
  //   series: [{
  //     name: "Similarity",
  //     data: similarityData
  //   }]
  // };

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
    <Label attached='top' size='large'><Icon name='close' size="mini"
                                                                       style={{float: "right"}}
                                                                       onClick={() => props.unselectDuplicateCluster()}/></Label>
    <Segment textAlign='left' style={{border: "none"}}>
      <Header as='h5' className="dedup-cluster-subtitle" >Details</Header>
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
    <Segment textAlign='left'>
      <h5>Values for field: <Label><Dropdown
      options={chartColumnData}
      inline
      scrolling = {true}
      placeholder = {dataset.headers[0]}
      value={dedupColumn}
      onChange={(event, data) => handleDedupColumnChange(event, data.value)}/></Label>
    </h5>
      <div style={{border: "solid lightgrey 2px", background: "white"}}>
        <HighchartsReact
          highcharts={CustomEvents(Highcharts)}
          allowChartUpdate={true}
          immutable={true}
          options={colOptions}
        />
      </div>
    </Segment>
  </Segment.Group>
};


export default DedupChartCluster;
