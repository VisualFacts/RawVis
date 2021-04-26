import axios from 'axios';
import { FAILURE, REQUEST, SUCCESS } from 'app/shared/reducers/action-type.util';
import { IDataset } from 'app/shared/model/dataset.model';
import { IQuery } from 'app/shared/model/query.model';
import { LatLngBounds } from 'leaflet';
import Supercluster from 'supercluster';
import { IRectangle } from 'app/shared/model/rectangle.model';
import { AggregateFunctionType } from 'app/shared/model/enumerations/aggregate-function-type.model';
import { IRectStats } from 'app/shared/model/rect-stats.model';
import { IGroupedStats } from 'app/shared/model/grouped-stats.model';
import { defaultValue, IIndexStatus } from 'app/shared/model/index-status.model';
import _, { initial } from 'lodash';
import StatsPanel from './stats-panel';

export const ACTION_TYPES = {
  FETCH_DATASET: 'visualizer/FETCH_DATASET',
  RESET: 'visualizer/RESET',
  UPDATE_MAP_BOUNDS: 'visualizer/UPDATE_MAP_BOUNDS',
  UPDATE_CLUSTERS: 'visualizer/UPDATE_CLUSTERS',
  UPDATE_FACETS: 'visualizer/UPDATE_FACETS',
  UPDATE_GROUP_BY: 'visualizer/UPDATE_GROUP_BY',
  UPDATE_MEASURE: 'visualizer/UPDATE_MEASURE',
  UPDATE_AGG_TYPE: 'visualizer/UPDATE_AGG_TYPE',
  UPDATE_CHART_TYPE: 'visualizer/UPDATE_CHART_TYPE',
  UPDATE_DRAWN_RECT: 'visualizer/UPDATE_DRAWN_RECT',
  UPDATE_ANALYSIS_RESULTS: 'visualizer/UPDATE_ANALYSIS_RESULTS',
  UPDATE_FILTERS: 'visualizer/UPDATE_FILTERS',
  UPDATE_QUERY_INFO: 'visualizer/UPDATE_QUERY_INFO',
  FETCH_INDEX_STATUS: 'visualizer/FETCH_INDEX_STATUS',
  UPDATE_DUPLICATES: 'visualizer/UPDATE_DUPLICATES',
  TOGGLE_DUPLICATES: 'visualizer/TOGGLE_DUPLICATES',
  REMOVE_DUPLICATES: 'visualizer/REMOVE_DUPLICATES',
};

const initialState = {
  indexStatus: defaultValue,
  loading: true,
  errorMessage: null,
  dataset: null,
  zoom: 14,
  categoricalFilters: {},
  chartType: 'column',
  groupByCols: null,
  measureCol: null,
  aggType: AggregateFunctionType.AVG,
  viewRect: null as IRectangle,
  drawnRect: null as IRectangle,
  series: [] as IGroupedStats[],
  facets: {},
  rectStats: null as IRectStats,
  clusters: [],
  fullyContainedTileCount: 0,
  tileCount: 0,
  pointCount: 0,
  ioCount: 0,
  totalTileCount: 0,
  totalPointCount: 0,
  executionTime: 0,
  totalTime: 0,
  duplicates: [],
  bounds: null,
  showDuplicates: false,
};

export type VisualizerState = Readonly<typeof initialState>;

// Reducer

export default (state: VisualizerState = initialState, action): VisualizerState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_DATASET):
      return {
        ...initialState,
        errorMessage: null,
        loading: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_DATASET):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_DATASET):
      action.payload.data && (action.payload.data.dimensions = _.sortBy(action.payload.data.dimensions, ['name']));
      return {
        ...state,
        loading: false,
        dataset: action.payload.data,
        groupByCols: [action.payload.data.dimensions[0].fieldIndex],
        measureCol: action.payload.data.measure0 && action.payload.data.measure0.fieldIndex,
      };
    case SUCCESS(ACTION_TYPES.UPDATE_CLUSTERS):
      return {
        ...state,
        clusters: action.payload,
        totalTime: new Date().getTime() - action.meta.requestTime,
      };
    case SUCCESS(ACTION_TYPES.UPDATE_DUPLICATES):
      return {
        ...state,
        duplicates: action.payload,
      };
    case ACTION_TYPES.UPDATE_FACETS:
      return {
        ...state,
        facets: action.payload,
      };
    case ACTION_TYPES.UPDATE_GROUP_BY:
      return {
        ...state,
        groupByCols: action.payload,
        series: action.payload.length !== state.groupByCols.length ? [] : state.series,
      };
    case ACTION_TYPES.UPDATE_MEASURE:
      return {
        ...state,
        measureCol: action.payload,
      };
    case ACTION_TYPES.UPDATE_FILTERS:
      return {
        ...state,
        categoricalFilters: action.payload,
      };
    case ACTION_TYPES.UPDATE_AGG_TYPE:
      return {
        ...state,
        aggType: action.payload,
      };
    case ACTION_TYPES.UPDATE_CHART_TYPE:
      return {
        ...state,
        chartType: action.payload,
      };
    case ACTION_TYPES.UPDATE_DRAWN_RECT:
      return {
        ...state,
        drawnRect: action.payload,
      };
    case ACTION_TYPES.UPDATE_MAP_BOUNDS:
      return {
        ...state,
        zoom: action.payload.zoom,
        viewRect: action.payload.viewRect,
      };
    case SUCCESS(ACTION_TYPES.UPDATE_ANALYSIS_RESULTS):
      return {
        ...state,
        series: action.payload.data.series,
        rectStats: action.payload.data.rectStats,
      };
    case ACTION_TYPES.UPDATE_ANALYSIS_RESULTS:
      return {
        ...state,
        series: action.payload.data.series,
        rectStats: action.payload.data.rectStats,
      };
    case ACTION_TYPES.UPDATE_QUERY_INFO:
      return {
        ...state,
        fullyContainedTileCount: action.payload.fullyContainedTileCount,
        tileCount: action.payload.tileCount,
        pointCount: action.payload.pointCount,
        ioCount: action.payload.ioCount,
        totalTileCount: action.payload.totalTileCount,
        totalPointCount: action.payload.totalPointCount,
        executionTime: action.payload.executionTime,
      };
    case SUCCESS(ACTION_TYPES.RESET):
      return {
        ...state,
        drawnRect: null,
        indexStatus: defaultValue,
      };
    case SUCCESS(ACTION_TYPES.FETCH_INDEX_STATUS):
      return {
        ...state,
        indexStatus: action.payload.data,
      };
    case ACTION_TYPES.TOGGLE_DUPLICATES:
      return {
        ...state,
        showDuplicates: !state.showDuplicates,
      };
    case ACTION_TYPES.REMOVE_DUPLICATES:
      return {
        ...state,
        duplicates: [],
      };
    default:
      return state;
  }
};

// Actions
export const getDataset = id => {
  const requestUrl = `api/datasets/${id}`;
  return {
    type: ACTION_TYPES.FETCH_DATASET,
    payload: axios.get<IDataset>(requestUrl),
  };
};

const prepareSupercluster = points => {
  const geoJsonPoints = points.map(point => ({
    type: 'Feature',
    properties: { totalCount: point[2] || 1 },
    geometry: {
      type: 'Point',
      coordinates: [point[1], point[0]],
    },
  }));
  const supercluster = new Supercluster({
    log: true,
    radius: 60,
    extent: 256,
    maxZoom: 18,
    reduce(accumulated, props) {
      return (accumulated.totalCount += props.totalCount);
    },
  });
  supercluster.load(geoJsonPoints);
  return supercluster;
};

const updateAnalysisResults = id => (dispatch, getState) => {
  const { categoricalFilters, drawnRect, groupByCols, measureCol, aggType, viewRect } = getState().visualizer;
  const analysisQuery = { categoricalFilters, rect: drawnRect || viewRect, groupByCols, measureCol, aggType } as IQuery;
  dispatch({
    type: ACTION_TYPES.UPDATE_ANALYSIS_RESULTS,
    payload: axios.post(`api/datasets/${id}/query`, analysisQuery),
  });
};

export const updateDuplicates = (id, showDuplicates) => (dispatch, getState) => {
  const { dataset, viewRect } = getState().visualizer;
  const sqlQuery = `SELECT DEDUP ${dataset.lat.name}, ${dataset.lon.name} FROM all.${dataset.name.split('.')[0]} WHERE ${
    dataset.lat.name
  } BETWEEN ${viewRect.lat[0]} AND ${viewRect.lat[1]} AND ${dataset.lon.name} BETWEEN ${viewRect.lon[0]} AND ${viewRect.lon[1]}`;
  if (showDuplicates)
    dispatch({
      type: ACTION_TYPES.UPDATE_DUPLICATES,
      payload: axios.get(`api/datasets/${id}/dedup-query?q=${sqlQuery}`).then(res => {
        return res.data.map(d => [parseFloat(d[0].columns[dataset.lon.name]), parseFloat(d[0].columns[dataset.lat.name]), d.length]);
      }),
    });
  else
    dispatch({
      type: ACTION_TYPES.REMOVE_DUPLICATES,
    });
};

export const updateClusters = id => (dispatch, getState) => {
  const { categoricalFilters, viewRect, zoom, groupByCols, measureCol, aggType, drawnRect } = getState().visualizer;
  const requestTime = new Date().getTime();
  if (viewRect == null) {
    return;
  }
  dispatch({
    type: ACTION_TYPES.UPDATE_CLUSTERS,
    meta: { requestTime },
    payload: axios
      .post(`api/datasets/${id}/query`, {
        rect: viewRect,
        zoom,
        categoricalFilters,
        groupByCols,
        measureCol,
        aggType,
      })
      .then(res => {
        dispatch({ type: ACTION_TYPES.UPDATE_FACETS, payload: res.data.facets });
        const responseTime = new Date().getTime();
        dispatch({
          type: ACTION_TYPES.UPDATE_QUERY_INFO,
          payload: { ...res.data, executionTime: responseTime - requestTime },
        });
        if (drawnRect == null) {
          dispatch({
            type: ACTION_TYPES.UPDATE_ANALYSIS_RESULTS,
            payload: res,
          });
        }
        const points = res.data.points || [];
        const supercluster = prepareSupercluster(points);
        return supercluster.getClusters([-180, -85, 180, 85], zoom);
      }),
  });
};

export const updateFilters = (id, filters) => dispatch => {
  dispatch({
    type: ACTION_TYPES.UPDATE_FILTERS,
    payload: filters,
  });
  dispatch(updateAnalysisResults(id));
  dispatch(updateClusters(id));
};

export const updateGroupBy = (id, groupByCols) => (dispatch, getState) => {
  const { categoricalFilters } = getState().visualizer;

  dispatch({
    type: ACTION_TYPES.UPDATE_GROUP_BY,
    payload: groupByCols,
  });
  const newCategoricalFilters = { ...categoricalFilters };
  groupByCols.forEach(groupByCol => {
    delete newCategoricalFilters[groupByCol];
  });
  dispatch(updateFilters(id, newCategoricalFilters));
};

export const updateMeasure = (id, measureCol) => dispatch => {
  dispatch({
    type: ACTION_TYPES.UPDATE_MEASURE,
    payload: measureCol,
  });
  dispatch(updateAnalysisResults(id));
};

export const updateAggType = (id, aggType) => dispatch => {
  dispatch({
    type: ACTION_TYPES.UPDATE_AGG_TYPE,
    payload: aggType,
  });
  dispatch(updateAnalysisResults(id));
};

export const updateChartType = (id, chartType) => dispatch => {
  dispatch({
    type: ACTION_TYPES.UPDATE_CHART_TYPE,
    payload: chartType,
  });
  dispatch(updateAnalysisResults(id));
};
export const updateDrawnRect = (id, drawnRectBounds: LatLngBounds) => dispatch => {
  const drawnRect = drawnRectBounds && {
    lat: [drawnRectBounds.getSouth(), drawnRectBounds.getNorth()],
    lon: [drawnRectBounds.getWest(), drawnRectBounds.getEast()],
  };
  dispatch({
    type: ACTION_TYPES.UPDATE_DRAWN_RECT,
    payload: drawnRect,
  });
  dispatch(updateAnalysisResults(id));
};

export const updateMapBounds = (id, bounds: LatLngBounds, zoom: number, showDuplicates: boolean) => dispatch => {
  const viewRect = {
    lat: [bounds.getSouth(), bounds.getNorth()],
    lon: [bounds.getWest(), bounds.getEast()],
  };
  dispatch({
    type: ACTION_TYPES.UPDATE_MAP_BOUNDS,
    payload: { zoom, viewRect },
  });
  dispatch(updateClusters(id));
  dispatch(updateDuplicates(id, showDuplicates));
};

export const updateMap = (id, viewRect, zoom: number, showDuplicates: boolean) => dispatch => {
  console.log(showDuplicates);

  dispatch({
    type: ACTION_TYPES.UPDATE_MAP_BOUNDS,
    payload: { zoom, viewRect },
  });
  dispatch(updateClusters(id));
  dispatch(updateDuplicates(id, showDuplicates));
};

export const reset = id => async dispatch => {
  const requestUrl = `api/datasets/${id}/reset-index`;
  await dispatch({
    type: ACTION_TYPES.RESET,
    payload: axios.post(requestUrl),
  });
  dispatch(updateClusters(id));
};

export const toggleDuplicates = () => dispatch => {
  dispatch({
    type: ACTION_TYPES.TOGGLE_DUPLICATES,
  });
};

export const getIndexStatus = id => {
  const requestUrl = `api/datasets/${id}/status`;
  return {
    type: ACTION_TYPES.FETCH_INDEX_STATUS,
    payload: axios.get<IIndexStatus>(requestUrl),
  };
};
