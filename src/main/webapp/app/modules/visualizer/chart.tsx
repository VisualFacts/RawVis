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
  updateGroupBy: typeof updateGroupBy,
  updateAggType: typeof updateAggType,
  updateMeasure: typeof updateMeasure
}


export const Chart = (props: IChartProps) => {
  const {dataset, series, aggType, groupByCols, measureCol} = props;
  const dimensions = dataset.dimensions || [];

  const [chartType, setChartType] = useState('column');

  const xAxisOptions = dimensions.map(dim => ({key: dim.id, value: dim.fieldIndex, text: dim.name}));
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
        props.updateGroupBy(dataset.id, [groupByCols[0], dimensions.find(dim => dim.fieldIndex !== groupByCols[0]).fieldIndex]);
      } else if (chartType === 'heatmap') {
        props.updateGroupBy(dataset.id, [groupByCols[0]]);
      }
    }
    setChartType(newChartType);
  };


  const xAxis = groupByCols && dataset.dimensions.find(d => d.fieldIndex === groupByCols[0]);

  const yAxis = groupByCols && groupByCols.length > 1 ? dataset.dimensions.find(d => d.fieldIndex === groupByCols[1]) : null;

  const measure = dataset.measure0 == null ? null : dataset.measure0.fieldIndex === measureCol ? dataset.measure0 : dataset.measure1;
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
          height: '250px',
          marginTop: 10,
          paddingTop: 0,
          marginBottom: 50,
          plotBorderWidth: 1
        },
        xAxis: {
          title: {
            text: xAxis.name
          },
          categories: xCategories
        },
        yAxis: {
          title: {
            text: yAxis.name
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
          height: '250px',
          marginTop: 10,
          paddingTop: 0,
          marginBottom: 50,
          plotBorderWidth: 1
        },
        xAxis: {
          type: 'category',
          title: {
            text: xAxis.name
          },
          categories: null
        },
        yAxis: {
          title: {
            text: `${aggType}(${measure == null ? '' : measure.name})`
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
    <Segment basic textAlign='center' compact style={{padding: 0}}>
      <Label.Group>
        {dataset.measure0 != null &&
        <Label>Aggregate Function: <Dropdown options={aggTypeOptions} inline value={aggType}
                                             onChange={handleAggTypeChange}/></Label>}

        {dataset.measure0 != null &&
        <Label>Measure: <Dropdown options={[{text: dataset.measure0.name, value: dataset.measure0.fieldIndex}, {
          text: dataset.measure1.name,
          value: dataset.measure1.fieldIndex
        }]} inline value={measure.fieldIndex} onChange={handleMeasureChange}/></Label>}

        <Label>xAxis: <Dropdown options={xAxisOptions} inline
                                value={xAxis && xAxis.fieldIndex}
                                onChange={handleXAxisChange}/></Label>
        {chartType === 'heatmap' && <Label>yAxis: <Dropdown options={xAxisOptions} inline onChange={handleYAxisChange}
                                                            value={yAxis && yAxis.fieldIndex}/></Label>}
      </Label.Group>
    </Segment>
  </Segment>
};


export default Chart;
