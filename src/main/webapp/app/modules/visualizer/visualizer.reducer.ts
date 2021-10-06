import axios from 'axios';
import { FAILURE, REQUEST, SUCCESS } from 'app/shared/reducers/action-type.util';
import { IDataset } from 'app/shared/model/dataset.model';
import { IQuery } from 'app/shared/model/query.model';
import { LatLngBounds } from 'leaflet';
import Supercluster from 'supercluster';
import { IRectangle } from 'app/shared/model/rectangle.model';
import { AggregateFunctionType } from 'app/shared/model/enumerations/aggregate-function-type.model';
import { IRectStats } from 'app/shared/model/rect-stats.model';
import { IDedupStats } from 'app/shared/model/rect-dedup-stats.model';
import { IDedupClusterStats } from 'app/shared/model/rect-dedup-cluster-stats.model';
import { IGroupedStats } from 'app/shared/model/grouped-stats.model';
import { defaultValue, IIndexStatus } from 'app/shared/model/index-status.model';
import {MIN_DEDUP_ZOOM_LEVEL} from "app/config/constants";

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

  TOGGLE_CLUSTER_CHART: 'visualizer/TOGGLE_CLUSTER_CHART',
  CLOSE_CLUSTER_CHART: 'visualizer/CLOSE_CLUSTER_CHART',
  UPDATE_CLUSTER_STATS: 'visualizer/UPDATE_CLUSTER_STATS',
};

const initialState = {
  indexStatus: defaultValue,
  loading: true,
  loadingDups: false,
  firstDupLoad: true,
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
  dedupStats: null as IDedupStats,
  dedupClusterStats: null as IDedupClusterStats,
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
  allowDedup: false,
  showDuplicates: false,
  showClusterChart: false,
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
      return {
        ...state,
        loading: false,
        dataset: action.payload.data,
        groupByCols: [action.payload.data.dimensions[0]],
        measureCol: action.payload.data.measure0 && action.payload.data.measure0,
      };
    case SUCCESS(ACTION_TYPES.UPDATE_CLUSTERS):
      return {
        ...state,
        clusters: action.payload,
        totalTime: new Date().getTime() - action.meta.requestTime,
      };
    case ACTION_TYPES.UPDATE_DUPLICATES:
      return {
        ...state,
        dedupStats: action.payload.dedupStats,
        duplicates: action.payload.duplicates,
      };
    case REQUEST(ACTION_TYPES.UPDATE_DUPLICATES):
      return {
        ...state,
        loadingDups: state.firstDupLoad ? true : false,
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
        allowDedup: action.payload.zoom >= MIN_DEDUP_ZOOM_LEVEL,
        showDuplicates: action.payload.zoom >= MIN_DEDUP_ZOOM_LEVEL && state.showDuplicates,
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
    case ACTION_TYPES.TOGGLE_CLUSTER_CHART:
      return {
        ...state,
        showClusterChart: true,
        dedupClusterStats: action.payload,
      };
    case ACTION_TYPES.CLOSE_CLUSTER_CHART:
      return {
        ...state,
        showClusterChart: false,
      };
    // case SUCCESS(ACTION_TYPES.UPDATE_CLUSTER_STATS):
    //   return{
    //     ...state,

    //   }
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

const getDuplicateData = (data, dataset) => {
  const duplicateData = {
    dedupStats: {
      percentOfDups: data.VizStatistic.percentOfDups,
      similarityMeasures: data.VizStatistic.similarityMeasures,
      columnValues: data.VizStatistic.columnValues,
    },

    duplicates: data.VizDataset.map(d => {
      let lat = 0.0;
      let lon = 0.0;
      for (let i = 0; i < d.VizData.length; i++) {
        lat = parseFloat(d.VizData[i].columns[dataset.lat]);
        lon = parseFloat(d.VizData[i].columns[dataset.lon]);
        if (!isNaN(lat) && !isNaN(lon)) {
          break;
        } else {
          lon = 0;
          lat = 0;
        }
      }
      return [lon, lat, d.VizData.length, d.groupedObj, d.clusterColumnSimilarity, d.clusterColumns];
    }),
  };
  return duplicateData;
};

export const updateClusters = id => (dispatch, getState) => {
  const {
    categoricalFilters,
    viewRect,
    zoom,
    groupByCols,
    measureCol,
    aggType,
    drawnRect,
    showDuplicates,
    dataset,
  } = getState().visualizer;
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
        dedupEnabled: showDuplicates,
      })
      .then(res => {
        dispatch({ type: ACTION_TYPES.UPDATE_FACETS, payload: res.data.facets });
        const responseTime = new Date().getTime();
        dispatch({
          type: ACTION_TYPES.UPDATE_QUERY_INFO,
          payload: { ...res.data, executionTime: responseTime - requestTime },
        });

        showDuplicates &&
          dispatch({
            type: ACTION_TYPES.UPDATE_DUPLICATES,
            payload: getDuplicateData(res.data.dedupVizOutput, dataset),
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

export const updateMapBounds = (id, bounds: LatLngBounds, zoom: number) => dispatch => {
  const viewRect = {
    lat: [bounds.getSouth(), bounds.getNorth()],
    lon: [bounds.getWest(), bounds.getEast()],
  };
  dispatch({
    type: ACTION_TYPES.UPDATE_MAP_BOUNDS,
    payload: { zoom, viewRect },
  });
  dispatch(updateClusters(id));
};

export const reset = id => async dispatch => {
  const requestUrl = `api/datasets/${id}/reset-index`;
  await dispatch({
    type: ACTION_TYPES.RESET,
    payload: axios.post(requestUrl),
  });
  dispatch(updateClusters(id));
};

export const toggleClusterChart = (clusterColumnSimilarity, clusterColumnValues, clusterId) => dispatch => {
  const dedupClusterStats = {
    clusterColumnSimilarity,
    clusterColumnValues,
    clusterId,
  };
  dispatch({
    type: ACTION_TYPES.TOGGLE_CLUSTER_CHART,
    payload: dedupClusterStats,
  });
};

export const closeClusterChart = () => dispatch => {
  dispatch({
    type: ACTION_TYPES.CLOSE_CLUSTER_CHART,
  });
};

export const toggleDuplicates = id => dispatch => {
  dispatch({
    type: ACTION_TYPES.TOGGLE_DUPLICATES,
  });
  dispatch(updateClusters(id));

};

export const getIndexStatus = id => {
  const requestUrl = `api/datasets/${id}/status`;
  return {
    type: ACTION_TYPES.FETCH_INDEX_STATUS,
    payload: axios.get<IIndexStatus>(requestUrl),
  };
};
