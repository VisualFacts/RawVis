import React, {useState} from 'react';
import {IDataset} from "app/shared/model/dataset.model";
import {Accordion, Checkbox, Divider, Dropdown, Icon, Image, List, Message, Popup, Segment} from "semantic-ui-react";
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
      <Dropdown scrolling style={{padding: '10px', marginTop: '0'}}
                className='icon left' text='Select one or more filters'
                icon='filter' fluid
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
    <Image href='/' src='./content/images/vf_logo.png' style={{width: 300, paddingBottom: "10px"}}/>
    <h4>
      Dataset
    </h4>
    <Dropdown scrolling style={{padding: '10px', marginBottom: '20px'}}
              className='icon left' text={dataset.name}
              fluid
              floating
              labeled
              button>
      <Dropdown.Menu>
        {datasets.map((d, index) => <Dropdown.Item key={index} as={Link} to={`/visualize/${d.id}`}
                                                   text={d.name}/>)}
      </Dropdown.Menu>
    </Dropdown>

    {/*
        <Label size='large' color='blue'>

        </Label> <Popup content='Reinitialize Dataset Index' trigger={<Button circular compact icon='refresh' size='mini'
                                                                           onClick={() => props.reset(dataset.id)}/>}/>*/}


    {/*    <Header as='h5'>Latitude Column</Header>
    <Label size='medium' color='blue'>
      {dataset.headers[dataset.lat]}
    </Label>
    <Header as='h5'>Longitude Column</Header>
    <Label size='medium' color='blue'>
      {dataset.headers[dataset.lon]}
    </Label>*/}
    <h4>
      Filtering
    </h4>
    {filterDropdowns}
    {removeFilters}
    <Popup disabled={props.allowDedup} content="You have to zoom in to be able to merge duplicates" trigger={
      <Checkbox className="toggle" disabled={!props.allowDedup} label={<label>Merge Duplicates</label>} style={{padding: "15px 7px", marginBottom: "0px"}}
                checked={props.showDuplicates}
                onChange={handleDuplicateToggleChange}
      />
    }/>
    <Divider />
    <p style={{fontSize: '12px', textAlign: 'justify'}}>
      The use case presents information of ~180K hotels in US gathered from multiple travel agencies. Multiple records
      for a hotel may be included in the data. The origin of the dataset is from https://www.factual.com/; for demo
      reasons, we have further amended, resized and generated duplicate records with different values for various
      attributes (e.g., name of the hotel, price, location, etc) for records coming from different sources.
    </p>
  </Segment>
};


export default VisControl;
