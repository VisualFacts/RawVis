import { combineReducers } from 'redux';
import { loadingBarReducer as loadingBar } from 'react-redux-loading-bar';

import applicationProfile, { ApplicationProfileState } from './application-profile';
import visualizer, { VisualizerState } from 'app/modules/visualizer/visualizer.reducer';

export interface IRootState {
  readonly applicationProfile: ApplicationProfileState;
  readonly visualizer: VisualizerState;
  readonly loadingBar: any;
}

const rootReducer = combineReducers<IRootState>({
  applicationProfile,
  visualizer,
  loadingBar,
});

export default rootReducer;
