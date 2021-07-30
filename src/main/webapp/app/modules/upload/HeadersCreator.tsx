import React from "react";
import { Icon, Label, Menu, Table } from "semantic-ui-react";

const HeadersCreator = (props) => (
  <Table.HeaderCell>{props.header}</Table.HeaderCell>
);

export default HeadersCreator;
