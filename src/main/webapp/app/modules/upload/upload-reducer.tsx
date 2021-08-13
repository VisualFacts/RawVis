import { createStore, combineReducers, applyMiddleware, Action } from 'redux';
import thunk from 'redux-thunk';
import { IDataset, defaultValue } from '../../shared/model/dataset.model';
import { DatasetType } from 'app/shared/model/enumerations/dataset-type.model';
import { IField } from '../../shared/model/field.model';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import axios from 'axios';
// ACTION TYPES

export const ActionTypes = {
  FETCH_DATASET_LIST: 'dataset/FETCH_DATASET_LIST',
  FETCH_DATASET: 'dataset/FETCH_DATASET',
  SET_LAT: 'lat',
  SET_LON: 'lon',
  SET_BOOLEAN: 'setbool',
  SET_DROPBOX1: 'setdrop1',
  SET_DROPBOX2: 'setdrop2',
  SET_DROPBOX3: 'setdrop3',
  SET_DROPMULTBOX: 'setDropMultBox',
  SET_DATA: 'setdata',
  ADD_DATA: 'addData',
  SET_MEASURE: 'setMeasure',
  SET_DIMENSIONS: 'setDimensions',
  EMPTY_DIMENSIONS: 'emptyDimensions',
  SET_OPTIONS: 'setOptions',
  SET_ACTIVEMENU: 'setActiveMenu',
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
  dropdown3: '',
  activeMenu: 'New Dataset',
  dropMultBox: [],
  optionsState: [],
  trimData: [],
  data: [],
};

const initialStato = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IDataset>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false,
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
    case ActionTypes.SET_DROPBOX3:
      return { ...state, dropdown3: action.payload };
    case ActionTypes.SET_DROPMULTBOX:
      return { ...state, dropMultBox: action.payload };
    case ActionTypes.SET_DATA:
      return { ...state, trimData: action.payload };
    case ActionTypes.ADD_DATA:
      return { ...state, data: action.payload };
    case ActionTypes.SET_OPTIONS:
      return { ...state, optionsState: action.payload };
    case ActionTypes.SET_ACTIVEMENU:
      return { ...state, activeMenu: action.payload };
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
    case ActionTypes.SET_MEASURE:
      return { ...state, measure0: { ...state.measure0, name: action.payload.measureName, fieldIndex: action.payload.measureIndex } };
    case ActionTypes.SET_DIMENSIONS:
      return {
        ...state,
        dimensions: [...state.dimensions, [action.payload.dimensionName, action.payload.dimensionIndex]],
      };
    case ActionTypes.EMPTY_DIMENSIONS:
      return { ...state, dimensions: [] };
    default:
      return state;
  }
};

export type DatasetState = Readonly<typeof initialStato>;

const datasetStato = (state: DatasetState = initialStato, action) => {
  switch (action.type) {
    case SUCCESS(ActionTypes.FETCH_DATASET):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ActionTypes.FETCH_DATASET_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
      };
    default:
      return state;
  }
};
//  ACTIONS
const apiUrl = 'api/datasets';

export const getEntities = () => ({
  type: ActionTypes.FETCH_DATASET_LIST,
  payload: axios.post(apiUrl, displayReducer),
});

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

export const setMenuItem = data => {
  return {
    type: ActionTypes.SET_ACTIVEMENU,
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

export const setDropbox3 = value => {
  return {
    type: ActionTypes.SET_DROPBOX3,
    payload: value,
  };
};
export const setDropMultBox = value => {
  return {
    type: ActionTypes.SET_DROPMULTBOX,
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

export const setOptionsState = value => {
  return {
    type: ActionTypes.SET_OPTIONS,
    payload: value,
  };
};

export const setMeasure = (measureName, measureIndex) => {
  return {
    type: ActionTypes.SET_MEASURE,
    payload: { measureName, measureIndex },
  };
};

export const setDimensions = (dimensionName, dimensionIndex) => {
  return {
    type: ActionTypes.SET_DIMENSIONS,
    payload: { dimensionName, dimensionIndex },
  };
};

export const emptyDimensions = () => {
  return {
    type: ActionTypes.EMPTY_DIMENSIONS,
  };
};

//  COMBINE REDUCERS
const reducers = combineReducers({
  uploadState: uploadPageReducer,
  displayInfo: displayReducer,
  dataSet: datasetStato,
});

export type RootState = ReturnType<typeof reducers>;

//  STORE CREATION
export const store = createStore(reducers, applyMiddleware(thunk));
