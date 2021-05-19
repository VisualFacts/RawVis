import React, {useState} from 'react';
import Highcharts from 'highcharts'
import Piechart from 'highcharts/modules/heatmap.js';
import {Button, Dropdown, Label, Segment} from "semantic-ui-react";
import { IDedupStats } from 'app/shared/model/rect-dedup-stats.model';
import _ from 'lodash';
import DedupChartPercentage from './dedup-chart-percentage';
import DedupChartSimilarities from './dedup-chart-similarities';

Piechart(Highcharts);

export interface IDedupChartProps {
  dedupStats: IDedupStats,
  columns: any,
}


export const DedupChart = (props: IDedupChartProps) => {
  const {dedupStats, columns} = props;
  let percentOfDups = 0;
  if(dedupStats != null) percentOfDups =  dedupStats.percentOfDups;

  const [chart, setChart] = useState('dedup');


  const handleChartChange = (chartClicked) => () => {
    if(chartClicked === "dedup"){
        setChart("dedup");
    }
    else if(chartClicked === "similarities"){
      setChart("similarities");
    }
  }

  return <Segment id='chart-container' raised textAlign='center'>
    <Button.Group basic>
      <Button onClick={handleChartChange('dedup')} active={chart === 'dedup'}>Duplicate Percentage</Button>
      <Button onClick={handleChartChange('similarities')} active={chart === 'similarities'}>Similarity Measures</Button>
    </Button.Group>
    <br/><br/><br/>
    {chart==="dedup" && <DedupChartPercentage dedupStats = {dedupStats}/>}
    {chart==="similarities" && <DedupChartSimilarities columns = {columns} dedupStats = {dedupStats}/> }
  </Segment>
};


export default DedupChart;
