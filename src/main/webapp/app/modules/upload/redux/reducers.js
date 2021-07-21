import { combineReducers } from 'redux';
import dataReducer from './dataReducer';
import trimDataReducer from './trimDataReducer';

const reducers = combineReducers({
  data: dataReducer,
  trimdata: trimDataReducer,
});

export default reducers;
