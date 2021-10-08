import React from 'react';
import { Icon, Label, Menu, Table } from 'semantic-ui-react';

const CellCreator = props => {
  const stringCheck = cellstring => {
    let noNull;
    cellstring === null ? (noNull = '') : (noNull = cellstring);
    return noNull.toString();
  };
  return <Table.Cell collapsing>{stringCheck(props.cell)}</Table.Cell>;
};

export default CellCreator;
