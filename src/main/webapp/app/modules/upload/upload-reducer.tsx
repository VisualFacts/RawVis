import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { IDataset, defaultValue } from '../../shared/model/dataset.model';
import { DatasetType } from 'app/shared/model/enumerations/dataset-type.model';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import axios from 'axios';

// ACTION TYPES

export const ActionTypes = {
  FETCH_DATASET_LIST: 'dataset/FETCH_DATASET_LIST',
  FETCH_DATASET: 'dataset/FETCH_DATASET',
  CREATE_DATASET: 'dataset/CREATE_DATASET',
  SET_LAT: 'lat',
  SET_REND: 'rend',
  SET_LON: 'lon',
  SET_BOOLEAN: 'setbool',
  SET_EDITBUTTON: 'setEditButton',
  SET_DROPBOX1: 'setdrop1',
  SET_DROPBOX2: 'setdrop2',
  SET_DROPBOX3: 'setdrop3',
  SET_DROPBOX4: 'setdrop4',
  SET_DROPMULTBOX: 'setDropMultBox',
  SET_DATA: 'setdata',
  ADD_DATA: 'addData',
  SET_MEASURE0: 'setMeasure0',
  SET_MEASURE1: 'setMeasure1',
  SET_DIMENSIONS: 'setDimensions',
  EMPTY_DIMENSIONS: 'emptyDimensions',
  SET_OPTIONS: 'setOptions',
  SET_ACTIVEMENU: 'setActiveMenu',
  SET_UPSTATE: 'setUpState',
  SET_DISPLAY: 'setDisplay',
  SET_XQUERY: 'setXQuery',
  SET_YQUERY: 'setYQuery',
  SET_NAME: 'name',
  SET_HASHEADER: 'hasheader',
  SET_ORIGINALFILE: 'setOriginalFile',
  RESET_UPSTATE_ONBOOL: 'resetUpStateOnHeaderChange',
  RESET_ONBOOL: 'resetDisplayOnHeaderChange',
  RESET_DROPDOWNS: 'resetDropdowns',
};

//  INITIALSTATE

const initialState = {
  id: null,
  name: '',
  type: null as DatasetType,
  hasHeader: true,
  measure0: null as number,
  measure1: null as number,
  lat: null as number,
  lon: null as number,
  dimensions: [] as number[],
  xMin: -180,
  xMax: 180,
  yMin: -90,
  yMax: 90,
  queryXMin: null as number,
  queryXMax: null as number,
  queryYMin: null as number,
  queryYMax: null as number,
  objectCount: 1516029,
};

const uploadPageInitial = {
  checkbox: false,
  rend: false,
  editButton: false,
  dropdown1: '',
  dropdown2: '',
  dropdown3: '',
  dropdown4: '',
  activeMenu: 'New Dataset',
  dropMultBox: [],
  optionsState: [],
  trimData: [],
  data: [],
  originalFile: null,
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
      return { ...state, checkbox: action.payload };
    case ActionTypes.SET_REND:
      return { ...state, rend: action.payload };
    case ActionTypes.SET_DROPBOX1:
      return { ...state, dropdown1: `${action.payload}` };
    case ActionTypes.SET_DROPBOX2:
      return { ...state, dropdown2: `${action.payload}` };
    case ActionTypes.SET_DROPBOX3:
      return { ...state, dropdown3: `${action.payload}` };
    case ActionTypes.SET_DROPBOX4:
      return { ...state, dropdown4: `${action.payload}` };
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
    case ActionTypes.SET_EDITBUTTON:
      return { ...state, editButton: action.payload };
    case ActionTypes.SET_ORIGINALFILE:
      return { ...state, originalFile: action.payload };
    case ActionTypes.RESET_DROPDOWNS:
      return { ...state, dropdown1: '', dropdown2: '', dropdown3: '', dropdown4: '', dropMultBox: [], rend: false, checkbox: false };
    case ActionTypes.RESET_UPSTATE_ONBOOL:
      return { ...state, dropdown1: '', dropdown2: '', dropdown3: '', dropdown4: '', dropMultBox: [] };
    default:
      return state;
  }
};

const displayReducer = (state: IDataset = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SET_LAT:
      return { ...state, lat: action.payload };
    case ActionTypes.SET_NAME:
      return { ...state, name: action.payload };
    case ActionTypes.SET_LON:
      return { ...state, lon: action.payload };
    case ActionTypes.SET_HASHEADER:
      return { ...state, hasHeader: !state.hasHeader };
    case ActionTypes.SET_MEASURE0:
      return {
        ...state,
        measure0: action.payload,
      };
    case ActionTypes.SET_MEASURE1:
      return {
        ...state,
        measure1: action.payload,
      };
    case ActionTypes.SET_DIMENSIONS:
      return {
        ...state,
        dimensions: [...state.dimensions, action.payload],
      };
    case ActionTypes.EMPTY_DIMENSIONS:
      return { ...state, dimensions: [] };
    case ActionTypes.SET_XQUERY:
      return { ...state, queryXMax: action.payload.max, queryXMin: action.payload.min };
    case ActionTypes.SET_YQUERY:
      return { ...state, queryYMax: action.payload.max, queryYMin: action.payload.min };
    case ActionTypes.SET_UPSTATE:
      return {
        ...state,
        lat: action.payload.lat,
        lon: action.payload.lon,
        measure0: action.payload.measure0,
        measure1: action.payload.measure1,
        dimensions: action.payload.dimensions,
        name: action.payload.name,
        hasHeader: action.payload.hasHeader,
        queryXMin: action.payload.queryXMin,
        queryXMax: action.payload.queryXMax,
        queryYMin: action.payload.queryYMin,
        queryYMax: action.payload.queryYMax,
      };
    case ActionTypes.SET_DISPLAY:
      return {
        id: null,
        name: '',
        type: null as DatasetType,
        hasHeader: true,
        measure0: null as number,
        measure1: null as number,
        lat: null as number,
        lon: null as number,
        dimensions: [] as number[],
        xMin: -180,
        xMax: 180,
        yMin: -90,
        yMax: 90,
        queryXMin: null as number,
        queryXMax: null as number,
        queryYMin: null as number,
        queryYMax: null as number,
        objectCount: 1516029,
      };
    case ActionTypes.RESET_ONBOOL:
      return {
        ...state,
        id: null,
        type: null as DatasetType,
        measure0: null as number,
        measure1: null as number,
        lat: null as number,
        lon: null as number,
        dimensions: [] as number[],
        xMin: -180,
        xMax: 180,
        yMin: -90,
        yMax: 90,
        queryXMin: null as number,
        queryXMax: null as number,
        queryYMin: null as number,
        queryYMax: null as number,
        objectCount: 1516029,
      };
    default:
      return state;
  }
};

export type DatasetState = Readonly<typeof initialStato>;

const datasetState = (state: DatasetState = initialStato, action) => {
  switch (action.type) {
    case REQUEST(ActionTypes.FETCH_DATASET_LIST):
    case REQUEST(ActionTypes.CREATE_DATASET):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case SUCCESS(ActionTypes.FETCH_DATASET):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case FAILURE(ActionTypes.FETCH_DATASET_LIST):
    case FAILURE(ActionTypes.CREATE_DATASET):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ActionTypes.CREATE_DATASET):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ActionTypes.FETCH_DATASET_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload,
      };
    default:
      return state;
  }
};
//  ACTIONS
const apiUrl = 'api/datasets';

const fetchPostsStarted = () => {
  return {
    type: REQUEST(ActionTypes.FETCH_DATASET_LIST),
  };
};

const fetchPostsSuccess = posts => {
  return {
    type: SUCCESS(ActionTypes.FETCH_DATASET_LIST),
    payload: posts,
  };
};

const fetchPostsFailed = error => {
  return {
    type: FAILURE(ActionTypes.FETCH_DATASET_LIST),
    payload: error,
  };
};

export const fetchEntitiesList = () => {
  return dispatch => {
    dispatch(fetchPostsStarted());

    axios
      .get(apiUrl)
      .then(res => {
        dispatch(fetchPostsSuccess(res.data));
      })
      .catch(err => {
        dispatch(fetchPostsFailed(err.message));
      });
  };
};

export const createEntity = displayRed => {
  return dispatch => {
    dispatch(fetchPostsStarted());
    axios
      .post(apiUrl, displayRed)
      .then(res => {
        dispatch(fetchPostsSuccess(res));
      })
      .catch(err => {
        dispatch(fetchPostsFailed(err.message));
      });
  };
};

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

export const setRend = value => {
  return {
    type: ActionTypes.SET_REND,
    payload: value,
  };
};

export const setMenuItem = data => {
  return {
    type: ActionTypes.SET_ACTIVEMENU,
    payload: data,
  };
};

export const setEditbutton = value => {
  return {
    type: ActionTypes.SET_EDITBUTTON,
    payload: value,
  };
};

export const setBool = value => {
  return {
    type: ActionTypes.SET_BOOLEAN,
    payload: value,
  };
};

export const resetDropdowns = () => {
  return {
    type: ActionTypes.RESET_DROPDOWNS,
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

export const setDropbox4 = value => {
  return {
    type: ActionTypes.SET_DROPBOX4,
    payload: value,
  };
};

export const setDropMultBox = value => {
  return {
    type: ActionTypes.SET_DROPMULTBOX,
    payload: value,
  };
};

export const setXQuery = value => ({
  type: ActionTypes.SET_XQUERY,
  payload: value,
});

export const setYQuery = value => ({
  type: ActionTypes.SET_YQUERY,
  payload: value,
});

export const setOriginalFile = value => ({
  type: ActionTypes.SET_ORIGINALFILE,
  payload: value,
});

export const setLat = latIndex => ({
  type: ActionTypes.SET_LAT,
  payload: latIndex,
});

export const setLon = lonIndex => ({
  type: ActionTypes.SET_LON,
  payload: lonIndex,
});

export const setUpState = value => ({
  type: ActionTypes.SET_UPSTATE,
  payload: value,
});

export const resetDisplay = () => ({
  type: ActionTypes.SET_DISPLAY,
});

export const boolResetDisplay = () => ({
  type: ActionTypes.RESET_ONBOOL,
});

export const boolResetUpState = () => ({
  type: ActionTypes.RESET_UPSTATE_ONBOOL,
});

export const setOptionsState = value => {
  return {
    type: ActionTypes.SET_OPTIONS,
    payload: value,
  };
};

export const setName = value => {
  return {
    type: ActionTypes.SET_NAME,
    payload: value,
  };
};

export const setHasHeader = () => ({
  type: ActionTypes.SET_HASHEADER,
});

export const setMeasure0 = measureIndex => ({
  type: ActionTypes.SET_MEASURE0,
  payload: measureIndex,
});

export const setMeasure1 = measureIndex => ({
  type: ActionTypes.SET_MEASURE1,
  payload: measureIndex,
});

export const setDimensions = dimensionIndex => {
  return {
    type: ActionTypes.SET_DIMENSIONS,
    payload: dimensionIndex,
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
  dataSet: datasetState,
});

export type RootState = ReturnType<typeof reducers>;

//  STORE CREATION
export const store = createStore(reducers, applyMiddleware(thunk));
