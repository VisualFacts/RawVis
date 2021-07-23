import { combineReducers } from 'redux';
import dataReducer from './dataReducer';
import trimDataReducer from './trimDataReducer';
import pageStateReducer from './pageStateReducer';

const reducers = combineReducers({
  data: dataReducer,
  trimdata: trimDataReducer,
  pageState: pageStateReducer,
});

export default reducers;
