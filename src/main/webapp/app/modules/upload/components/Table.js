import React from 'react';
import HeadersCreator from './HeadersCreator';
import { Menu, Table } from 'semantic-ui-react';
import TableCellRowCreator from './TableCellRowCreator';
import { useDispatch, useSelector } from 'react-redux';
import { setData } from '../redux/actions/set';

const pageLimit = props => {
  return props.map((cellRow, index) => <TableCellRowCreator cellRow={cellRow} key={index} />);
};

export const TablePagination = props => {
  const trimData = useSelector(state => state.trimdata);
  const dispatch = useDispatch();
  return (
    <Table celled>
      <Table.Header>
        <Table.Row>
          {props.state.data[0].map((header, index) => (
            <HeadersCreator header={header} key={index} />
          ))}
        </Table.Row>
      </Table.Header>

      <Table.Body>{pageLimit(trimData)}</Table.Body>

      <Table.Footer>
        <Table.Row>
          <Table.HeaderCell colSpan={props.state.data[0].length}>
            <Menu floated="right" pagination>
              <Menu.Item
                as="a"
                onClick={() => {
                  dispatch(setData(props.state.data.slice(1, 10)));
                }}
              >
                1
              </Menu.Item>
              <Menu.Item
                as="a"
                onClick={() => {
                  dispatch(setData(props.state.data.slice(11, 20)));
                }}
              >
                2
              </Menu.Item>
              <Menu.Item
                as="a"
                onClick={() => {
                  dispatch(setData(props.state.data.slice(21, 30)));
                }}
              >
                3
              </Menu.Item>
              <Menu.Item
                as="a"
                onClick={() => {
                  dispatch(setData(props.state.data.slice(31, 40)));
                }}
              >
                4
              </Menu.Item>
              <Menu.Item
                as="a"
                onClick={() => {
                  dispatch(setData(props.state.data.slice(41, 50)));
                }}
              >
                5
              </Menu.Item>
            </Menu>
          </Table.HeaderCell>
        </Table.Row>
      </Table.Footer>
    </Table>
  );
};
