import React from 'react';
import { Header, Table, Button, Container, DimmerDimmableProps } from 'semantic-ui-react';
import { useSelector, useDispatch } from 'react-redux';
import * as Actions from './upload-reducer';
import { TablePagination } from './Table';

const DatasetCellRowCreator = props => (
  <Table.Row verticalAlign="middle">
    <Table.Cell collapsing>{props.EntityRow.name}</Table.Cell>
    <Table.Cell collapsing>{props.EntityRow.lat.name}</Table.Cell>
    <Table.Cell collapsing>{props.EntityRow.lon.name}</Table.Cell>
    <Table.Cell collapsing>
      <DatasetCellDimCreator measure0={props.EntityRow.measure0} measure1={props.EntityRow.measure1} />
    </Table.Cell>
    <Table.Cell collapsing>
      <DatasetCellDimCreator dimensions={props.EntityRow.dimensions} />
    </Table.Cell>
    <Table.Cell collapsing>
      <EditButton Entity={props.EntityRow} />
    </Table.Cell>
    <Table.Cell collapsing>
      <Button compact>explore</Button>
    </Table.Cell>
  </Table.Row>
);

const getDimensions = dimensions => {
  const nameClear = dimensions.map((dim, index) => ({ key: `${index}`, value: `${index}`, text: `${dim.name}` }));
  return nameClear;
};

const EditButton = props => {
  const dispatch = useDispatch();
  return (
    <Button
      compact
      onClick={() => {
        dispatch(Actions.setEditbutton(props.Entity));
        dispatch(Actions.setDropbox1(props.Entity.lat.name));
        dispatch(Actions.setDropbox2(props.Entity.lon.name));
        dispatch(Actions.setDropbox3(props.Entity.measure0.name));
        dispatch(Actions.setDropbox4(props.Entity.measure1.name));
        dispatch(Actions.setDropMultBox(getDimensions(props.Entity.dimensions)));
      }}
    >
      Edit
    </Button>
  );
};

const DatasetCellDimCreator = props => {
  if (props.measure0) {
    return (
      <Header.Content>
        <Header.Subheader key={0}>{props.measure0.name}</Header.Subheader>
        <Header.Subheader key={1}>{props.measure1.name}</Header.Subheader>
      </Header.Content>
    );
  } else {
    return (
      <Header.Content>
        {props.dimensions.map((dimension, index) => (
          <Header.Subheader key={index}>{dimension.name}</Header.Subheader>
        ))}
      </Header.Content>
    );
  }
};

const DatasetsTable = () => {
  const dataSet = useSelector((state: Actions.RootState) => state.dataSet);
  const uploadState = useSelector((state: Actions.RootState) => state.uploadState);
  const dispatch = useDispatch();

  if (uploadState.editButton.length === 0) {
    return (
      <div>
        <Table basic="very" size="large">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Latitude</Table.HeaderCell>
              <Table.HeaderCell>Longtitude</Table.HeaderCell>
              <Table.HeaderCell>Measures</Table.HeaderCell>
              <Table.HeaderCell>Dimensions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {dataSet.entities.length && dataSet.entities.map((entity, index) => <DatasetCellRowCreator EntityRow={entity} key={index} />)}
          </Table.Body>
        </Table>
      </div>
    );
  } else {
    const dropvalues = [];
    dropvalues.push(uploadState.editButton.dimensions.map(dim => dim.name));
    return (
      <div>
        <Container fluid textAlign="left">
          <Button
            onClick={() => {
              dispatch(Actions.setEditbutton([]));
              dispatch(Actions.resetDropdowns());
            }}
          >
            Back
          </Button>
        </Container>
        <TablePagination />
        <Button floated="left">Save</Button>
      </div>
    );
  }
};

export default DatasetsTable;
