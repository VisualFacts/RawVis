import axios from 'axios';
import {FAILURE, REQUEST, SUCCESS} from 'app/shared/reducers/action-type.util';
import {IDataset} from 'app/shared/model/dataset.model';
import {IQuery} from 'app/shared/model/query.model';
import {LatLngBounds} from 'leaflet';
import Supercluster from 'supercluster';
import {IRectangle} from 'app/shared/model/rectangle.model';
import {AggregateFunctionType} from 'app/shared/model/enumerations/aggregate-function-type.model';
import {IRectStats} from 'app/shared/model/rect-stats.model';
import {IDedupStats} from 'app/shared/model/rect-dedup-stats.model';
import {IGroupedStats} from 'app/shared/model/grouped-stats.model';
import {defaultValue, IIndexStatus} from 'app/shared/model/index-status.model';
import {MAX_ZOOM, MIN_DEDUP_ZOOM_LEVEL} from 'app/config/constants';

export const ACTION_TYPES = {
  FETCH_DATASET: 'visualizer/FETCH_DATASET',
  FETCH_DATASET_LIST: 'dataset/FETCH_DATASET_LIST',
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
  UPDATE_DEDUP_COLUMN: 'visualizer/UPDATE_DEDUP_COLUMN',
  TOGGLE_DUPLICATES: 'visualizer/TOGGLE_DUPLICATES',
  SELECT_DUPLICATE_CLUSTER: 'visualizer/SELECT_DUPLICATE_CLUSTER',
  UNSELECT_DUPLICATE_CLUSTER: 'visualizer/UNSELECT_DUPLICATE_CLUSTER',
  UPDATE_CLUSTER_STATS: 'visualizer/UPDATE_CLUSTER_STATS',
  UPDATE_EXPANDED_CLUSTER_INDEX: 'visualizer/UPDATE_EXPANDED_CLUSTER_INDEX',
  FETCH_ROW: 'visualizer/FETCH_ROW',
};

const initialState = {
  indexStatus: defaultValue,
  loading: true,
  loadingDups: false,
  firstDupLoad: true,
  errorMessage: null,
  dataset: null,
  datasets: null,
  zoom: 14,
  categoricalFilters: {},
  groupByCols: null,
  measureCol: null,
  aggType: AggregateFunctionType.AVG,
  viewRect: null as IRectangle,
  drawnRect: null as IRectangle,
  series: [] as IGroupedStats[],
  cleanedSeries: [] as IGroupedStats[],
  facets: {},
  rectStats: null as IRectStats,
  dedupStats: null as IDedupStats,
  cleanedRectStats: null as IRectStats,
  clusters: [],
  fullyContainedTileCount: 0,
  tileCount: 0,
  pointCount: 0,
  ioCount: 0,
  totalTileCount: 0,
  totalPointCount: 0,
  executionTime: 0,
  totalTime: 0,
  bounds: null,
  allowDedup: false,
  showDuplicates: false,
  duplicates: [],
  selectedDuplicate: null,
  expandedClusterIndex: null,
  row: null,
  selectedPointId: null,
  dedupColumn: 0,
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
    case SUCCESS(ACTION_TYPES.FETCH_DATASET_LIST):
      return {
        ...state,
        datasets: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.UPDATE_CLUSTERS):
      return {
        ...state,
        clusters: action.payload,
        expandedClusterIndex: null,
        totalTime: new Date().getTime() - action.meta.requestTime,
      };
    case ACTION_TYPES.UPDATE_DUPLICATES:
      return {
        ...state,
        dedupStats: action.payload.dedupStats,
        duplicates: action.payload.duplicates,
        selectedDuplicate: null,
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
        cleanedSeries: action.payload.data.cleanedSeries,
        cleanedRectStats: action.payload.data.cleanedRectStats,
      };
    case ACTION_TYPES.UPDATE_ANALYSIS_RESULTS:
      return {
        ...state,
        series: action.payload.data.series,
        rectStats: action.payload.data.rectStats,
        cleanedSeries: action.payload.data.cleanedSeries,
        cleanedRectStats: action.payload.data.cleanedRectStats,
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
    case ACTION_TYPES.UPDATE_EXPANDED_CLUSTER_INDEX:
      return {
        ...state,
        expandedClusterIndex: action.payload,
      };
    case ACTION_TYPES.SELECT_DUPLICATE_CLUSTER:
      return {
        ...state,
        selectedDuplicate: action.payload,
      };
    case ACTION_TYPES.UNSELECT_DUPLICATE_CLUSTER:
      return {
        ...state,
        selectedDuplicate: null,
      };
    case REQUEST(ACTION_TYPES.FETCH_ROW):
      return {
        ...state,
        selectedPointId: action.meta,
        row: null,
      };
    case SUCCESS(ACTION_TYPES.FETCH_ROW):
      return {
        ...state,
        row: action.payload.data,
      };
    case ACTION_TYPES.UPDATE_DEDUP_COLUMN:
      return {
        ...state,
        dedupColumn: action.payload,
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

export const getDatasets = () => {
  const requestUrl = `api/datasets/`;
  return {
    type: ACTION_TYPES.FETCH_DATASET_LIST,
    payload: axios.get<IDataset>(requestUrl),
  };
};

export const getRow = (datasetId, rowId) => {
  const requestUrl = `api/datasets/${datasetId}/objects/${rowId}`;
  return {
    type: ACTION_TYPES.FETCH_ROW,
    payload: axios.get(requestUrl),
    meta: rowId,
  };
};

const prepareSupercluster = points => {
  const geoJsonPoints = points.map(point => ({
    type: 'Feature',
    properties: {totalCount: 1, unmergedCount: point[2], points: [point]},
    geometry: {
      type: 'Point',
      coordinates: [point[1], point[0]],
    },
  }));
  const supercluster = new Supercluster({
    log: false,
    radius: 60,
    extent: 256,
    maxZoom: MAX_ZOOM,
    minPoints: 3,
    reduce(accumulated, props) {
      accumulated.totalCount += props.totalCount;
      accumulated.unmergedCount += props.unmergedCount;
      accumulated.points = accumulated.points.concat(props.points);
    },
  });
  supercluster.load(geoJsonPoints);
  return supercluster;
};

const updateAnalysisResults = id => (dispatch, getState) => {
  const {categoricalFilters, drawnRect, groupByCols, measureCol, aggType, viewRect} = getState().visualizer;
  const analysisQuery = {categoricalFilters, rect: drawnRect || viewRect, groupByCols, measureCol, aggType} as IQuery;
  dispatch({
    type: ACTION_TYPES.UPDATE_ANALYSIS_RESULTS,
    payload: axios.post(`api/datasets/${id}/query`, analysisQuery),
  });
};

const getDuplicateData = (data, dataset) => {
  const duplicateData = {
    dedupStats: {
      percentOfDups: data.VizStatistic.percentOfDups,
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
      return [lat, lon, d.VizData.length, d.groupedObj, d.clusterColumns, d.VizData[d.VizData.length - 1].offset];
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
    meta: {requestTime},
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
        dispatch({type: ACTION_TYPES.UPDATE_FACETS, payload: res.data.facets});
        const responseTime = new Date().getTime();
        dispatch({
          type: ACTION_TYPES.UPDATE_QUERY_INFO,
          payload: {...res.data, executionTime: responseTime - requestTime},
        });

        let duplicateData;
        let points = res.data.points || [];

        if (showDuplicates) {
          duplicateData = getDuplicateData(res.data.dedupVizOutput, dataset);
          points = points.concat(duplicateData.duplicates);
          dispatch({
            type: ACTION_TYPES.UPDATE_DUPLICATES,
            payload: duplicateData,
          });
        }

        if (drawnRect == null) {
          dispatch({
            type: ACTION_TYPES.UPDATE_ANALYSIS_RESULTS,
            payload: res,
          });
        }

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
  const {categoricalFilters} = getState().visualizer;

  dispatch({
    type: ACTION_TYPES.UPDATE_GROUP_BY,
    payload: groupByCols,
  });
  const newCategoricalFilters = {...categoricalFilters};
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
    payload: {zoom, viewRect},
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

export const selectDuplicateCluster = duplicate => dispatch => {
  /*  const dedupClusterStats = {
      clusterColumnSimilarity,
      clusterColumnValues,
      clusterId,
    }; */
  dispatch({
    type: ACTION_TYPES.SELECT_DUPLICATE_CLUSTER,
    payload: duplicate,
  });
};

export const unselectDuplicateCluster = () => dispatch => {
  dispatch({
    type: ACTION_TYPES.UNSELECT_DUPLICATE_CLUSTER,
  });
};

export const updateDedupColumn = column => dispatch => {
  dispatch({
    type: ACTION_TYPES.UPDATE_DEDUP_COLUMN,
    payload: column,
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

export const updateExpandedClusterIndex = index => ({
  type: ACTION_TYPES.UPDATE_EXPANDED_CLUSTER_INDEX,
  payload: index,
});
