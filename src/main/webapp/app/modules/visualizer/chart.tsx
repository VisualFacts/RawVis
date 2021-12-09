import React, {useState} from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official';
import Heatmap from 'highcharts/modules/heatmap.js';
import {IDataset} from "app/shared/model/dataset.model";
import {Button, Dropdown, Label, Popup, Segment} from "semantic-ui-react";
import {updateAggType, updateGroupBy, updateMeasure} from './visualizer.reducer';
import {AggregateFunctionType} from "app/shared/model/enumerations/aggregate-function-type.model";
import {IGroupedStats} from "app/shared/model/grouped-stats.model";
import _ from 'lodash';

Heatmap(Highcharts);

export interface IChartProps {
  dataset: IDataset,
  series: IGroupedStats[],
  cleanedSeries: IGroupedStats[],
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
  const {dataset, series, aggType, measureCol, dataSource, cleanedSeries, showDuplicates} = props;
  const usedSeries = cleanedSeries === null ? series : cleanedSeries;
  const groupByCols = props.groupByCols;
  const dimensions = dataset.dimensions || [];

  const [chartType, setChartType] = useState('column');

  const xAxisOptions = dimensions.map(dim => ({key: dim, value: dim, text: dataset.headers[dim]}));
  const aggTypeOptions = Object.values(AggregateFunctionType).map((type, index) => ({
    key: `agg-type-${index}`,
    value: type,
    text: type
  }));

  let seriesData, xCategories, yCategories;

  if (chartType === 'heatmap') {
    xCategories = _(usedSeries).map(groupedStat => groupedStat.group[0]).uniq().sortBy().value();
    yCategories = _(usedSeries).map(groupedStat => groupedStat.group[1]).uniq().sortBy().value();
    seriesData = usedSeries.map(groupedStat => ([xCategories.findIndex(c => c === groupedStat.group[0]), yCategories.findIndex(c => c === groupedStat.group[1]), groupedStat.value]));
  } else {
    seriesData = usedSeries.map(groupedStat => ({
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

  let xAxis = groupByCols && groupByCols.length > 0 ? dataset.dimensions.find(d => d === groupByCols[0]) : dataset.dimensions.find(d => d === xAxisOptions[0].key);
  xAxis = (showDuplicates && xAxis === dataset.dimensions.find(d => d === dataSource)) ? dataset.dimensions.find(d => d === xAxisOptions[1].key) : xAxis;
  let yAxis = groupByCols && groupByCols.length > 1 ? dataset.dimensions.find(d => d === groupByCols[1]) : dataset.dimensions.find(d => d === xAxisOptions[1].key);
  yAxis = (showDuplicates && yAxis === dataset.dimensions.find(d => d === xAxisOptions[1].key)) ? dataset.dimensions.find(d => d === xAxisOptions[2].key) : yAxis;

  const measure = dataset.measure0 == null ? null : dataset.measure0 === measureCol ? dataset.measure0 : dataset.measure1;
  return <Segment id='chart-container' raised textAlign='center'>
    <Button.Group floated='right' basic size='mini'>
      <Popup content="Bar Chart" trigger={
        <Button icon='chart bar outline' active={chartType === 'column'} onClick={handleChartTypeChange('column')}/>
      }/>
      <Popup content="Line Chart" trigger={
        <Button icon='chart line' active={chartType === 'line'} onClick={handleChartTypeChange('line')}/>
      }/>
      <Popup content="Area Chart" trigger={
        <Button icon='area chart' active={chartType === 'area'} onClick={handleChartTypeChange('area')}/>
      }/>
      <Popup content="Heatmap" trigger={
        <Button icon='th' active={chartType === 'heatmap'} onClick={handleChartTypeChange('heatmap')}/>
      }/>
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
            text: dataset.headers[xAxis],
            style: {
              fontSize: "1.1em"
            },
          },

          categories: xCategories
        },
        yAxis: {
          title: {
            text: dataset.headers[yAxis],
            style: {
              fontSize: "1.1em"
            }
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
            text: `${aggType}${measure == null || aggType === AggregateFunctionType.COUNT ? '' : '(' + dataset.headers[measure] + ')'}`
          },
          reversed: false,
          categories: null
        },
        tooltip: {
          formatter() {
            return this.point.value != null ? this.point.value.toFixed(2) : this.point.y.toFixed(2);
          }
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
    <Segment basic textAlign='center' compact style={{margin: "auto"}}>
      <Label.Group>
        {dataset.measure0 != null &&
        <span>Find <Dropdown options={aggTypeOptions} inline value={aggType}
                             onChange={handleAggTypeChange}/></span>}

        {dataset.measure0 != null && aggType !== AggregateFunctionType.COUNT &&
        <span> of <Dropdown
          scrolling={true}
          options={[{text: dataset.headers[dataset.measure0], value: dataset.measure0}, {
            text: dataset.headers[dataset.measure1],
            value: dataset.measure1
          }]} inline value={measure} onChange={handleMeasureChange}/></span>}

        <span> per <Dropdown scrolling={true} options={xAxisOptions} inline
                             value={xAxis && xAxis}
                             onChange={handleXAxisChange}/></span>
        {chartType === 'heatmap' && <span> and <Dropdown options={xAxisOptions} inline onChange={handleYAxisChange}
                                                         value={yAxis && yAxis}/></span>}
      </Label.Group>
    </Segment>
  </Segment>
};


export default Chart;
