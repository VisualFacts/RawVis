import React from 'react';
import { NavLink as Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Reader from './app';

export type IHomeProp = StateProps;

export const Upload = (props: IHomeProp) => {
  const { account } = props;

  return (
    <div>
      <Reader />
    </div>
  );
};

const mapStateToProps = storeState => ({
  account: storeState.authentication.account,
  isAuthenticated: storeState.authentication.isAuthenticated,
});

type StateProps = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(Upload);
