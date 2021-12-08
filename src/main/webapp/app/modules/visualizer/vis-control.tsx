import React, {useState} from 'react';
import {IDataset} from "app/shared/model/dataset.model";
import {
  Accordion,
  Button,
  Checkbox,
  Dropdown,
  Header,
  Icon,
  Image,
  Label,
  List,
  Popup,
  Segment
} from "semantic-ui-react";
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

  const [expandedFilter, setExpandedFilter] = useState(null);

  const handleAccordionClick = (e, data) => {
    e.stopPropagation();
    const {index} = data;
    const newIndex = expandedFilter === index ? null : index;
    setExpandedFilter(newIndex);
  };

  const handleFilterChange = (dimIndex) => (e, {value}) => {
    e.stopPropagation();
    const filters = {...categoricalFilters};
    filters[dimIndex] = value === "" ? null : value;
    props.updateFilters(dataset.id, filters);
  };

  const removeFilter = (dimIndex) => () => {
    const filters = {...categoricalFilters};
    props.updateFilters(dataset.id, _.omit(filters, dimIndex));
  };

  const handleDuplicateToggleChange = (e) => {
    props.toggleDuplicates(dataset.id);
  };

  /* const filterDropdowns = facets &&
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
          /></div>)}</div>;*/


  const filterDropdowns = facets &&
    <div className='filters'>
      <Dropdown scrolling
                className='icon primary left' text='Select one or more filters'
                icon='filter'
                floating
                labeled
                button>
        <Accordion fluid as={Dropdown.Menu}>
          {dataset.dimensions
            .map((dimension, i) => (
              facets[dimension] && <Dropdown.Item
                key={i}
                onClick={handleAccordionClick}
                index={dimension} className='dimension-filter'>
                <Accordion.Title
                  onClick={handleAccordionClick}
                  index={dimension}
                  className="filter-accordion-title"
                  active={expandedFilter === dimension}
                  content={dataset.headers[dimension]}
                  icon="sort down"
                />
                <Accordion.Content active={expandedFilter === dimension}>
                  <List relaxed verticalAlign="middle">
                    {facets[dimension].map((value, index) => (
                      <List.Item onClick={handleFilterChange(dimension)} value={value} key={index}>
                        <List.Icon
                          name={value === categoricalFilters[dimension] ? 'dot circle outline' : 'circle outline'}
                        />
                        <List.Content>
                          <List.Description
                            className="dropdown-description">{value}</List.Description>
                        </List.Content>
                      </List.Item>
                    ))}
                  </List>
                </Accordion.Content>
              </Dropdown.Item>
            ))}
        </Accordion></Dropdown></div>;


  const removeFilters =
    <div className="remove-filters">
      {categoricalFilters && _.map(categoricalFilters, (value, dim) => {
        return (
          <div className="remove-filter" key={dim}>
            <Icon link name='close' onClick={removeFilter(dim)}/>
            <span className="remove-filter-dim-label">{dataset.headers[dim]} / </span>
            <span className="remove-filter-value">
                    {value}
                  </span>
          </div>
        );
      })}
    </div>;

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
    <Popup disabled={props.allowDedup} content="You have to zoom in to be able to merge duplicates" trigger={
      <Checkbox className="toggle" disabled={!props.allowDedup}
                checked={props.showDuplicates}
                onChange={handleDuplicateToggleChange}
      />
    }/>


    <br/>
    {filterDropdowns}
    {removeFilters}
    <br/>
  </Segment>
};


export default VisControl;
