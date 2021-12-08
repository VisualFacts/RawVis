import React from 'react';
import {Route, Switch} from 'react-router-dom';
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';
import PageNotFound from 'app/shared/error/page-not-found';
import VisPage from "app/modules/visualizer/vis-page";


const Routes = () => (
  <div className="view-routes">
    <Switch>
      <Route exact path="/" component={() => {
        window.location.href = 'https://visualfacts.imsi.athenarc.gr';
        return null;
      }}/>
      <ErrorBoundaryRoute exact path={"/visualize/:id"} component={VisPage}/>
      <ErrorBoundaryRoute component={PageNotFound}/>
    </Switch>
  </div>
);

export default Routes;
