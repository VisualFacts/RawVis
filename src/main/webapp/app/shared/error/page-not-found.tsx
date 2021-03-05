import React from 'react';
import {Message} from "semantic-ui-react";

class PageNotFound extends React.Component {
  render() {
    return (<Message negative>
      <Message.Header>The page does not exist.</Message.Header>
    </Message>);
  }
}

export default PageNotFound;
