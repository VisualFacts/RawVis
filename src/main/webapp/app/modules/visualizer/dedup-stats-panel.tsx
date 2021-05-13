import React, {useState} from 'react';
import {IDataset} from "app/shared/model/dataset.model";
import {Dropdown, Label, Segment, Statistic} from "semantic-ui-react";
import {IRectStats} from "app/shared/model/rect-stats.model";
import {IDedupStats} from "app/shared/model/rect-dedup-stats.model";


export interface IStatsPanelProps {
  dataset: IDataset,
  dedupStats: IDedupStats,

}


export const DedupStatsPanel = (props: IStatsPanelProps) => {
  const {dataset, dedupStats} = props;
  const formatStat = (stat) => stat != null ? (parseFloat(stat) * 100).toFixed(3) + ' %' : 'N/A';
  let percentOfDups = 0;
  if(dedupStats != null)
    percentOfDups = dedupStats.percentOfDups;
  return <Segment id='stats-panel' textAlign='left' raised padded>
    <Label attached='top' size='large'>Statistics</Label>
    <Statistic.Group widths='five' className='field-stats'>
      <Statistic>
        <Statistic.Value>{formatStat(percentOfDups)}</Statistic.Value>
        <Statistic.Label>Duplicates</Statistic.Label>
      </Statistic>
      
    </Statistic.Group>
  </Segment>
};


export default DedupStatsPanel;
