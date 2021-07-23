import React, { useState } from 'react';
import HeadersCreator from './HeadersCreator';
import { Menu, Table, Checkbox } from 'semantic-ui-react';
import TableCellRowCreator from './TableCellRowCreator';
import { useDispatch, useSelector } from 'react-redux';
import { setData } from '../redux/actions/set';
import { setNumber } from '../redux/actions/setNumber';

export const TablePagination = props => {
  const trimData = useSelector(state => state.trimdata);
  const pageState = useSelector(state => state.pageState);
  const dispatch = useDispatch();
  const [checkHeader, setCheckHeader] = useState(false);

  const handleChange = () => {
    setCheckHeader(!checkHeader);
  };

  return (
    <div>
      <Table celled>
        <Table.Header>
          <Table.Row>
            {checkHeader === false
              ? props.state.data[0].map((header, index) => <HeadersCreator header={header} key={index} />)
              : props.state.data[0].map((header, index) => <Table.HeaderCell>{`col(${index})`}</Table.HeaderCell>)}
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {trimData.map((cellRow, index) => (
            <TableCellRowCreator cellRow={cellRow} key={index} />
          ))}
        </Table.Body>

        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell colSpan={props.state.data[0].length}></Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
      <Menu floated="right" pagination>
        <Menu.Item
          active={pageState === 1}
          onClick={() => {
            dispatch(setData(props.state.data.slice(1, 11)));
            dispatch(setNumber(1));
          }}
        >
          1
        </Menu.Item>
        <Menu.Item
          active={pageState === 2}
          onClick={() => {
            dispatch(setData(props.state.data.slice(11, 21)));
            dispatch(setNumber(2));
          }}
        >
          2
        </Menu.Item>
        <Menu.Item
          active={pageState === 3}
          onClick={() => {
            dispatch(setData(props.state.data.slice(21, 31)));
            dispatch(setNumber(3));
          }}
        >
          3
        </Menu.Item>
        <Menu.Item
          active={pageState === 4}
          onClick={() => {
            dispatch(setData(props.state.data.slice(31, 41)));
            dispatch(setNumber(4));
          }}
        >
          4
        </Menu.Item>
        <Menu.Item
          active={pageState === 5}
          onClick={() => {
            dispatch(setData(props.state.data.slice(41, 51)));
            dispatch(setNumber(5));
          }}
        >
          5
        </Menu.Item>
      </Menu>
      <Checkbox label="File without header" onClick={handleChange} />
    </div>
  );
};
