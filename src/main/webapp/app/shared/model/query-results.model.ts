import { LatLngTuple } from 'leaflet';
import { IRectStats } from 'app/shared/model/rect-stats.model';
import { IGroupedStats } from 'app/shared/model/grouped-stats.model';

export interface IQueryResults {
  rectStats?: IRectStats;
  series?: IGroupedStats[];
  cleanedRectStats?: IRectStats;
  cleanedSeries?: IGroupedStats[];
  points?: [][];
  facets?: any;
  fullyContainedTileCount?: number;
  tileCount?: number;
  pointCount?: number;
  ioCount?: number;
  totalTileCount?: number;
  totalPointCount?: number;
}

export const defaultValue: Readonly<IQueryResults> = { series: [], points: [] };
