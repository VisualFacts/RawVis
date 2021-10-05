import React from 'react';
import {IDataset} from "app/shared/model/dataset.model";
import {Button, Checkbox, Divider, Dropdown, Header, Icon, Image, Label, Popup, Segment} from "semantic-ui-react";
import {reset, toggleDuplicates, updateFilters} from "app/modules/visualizer/visualizer.reducer";
import {NavLink as Link} from 'react-router-dom';


export interface IVisControlProps {
  dataset: IDataset,
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
  const {dataset, categoricalFilters, facets, groupByCols} = props;

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
        <Header as='h4'>
          <Icon name='filter'/>
          Filtering
        </Header>
      </Divider>
      {dataset.dimensions.map(dim => facets[dim] &&
        <>
          <h5>
            <span>{dataset.headers[dim]}</span>
          </h5>
          <Dropdown
            options={facets[dim].map((value, index) => ({key: index, value, text: value}))}
            selection clearable upward fluid disabled={groupByCols.includes(dim)}
            value={categoricalFilters[dim] || null}
            onChange={handleFilterChange(dim)}
          /></>)}</div>;


  return <Segment id='vis-control' padded='very' raised>
    <Image href='/' src='./content/images/logo.png' style={{width: 100}}/>
    <h5>
      Dataset <Popup content='Reinitialize Dataset Index' trigger={<Button circular compact icon='refresh' size='mini'
                                                                           onClick={() => props.reset(dataset.id)}/>}/>
    </h5>
    <Label size='medium' color='blue'>
      <Dropdown text={dataset.name}>
        <Dropdown.Menu>
          <Dropdown.Item as={Link} to="/visualize/taxi" text='taxi.csv'/>
          <Dropdown.Item as={Link} to="/visualize/network" text='network_data.csv'/>
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
    {/* <Header as='h5'>Show All</Header>
    <Checkbox className="toggle"
       checked = {props.showAll}
       onChange={handleShowAllToggleChange}
    /> */}
    <Header as='h5'>Show Duplicates</Header>
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
