import { LatLngTuple } from 'leaflet';
import { IRectStats } from 'app/shared/model/rect-stats.model';
import { IGroupedStats } from 'app/shared/model/grouped-stats.model';

export interface IQueryResults {
  series?: IGroupedStats[];
  points?: LatLngTuple[];
  facets?: any;
  rectStats?: IRectStats;
  fullyContainedTileCount?: number;
  tileCount?: number;
  pointCount?: number;
  ioCount?: number;
  totalTileCount?: number;
  totalPointCount?: number;
}

export const defaultValue: Readonly<IQueryResults> = { series: [], points: [] };
