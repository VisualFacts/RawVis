import React from 'react';
import { Icon, Label, Menu, Table } from 'semantic-ui-react';
import CellCreator from './CellCreator';

const TableCellRowCreator = props => (
  <Table.Row>
    {props.cellRow.map((cell, index) => (
      <CellCreator cell={cell} key={index} />
    ))}
  </Table.Row>
);

export default TableCellRowCreator;
