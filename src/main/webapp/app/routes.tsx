import React from 'react';
import { Switch } from 'react-router-dom';
import Upload from './modules/upload/Upload';
import Home from 'app/modules/home/home';
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';
import PageNotFound from 'app/shared/error/page-not-found';
import VisPage from 'app/modules/visualizer/vis-page';

const Routes = () => (
  <div className="view-routes">
    <Switch>
      <ErrorBoundaryRoute path="/" exact component={Home} />
      <ErrorBoundaryRoute path="/upload" exact component={Upload} />
      <ErrorBoundaryRoute exact path={'/visualize/:id'} component={VisPage} />
      <ErrorBoundaryRoute component={PageNotFound} />
    </Switch>
  </div>
);

export default Routes;
