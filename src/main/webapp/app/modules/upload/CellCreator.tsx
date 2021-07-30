import React from 'react';
import { Icon, Label, Menu, Table } from 'semantic-ui-react';

const CellCreator = props => <Table.Cell collapsing>{props.cell}</Table.Cell>;

export default CellCreator;
