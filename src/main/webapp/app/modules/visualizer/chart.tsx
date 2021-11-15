import React, {useState} from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official';
import Heatmap from 'highcharts/modules/heatmap.js';
import {IDataset} from "app/shared/model/dataset.model";
import {Button, Dropdown, Label, Segment} from "semantic-ui-react";
import {updateAggType, updateGroupBy, updateMeasure} from './visualizer.reducer';
import {AggregateFunctionType} from "app/shared/model/enumerations/aggregate-function-type.model";
import {IGroupedStats} from "app/shared/model/grouped-stats.model";
import _ from 'lodash';

Heatmap(Highcharts);

export interface IChartProps {
  dataset: IDataset,
  series: IGroupedStats[],
  groupByCols: number[],
  measureCol: number,
  aggType: AggregateFunctionType,
  dataSource: number,
  showDuplicates: boolean,
  updateGroupBy: typeof updateGroupBy,
  updateAggType: typeof updateAggType,
  updateMeasure: typeof updateMeasure
}


export const Chart = (props: IChartProps) => {
  const {dataset, series, aggType, measureCol, dataSource, showDuplicates} = props;
  let groupByCols = props.groupByCols;
  const dimensions = dataset.dimensions || [];

  const [chartType, setChartType] = useState('column');

  let xAxisOptions = dimensions.map(dim => ({key: dim, value: dim, text: dataset.headers[dim]}));
  const aggTypeOptions = Object.values(AggregateFunctionType).map((type, index) => ({
    key: `agg-type-${index}`,
    value: type,
    text: type
  }));

  let seriesData, xCategories, yCategories;

  if (chartType === 'heatmap') {
    xCategories = _(series).map(groupedStat => groupedStat.group[0]).uniq().sortBy().value();
    yCategories = _(series).map(groupedStat => groupedStat.group[1]).uniq().sortBy().value();
    seriesData = series.map(groupedStat => ([xCategories.findIndex(c => c === groupedStat.group[0]), yCategories.findIndex(c => c === groupedStat.group[1]), groupedStat.value]));
  } else {
    seriesData = series.map(groupedStat => ({
      name: groupedStat.group[0],
      y: groupedStat.value,
      color: '#2185d0'
    }));
  }

  const handleXAxisChange = (e, {value}) => {
    props.updateGroupBy(dataset.id, [value]);
  };

  const handleYAxisChange = (e, {value}) => {
    props.updateGroupBy(dataset.id, [groupByCols[0], value]);
  };


  const handleAggTypeChange = (e, {value}) => props.updateAggType(dataset.id, value);

  const handleMeasureChange = (e, {value}) => props.updateMeasure(dataset.id, value);

  const handleChartTypeChange = (newChartType) => () => {
    if (newChartType !== chartType) {
      if (newChartType === 'heatmap') {
        props.updateGroupBy(dataset.id, [groupByCols[0], dimensions.find(dim => dim !== groupByCols[0])]);
      } else if (chartType === 'heatmap') {
        props.updateGroupBy(dataset.id, [groupByCols[0]]);
      }
    }
    setChartType(newChartType);
  };
 
  if(showDuplicates){
    groupByCols = groupByCols.filter(e => e !== dataSource);
    xAxisOptions = xAxisOptions.filter(e => e.key !== dataSource);
  }
  const xAxis = groupByCols && groupByCols.length > 0 ?  dataset.dimensions.find(d => d === groupByCols[0]) :  dataset.dimensions.find(d => d === xAxisOptions[0].key);

  const yAxis = groupByCols && groupByCols.length > 1 ? dataset.dimensions.find(d => d === groupByCols[1]) : null;

  const measure = dataset.measure0 == null ? null : dataset.measure0 === measureCol ? dataset.measure0 : dataset.measure1;
  return <Segment id='chart-container' raised textAlign='center'>
    <Button.Group floated='right' basic size='mini'>
      <Button icon='chart bar outline' active={chartType === 'column'} onClick={handleChartTypeChange('column')}/>
      <Button icon='chart line' active={chartType === 'line'} onClick={handleChartTypeChange('line')}/>
      <Button icon='area chart' active={chartType === 'area'} onClick={handleChartTypeChange('area')}/>
      <Button icon='th' active={chartType === 'heatmap'} onClick={handleChartTypeChange('heatmap')}/>
    </Button.Group>
    <br/><br/><br/>
    <HighchartsReact
      highcharts={Highcharts}
      allowChartUpdate={true}
      immutable={false}
      updateArgs={[true, true, true]}
      options={chartType === 'heatmap' ? {
        chart: {
          type: 'heatmap',
          height: '300px',
          marginTop: 10,
          paddingTop: 0,
          marginBottom: 50,
          plotBorderWidth: 1
        },
        xAxis: {
          title: {
            text: dataset.headers[xAxis]
          },
          categories: xCategories
        },
        yAxis: {
          title: {
            text: dataset.headers[yAxis]
          },
          categories: yCategories,
          reversed: true
        },
        colorAxis: {
          min: 0,
          minColor: '#FFFFFF',
          maxColor: '#2185d0'
        },
        legend: {
          enabled: false
        },
        title: null,
        series: [{
          data: seriesData
        }]

      } : {
        title: null,
        plotOptions: {
          series: {
            maxPointWidth: 80
          }
        },
        series: [{
          data: seriesData
        }],
        chart: {
          type: chartType,
          height: '300px',
          marginTop: 10,
          paddingTop: 0,
          marginBottom: 100,
          plotBorderWidth: 1
        },
        xAxis: {
          type: 'category',
          title: {
            text: dataset.headers[xAxis]
          },
          categories: null
        },
        yAxis: {
          title: {
            text: `${aggType}(${measure == null ? '' : dataset.headers[measure]})`
          },
          reversed: false,
          categories: null
        },
        colorAxis: null,
        legend: {
          enabled: false
        },
        credits: {
          enabled: false
        },
      }}
    />
    <Segment basic textAlign='center' compact style={{ margin: "auto"}}>
      <Label.Group>
        {dataset.measure0 != null &&
        <Label>Find <Dropdown options={aggTypeOptions} inline value={aggType}
                                             onChange={handleAggTypeChange}/></Label>}

        {dataset.measure0 != null &&
        <Label>of <Dropdown 
        scrolling = {true}
        options={[{text: dataset.headers[dataset.measure0], value: dataset.measure0}, {
          text: dataset.headers[dataset.measure1],
          value: dataset.measure1
        }]} inline value={measure} onChange={handleMeasureChange}/></Label>}

        <Label>per <Dropdown  scrolling = {true} options={xAxisOptions} inline
                                value={xAxis && xAxis}
                                onChange={handleXAxisChange}/></Label>
        {chartType === 'heatmap' && <Label>and <Dropdown options={xAxisOptions} inline onChange={handleYAxisChange}
                                                            value={yAxis && yAxis}/></Label>}
      </Label.Group>
    </Segment>
  </Segment>
};


export default Chart;
