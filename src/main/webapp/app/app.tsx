import 'react-toastify/dist/ReactToastify.css';
import './app.scss';
import 'semantic-ui-css/semantic.min.css';


import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {BrowserRouter as Router} from 'react-router-dom';
import {toast, ToastContainer} from 'react-toastify';
import {hot} from 'react-hot-loader';

import {IRootState} from 'app/shared/reducers';
import {getProfile} from 'app/shared/reducers/application-profile';
import ErrorBoundary from 'app/shared/error/error-boundary';
import AppRoutes from 'app/routes';

const baseHref = document.querySelector('base').getAttribute('href').replace(/\/$/, '');

export interface IAppProps extends StateProps, DispatchProps {
}

export const App = (props: IAppProps) => {
  useEffect(() => {
    props.getProfile();
  }, []);

  return (
    <Router basename={baseHref}>
      <div className="app-container">
        <ToastContainer position={toast.POSITION.TOP_LEFT} className="toastify-container"
                        toastClassName="toastify-toast"/>
        <div className="container-fluid view-container" id="app-view-container">
          <ErrorBoundary>
            <AppRoutes/>
          </ErrorBoundary>
        </div>
      </div>
    </Router>
  );
};

const mapStateToProps = ({applicationProfile}: IRootState) => ({
  ribbonEnv: applicationProfile.ribbonEnv,
  isInProduction: applicationProfile.inProduction,
});

const mapDispatchToProps = {getProfile};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(hot(module)(App));
