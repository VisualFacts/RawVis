import React, {useState} from 'react';
import Highcharts from 'highcharts'
import Piechart from 'highcharts/modules/heatmap.js';
import { Segment, Label} from "semantic-ui-react";
import {IDedupStats} from 'app/shared/model/rect-dedup-stats.model';
import DedupChartPercentage from './dedup-chart-percentage';
import DedupChartSimilarities from './dedup-chart-similarities';
import {IDataset} from "app/shared/model/dataset.model";

Piechart(Highcharts);

export interface IDedupChartProps {
  dedupStats: IDedupStats,
  dataset: IDataset,
}


export const DedupChart = (props: IDedupChartProps) => {
  const {dedupStats, dataset} = props;
  let percentOfDups = 0;
  if (dedupStats != null) percentOfDups = dedupStats.percentOfDups;

  const [chart, setChart] = useState('dedup');


  const handleChartChange = (chartClicked) => () => {
    if (chartClicked === "dedup") {
      setChart("dedup");
    } else if (chartClicked === "similarities") {
      setChart("similarities");
    }
  }
  return <Segment id='chart-container' raised textAlign='center'>
    <Label attached='top' size='large'>Dirtiness Ratio</Label>
    {/* <Button.Group basic>
      <Button onClick={handleChartChange('dedup')} active={chart === 'dedup'}>Dirtiness Ratio</Button> 
     <Button onClick={handleChartChange('similarities')} active={chart === 'similarities'}>Similarities</Button> 
    </Button.Group> */}
    <br/><br/><br/>
    {chart === "dedup" && <DedupChartPercentage dedupStats={dedupStats}/>}
    {/* {chart === "similarities" && <DedupChartSimilarities dataset={dataset} dedupStats={dedupStats}/>} */}
  </Segment>
};


export default DedupChart;
