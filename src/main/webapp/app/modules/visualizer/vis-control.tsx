import React from 'react';
import {IDataset} from "app/shared/model/dataset.model";
import {Button, Divider, Dropdown, Header, Icon, Image, Label, Popup, Segment} from "semantic-ui-react";
import {reset, updateFilters} from "app/modules/visualizer/visualizer.reducer";
import {NavLink as Link} from 'react-router-dom';


export interface IVisControlProps {
  dataset: IDataset,
  facets: any,
  groupByCols: number[],
  categoricalFilters: any,
  updateFilters: typeof updateFilters,
  reset: typeof reset,
}


export const VisControl = (props: IVisControlProps) => {
  const {dataset, categoricalFilters, facets, groupByCols} = props;

  const handleFilterChange = (dimIndex) => (e, {value}) => {
    const filters = {...categoricalFilters};
    filters[dimIndex] = value === "" ? null : value;
    props.updateFilters(dataset.id, filters);
  };


  const filterDropdowns = facets &&
    <div>
      <Divider section horizontal>
        <Header as='h4'>
          <Icon name='filter'/>
          Filtering
        </Header></Divider>
      {dataset.dimensions.map(dim => facets[dim.fieldIndex] &&
        <>
          <h5>
            <span>{dim.name}</span>
          </h5>
          <Dropdown
            options={facets[dim.fieldIndex].map((value, index) => ({key: index, value, text: value}))}
            selection clearable upward fluid disabled={groupByCols.includes(dim.fieldIndex)}
            value={categoricalFilters[dim.fieldIndex] || null}
            onChange={handleFilterChange(dim.fieldIndex)}
          /></>)}</div>;


  return <Segment id='vis-control' padded='very' raised>
    <Image src='./content/images/logo.png' style={{width: 100}}/>
    <h5>
      Dataset <Popup content='Reinitialize Dataset Index' trigger={<Button circular compact icon='refresh' size='mini'
                                                                           onClick={() => props.reset(dataset.id)}/>}/>
    </h5>
    <Label size='medium' color='blue'>
      <Dropdown text={dataset.name}>
        <Dropdown.Menu>
          <Dropdown.Item as={Link} to="/visualize/1" text='taxi.csv'/>
          <Dropdown.Item as={Link} to="/visualize/2" text='network_data.csv'/>
        </Dropdown.Menu>
      </Dropdown>
    </Label>
    <Header as='h5'>Latitude</Header>
    <Label size='medium' color='blue'>
      {dataset.lat.name}
    </Label>
    <Header as='h5'>Longitude</Header>
    <Label size='medium' color='blue'>
      {dataset.lon.name}
    </Label>
    <br/>
    {
      filterDropdowns
    }
    <br/>
  </Segment>
};


export default VisControl;
