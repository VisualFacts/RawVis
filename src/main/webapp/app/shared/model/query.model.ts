import { IRectangle } from 'app/shared/model/rectangle.model';
import { AggregateFunctionType } from 'app/shared/model/enumerations/aggregate-function-type.model';

export interface IQuery {
  rect: IRectangle;
  zoom: number;
  categoricalFilters?: any;
  groupByCols?: number[];
  measureCol?: number;
  aggType?: AggregateFunctionType;
}

export const defaultValue: Readonly<IQuery> = {
  rect: null,
  zoom: 13,
  groupByCols: [3],
  measureCol: 16,
  categoricalFilters: {},
  aggType: AggregateFunctionType.AVG,
};
