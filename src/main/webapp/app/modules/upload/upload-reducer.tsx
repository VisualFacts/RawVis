import { createStore, combineReducers, applyMiddleware, Action } from 'redux';
import thunk from 'redux-thunk';
import { IDataset } from '../../shared/model/dataset.model';
import { DatasetType } from 'app/shared/model/enumerations/dataset-type.model';
import { IField } from '../../shared/model/field.model';

// ACTION TYPES

export const ActionTypes = {
  SET_LAT: 'lat',
  SET_LON: 'lon',
  SET_BOOLEAN: 'setbool',
  SET_DROPBOX1: 'setdrop1',
  SET_DROPBOX2: 'setdrop2',
  SET_NUMBER: 'setnumb',
  SET_DATA: 'setdata',
  ADD_DATA: 'addData',
};

//  INITIALSTATE

const initialState = {
  id: '',
  name: '',
  type: null as DatasetType,
  measure0: null as IField,
  measure1: null as IField,
  lat: null as IField,
  lon: null as IField,
  dimensions: [] as IField[],
  xMin: 0,
  xMax: 0,
  yMin: 0,
  yMax: 0,
  queryXMin: 0,
  queryXMax: 0,
  queryYMin: 0,
  queryYMax: 0,
  objectCount: 0,
};

const uploadPageInitial = {
  checkbox: false,
  dropdown1: '',
  dropdown2: '',
  pageState: 1,
  trimData: [],
  data: [],
};

//  REDUCERS

const uploadPageReducer = (state = uploadPageInitial, action) => {
  switch (action.type) {
    case ActionTypes.SET_BOOLEAN:
      return { ...state, checkbox: !state.checkbox };
    case ActionTypes.SET_DROPBOX1:
      return { ...state, dropdown1: action.payload };
    case ActionTypes.SET_DROPBOX2:
      return { ...state, dropdown2: action.payload };
    case ActionTypes.SET_NUMBER:
      return { ...state, pageState: action.payload };
    case ActionTypes.SET_DATA:
      return { ...state, trimData: action.payload };
    case ActionTypes.ADD_DATA:
      return { ...state, data: action.payload };
    default:
      return state;
  }
};

const displayReducer = (state: IDataset = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SET_LAT:
      return { ...state, lat: { ...state.lat, name: action.payload.latName, fieldIndex: action.payload.latIndex } };
    case ActionTypes.SET_LON:
      return { ...state, lon: { ...state.lon, name: action.payload.latName, fieldIndex: action.payload.latIndex } };
    default:
      return state;
  }
};

//  ACTIONS
export const addData = data => {
  return {
    type: ActionTypes.ADD_DATA,
    payload: data,
  };
};

export const setData = data => {
  return {
    type: ActionTypes.SET_DATA,
    payload: data,
  };
};

export const setNumber = data => {
  return {
    type: ActionTypes.SET_NUMBER,
    payload: data,
  };
};

export const setBool = () => {
  return {
    type: ActionTypes.SET_BOOLEAN,
  };
};

export const setDropbox1 = value => {
  return {
    type: ActionTypes.SET_DROPBOX1,
    payload: value,
  };
};

export const setDropbox2 = value => {
  return {
    type: ActionTypes.SET_DROPBOX2,
    payload: value,
  };
};

export const setLat = (latName, latIndex) => {
  return {
    type: ActionTypes.SET_LAT,
    payload: { latName, latIndex },
  };
};

export const setLon = (latName, latIndex) => {
  return {
    type: ActionTypes.SET_LON,
    payload: { latName, latIndex },
  };
};

//  COMBINE REDUCERS
const reducers = combineReducers({
  uploadState: uploadPageReducer,
  displayInfo: displayReducer,
});

export type RootState = ReturnType<typeof reducers>;

//  STORE CREATION
export const store = createStore(reducers, applyMiddleware(thunk));
