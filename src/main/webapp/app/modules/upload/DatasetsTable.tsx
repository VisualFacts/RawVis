import React from 'react';
import { Header, Table } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import * as Actions from './upload-reducer';

const DatasetCellRowCreator = props => (
  <Table.Row>
    <Table.Cell collapsing>
      <a>{props.EntityRow.name}</a>
    </Table.Cell>
    <Table.Cell collapsing>{props.EntityRow.lat.name}</Table.Cell>
    <Table.Cell collapsing>{props.EntityRow.lon.name}</Table.Cell>
    <Table.Cell collapsing>
      <DatasetCellDimCreator dimensions={props.EntityRow.dimensions} />
    </Table.Cell>
  </Table.Row>
);

const DatasetCellDimCreator = props => (
  <Header.Content>
    {props.dimensions.map((dimension, index) => (
      <Header.Subheader key={index}>{dimension.name}</Header.Subheader>
    ))}
  </Header.Content>
);

const DatasetsTable = () => {
  const dataSet = useSelector((state: Actions.RootState) => state.dataSet);

  return (
    <div>
      <Table basic="very" size="large">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Latitude</Table.HeaderCell>
            <Table.HeaderCell>Longtitude</Table.HeaderCell>
            <Table.HeaderCell>Dimensions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {dataSet.entities.length && dataSet.entities.map((entity, index) => <DatasetCellRowCreator EntityRow={entity} key={index} />)}
        </Table.Body>
      </Table>
    </div>
  );
};

export default DatasetsTable;
