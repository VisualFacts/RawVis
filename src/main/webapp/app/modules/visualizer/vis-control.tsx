import React from 'react';
import {IDataset} from "app/shared/model/dataset.model";
import {Button, Checkbox, Divider, Dropdown, Header, Icon, Image, Label, Popup, Segment} from "semantic-ui-react";
import {reset, toggleDuplicates, updateFilters} from "app/modules/visualizer/visualizer.reducer";
import {NavLink as Link} from 'react-router-dom';
import _ from 'lodash';

export interface IVisControlProps {
  dataset: IDataset,
  datasets: IDataset[],
  facets: any,
  groupByCols: number[],
  categoricalFilters: any,
  showDuplicates: boolean,
  allowDedup: boolean,
  updateFilters: typeof updateFilters,
  toggleDuplicates: typeof toggleDuplicates,
  reset: typeof reset,
}


export const VisControl = (props: IVisControlProps) => {
  const {dataset, datasets, categoricalFilters, facets} = props;

  const handleFilterChange = (dimIndex) => (e, {value}) => {
    const filters = {...categoricalFilters};
    filters[dimIndex] = value === "" ? null : value;
    props.updateFilters(dataset.id, filters);
  };

  const handleDuplicateToggleChange = (e) => {
    props.toggleDuplicates(dataset.id);
  };

  const filterDropdowns = facets &&
    <div>
      <Divider section horizontal>
      </Divider>
      <Header as='h3' floated='left'>
        Filtering
      </Header>
      {!_.isEmpty(categoricalFilters) &&
      <Popup content='Clear All Filters' trigger={<Button floated='right' compact icon size='mini'
                                                                   onClick={() => props.updateFilters(dataset.id, {})}><Icon.Group
        size='large'>
        <Icon name='filter'/>
        <Icon corner name='close' style={{textShadow: 'none'}}/>
      </Icon.Group></Button>}/>
      }
      <Divider clearing/>
      {dataset.dimensions.map((dim, i) => facets[dim] &&
        <div key={i} className="dimension-filter">
          <h5>
            <span>{dataset.headers[dim]}</span>
          </h5>
          <Dropdown
            options={facets[dim].map((value, index) => ({key: index, value, text: value}))}
            selection clearable upward fluid selectOnBlur={false}
            value={categoricalFilters[dim] || null}
            onChange={handleFilterChange(dim)}
          /></div>)}</div>;

  return datasets && <Segment id='vis-control' padded='very' raised>
    <Image href='/' src='./content/images/vf_logo.png' style={{width: 300}}/>
    <h5>
      Dataset <Popup content='Reinitialize Dataset Index' trigger={<Button circular compact icon='refresh' size='mini'
                                                                           onClick={() => props.reset(dataset.id)}/>}/>
    </h5>
    <Label size='medium' color='blue'>
      <Dropdown text={dataset.name}>
        <Dropdown.Menu>
          {datasets.map((d, index) => <Dropdown.Item key={index} as={Link} to={`/visualize/${d.id}`}
                                                     text={d.name}/>)}
        </Dropdown.Menu>
      </Dropdown>
    </Label>
    <Header as='h5'>Latitude</Header>
    <Label size='medium' color='blue'>
      {dataset.headers[dataset.lat]}
    </Label>
    <Header as='h5'>Longitude</Header>
    <Label size='medium' color='blue'>
      {dataset.headers[dataset.lon]}
    </Label>
    <Header as='h5'>Merge Duplicates</Header>
    <Checkbox className="toggle" disabled={!props.allowDedup}
              checked={props.showDuplicates}
              onChange={handleDuplicateToggleChange}
    />

    <br/>
    {
      filterDropdowns
    }
    <br/>
  </Segment>
};


export default VisControl;
