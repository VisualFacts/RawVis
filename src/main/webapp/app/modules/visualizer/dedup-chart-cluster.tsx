import React, {useState} from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official';
import CustomEvents from 'highcharts-custom-events';
import {Header, Icon, Label, Segment, Dropdown} from 'semantic-ui-react'
import './visualizer.scss';
import {IDataset} from "app/shared/model/dataset.model";
import {unselectDuplicateCluster, updateDedupColumn} from "app/modules/visualizer/visualizer.reducer";
import { forIn } from 'lodash';



export interface IDedupChartClusterProps {
  duplicateCluster: any,
  clusterIndex: number,
  dataset: IDataset,
  dedupColumn: number,
  updateDedupColumn: typeof updateDedupColumn,
  unselectDuplicateCluster: typeof unselectDuplicateCluster
}



const createColumnValueData = (columnValues) => {
  const drilldown = {};
  const columnData = []
  for (const colVal in columnValues) {
    if (colVal in columnValues){
      columnData.push({name: colVal, y: columnValues[colVal].length})
      let data = [];
      const len = columnValues[colVal].length;
      for (let i = 0; i < len; i++){
        data.push(columnValues[colVal][i]);
      }
      drilldown[colVal] = data;
      }
  }
  
  return {drilldown, columnData};
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

  let colDic = {}
  let drilldown = {};
  let columnData = [];
  let chartColumnData = [];
 
  chartColumnData = createChartColumnData(dataset.headers);
  colDic = (props.dedupColumn != null && duplicateCluster != null) && createColumnValueData(duplicateCluster[4][props.dedupColumn]);
  columnData = colDic["columnData"];
  drilldown = colDic["drilldown"];
  const handleDedupColumnChange = (e, value) => {
    props.updateDedupColumn(value);
  }
  const colOptions = {
    chart: {
      type: 'pie',
      height: '300px',
      marginTop: 10,
      paddingTop: 0,
      marginBottom: 50,
      paddingBottom: 20,
      plotBorderWidth: 1,
      // events: {
      //   drilldown: function(e) {
      //     var chart = this;
        
      //     chart.addSingleSeriesAsDrilldown(e.point, {
      //          name: "New",
      //           color: "green",
      //           data: drilldown[e.point.name].data
      //     });
             
      //     chart.applyDrilldown();
      //   }
        
      // }

    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<div style="display:inline-block;font-size:6px;"><b>{point.name}</b></span>'
        },
        
        colors: ["rgba(124, 181, 236, 0.8)", "rgba(181 ,124, 236, 0.8)"]
      }
    },
    legend: {
      enabled: false
    },
    tooltip: {
      formatter() {   // Use a normal fn, not a fat arrow fn
        // Access properties using `this`
        // Return HTML string
        const key = this.key;
        const data = drilldown[key];
        let s = '<div font-size:6px;"><b>Sources:<br></b>'
        for(let i = 0; i < data.length; i ++){
          s += data[i] + "<br>";
        }
        s+= '</div>';
        return s;

      },
      shared: true
    },
    title: null,
    series: [{
      name: "Count",
      data: columnData,
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
