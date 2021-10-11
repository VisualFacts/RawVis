import React from 'react';
import { Icon, Label, Menu, Table } from 'semantic-ui-react';

const HeadersCreator = props => {
  const stringCheck = cellstring => {
    let noNull;
    cellstring === null ? (noNull = '') : (noNull = cellstring);
    cellstring === false && (noNull = 'false');
    cellstring === true && (noNull = 'true');
    return noNull.toString();
  };
  return <Table.HeaderCell>{stringCheck(props.header)}</Table.HeaderCell>;
};

export default HeadersCreator;
