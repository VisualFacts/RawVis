import React, {useState} from 'react';
import {IDataset} from "app/shared/model/dataset.model";
import {Icon, Segment, Statistic} from "semantic-ui-react";

export interface IQueryInfoPanelProps {
  dataset: IDataset,
  fullyContainedTileCount: number,
  tileCount: number,
  pointCount: number,
  ioCount: number,
  totalTileCount: number,
  totalPointCount: number,
  totalTime: number,
  executionTime: number,
}

export const QueryInfoPanel = (props: IQueryInfoPanelProps) => {
  const {
    dataset, fullyContainedTileCount, tileCount, ioCount,
    pointCount, totalPointCount, totalTileCount,
    totalTime, executionTime
  } = props;


  const [expanded, setExpanded] = useState(false);

  const executionPerc = (executionTime / totalTime) * 100;
  const renderPerc = 100 - executionPerc;

  return <Segment id='query-info-panel' className={expanded? 'expanded' : ''} textAlign='left' raised padded>
    <h5 style={{marginBottom: 0}}><Icon name='info'/>Query Evaluation Info <Icon
      onClick={() => setExpanded(!expanded)}
      name={expanded ? 'minus' : 'plus'}
      style={{float: 'right'}}/></h5>
    <Segment basic compact style={{display: expanded ? 'block' : 'none', padding: 0}}>
      <Statistic.Group widths='4' className='query-stats'>
        <Statistic>
          <Statistic.Value>{ioCount}</Statistic.Value>
          <Statistic.Label>#I/O</Statistic.Label>
        </Statistic>
        <Statistic>
          <Statistic.Value>{pointCount}</Statistic.Value>
          <Statistic.Label>#Objects</Statistic.Label>
        </Statistic>
        <Statistic>
          <Statistic.Value>{tileCount} / {totalTileCount}</Statistic.Value>
          <Statistic.Label>#Overlapped Tiles</Statistic.Label>
        </Statistic>
        <Statistic>
          <Statistic.Value>{fullyContainedTileCount}</Statistic.Value>
          <Statistic.Label>#Fully Overlapped Tiles</Statistic.Label>
        </Statistic>
      </Statistic.Group>
      <Segment basic>
        <div className="ui multiple progress">
          <div className="bar" style={{backgroundColor: '#2185d0', width: executionPerc + '%'}}>
            <div className="progress" style={{left: '0.5em'}}>Query Execution {executionPerc.toFixed(2)}%</div>
          </div>
          <div className="bar" style={{backgroundColor: '#fbbd08', width: renderPerc + '%'}}>
            <div className="progress">Rendering {renderPerc.toFixed(2)}%</div>
          </div>
          <div className="label">Query Time Breakdown</div>
        </div>
      </Segment>
    </Segment>
  </Segment>
};


export default QueryInfoPanel;
