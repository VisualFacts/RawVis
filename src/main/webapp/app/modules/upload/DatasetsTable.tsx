import React from 'react';
import { Header, Table, Button, Segment, Grid, GridColumn, Divider } from 'semantic-ui-react';
import { useSelector, useDispatch } from 'react-redux';
import * as Actions from './upload-reducer';
import { TablePagination } from './Table';
import { readString } from 'react-papaparse';
import { NavLink as Link } from 'react-router-dom';
import axios from 'axios';

const DatasetCellRowCreator = props => (
  <>
    {props.EntityRow.headers !== null && (
      <Table.Row verticalAlign="middle">
        <Table.Cell collapsing>{props.EntityRow.name}</Table.Cell>
        <Table.Cell collapsing>{props.EntityRow.headers[props.EntityRow.lat] || '-'}</Table.Cell>
        <Table.Cell collapsing>{props.EntityRow.headers[props.EntityRow.lon] || '-'}</Table.Cell>
        <Table.Cell collapsing>
          <DatasetCellDimCreator
            measure0={props.EntityRow.headers[props.EntityRow.measure0] || '-'}
            measure1={props.EntityRow.headers[props.EntityRow.measure1] || '-'}
          />
        </Table.Cell>
        <Table.Cell collapsing>
          <DatasetCellDimCreator dimensions={props.EntityRow.dimensions || '-'} headers={props.EntityRow.headers} />
        </Table.Cell>
        <Table.Cell collapsing>
          <EditButton Entity={props.EntityRow} />
        </Table.Cell>
        <Table.Cell collapsing>
          <Link to={`/visualize/${props.EntityRow.id}`}>
            <Button color="black" compact>
              explore
            </Button>
          </Link>
        </Table.Cell>
        <Table.Cell collapsing>
          <DeleteButton name={props.EntityRow.name} />
        </Table.Cell>
      </Table.Row>
    )}
  </>
);

const getDimensions = entity => {
  const nameClear = entity.dimensions.map((dim, index) => `${entity.headers[dim]}`);
  return nameClear;
};

const DeleteButton = props => {
  const dispatch = useDispatch();
  return (
    <Button
      color="red"
      compact
      onClick={() => {
        axios.delete(`api/datasets/${props.name}`).then(() => dispatch(Actions.fetchEntitiesList()));
      }}
    >
      delete
    </Button>
  );
};

const EditButton = props => {
  const dispatch = useDispatch();
  return (
    <Button
      color="grey"
      compact
      onClick={() => {
        dispatch(Actions.setDropbox1(props.Entity.headers[props.Entity.lat]));
        dispatch(Actions.setDropbox2(props.Entity.headers[props.Entity.lon]));
        dispatch(Actions.setDropbox3(props.Entity.headers[props.Entity.measure0]));
        dispatch(Actions.setDropbox4(props.Entity.headers[props.Entity.measure1]));
        dispatch(Actions.setDropMultBox(getDimensions(props.Entity)));
        dispatch(Actions.setUpState(props.Entity));

        axios.get(`api/readData/${props.Entity.name}`).then(res => {
          dispatch(
            Actions.addData(
              readString(res.data, {
                header: false,
                dynamicTyping: true,
                skipEmptyLines: true,
              }).data
            )
          ),
            dispatch(
              Actions.setData(
                readString(res.data, {
                  header: false,
                  dynamicTyping: true,
                  skipEmptyLines: true,
                }).data.slice(1, 50)
              )
            );
        });
        dispatch(Actions.setEditbutton(true));
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
        <Header.Subheader key={0}>{props.measure0}</Header.Subheader>
        <Header.Subheader key={1}>{props.measure1}</Header.Subheader>
      </Header.Content>
    );
  } else {
    return (
      <Header.Content>
        {props.dimensions.length !== 0 ? (
          props.dimensions.map((dimension, index) => <Header.Subheader key={index}>{props.headers[dimension]}</Header.Subheader>)
        ) : (
          <Header.Subheader key={0}>{'null'}</Header.Subheader>
        )}
      </Header.Content>
    );
  }
};

const DatasetsTable = () => {
  const dataSet = useSelector((state: Actions.RootState) => state.dataSet);
  const uploadState = useSelector((state: Actions.RootState) => state.uploadState);
  const dispatch = useDispatch();

  if (uploadState.editButton === false) {
    return (
      <div>
        <Divider hidden />
        <Grid centered>
          <GridColumn width="10">
            <Table basic="very" size="large">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Name</Table.HeaderCell>
                  <Table.HeaderCell>Latitude</Table.HeaderCell>
                  <Table.HeaderCell>Longtitude</Table.HeaderCell>
                  <Table.HeaderCell>Measures</Table.HeaderCell>
                  <Table.HeaderCell>Dimensions</Table.HeaderCell>
                  <Table.HeaderCell></Table.HeaderCell>
                  <Table.HeaderCell></Table.HeaderCell>
                  <Table.HeaderCell></Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {dataSet.entities.length &&
                  dataSet.entities.map((entity, index) => <DatasetCellRowCreator EntityRow={entity} key={index} />)}
              </Table.Body>
            </Table>
          </GridColumn>
        </Grid>
      </div>
    );
  } else {
    return (
      <div>
        <TablePagination />
      </div>
    );
  }
};

export default DatasetsTable;
